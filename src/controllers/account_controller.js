const { RpcApiName } = require("../service/constant");
const {
  getAccountData,
  getRichest,
  getUnstakingAmount,
  getAccountName,
  withoutTime,
} = require("../service/account");
const math = require("mathjs");
require("dotenv").config();
const {
  getHolder,
  getTotalNumberOfAccount,
  getPublicKeyByAccountHash,
} = require("../models/account");
const {
  getTransfersByAccountHash,
  getTotalNumberOfTransfersByAccount,
} = require("../models/transfer");
const { getTimestampByEraFromSwtichBlock } = require("../models/block_model");
const { getTimestampByEra } = require("../models/era");
const {
  getDeploysByPublicKey,
  getDeployOfPublicKeyByType,
  countDeployByType,
  getTotalDeployByPublicKey,
} = require("../models/deploy");
const {
  getAccountHash,
  getEra,
  requestRPC,
  getNetWorkRPC,
  getBalanceByAccountHash,
  pagination,
  checkNextAndPreviousPage,
} = require("../service/common");
const {
  getValidatorReward,
  getDelegatorReward,
  getPublicKeyRewardByDate,
  getLatestEra,
  getPublicKeyRewardByEra,
  getLatestTimestampByPublicKey,
} = require("../models/era");
const { gerEraIdByDate } = require("../models/era_id");
const { getValidatorInformation } = require("../service/validator");
const { getDeployByRPC } = require("../service/chain");
const { getValidator } = require("../models/validator");
const { getTotalStakeAsDelegator } = require("../models/delegator");

require("dotenv").config();

const NodeCache = require("node-cache");
const { getEraByBlockHash } = require("../models/block_model");
const get_rich_accounts_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_RICH_ACCOUNTS || 3600,
});

