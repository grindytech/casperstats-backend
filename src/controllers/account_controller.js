const { Execute, RequestRPC, GetEraInfoBySwitchBlock } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData } = require('../utils/account');
const math = require('mathjs');
const mysql = require('mysql');
require('dotenv').config();
const { GetHolder, GetRichAccounts, GetTotalNumberOfAccount } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey } = require('../models/deploy');
const { GetAccountHash } = require('../utils/common');
const { GetSwitchBlockByDate, GetBlockHashByHeight } = require('../models/block_model');

require('dotenv').config();

module.exports = {

  GetAccount: async function (req, res) {

    const account = req.params.account;

    GetHolder(account).then(value => {
      if (value.length == 1) {
        res.json(value[0]);
      } else {
        GetAccountData(account).then(acc => {
          res.json(acc);
        }).catch(err => {
          res.send(err);
        })
      }
    }).catch(err => {
      res.send(err);
    })
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
    GetRichAccounts(start, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },


  GetRewards: async function (req, res) {
    // get params
    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;

    // Get block switch from the_date to the_date - count
    let switch_blocks = [];
    {
      const the_time = new Date();
      for (let i = 0; i < count; i++) {
        let the_date = new Date();
        the_date.setDate(the_time.getDate() - (Number(start) + i));
        the_date = the_date.toISOString().slice(0, 10);
        console.log(the_date);
        const switchs = await GetSwitchBlockByDate(the_date);
        switch_blocks.push({ "date": the_date, "switchs": switchs });
      }
    }

    // get rewards
    let rewards = [];
    {
      for (let i = 0; i < switch_blocks.length; i++) {
        
        const switchs = switch_blocks[i].switchs;
        
        let daily_rewards = math.bignumber("0");
        // calculate daily rewards
        for (let ii = 0; ii < switchs.length; ii++) {
          const height = switchs[ii].height;
          const hash = await GetBlockHashByHeight(height);
          const era_info = await GetEraInfoBySwitchBlock(hash.hash);
          // make sure block is the last switch block of the day
          if (era_info.era_summary == null) {
            continue;
          }
          const seigniorage_allocations = era_info.era_summary.stored_value.EraInfo.seigniorage_allocations;
          const allocation_filter = seigniorage_allocations.filter(function (element) {
            // console.log(delegator.Delegator.delegator_public_key);
            // console.log(account);

            if (element.Delegator) {
              return element.Delegator.delegator_public_key == account;
            } else if (element.Validator) {
              return element.Validator.validator_public_key == account;
            }
          })

          for (let j = 0; j < allocation_filter.length; j++) {
            if (allocation_filter[j].Delegator) {
              const reward = math.bignumber(allocation_filter[j].Delegator.amount);
              daily_rewards = math.add(daily_rewards, reward);
            } else if (element.Validator) {
              const reward = math.bignumber(allocation_filter[j].Validator.amount);
              daily_rewards = math.add(daily_rewards, reward);
            }
          }
        }

        rewards.push({
          "date": switch_blocks[i].date,
          "rewards": daily_rewards.toString(),
        })
      }
    }

    // get total reward by date
    res.json(rewards);
  }

};
