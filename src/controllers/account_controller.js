const { RpcApiName } = require('../utils/constant');
const { GetAccountData, GetRichest, GetUndelegating, GetDelegating } = require('../utils/account');
const math = require('mathjs');
require('dotenv').config();
const { GetHolder, GetTotalNumberOfAccount, GetPublicKeyByAccountHash } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey, GetDeployOfPublicKeyByType } = require('../models/deploy');
const { GetAccountHash, RequestRPC, GetBalanceByAccountHash, GetNetWorkRPC, GetEra } = require('../utils/common');
const { GetRewardByPublicKey, GetPublicKeyRewardByDate, GetLatestEra,
  GetPublicKeyRewardByEra, GetTimestampByEra, GetLatestEraByDate,
  GetEraValidatorOfPublicKey,
  GetLatestTimestampByPublicKey } = require('../models/era');
const { GetValidatorInformation } = require('../utils/validator');
const { GetDeployByRPC } = require('../utils/chain');

require('dotenv').config();

const NodeCache = require("node-cache");
const { GetEraByBlockHash } = require('../models/block_model');
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
        account_data = account_data[0];
      } else {
        account_data = await GetAccountData(account);
      }

      let transferrable = 0;
      {
        try {
          transferrable = (await GetBalanceByAccountHash(url, "account-hash-" + account_data.account_hash)).balance_value;
        } catch (err) {
          transferrable = 0;
        }
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
      console.log(err);
      res.send(err);
    }
  },

  GetAccountHash: async function (req, res) {
    const public_key = req.params.public_key;
    try {
      const account_hash = await GetAccountHash(public_key);
      res.status(200).json(account_hash);
    } catch (err) {
      console.log(err);
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
    const start = req.query.start;
    const count = req.query.count;
    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    try {
      const url = await GetNetWorkRPC();
      let withdraws = [];
      const deploys = await GetDeployOfPublicKeyByType(public_key, "undelegate", start, count);
      const current_era = await GetEra(url);
      for (let i = 0; i < deploys.length; i++) {
        let withdraw = {};
        withdraw.hash = deploys[i].deploy_hash;
        const deploy_data = await GetDeployByRPC(url, deploys[i].deploy_hash);
        const args = deploy_data.result.deploy.session.StoredContractByHash.args;
        withdraw.unbonder_public_key = args.find(value => {
          return value[0] == "delegator";
        })[1].parsed;
        withdraw.validator_public_key = args.find(value => {
          return value[0] == "validator";
        })[1].parsed;
        withdraw.amount = args.find(value => {
          return value[0] == "amount";
        })[1].parsed;

        const status = deploys[i].status == "success" ? true : false;
        withdraw.status = status;
        const era_of_creation = await GetEraByBlockHash(deploys[i].hash);
        withdraw.era_of_creation = era_of_creation;
        if (status) {
          const era_of_releasing = Number(era_of_creation) + 8;
          withdraw.era_of_releasing = era_of_releasing;

          const time_of_creation = (await GetTimestampByEra(era_of_creation)).timestamp;
          if (time_of_creation) {
            const creation_date = new Date(time_of_creation)
            withdraw.time_of_creation = creation_date.getTime();
            const time_of_releasing = Number(withdraw.time_of_creation) + 480000;
            withdraw.time_of_releasing = time_of_releasing;
          }
          const is_release = current_era >= era_of_releasing ? true : false;
          withdraw.is_release = is_release;
        }

        try {
          const validator_info = await GetValidatorInformation(withdraw.validator_public_key);
          if (validator_info != null) {
            withdraw.validator_name = validator_info.name;
            withdraw.validator_icon = validator_info.icon;
          }
        } catch (err) { }
        withdraws.push(withdraw);
      }
      res.status(200).json(withdraws);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  GetDelegate: async function (req, res) {
    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;
    let public_key = account;
    {
      const public_key_hex = await GetPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    try {
      const url = await GetNetWorkRPC();
      let withdraws = [];
      const deploys = await GetDeployOfPublicKeyByType(public_key, "delegate", start, count);
      for (let i = 0; i < deploys.length; i++) {
        let withdraw = {};
        withdraw.hash = deploys[i].deploy_hash;
        const deploy_data = await GetDeployByRPC(url, deploys[i].deploy_hash);
        const args = deploy_data.result.deploy.session.StoredContractByHash.args;
        withdraw.unbonder_public_key = args.find(value => {
          return value[0] == "delegator";
        })[1].parsed;
        withdraw.validator_public_key = args.find(value => {
          return value[0] == "validator";
        })[1].parsed;
        withdraw.amount = args.find(value => {
          return value[0] == "amount";
        })[1].parsed;
        const status = deploys[i].status == "success" ? true : false;
        withdraw.status = status;
        withdraw.timestamp = (new Date(deploy_data.result.deploy.header.timestamp)).getTime();
        try {
          const validator_info = await GetValidatorInformation(withdraw.validator_public_key);
          if (validator_info != null) {
            withdraw.validator_name = validator_info.name;
            withdraw.validator_icon = validator_info.icon;
          }
        } catch (err) { }
        withdraws.push(withdraw);
      }
      res.status(200).json(withdraws);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  GetBids: async function (req, res) {
    const public_key = req.query.public_key;
    try {
      const url = await GetNetWorkRPC();
      const auction_info = await RequestRPC(url, RpcApiName.get_auction_info, []);

      const bids = auction_info.result.auction_state.bids;

      // find all the bids belong to public_key

      let delegate_history = [];
      for (let i = 0; i < bids.length; i++) {
        const delegators = bids[i].bid.delegators;
        let delegated = delegators.filter(value => {
          return value.public_key == public_key;
        })
        if (delegated.length > 0) {
          const validator = bids[i].public_key;
          delegated = delegated[0];
          const data = {
            validator: validator,
            delegation_rate: bids[i].bid.delegation_rate,
            staked_amount: delegated.staked_amount,
          };
          // try to get validator information
          try {
            const validator_info = await GetValidatorInformation(validator);
            if (validator_info != null) {
              data.validator_name = validator_info.name;
              data.validator_icon = validator_info.icon;
            }
          } catch (err) { }
          delegate_history.push(data);
        }
      }
      res.status(200).json(delegate_history);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};
