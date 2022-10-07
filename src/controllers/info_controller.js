const {
  getDeploy,
  getType,
  getTransfersVolume,
  getDeployFromRPC,
} = require("../service/chain");

const { ELEMENT_TYPE } = require("../service/constant");
const { execute, getNetWorkRPC } = require("../service/common");
require("dotenv").config();

const {
  getTotalNumberOfAccount,
  getNumberOfAccountFromDate,
} = require("../models/account");
const {
  getNumberOfTransfersByDate,
  getVolumeByDate,
} = require("../models/transfer");
const CoinGecko = require("coingecko-api");
const { getAPY } = require("../service/validator");
const {
  getDexAddressesTraffic,
  getExchangeVolumeByDate,
} = require("../service/account");
const { getTotalReward } = require("../models/era");
const coinGeckoClient = new CoinGecko();

const NodeCache = require("node-cache");
const { getBlockHeight } = require("../models/block_model");
const {
  getTotalStakeCurrentEra,
  getTotalActiveValidator,
  getTotalValidator,
  getCurrentEraValidator,
  getTotalActiveBids,
} = require("../models/validator");
const { getTotalDelegator } = require("../models/delegator");
const { getStats } = require("../models/stats");
const { getEraUpdateTime } = require("../models/timestamp");
const { getBlockchainDataByKey } = require("../models/blockchain");

const get_stats_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_STATS || 300,
});
const economics_cache = new NodeCache({
  stdTTL: process.env.CACHE_ECONOMICS || 240,
});

const blockchain_data_cache = new NodeCache({
  stdTTL: process.env.CACHE_BLOCKCHAIN_DATA || 1800,
});
const get_volume_cache = new NodeCache({
  stdTTL: process.env.CACHE_VOLUME || 4200,
});

const exchange_volume_cache = new NodeCache({
  stdTTL: process.env.CACHE_EXCHANGE_VOLUME || 4200,
});
const get_total_reward = new NodeCache({
  stdTTL: process.env.CACHE_GET_TOTAL_REWARD || 450,
});

let total_reward_timestamp;

async function getTotalRewardCache() {
  let total_reward;
  try {
    let timestamp = await getEraUpdateTime();
    if (get_total_reward.has(`total-reward-'${timestamp}'`)) {
      total_reward_timestamp = timestamp;
      return (total_reward = get_total_reward.get(
        `total-reward-'${timestamp}'`
      ));
    }
    total_reward = (await getTotalReward()).total_reward;
    get_total_reward.set(`total-reward-'${timestamp}'`, total_reward);
    get_total_reward.del(`total-reward-'${total_reward_timestamp}'`);
    total_reward_timestamp = timestamp;
    console.log("Update get_total_reward successful");
  } catch (err) {
    console.log(err);
  }

  return total_reward;
}

async function getEconomicsCache() {
  let economics = {};
  try {
    const block_height = await getBlockHeight();
    economics.block_height = block_height;
    const supply = await getStats();
    if (supply) {
      economics.total_supply = supply.total_supply;
      economics.circulating_supply = supply.circulating_supply;
    }

    let total_stake = await getTotalStakeCurrentEra();

    // calculate APY
    const apy = await getAPY(total_stake);
    economics.APY = apy;

    // calculate total_stake

    economics.total_stake = total_stake.toString();
    economics.total_active_validators = await getTotalActiveValidator();
    economics.total_bid_validators = await getTotalValidator();
    economics.total_active_bids = await getTotalActiveBids();
    economics.total_delegators = await getTotalDelegator();

    // total reward
    let total_reward;
    if (get_total_reward.has(`total-reward-'${total_reward_timestamp}'`)) {
      total_reward = get_total_reward.get(
        `total-reward-'${total_reward_timestamp}'`
      );
    } else {
      total_reward = await getTotalRewardCache();
    }
    economics.total_reward = total_reward;
    economics_cache.set("economics", economics);
  } catch (err) {
    console.log(err);
  }
  return economics;
}

