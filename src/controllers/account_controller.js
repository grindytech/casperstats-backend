const { Execute, GetEraInfoBySwitchBlock } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData, GetRichest, GetUndelegating } = require('../utils/account');
const math = require('mathjs');
const mysql = require('mysql');
require('dotenv').config();
const { GetHolder, GetTotalNumberOfAccount } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey, GetAllDeployByPublicKey } = require('../models/deploy');
const { GetAccountHash, RequestRPC, GetBalance, GetBalanceByAccountHash } = require('../utils/common');
const { GetRewardByPublicKey, GetPublicKeyRewardByDate, GetLatestEra,
  GetPublicKeyRewardByEra, GetTimestampByEra, GetLatestEraByDate,
  GetEraValidatorOfPublicKey } = require('../models/era');

require('dotenv').config();

const NodeCache = require("node-cache");
const get_rich_accounts_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_RICH_ACCOUNTS || 60 });

module.exports = {
  get_rich_accounts_cache,

  GetAccount: async function (req, res) {
    const account = req.params.account;
    try {
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
        account_data.balance = (await GetBalanceByAccountHash("account-hash-" + account_data.account_hash)).balance_value;
      }

      // Available
      let transferrable = 0;
      {
        transferrable = account_data.balance;
      }

      // Total staked
      let total_staked = math.bignumber("0");
      {
        if (account_data.public_key_hex) {
          const auction_info = await RequestRPC(RpcApiName.get_auction_info, []);
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
      }

      // Undonding
      let unbonding = 0;
      {
        const result = await GetUndelegating(account);
        const the_date = new Date();
        for (let i = 0; i < result.length; i++) {
          if(result[i].release_timestamp > the_date.getTime()) {
            unbonding += Number(result[i].amount);
          }
        }
      }

      // Total reward
      let total_reward = 0;
      {
        if (account_data.public_key_hex) {
          total_reward = (await GetRewardByPublicKey(account_data.public_key_hex)).total_reward;
        }
        if (total_reward == null) {
          total_reward = 0;
        }
      }

      account_data.balance = (Number(transferrable) + Number(total_staked)).toString();
      account_data.transferrable = transferrable.toString();
      account_data.total_staked = total_staked.toString();
      account_data.unbonding = unbonding.toString();
      account_data.total_reward = total_reward.toString();

      res.json(account_data);
    } catch (err) {
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
    const start = Number(req.query.start);
    const count = Number(req.query.count);

    try {
      // get rewards
      let rewards = [];
      {

        const the_time = new Date();
        let mark_date = new Date();
        mark_date.setDate(the_time.getDate() + (1 - start)); // next day
        mark_date = mark_date.toISOString().slice(0, 10);


        for (let i = 0; i < count; i++) {
          let the_date = new Date();
          the_date.setDate(the_time.getDate() - (start + i));
          the_date = the_date.toISOString().slice(0, 10);

          let reward = (await GetPublicKeyRewardByDate(account, the_date, mark_date)).reward;
          if (reward == null) {
            reward = 0;
          }

          let validator = "";
          {
            const latest_date_era = (await GetLatestEraByDate(the_date, mark_date)).era_id;
            validator = (await GetEraValidatorOfPublicKey(account, latest_date_era)).validator;
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
    const last_era = (await GetLatestEra()).era_id;
    try {
      let result = [];
      {
        for (let i = 0; i < count; i++) {
          const index_era = Number(last_era) - Number(i);
          // get reward by era
          let era_reward = (await GetPublicKeyRewardByEra(account, index_era)).reward;
          if (era_reward == null) {
            era_reward = 0;
          }
          const timestamp = (await GetTimestampByEra(index_era)).timestamp;
          result.push([
            (new Date(timestamp).getTime()),
            era_reward.toString(),
            index_era,
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
    try {
      const result = await GetUndelegating(account);
      res.status(200);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
};
