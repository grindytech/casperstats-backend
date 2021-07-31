const { Execute } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData, GetRichest, GetUndelegating, GetDelegating } = require('../utils/account');
const math = require('mathjs');
const mysql = require('mysql');
require('dotenv').config();
const { GetHolder, GetTotalNumberOfAccount, GetPublicKeyByAccountHash } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey, GetAllDeployByPublicKey } = require('../models/deploy');
const { GetAccountHash, RequestRPC, GetBalanceByAccountHash, GetNetWorkRPC, GetBalance } = require('../utils/common');
const { GetRewardByPublicKey, GetPublicKeyRewardByDate, GetLatestEra,
  GetPublicKeyRewardByEra, GetTimestampByEra, GetLatestEraByDate,
  GetEraValidatorOfPublicKey,
  GetTotalRewardByPublicKey,
  GetLatestTimestampByPublicKey } = require('../models/era');

require('dotenv').config();

const NodeCache = require("node-cache");
const get_rich_accounts_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_RICH_ACCOUNTS || 60 });

module.exports = {
  get_rich_accounts_cache,

  GetAccount: async function (req, res) {
    let account = req.params.account;
    try {
      const url = await GetNetWorkRPC();

      // modify param
      {
        account = account.replace("/\n/g", '');
        account = account.replace("account-hash-", '');
      }

      let account_data = await GetHolder(account);
      if (account_data.length == 1) {
        // from database
        account_data = account_data[0];
      } else {
        // from ledger
        account_data = await GetAccountData(account);
      }
      // add more data
      // BALANCE
      {
        try {
          account_data.balance = (await GetBalanceByAccountHash(url, "account-hash-" + account_data.account_hash)).balance_value;
        } catch (err) {
          account_data.balance = 0;
        }
      }

      // Available
      let transferrable = 0;
      {
        transferrable = account_data.balance;
      }

      // Total staked
      let total_staked = math.bignumber("0");
      try {
        if (account_data.public_key_hex) {
          const auction_info = await RequestRPC(url, RpcApiName.get_auction_info, []);
          const bids = auction_info.result.auction_state.bids;
          if (bids) {
            for (let i = 0; i < bids.length; i++) {
              if (bids[i].public_key == account_data.public_key_hex) {
                total_staked = math.add(total_staked, math.bignumber(bids[i].bid.staked_amount));
              }
              const delegators = bids[i].bid.delegators;
              if (delegators) {
                for (let j = 0; j < delegators.length; j++) {
                  if (delegators[j].public_key == account_data.public_key_hex) {
                    console.log(account_data.public_key_hex);
                    total_staked = math.add(total_staked, math.bignumber(delegators[j].staked_amount));
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        total_staked = math.bignumber("0");
      }

      // Undonding
      let unbonding = 0;
      try {
        const result = await GetUndelegating(account);
        const the_date = new Date();
        for (let i = 0; i < result.length; i++) {
          if (result[i].release_timestamp > the_date.getTime()) {
            unbonding += Number(result[i].amount);
          }
        }
      } catch (err) {
        unbonding = 0;
      }

      // Total reward
      let total_reward = 0;
      try {
        if (account_data.public_key_hex) {
          total_reward = (await GetRewardByPublicKey(account_data.public_key_hex)).total_reward;
        }
        if (total_reward == null) {
          total_reward = 0;
        }
      } catch (err) {
        total_reward = 0;
      }

      account_data.balance = (Number(transferrable) + Number(total_staked)).toString();
      account_data.transferrable = transferrable.toString();
      account_data.total_staked = total_staked.toString();
      account_data.unbonding = unbonding.toString();
      account_data.total_reward = total_reward.toString();

      res.json(account_data);
    } catch (err) {
      console.log(err)
      res.send(err);
    }
  },

  CountHolders: async function (req, res) {
    const account = req.params.account;

    GetTotalNumberOfAccount().then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetAccountTransfers: async function (req, res) {

    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;

    let account_hash = account;

    // Get account_hash if possible
    try {
      const hash = await GetAccountHash(account);
      account_hash = hash;
    } catch (err) { }

    GetTransfersByAccountHash(account_hash, start, count).then(value => {

      // add type in or out
      for (let i = 0; i < value.length; i++) {

        if (value[i].to_address === "null") {
          value[i].to_address = null;
        }

        if (account_hash == value[i].from_address) {
          value[i]["type"] = "out";
        } else {
          value[i]["type"] = "in";
        }
      }
      res.json(value);
    }).catch(err => {
      console.log(err);
      res.send(err);
    })
  },

  GetAccountDeploys: async function (req, res) {
    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;

    let public_key_hex = "";
    {
      try {
        const get_holder = await GetHolder(account);
        const holder = get_holder[0];
        public_key_hex = holder.public_key_hex;
      } catch (err) {
        public_key_hex = account;
      }
    }
    GetDeploysByPublicKey(public_key_hex, start, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })

  },

  GetBalance: async function (req, res) {
    const public_key = req.params.public_key;
    try {
      const account_hash = await GetAccountHash(public_key);
      const url = await GetNetWorkRPC();
      const balance = await GetBalanceByAccountHash(url, "account-hash-" + account_hash);
      res.status(200).json(balance);
    } catch (err) {
      res.send(err);
    }
  },

  GetAccountHash: async function (req, res) {
    const public_key = req.params.public_key;
    try {
      const account_hash = await GetAccountHash(public_key);
      res.status(200).json(account_hash);
    } catch (err) {
      res.status(500).json(null);
    }
  },

  GetRichAccounts: async function (req, res) {
    const start = req.query.start;
    const count = req.query.count;

    GetRichest(start, count).then(value => {
      get_rich_accounts_cache.set(`start: ${start} count ${count}`, value);
      res.status(200);
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetRewards: async function (req, res) {
    // get params
    const account = req.query.account;

    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }

    const start = Number(req.query.start);
    const count = Number(req.query.count);

    try {
      // Get the last date that account has reward
      const last_date = (await GetLatestTimestampByPublicKey(public_key)).timestamp;

      // return if account never stake
      if (last_date == null) {
        res.status(200);
        res.json([]);
        return;
      }

      // get rewards
      let rewards = [];
      {
        const start_date = new Date(last_date);
        let mark_date = new Date();
        mark_date.setDate(start_date.getDate() + (1 - start)); // next day
        mark_date = mark_date.toISOString().slice(0, 10);

        for (let i = 0; i < count; i++) {
          let the_date = new Date();
          the_date.setDate(start_date.getDate() - (start + i));
          the_date = the_date.toISOString().slice(0, 10);

          let reward = (await GetPublicKeyRewardByDate(public_key, the_date, mark_date)).reward;
          if (reward == null) {
            reward = 0;
          }

          let validator = "";
          {
            const latest_date_era = (await GetLatestEraByDate(the_date, mark_date)).era_id;
            validator = (await GetEraValidatorOfPublicKey(public_key, latest_date_era)).validator;
          }

          rewards.push({
            "date": (new Date(the_date).getTime()),
            "validator": validator,
            "reward": reward.toString(),
          })
          mark_date = the_date;
        }
      }
      res.status(200);
      res.json(rewards);
    } catch (err) {
      res.send(err);
    }
  },

  GetEraReward: async function (req, res) {
    const count = req.query.count;
    const account = req.query.account;

    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }

    const last_era = (await GetLatestEra()).era_id;
    try {
      let result = [];
      {
        for (let i = 0; i < count; i++) {
          const index_era = Number(last_era) - Number(i);
          // get reward by era
          let era_reward = (await GetPublicKeyRewardByEra(public_key, index_era)).reward;
          if (era_reward == null) {
            era_reward = 0;
          }
          const timestamp = (await GetTimestampByEra(index_era)).timestamp;
          result.push([
            (new Date(timestamp).getTime()),
            Number((Number(era_reward) / 1000000000).toFixed(2)), //convert to CSPR
          ])
        }
        res.status(200);
        res.json(result);
      }
    } catch (err) {
      res.send(err);
    }
  },

  GetUndelegate: async function (req, res) {
    const account = req.query.account;
    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    try {
      const result = await GetUndelegating(public_key);
      res.status(200);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  GetDelegate: async function (req, res) {
    const account = req.query.account;
    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    try {
      const result = await GetDelegating(public_key);
      res.status(200);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  GetStaking: async function (req, res) {
    const account = req.query.account;
    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    try {
      const delegate = await GetDelegating(public_key);
      const undelegate = await GetUndelegating(public_key);
      res.status(200);
      res.json({
        delegate,
        undelegate
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
};