async function getStatsCache() {
  let stats = {
    holders: 0,
    holders_change: 0, // last 24 hours
    validators: 0,
    validators_change: 0, // last 24 hours
    circulating: 0,
    circulating_change: 0, // last 24 hours
    total_supply: 0,
    total_supply_change: 0, // last 24 hours
    price: 0,
    price_change: 0, // last 24 hours
    marketcap: 0,
    marketcap_change: 0, // last 24 hours
    transactions: 0,
    transactions_change: 0, // last 24 hours
    transfers: [], // last 60 days transfer
  };
  try {
    // holder
    {
      var datetime = new Date();
      let yesterday = new Date();
      {
        yesterday.setDate(datetime.getDate() - 1);
        yesterday = yesterday.toISOString();
      }

      const holders = (await getTotalNumberOfAccount()).number_of_holders;
      const last_holders = (await getNumberOfAccountFromDate(yesterday))
        .number_of_holders;
      stats.holders = holders;
      stats.holders_change =
        ((Number(holders) - Number(last_holders)) / Number(holders)) * 100;
    }

    // validator
    {
      const era_validators = await getCurrentEraValidator();
      const current_validators = era_validators.length;
      stats.validators = current_validators;
    }

    // circulating + total supply
    {
      const supply = await getStats();
      if (supply) {
        stats.circulating = supply.circulating_supply;
        stats.total_supply = supply.total_supply;
        stats.price = supply.current_price;
        stats.price_change = supply.price_change_percentage_24h;
        stats.marketcap = supply.market_cap;
        stats.marketcap_change = supply.market_cap_change_percentage_24h;
      }
    }

    // price + marketcap
    {
      // const params = {
      //     tickers: false,
      //     community_data: false,
      //     developer_data: false,
      //     localization: false,
      // }
      // let data = await coinGeckoClient.coins.fetch('casper-network', params);
      // stats.price = data.data.market_data.current_price.usd;
      // stats.price_change = data.data.market_data.price_change_percentage_24h;
      // stats.marketcap = data.data.market_data.market_cap.usd;
      // stats.marketcap_change = data.data.market_data.market_cap_change_percentage_24h;
    }

    // volume
    {
      // const params = {
      //     days: 1,
      //     vs_currency: 'usd',
      // }
      // let data = await coinGeckoClient.coins.fetchMarketChart('casper-network', params);

      // const length = data.data.total_volumes.length;
      // const current_transaction =  data.data.total_volumes[0][1];
      // const last_transaction = data.data.total_volumes[282][length - 1];
      // stats.volume = current_transaction;
      // stats.volume_change = (Number(last_transaction) - Number(current_transaction)) / Number(current_transaction) * 100

      let now = new Date();
      now = now.toISOString();

      const the_time = new Date();
      let yesterday = new Date();
      {
        yesterday.setDate(the_time.getDate() - 1);
        yesterday = yesterday.toISOString();
      }

      let before_yesterday = new Date();
      {
        before_yesterday.setDate(the_time.getDate() - 2);
        before_yesterday = before_yesterday.toISOString();
      }

      let today_transfers = (await getNumberOfTransfersByDate(yesterday, now))
        .number_of_transfers;
      let yesterday_transfers = (
        await getNumberOfTransfersByDate(before_yesterday, yesterday)
      ).number_of_transfers;

      stats.transactions = today_transfers;
      stats.transactions_change =
        ((Number(today_transfers) - Number(yesterday_transfers)) /
          Number(yesterday_transfers)) *
        100;
    }

    // transfers
    {
      const count = 60;
      const data = await getTransfersVolume(count);
      stats.transfers = data;
    }

    get_stats_cache.set("get-stats", stats);
  } catch (err) {
    console.log(err);
  }

  return stats;
}

async function GetVolumeCache(count) {
  let result = [];
  try {
    var datetime = new Date();

    for (let i = 0; i < count; i++) {
      let the_date = new Date();
      the_date.setDate(datetime.getDate() - i);
      the_date = the_date.toISOString().slice(0, 10);
      let data = await getVolumeByDate(the_date, the_date);
      data = data[0];

      const paser_data = [
        Math.floor(new Date(the_date).getTime()),
        Number((Number(data.volume) / 1000000000).toFixed(2)),
      ];

      result.push(paser_data);
    }
    get_volume_cache.set(`get-volume-${count}`, result);
  } catch (err) {
    console.log(err);
  }

  return result;
}

