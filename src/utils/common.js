const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require("./constant");
const request = require("request");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");

var db_config = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
};

var db_config_sequelize = {
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
  let s = await GetLatestStateRootHash(url); // get latest root hash
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
  let s = await GetLatestStateRootHash(url); //Hex-encoded hash of the state root

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

async function GetAccountData(url, address) {
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
  return new Promise((resolve, reject) => {
    let body = "";
    if (id == undefined) {
      let unique = new Date().getTime();
      body = JSON.stringify({
        jsonrpc: "2.0",
        id: unique,
        method: method,
        params: params,
      });
    } else {
      body = JSON.stringify({
        jsonrpc: "2.0",
        id: id,
        method: method,
        params: params,
      });
    }
    let options = {
      url: url,
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body,
    };
    console.log("Option: ", options);
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

const GetLatestStateRootHash = async (url) => {
  return new Promise((resolve, reject) => {
    requestRPC(url, RpcApiName.get_state_root_hash, [])
      .then((value) => {
        resolve(value.result.state_root_hash);
      })
      .catch((err) => {
        reject(err);
      });
  });
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
  const rpc_url = await getNetWorkRPC();

  if (state == "") {
    state = await GetLatestStateRootHash(rpc_url);
  }

  return new Promise((resolve, reject) => {
    let command = `${process.env.CASPER_CLIENT} query-state --node-address ${rpc_url} -k ${key} -s ${state}`;
    console.log("command: ", command);
    if (id != undefined) {
      command = command + ` --id ${id}`;
    }

    execute(command)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
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
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: RpcApiName.get_status,
      params: [],
    });
    let options = {
      url: URL,
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body,
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
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
      status = JSON.parse(status);
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

module.exports = {
  GetAccountData,
  getHeight,
  queryState,
  GetLatestStateRootHash,
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
};
