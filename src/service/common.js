const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require("./constant");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const axios = require("axios");

const db_config = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
};

const casper_config_sequelize = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: "mysql",
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
const validator_config_sequelize = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.VALIDATOR_DB_NAME,
  dialect: "mysql",
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const validator_sequelize = new Sequelize(
  validator_config_sequelize.database,
  validator_config_sequelize.user,
  validator_config_sequelize.password,
  {
    host: validator_config_sequelize.host,
    dialect: validator_config_sequelize.dialect,
    pool: {
      max: validator_config_sequelize.pool.max,
      min: validator_config_sequelize.pool.min,
      acquire: validator_config_sequelize.pool.acquire,
      idle: validator_config_sequelize.pool.idle,
    },
    define: {
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

const casper_sequelize = new Sequelize(
  casper_config_sequelize.database,
  casper_config_sequelize.user,
  casper_config_sequelize.password,
  {
    host: casper_config_sequelize.host,
    dialect: casper_config_sequelize.dialect,
    pool: {
      max: casper_config_sequelize.pool.max,
      min: casper_config_sequelize.pool.min,
      acquire: casper_config_sequelize.pool.acquire,
      idle: casper_config_sequelize.pool.idle,
    },
    define: {
      freezeTableName: true,
    },
  }
);

const db_config_sequelize = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.STATS_DB_NAME,
  dialect: "mysql",
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(
  db_config_sequelize.database,
  db_config_sequelize.user,
  db_config_sequelize.password,
  {
    host: db_config_sequelize.host,
    dialect: db_config_sequelize.dialect,
    pool: {
      max: db_config_sequelize.pool.max,
      min: db_config_sequelize.pool.min,
      acquire: db_config_sequelize.pool.acquire,
      idle: db_config_sequelize.pool.idle,
    },
    define: {
      freezeTableName: true,
    },
  }
);

const common_option = (option) => {
  return {
    series: [
      {
        type: "area",
        data: option.data.reverse(),
      },
    ],
    yAxis: {
      title: {
        text: option.title,
      },
    },
  };
};

const chart_config = (option) => {
  return {
    chart: {
      backgroundColor: "none",
      numberFormatter(v) {
        return numeral(v).format("0.[00] a");
      },
    },
    legend: {
      enabled: false,
    },
    title: {
      text: "",
    },
    colors: ["#B6B6B4"],
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1.3,
          },
          stops: [
            [0, "rgba(0, 0, 0, 0.2)"],
            [1, "rgba(255,255,255,0)"],
          ],
        },
        threshold: null,
      },
    },
    series: option.series,
    xAxis: {
      type: "datetime",
    },
    yAxis: option.yAxis,
  };
};

async function getAccountHash(address) {
  return new Promise((resolve, reject) => {
    let command = `${process.env.CASPER_CLIENT} account-address`;
    if (address) {
      command = command + ` --public-key ${address}`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      let result = String(stdout).replace(/\n/g, "");
      result = result.replace("account-hash-", "");
      return resolve(result);
    });
  });
}

const getBalance = async (url, address) => {
  let s = await getLatestStateRootHash(url); // get latest root hash
  try {
    let URef = await queryState(address, s); // URef for address
    let main_purse = URef.result.stored_value.Account.main_purse;

    let params = [s, main_purse];

    let result = await requestRPC(url, RpcApiName.get_balance, params);
    return result;
  } catch (err) {
    throw {
      code: -32001,
      message: "address not known",
      data: null,
    };
  }
};

const getBalanceByAccountHash = async (url, account_hash) => {
  let s = await getLatestStateRootHash(url); //Hex-encoded hash of the state root

  const state = await queryState(account_hash, s);
  const main_purse = state.result.stored_value.Account.main_purse;

  let params = [s, main_purse];
  const result = await requestRPC(url, RpcApiName.get_balance, params);
  return {
    balance_value: result.result.balance_value,
  };
};