async function getBlockchainDataCache(type) {
  let blockchain_data = [];
  const result = await getBlockchainDataByKey(type);

  // Return error if type is invalid
  if (result.length == 0) {
    return { error: "Could not find data with given type" };
  }

  // Get group of given type
  const group = result[0].group;
  if (group === "volume") {
    for (let i = result.length - 1; i >= 0; i--) {
      const data = [
        Math.floor(result[i].timestamp),
        Number((Number(result[i].value) / 1000000000).toFixed(2)),
      ];
      blockchain_data.push(data);
    }
  } else {
    for (let i = result.length - 1; i >= 0; i--) {
      const data = [Math.floor(result[i].timestamp), Number(result[i].value)];
      blockchain_data.push(data);
    }
  }
  blockchain_data_cache.set(`${type}`, blockchain_data);

  return blockchain_data;
}

async function GetExchangeVolumeCache(count) {
  let result = [];
  try {
    var datetime = new Date();

    for (let i = 0; i < count; i++) {
      let the_date = new Date();
      the_date.setDate(datetime.getDate() - i);
      the_date = the_date.toISOString().slice(0, 10);

      const traffic_data = await getExchangeVolumeByDate(the_date, the_date);
      result.push(traffic_data);
    }
    exchange_volume_cache.set(count, result);
  } catch (err) {
    console.log(err);
  }

  return result;
}

module.exports = {
  get_stats_cache,
  economics_cache,
  blockchain_data_cache,
  get_volume_cache,
  exchange_volume_cache,
  getEconomicsCache,
  getStatsCache,
  GetVolumeCache,
  GetExchangeVolumeCache,
  getTotalRewardCache,
  getBlockchainDataCache,

  getDeploy: async function (req, res) {
    let hex = req.params.hex; // Hex-encoded deploy hash
    const url = await getNetWorkRPC();
    getDeployFromRPC(url, hex)
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },

  getDeployInfo: async function (req, res) {
    let hex = req.params.hex; // Hex-encoded deploy hash
    getDeploy(hex)
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },

  getListDeploys: async function (req, res) {
    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used
    const rpc_url = await getNetWorkRPC();
    let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${rpc_url}`;

    if (id) {
      command = command + ` --id ${id}`;
    }

    if (b) {
      command = command + ` -b ${b}`;
    }

    execute(command)
      .then((value) => {
        res.status(200);
        res.json(value);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getType: async function (req, res) {
    const param = req.params.param;
    try {
      const type = await getType(param);
      res.status(200);
      res.json(type);
    } catch (err) {
      res.json({
        value: param,
        type: ELEMENT_TYPE.UNKNOWN,
      });
    }
  },

  getCirculatingSupply: async function (req, res) {
    // CasperLabs APIs
    res.status(200).json("comming soon");
  },

  getSupply: async function (req, res) {
    res.status(200).json("comming soon");
  },

  getBlockchainData: async function (req, res) {
    try {
      const type = req.query.type;
      const result = await getBlockchainDataCache(type);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  },

  getVolume: async function (req, res) {
    try {
      const count = req.params.count;
      const result = await GetVolumeCache(count);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  },

  getStats: async function (req, res) {
    try {
      let stats = await getStatsCache();
      res.status(200);
      res.json(stats);
    } catch (err) {
      res.send(err);
    }
  },

  getEconomics: async function (req, res) {
    try {
      let economics = await getEconomicsCache();
      res.status(200).json(economics);
    } catch (err) {
      res.send(err);
    }
  },

  getDexTraffic: async function (req, res) {
    // get all known address
    try {
      let now = new Date();
      let yesterday = new Date();
      {
        yesterday.setDate(now.getDate() - 1);
        yesterday = yesterday.toISOString();
        now = now.toISOString();
      }
      let inflow = await getDexAddressesTraffic("in", yesterday, now);
      let outflow = await getDexAddressesTraffic("out", yesterday, now);

      res.status(200).json({
        inflow,
        outflow,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "can not get dex traffic",
      });
    }
  },

  getExchangeVolume: async function (req, res) {
    // get all known address
    const count = req.query.count;
    try {
      const result = await GetExchangeVolumeCache(count);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "can not get exchange volume",
      });
    }
  },
};
