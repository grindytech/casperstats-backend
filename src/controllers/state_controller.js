const {
  requestRPC,
  queryState,
  getBalance,
  getBalanceByAccountHash,
  getBalanceByState,
  getNetWorkRPC,
} = require("../service/common");
const {
  getValidators,
  getCurrentEraValidators,
  getNextEraValidators,
  getBids,
  getValidatorData,
  getValidatorInformation,
  getRangeBidsPagination,
} = require("../service/validator");
const { RpcApiName } = require("../service/constant");
const math = require("mathjs");
require("dotenv").config();

const NodeCache = require("node-cache");
const { getLatestDeployCostByType } = require("../models/deploy");
const { getRangeDelegator } = require("../models/delegator");
const { getRangeEraRewards } = require("../models/era");
const { getDateByEra } = require("../models/era_id");
const { getValidatorUpdateTime } = require("../models/timestamp");
const {
  getTotalStakeNextEra,
  getTotalNextEraValidators,
} = require("../models/validator");

const get_validators_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_BIDS || 7200,
});
const get_bids_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_BIDS || 7200,
});
const get_current_era_validators_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_ERA_VALIDATORS || 7200,
});
const get_validator_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_VALIDATOR || 300,
});
const get_range_delegator_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_RANGE_DELEGATOR || 300,
});
const get_range_era_rewards_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_RANGE_ERA_REWARDS || 300,
});
const get_next_era_validators_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_ERA_VALIDATORS || 7200,
});
let validator_timestamp;
let current_era_validator_timestamp;
let next_era_validator_timestamp;
let validators_timestamp;

async function getBidsCache() {
  let bids;
  try {
    let timestamp = await getValidatorUpdateTime();
    if (get_bids_cache.has(`get-bids-'${timestamp}'`)) {
      validator_timestamp = timestamp;
      return (bids = get_bids_cache.get(`get-bids-'${timestamp}'`));
    }
    bids = await getBids();
    get_bids_cache.set(`get-bids-'${timestamp}'`, bids);
    get_bids_cache.del(`get-bids-'${validator_timestamp}'`);
    validator_timestamp = timestamp;
    console.log("reset get-bids-cache successful");
  } catch (err) {
    console.log(err);
  }
  return bids;
}

async function getCurrentEraValidatorsCache() {
  let era_validators;
  try {
    let timestamp = await getValidatorUpdateTime();
    if (
      get_current_era_validators_cache.has(
        `get-current-era-validators-'${timestamp}'`
      )
    ) {
      current_era_validator_timestamp = timestamp;
      return (era_validators = get_current_era_validators_cache.get(
        `get-current-era-validators-'${timestamp}'`
      ));
    }
    const url = await getNetWorkRPC();
    era_validators = await getCurrentEraValidators(url);
    get_current_era_validators_cache.set(
      `get-current-era-validators-'${timestamp}'`,
      era_validators
    );
    get_current_era_validators_cache.del(
      `get-current-era-validators-'${current_era_validator_timestamp}'`
    );
    current_era_validator_timestamp = timestamp;
    console.log("reset get-current-era-validator-cache successful");
  } catch (err) {
    console.log(err);
  }

  return era_validators;
}

async function getNextEraValidatorsCache() {
  let era_validators;
  try {
    let timestamp = await getValidatorUpdateTime();
    if (
      get_next_era_validators_cache.has(
        `get-next-era-validators-'${timestamp}'`
      )
    ) {
      next_era_validator_timestamp = timestamp;
      return (era_validators = get_next_era_validators_cache.get(
        `get-next-era-validators-'${timestamp}'`
      ));
    }
    const url = await getNetWorkRPC();
    era_validators = await getNextEraValidators(url);
    get_next_era_validators_cache.set(
      `get-next-era-validators-'${timestamp}'`,
      era_validators
    );
    get_next_era_validators_cache.del(
      `get-next-era-validators-'${next_era_validator_timestamp}'`
    );
    next_era_validator_timestamp = timestamp;
    console.log("reset get-next-era-validator-cache successful");
  } catch (err) {
    console.log(err);
  }

  return era_validators;
}

async function getValidatorsCache(number) {
  let validators;
  try {
    let timestamp = await getValidatorUpdateTime();
    if (get_validators_cache.has(`'${number}'-'${timestamp}'`)) {
      validators_timestamp = timestamp;
      return (validators = get_validators_cache.get(
        `'${number}'-'${timestamp}'`
      ));
    }
    validators = await getValidators(number);
    get_validators_cache.set(`'${number}'-'${timestamp}'`, validators);
    get_validators_cache.del(`'${number}'-'${validators_timestamp}'`);
    validators_timestamp = timestamp;
    console.log("Update get-validators-cache successfull");
  } catch (err) {
    res.send(err);
  }
  return validators;
}

