const mysql = require("mysql");
const { db_config } = require("../utils/common");

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: db_config.host || "localhost",
  user: db_config.user || "root",
  password: db_config.password,
  database: db_config.database,
  debug: false,
});

async function GetTotalRewardByPublicKey(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE validator = '${public_key}' OR delegator = '${public_key}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function getRewardByPublicKey(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE (validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function getRangeEraRewards(public_key, start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT era, SUM(amount) as amount FROM era WHERE validator = '${public_key}' GROUP BY era LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getValidatorReward(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_validator_reward FROM era WHERE validator = '${public_key}' AND delegator = ""`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_validator_reward: 0 });
      }
    });
  });
}

async function getDelegatorReward(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_delegator_reward FROM era WHERE delegator = '${public_key}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_delegator_reward: 0 });
      }
    });
  });
}

async function GetTotalRewardByEra(era_id) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE era = '${era_id}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function getLatestEra() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT MAX(era) as era_id FROM era`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ era_id: null });
      }
    });
  });
}

async function getLatestEraByDate(from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT MAX(era) as era_id FROM era WHERE timestamp BETWEEN '${from}' AND '${to}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ era_id: null });
      }
    });
  });
}

async function getPublicKeyRewardByDate(public_key, from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT SUM(era.amount) as reward FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND timestamp BETWEEN '${from}' AND '${to}'`;
    console.log("sql: ", sql);
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function getPublicKeyRewardByEra(public_key, era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as reward FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND era = ${era}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function GetPublicKeyTotalRewardByDate(account, from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE (validator = '${account}' OR delegator = '${account}') AND timestamp BETWEEN '${from}' AND '${to}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function GetTotalDelegator(era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(DISTINCT validator, delegator) as total_delegators from era WHERE era = ${era}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result != undefined && result != null && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_delegators: 0 });
      }
    });
  });
}

async function GetTotalReward() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_delegators: 0 });
      }
    });
  });
}

async function getTimestampByEra(era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT timestamp FROM era WHERE era = '${era}' LIMIT 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(0);
      }
    });
  });
}

async function GetEraValidatorOfPublicKey(public_key, era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT validator FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND era = ${era}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ total_reward: 0 });
      }
    });
  });
}

async function getLatestTimestampByPublicKey(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT timestamp FROM era WHERE (validator = '${public_key}' OR delegator = '${public_key}') ORDER BY timestamp DESC LIMIT 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        resolve({ timestamp: null });
      }
    });
  });
}

module.exports = {
  GetTotalRewardByPublicKey,
  GetTotalRewardByEra,
  getLatestEra,
  GetPublicKeyTotalRewardByDate,
  GetTotalDelegator,
  GetTotalReward,
  getValidatorReward,
  getPublicKeyRewardByDate,
  getPublicKeyRewardByEra,
  getTimestampByEra,
  getLatestEraByDate,
  GetEraValidatorOfPublicKey,
  getLatestTimestampByPublicKey,
  getRangeEraRewards,
  getDelegatorReward,
  getRewardByPublicKey,
};