async function getRangeRichestCache(start, count) {
  try {
    const value = await getRichest(start, count);
    get_rich_accounts_cache.set(`start: ${start} count ${count}`, value);
    return value;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  get_rich_accounts_cache,
  getRangeRichestCache,

  getAccount: async function (req, res) {
    let account = req.params.account;
    try {
      const url = await getNetWorkRPC();
      // modify param

      let account_hash;
      try {
        account_hash = await getAccountHash(account);
      } catch (err) {
        account_hash = account;
      }

      // {
      //   account = account.replace("/\n/g", '');
      //   account = account.replace("account-hash-", '');
      // }

      let account_data = await getHolder(account_hash);
      let transferrable = 0;
      let total_staked_as_delegator = math.bignumber("0");
      let total_staked_as_validator = math.bignumber("0");

      //if database has the account, query from the database else request from rpc
      if (account_data.length == 1) {
        account_data = account_data[0];
        transferrable = account_data.balance;
        if (
          account_data.public_key_hex != null ||
          account_data.public_key_hex != undefined
        ) {
          let validator = await getValidator(account_data.public_key_hex);
          if (validator.length > 0) {
            total_staked_as_validator = validator[0].self_stake;
          }
          let delegator = await getTotalStakeAsDelegator(
            account_data.public_key_hex
          );
          if (delegator) {
            total_staked_as_delegator = delegator.toString();
          }
        }
      } else {
        account_data = await getAccountData(account);
        {
          try {
            transferrable = (
              await getBalanceByAccountHash(
                url,
                "account-hash-" + account_data.account_hash
              )
            ).balance_value;

            console.log("transferrable: ", transferrable);
          } catch (err) {
            transferrable = 0;
          }
        }

        //total_staked
        // try {
        //   if (account_data.public_key_hex) {
        //     const auction_info = await requestRPC(url, RpcApiName.get_auction_info, []);
        //     const bids = auction_info.result.auction_state.bids;
        //     if (bids) {
        //       for (let i = 0; i < bids.length; i++) {
        //         if (bids[i].public_key.toLowerCase() == account_data.public_key_hex.toLowerCase()) {
        //           total_staked = math.add(total_staked, math.bignumber(bids[i].bid.staked_amount));
        //         }
        //         const delegators = bids[i].bid.delegators;
        //         if (delegators) {
        //           for (let j = 0; j < delegators.length; j++) {
        //             if (delegators[j].public_key.toLowerCase() == account_data.public_key_hex.toLowerCase()) {
        //               total_staked = math.add(total_staked, math.bignumber(delegators[j].staked_amount));
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // } catch (err) {
        //   console.log("Get Total Stake Error: ", err.message);
        //   total_staked = math.bignumber("0");
        // }
      }

      // Total validator reward
      let total_validator_reward = 0;
      try {
        if (account_data.public_key_hex) {
          total_validator_reward = (
            await getValidatorReward(account_data.public_key_hex.toLowerCase())
          ).total_validator_reward;
        }
        if (total_validator_reward == null) {
          total_validator_reward = 0;
        }
      } catch (err) {
        total_validator_reward = 0;
      }

      // Total delegator reward
      let total_delegator_reward = 0;
      try {
        if (account_data.public_key_hex) {
          total_delegator_reward = (
            await getDelegatorReward(account_data.public_key_hex.toLowerCase())
          ).total_delegator_reward;
        }
        if (total_delegator_reward == null) {
          total_delegator_reward = 0;
        }
      } catch (err) {
        total_delegator_reward = 0;
      }

      let total_reward = math.add(
        Number(total_validator_reward),
        Number(total_delegator_reward)
      );
      // try {
      //   if (account_data.public_key_hex) {
      //     total_reward = (await GetRewardByPublicKey(account_data.public_key_hex.toLowerCase())).total_reward;
      //   }
      //   if (total_reward == null) {
      //     total_reward = 0;
      //   }
      // } catch (err) {
      //   total_reward = 0;
      // }

      // unbonding
      let unbonding = 0;
      {
        try {
          unbonding = await getUnstakingAmount(
            url,
            account_data.public_key_hex.toLowerCase()
          );
        } catch (err) {
          unbonding = 0;
        }
      }

      // get name
      try {
        account_data.name = await getAccountName(
          account_data.public_key_hex.toLowerCase()
        );
      } catch (err) {}

      account_data.balance = (
        Number(transferrable) +
        Number(total_staked_as_delegator) +
        Number(total_staked_as_validator)
      ).toString();
      account_data.transferrable = transferrable.toString();
      account_data.total_staked_as_delegator =
        total_staked_as_delegator.toString();
      account_data.total_staked_as_validator =
        total_staked_as_validator.toString();
      account_data.total_staked = (
        Number(total_staked_as_delegator) + Number(total_staked_as_validator)
      ).toString();
      account_data.total_validator_reward = total_validator_reward.toString();
      account_data.total_delegator_reward = total_delegator_reward.toString();
      account_data.total_reward = total_reward.toString();
      account_data.unbonding = unbonding.toString();
      res.json(account_data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not query account data");
    }
  },

  countHolders: async function (req, res) {
    getTotalNumberOfAccount()
      .then((value) => {
        res.json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Can not get number of holder");
      });
  },

  getAccountTransfers: async function (req, res) {
    const account = req.query.account;
    const page = Number(req.query.page);
    const size = Number(req.query.size);

    let account_hash;
    const data = pagination;

    try {
      data.currentPage = page;
      data.size = size;

      // Get account_hash if possible
      try {
        account_hash = await getAccountHash(account);
      } catch (err) {
        console.log(err);
        account_hash = account;
      }

      // get total transfers by account
      const totalTransfers = await getTotalNumberOfTransfersByAccount(
        account_hash
      );
      data.total = totalTransfers;

      // get total pages
      const totalPages = Math.ceil(totalTransfers / size);
      data.pages = totalPages;

      // check if current page has next page and previous page
      const check = checkNextAndPreviousPage(page, totalPages);
      data.hasNext = check.hasNext;
      data.hasPrevious = check.hasPrevious;

      // get range transfers by account
      const start = Number(size * (page - 1));
      const transfers = await getTransfersByAccountHash(
        account_hash,
        start,
        size
      );

      // get type of transfer
      for (let i = 0; i < transfers.length; i++) {
        if (transfers[i].to_address === "null") {
          transfers[i].to_address = null;
        }

        if (account_hash == transfers[i].from_address) {
          transfers[i].dataValues.type = "out";
        } else {
          transfers[i].dataValues.type = "in";
        }
      }
      data.items = transfers;

      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get transfer deploys history");
    }
  },

  getAccountDeploys: async function (req, res) {
    const account = req.query.account;
    const page = Number(req.query.page);
    const size = Number(req.query.size);

    try {
      const data = pagination;
      data.currentPage = page;
      data.size = size;

      // try to get public key if possible
      let public_key_hex = "";
      {
        try {
          let account_hash = account;
          const get_holder = await getHolder(account_hash);
          public_key_hex = get_holder[0].public_key_hex;
        } catch (err) {
          public_key_hex = account;
        }
      }
      // get total number of deploys by account
      const totalDeployTxs = await getTotalDeployByPublicKey(public_key_hex);
      data.total = totalDeployTxs;

      // get total pages
      const totalPages = Math.ceil(totalDeployTxs / size);
      data.pages = totalPages;

      // check if current page has next page and previous page
      const check = checkNextAndPreviousPage(page, totalPages);
      data.hasNext = check.hasNext;
      data.hasPrevious = check.hasPrevious;

      // get range of deploy by public key
      const start = Number(size * (page - 1));
      const deploys = await getDeploysByPublicKey(public_key_hex, start, size);
      data.items = deploys;

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get deploy history");
    }
  },

  getBalance: async function (req, res) {
    const public_key = req.params.public_key;
    try {
      const account_hash = await getAccountHash(public_key);
      const url = await getNetWorkRPC();
      const balance = await getBalanceByAccountHash(
        url,
        "account-hash-" + account_hash
      );
      res.status(200).json(balance);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get account balance");
    }
  },

  getAccountHash: async function (req, res) {
    const public_key = req.params.public_key;
    try {
      const account_hash = await getAccountHash(public_key);
      res.status(200).json(account_hash);
    } catch (err) {
      console.log(err);
      res.status(500).json(null);
    }
  },

  getRichAccounts: async function (req, res) {
    try {
      const start = req.query.start;
      const count = req.query.count;

      const value = await getRangeRichestCache(start, count);
      res.status(200);
      res.json(value);
    } catch (err) {
      res.status(500).send("Can not get rich list");
    }
  },

  GetRewards: async function (req, res) {
    // get params
    const account = req.query.account;

    let public_key = account;
    {
      const public_key_hex = await getPublicKeyByAccountHash(account);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    const start = Number(req.query.start);
    const count = Number(req.query.count);
    try {
      // Get the last date that account has reward
      const last_date = (await getLatestTimestampByPublicKey(public_key))
        .timestamp;
      // return if account never stake
      if (last_date == null) {
        res.status(200);
        res.json([]);
        return;
      }

      // get rewards
      let rewards = [];
      {
        let mark_date = new Date();
        mark_date.setDate(start_date.getDate() + (1 - start)); // next day
        mark_date = mark_date.toISOString().slice(0, 10);

        for (let i = 0; i < count; i++) {
          let the_date = new Date();
          the_date.setDate(start_date.getDate() - (start + i));
          the_date = the_date.toISOString().slice(0, 10);
          let reward = (
            await getPublicKeyRewardByDate(public_key, the_date, mark_date)
          ).reward;
          if (reward == null) {
            reward = 0;
          }
          rewards.push({
            date: new Date(the_date).getTime(),
            reward: reward.toString(),
          });
          mark_date = the_date;
        }
      }
      res.status(200);
      res.json(rewards);
    } catch (err) {
      console.log(err);
      res.status(200).send("Can not get account rewards");
    }
  },

  getEraReward: async function (req, res) {
    const count = req.query.count;
    const account = req.query.account;

    let public_key = account;
    {
      let account_hash = account;
      if (account.includes("account-hash-")) {
        account_hash = account.replace("account-hash-", "");
      }

      const public_key_hex = await getPublicKeyByAccountHash(account_hash);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }

    const last_era = (await getLatestEra()).era_id;
    try {
      let result = [];
      {
        for (let i = 0; i < count; i++) {
          const index_era = Number(last_era) - Number(i);
          // get reward by era
          let era_reward = (
            await getPublicKeyRewardByEra(public_key, index_era)
          ).reward;
          if (era_reward == null) {
            era_reward = 0;
          }
          const timestamp = (await getTimestampByEra(index_era)).timestamp;
          result.push([
            new Date(timestamp).getTime(),
            Number((Number(era_reward) / 1000000000).toFixed(2)), //convert to CSPR
          ]);
        }
        res.status(200);
        res.json(result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get era reward");
    }
  },

  getRewardV2: async function (req, res) {
    // get params
    const account = req.query.account;

    let public_key = account;
    {
      let account_hash = account;
      const public_key_hex = await getPublicKeyByAccountHash(account_hash);
      if (public_key_hex != null) {
        public_key = public_key_hex.public_key_hex;
      }
    }
    const start = Number(req.query.start);
    const count = Number(req.query.count);
    try {
      // Get the last date that account has reward
      const last_date = (await getLatestTimestampByPublicKey(public_key))
        .timestamp;
      // return if account never stake
      if (last_date == null) {
        res.status(200);
        res.json([]);
        return;
      }
      let start_date = new Date(last_date);
      // get rewards
      let rewards = [];
      {
        let mark_date = new Date(
          start_date.getTime() + 24 * 60 * 60 * 1000 * (1 - start)
        );
        mark_date = withoutTime(mark_date);
        for (let i = 0; i < count; i++) {
          let the_date = new Date(
            start_date.getTime() - 24 * 60 * 60 * 1000 * (start + i)
          );
          the_date = withoutTime(the_date);
          const era_ids = await gerEraIdByDate(
            the_date.toISOString(),
            mark_date.toISOString()
          );
          let total_reward = 0;
          for (const id of era_ids) {
            let era_reward = (await getPublicKeyRewardByEra(public_key, id.era))
              .reward;
            total_reward += Number(era_reward);
          }
          rewards.push({
            date: the_date.getTime(),
            reward: total_reward.toString(),
          });
          mark_date = the_date;
        }
      }
      res.status(200).json(rewards);
    } catch (err) {
      console.log(err);
      res.status(200).send("Can not get account rewards");
    }
  },

  getUndelegate: async function (req, res) {
    const account = req.query.account;
    const start = req.query.start || 0;
    const count = req.query.count || 10;

    try {
      let public_key = account;
      {
        let account_hash = account;
        const public_key_hex = await getPublicKeyByAccountHash(account_hash);
        if (public_key_hex != null) {
          public_key = public_key_hex.public_key_hex;
        }
      }

      const total = (await countDeployByType(public_key, "undelegate")).total;
      if (Number(total) < 1) {
        res.status(200).json({});
        return;
      }

      const url = await getNetWorkRPC();
      let withdraws = [];
      const deploys = await getDeployOfPublicKeyByType(
        public_key,
        "undelegate",
        start,
        count
      );
      const current_era = await getEra(url);
      for (let i = 0; i < deploys.length; i++) {
        let withdraw = {};
        withdraw.hash = deploys[i].deploy_hash;
        const deploy_data = await getDeployByRPC(url, deploys[i].deploy_hash);
        const args =
          deploy_data.result.deploy.session.StoredContractByHash.args;
        withdraw.unbonder_public_key = args.find((value) => {
          return value[0] == "delegator";
        })[1].parsed;
        withdraw.validator_public_key = args.find((value) => {
          return value[0] == "validator";
        })[1].parsed;
        withdraw.amount = args.find((value) => {
          return value[0] == "amount";
        })[1].parsed;

        const status = deploys[i].status == "success" ? true : false;
        withdraw.status = status;
        const era_of_creation = await getEraByBlockHash(deploys[i].hash);
        withdraw.era_of_creation = era_of_creation;
        if (status) {
          const era_of_releasing = Number(era_of_creation) + 8;
          withdraw.era_of_releasing = era_of_releasing;

          const time_of_creation = await getTimestampByEraFromSwtichBlock(
            era_of_creation
          );
          if (time_of_creation) {
            const creation_date = new Date(time_of_creation);
            withdraw.time_of_creation = creation_date.getTime();
            const time_of_releasing =
              Number(withdraw.time_of_creation) + 57600000;
            withdraw.time_of_releasing = time_of_releasing;
          }
          const is_release = current_era >= era_of_releasing ? true : false;
          withdraw.is_release = is_release;
        }

        try {
          const validator_info = await getValidatorInformation(
            withdraw.validator_public_key
          );
          if (validator_info != null) {
            withdraw.validator_name = validator_info.name;
            withdraw.validator_icon = validator_info.icon;
          }
        } catch (err) {}
        withdraws.push(withdraw);
      }
      res.status(200).json({
        total,
        data: withdraws,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get undelegate history");
    }
  },

  getDelegate: async function (req, res) {
    const account = req.query.account;
    const start = req.query.start || 0;
    const count = req.query.count || 10;
    try {
      let public_key = account;
      {
        let account_hash = account;
        const public_key_hex = await getPublicKeyByAccountHash(account_hash);
        if (public_key_hex != null) {
          public_key = public_key_hex.public_key_hex;
        }
      }

      const total = (await countDeployByType(public_key, "delegate")).total;
      if (Number(total) < 1) {
        res.status(200).json({});
        return;
      }

      const url = await getNetWorkRPC();
      let withdraws = [];
      const deploys = await getDeployOfPublicKeyByType(
        public_key,
        "delegate",
        start,
        count
      );
      for (let i = 0; i < deploys.length; i++) {
        let withdraw = {};
        withdraw.hash = deploys[i].deploy_hash;
        const deploy_data = await getDeployByRPC(url, deploys[i].deploy_hash);
        const args =
          deploy_data.result.deploy.session.StoredContractByHash.args;
        withdraw.unbonder_public_key = args.find((value) => {
          return value[0] == "delegator";
        })[1].parsed;
        withdraw.validator_public_key = args.find((value) => {
          return value[0] == "validator";
        })[1].parsed;
        withdraw.amount = args.find((value) => {
          return value[0] == "amount";
        })[1].parsed;
        const status = deploys[i].status == "success" ? true : false;
        withdraw.status = status;
        withdraw.timestamp = new Date(
          deploy_data.result.deploy.header.timestamp
        ).getTime();
        try {
          const validator_info = await getValidatorInformation(
            withdraw.validator_public_key
          );
          if (validator_info != null) {
            withdraw.validator_name = validator_info.name;
            withdraw.validator_icon = validator_info.icon;
          }
        } catch (err) {}
        withdraws.push(withdraw);
      }
      res.status(200).json({
        total,
        data: withdraws,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get undelegate history");
    }
  },

  getBids: async function (req, res) {
    const public_key = req.query.public_key;
    try {
      const url = await getNetWorkRPC();
      const auction_info = await requestRPC(
        url,
        RpcApiName.get_auction_info,
        []
      );

      const bids = auction_info.result.auction_state.bids;

      // find all the bids belong to public_key

      let delegate_history = [];
      for (let i = 0; i < bids.length; i++) {
        const delegators = bids[i].bid.delegators;
        let delegated = delegators.filter((value) => {
          return value.public_key.toLowerCase() == public_key.toLowerCase();
        });
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
            const validator_info = await getValidatorInformation(validator);
            if (validator_info != null) {
              data.validator_name = validator_info.name;
              data.validator_icon = validator_info.icon;
            }
          } catch (err) {}
          delegate_history.push(data);
        }
      }
      res.status(200).json(delegate_history);
    } catch (err) {
      console.log(err);
      res.status(500).json("Can not get bid history");
    }
  },
};