module.exports = {
  get_validators_cache,
  get_bids_cache,
  get_validator_cache,
  get_current_era_validators_cache,
  get_range_delegator_cache,
  get_range_era_rewards_cache,
  get_next_era_validators_cache,
  getBidsCache,
  getCurrentEraValidatorsCache,
  getNextEraValidatorsCache,
  getValidatorsCache,

  getBalanceAccountHash: async function (req, res) {
    const account_hash = req.params.account_hash;
    try {
      const url = await getNetWorkRPC();
      const balance = await getBalanceByAccountHash(url, account_hash);
      res.status(200);
      res.json(balance);
    } catch (err) {
      res.send(err);
    }
  },

  getBalanceAddress: async function (req, res) {
    let account = req.params.account;
    try {
      const url = await getNetWorkRPC();
      const balance = await getBalance(url, account);
      res.status(200);
      res.json(balance);
    } catch (err) {
      res.send(err);
    }
  },

  queryState: async function (req, res) {
    let k = req.params.key;
    //key must be a formatted PublicKey or Key. This will take one of the following forms:
    //     01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
    // account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
    // hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
    // uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
    // transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
    // deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo

    queryState(k)
      .then((value) => {
        res.status(200);
        res.json(value);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },

  getAuctionInfo: async function (req, res) {
    const block = Number(req.query.block);
    const url = await getNetWorkRPC();
    requestRPC(url, RpcApiName.get_auction_info, [{ Height: block }])
      .then((value) => {
        res.status(200);
        res.json(value.result);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getValidators: async function (req, res) {
    const number = Number(req.params.number);
    try {
      let validators;
      if (get_validators_cache.has(`'${number}'-'${validators_timestamp}'`)) {
        validators = get_validators_cache.get(
          `'${number}'-'${validators_timestamp}'`
        );
      } else {
        validators = await getValidatorsCache(number);
      }

      res.status(200).json(validators);
    } catch (err) {
      res.send(err);
    }
  },

  getCurrentEraValidators: async function (req, res) {
    try {
      let era_validators;
      if (
        get_current_era_validators_cache.has(
          `get-current-era-validators-'${current_era_validator_timestamp}'`
        )
      ) {
        era_validators = get_current_era_validators_cache.get(
          `get-current-era-validators-'${current_era_validator_timestamp}'`
        );
      } else {
        era_validators = await getCurrentEraValidatorsCache();
      }

      res.status(200).json(era_validators);
    } catch (err) {
      res.send(err);
    }
  },

  getNextEraValidators: async function (req, res) {
    try {
      let era_validators;
      if (
        get_next_era_validators_cache.has(
          `get-next-era-validators-'${next_era_validator_timestamp}'`
        )
      ) {
        era_validators = get_next_era_validators_cache.get(
          `get-next-era-validators-'${next_era_validator_timestamp}'`
        );
      } else {
        era_validators = await getNextEraValidatorsCache();
      }

      res.status(200).json(era_validators);
    } catch (err) {
      res.send(err);
    }
  },

  getBids: async function (req, res) {
    try {
      let bids;
      if (get_bids_cache.has(`get-bids-'${validator_timestamp}'`)) {
        bids = get_bids_cache.get(`get-bids-'${validator_timestamp}'`);
      } else {
        bids = await getBidsCache();
      }

      res.status(200).json(bids);
    } catch (err) {
      res.send(err);
    }
  },

  getRangeBids: async function (req, res) {
    try {
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      const order_by = req.query.order_by;
      const order_direction = req.query.order_direction;
      const data = await getRangeBidsPagination(
        page,
        size,
        order_by,
        order_direction
      );
      res.status(200).json(data);
    } catch (err) {
      res.send(err);
    }
  },

  getValidator: async function (req, res) {
    try {
      const account = req.params.account;
      const url = await getNetWorkRPC();
      let data = await getValidatorData(url, account);

      // add additonal information
      try {
        data.information = await getValidatorInformation(account);
      } catch (err) {
        data.information = null;
      }
      get_validator_cache.set(account, data);
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getRangeDelegator: async function (req, res) {
    try {
      const validator = req.query.validator;
      const start = Number(req.query.start);
      const count = Number(req.query.count);
      const data = await getRangeDelegator(validator, start, count);
      get_range_delegator_cache.set(
        `validator: '${validator}' start: ${start} count: ${count}`,
        data
      );
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getRangeEraRewards: async function (req, res) {
    try {
      const validator = req.query.validator;
      const start = req.query.start;
      const count = req.query.count;

      const data = await getRangeEraRewards(validator, start, count);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const timestamp = await getDateByEra(data[i].era);
          data[i].timestamp = timestamp;
        }
      }
      get_range_era_rewards_cache.set(
        `validator: '${validator}' start: ${start} count: ${count}`,
        data
      );
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getBalanceState: async function (req, res) {
    const account_hash = req.query.account_hash;
    const state = req.query.state;
    try {
      const url = await getNetWorkRPC();
      const result = await getBalanceByState(url, account_hash, state);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  },

  getLatestTransaction: async function (req, res) {
    const type = req.params.type;
    try {
      let cost = (await getLatestDeployCostByType(type)).cost;
      if (type == "delegate") {
        if (Number(cost) < Number(process.env.MIN_DELEGATE_FEE)) {
          cost = Number(process.env.MIN_DELEGATE_FEE);
        }
      }
      res.status(200).json({
        type: type,
        fee: cost.toString(),
      });
    } catch (err) {
      res.status(500).send(`Can not get latest cost of ${type} transaction`);
    }
  },
};
