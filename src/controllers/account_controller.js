const { Execute, GetEraInfoBySwitchBlock } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData, GetRichest } = require('../utils/account');
const math = require('mathjs');
const mysql = require('mysql');
require('dotenv').config();
const { GetHolder, GetRichAccounts, GetTotalNumberOfAccount } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey } = require('../models/deploy');
const { GetAccountHash, RequestRPC } = require('../utils/common');
const { GetSwitchBlockByDate, GetBlockHashByHeight } = require('../models/block_model');
const { GetTotalRewardByPublicKey, GetRewardByPublicKey } = require('../models/era');

require('dotenv').config();

module.exports = {

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
      let unbonding = "0";
      {

      }

      // Total reward
      let total_reward = 0;
      {
        if (account_data.public_key_hex) {
          total_reward = (await GetRewardByPublicKey(account_data.public_key_hex)).total_reward;
        }
        if(total_reward == null) {
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
    // GetRichAccounts(start, count).then(value => {
    //   res.json(value);
    // }).catch(err => {
    //   res.send(err);
    // })

    GetRichest(start, count).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      console.log(err);
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
        let validator = "";
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
              if (validator == "") {
                validator = allocation_filter[j].Delegator.validator_public_key;
              }

            } else if (allocation_filter[j].Validator) {
              const reward = math.bignumber(allocation_filter[j].Validator.amount);
              daily_rewards = math.add(daily_rewards, reward);
              if (validator == "") {
                validator = allocation_filter[j].Validator.validator_public_key;
              }
            }
          }
        }

        rewards.push({
          "date": (new Date(switch_blocks[i].date)).getTime(),
          "validator": validator,
          "reward": daily_rewards.toString(),
          // "APY": APY,
        })
      }
    }

    // check rewards
    var is_valid_address = rewards.find(obj => {
      return obj.reward !== "0";
    })

    if(is_valid_address) {
      res.json(rewards);
    }else {
      res.json([]);
    }
  }
};