const getBalanceByState = async (url, account_hash, s) => {
  const state = await queryState(account_hash, s);
  const main_purse = state.result.stored_value.Account.main_purse;

  let params = [s, main_purse];
  const result = await requestRPC(url, RpcApiName.get_balance, params);
  return result.result.balance_value;
};

async function getAccountData(url, address) {
  const account = {};
  account["balance"] = await getBalance(url, address);
  account["account_hash"] = await getAccountHash(address);

  return account;
}
const execute = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });
};

const requestRPC = async (url, method, params, id = undefined) => {
  try {
    let body = "";
    if (id === undefined) {
      let unique = new Date().getTime();
      id = unique;
    }

    body = {
      jsonrpc: "2.0",
      id: id,
      method: method,
      params: params,
    };

    const response = await axios.post(url, body);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getLatestStateRootHash = async (url) => {
  try {
    const state_root_hash = await requestRPC(
      url,
      RpcApiName.get_state_root_hash,
      []
    );
    return state_root_hash.result.state_root_hash;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Retrieves a stored value from the network
 *
 * @param {string} key must be a formatted PublicKey or Key. This will take one of the following forms:
 * 01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
 * account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
 * hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
 * uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
 * transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
 * deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo
 * @param {string} state Hex-encoded hash of the state root.
 * @param {number} id optional
 * @return {object}.
 */
const queryState = async (key, state = "", id = undefined) => {
  try {
    const rpc_url = await getNetWorkRPC();

    if (state == "") {
      state = await getLatestStateRootHash(rpc_url);
    }

    let command = `${process.env.CASPER_CLIENT} query-state --node-address ${rpc_url} -k ${key} -s ${state}`;
    //console.log("command: ", command);
    if (id != undefined) {
      command = command + ` --id ${id}`;
    }

    const result = await execute(command);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getHeight = async (url) => {
  let params = [{}];

  let block_data = await requestRPC(url, RpcApiName.get_block, params);
  let height = block_data.result.block.header.height;
  return height;
};

const getEra = async (url) => {
  let params = [{}];
  let block_data = await requestRPC(url, RpcApiName.get_block, params);
  let era_id = block_data.result.block.header.era_id;
  return era_id;
};

async function GetNetworkStatus(URL) {
  try {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: RpcApiName.get_status,
      params: [],
    };

    const response = await axios.post(URL, body);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * getNetWorkRPC return Network RPC URL, prevent connection lost
 * @returns active URL string ortherwise
 */
async function getNetWorkRPC() {
  const URLs = JSON.parse(process.env.NETWORK_RPC_URLS);
  // check array
  if (Array.isArray(URLs) == false) {
    throw Error("Can not find Network RPC");
  }
  // check status from 0
  for (let i = 0; i < URLs.length; i++) {
    try {
      let status = await GetNetworkStatus(URLs[i]);
      if (status.result.last_added_block_info != undefined) {
        return URLs[i];
      }
    } catch (err) {}
  }
  throw Error("Can not find Network RPC");
}

const auth = (user, password) => {
  return user == process.env.API_USER && password == process.env.API_PASSWORD;
};

// API pagination
const pagination = {
  currentPage: 1,
  hasNext: false,
  hasPrevious: false,
  items: [],
  pages: 1,
  size: 0,
  total: 0,
};

const checkNextAndPreviousPage = (page, totalPages) => {
  let hasNext = false;
  let hasPrevious = false;
  // check if current page has next page and previous page
  if (page === totalPages) {
    hasNext = false;
  }
  if (page < totalPages) {
    hasNext = true;
  }
  if (page > 1 && page <= totalPages) {
    hasPrevious = true;
  }

  return { hasNext: hasNext, hasPrevious: hasPrevious };
};

module.exports = {
  getAccountData,
  getHeight,
  queryState,
  getLatestStateRootHash,
  execute,
  getBalance,
  getAccountHash,
  requestRPC,
  getBalanceByAccountHash,
  db_config,
  getBalanceByState,
  getNetWorkRPC,
  auth,
  getEra,
  sequelize,
  chart_config,
  common_option,
  pagination,
  checkNextAndPreviousPage,
  casper_sequelize,
  validator_sequelize,
};
