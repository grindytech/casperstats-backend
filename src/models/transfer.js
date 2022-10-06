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

async function getTransfers(start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM transfer ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTransfersByDeployHash(deploy_hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT deploy_hash, timestamp, from_address AS 'from', to_address AS 'to', value AS 'amount', fee, from_balance, to_balance FROM transfer WHERE deploy_hash = '${deploy_hash}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0]);
    });
  });
}

async function getTransfersByAccountHash(account_hash, start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM transfer WHERE (from_address = '${account_hash}' OR to_address = '${account_hash}') ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTotalNumberOfTransfers() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) AS number_of_transfers FROM transfer`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function GetNumberOfTransfersByDate(from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) AS number_of_transfers FROM transfer WHERE DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}')`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result != undefined && result != null && result.length == 1) {
        resolve(result[0]);
      } else {
        resolve(0);
      }
    });
  });
}

async function GetVolumeByDate(from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(transfer.value AS UNSIGNED INTEGER)) as CHAR) as volume FROM transfer WHERE DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}')`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function GetInflowOfAddressByDate(account_hash, from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(transfer.value AS UNSIGNED INTEGER)) as CHAR) as amount FROM transfer WHERE to_address = '${account_hash}' AND (DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}'));`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result[0].amount != null) {
        resolve(result[0].amount);
      } else {
        resolve(0);
      }
    });
  });
}

async function GetOutflowOfAddressByDate(account_hash, from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT CAST(SUM(CAST(transfer.value AS UNSIGNED INTEGER)) as CHAR) as amount FROM transfer WHERE from_address = '${account_hash}' AND (DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}'));`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result && result[0].amount != null) {
        resolve(result[0].amount);
      } else {
        resolve(0);
      }
    });
  });
}

module.exports = {
  getTransfersByAccountHash,
  getTotalNumberOfTransfers,
  GetNumberOfTransfersByDate,
  GetVolumeByDate,
  getTransfers,
  GetInflowOfAddressByDate,
  GetOutflowOfAddressByDate,
  getTransfersByDeployHash,
};
