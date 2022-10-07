const mysql = require("mysql");
const { db_config } = require("../service/common");

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: db_config.host || "localhost",
  user: db_config.user || "root",
  password: db_config.password,
  database: db_config.database,
  debug: false,
});

async function getBlocksByValidator(validator_public_key, start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM block WHERE validator = '${validator_public_key}' ORDER BY height DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function GetSwitchBlockByDate(date) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT era , MAX(height) as height FROM block WHERE DATE(timestamp) BETWEEN '${date}' AND '${date}' GROUP BY era ORDER BY height DESC`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getBlockByHeight(height) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM block WHERE height = '${height}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0]);
    });
  });
}

async function getBlockHeightByHash(hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT height FROM block WHERE hash = '${hash}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getLatestBlock(count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM block ORDER BY height DESC LIMIT 0, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getRangeBlock(start, end) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM block WHERE height BETWEEN ${start} AND ${end} ORDER BY height DESC`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getBlockHeight() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT MAX(height) as height FROM block`;
    pool.query(sql, function (err, result, fields) {
      if (err) resolve(false);
      if (result != undefined && result.length > 0) {
        const height = result[0].height;
        resolve(height);
      } else {
        resolve(-1);
      }
    });
  });
}

async function getEraByBlockHash(hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT era FROM block WHERE hash = '${hash}'`;
    pool.query(sql, function (err, result, fields) {
      if (err) resolve(false);
      if (result != undefined && result.length > 0) {
        const era = result[0].era;
        resolve(era);
      } else {
        resolve(-1);
      }
    });
  });
}

async function getTimestampByEraFromSwtichBlock(era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT timestamp FROM block WHERE height = (SELECT MIN(height) AS height FROM block WHERE era = ${era})`;
    pool.query(sql, function (err, result, fields) {
      if (err) reject(err);
      if (result != undefined && result != null && result.length > 0) {
        const timestamp = result[0].timestamp;
        resolve(timestamp);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  getBlocksByValidator,
  GetSwitchBlockByDate,
  getBlockByHeight,
  getBlockHeight,
  getEraByBlockHash,
  getTimestampByEraFromSwtichBlock,
  getBlockHeightByHash,
  getRangeBlock,
  getLatestBlock,
};
