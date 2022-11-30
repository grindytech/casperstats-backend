const mysql = require("mysql");
const { db_config } = require("../service/common");
const { casper_sequelize } = require("../service/common");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: db_config.host || "localhost",
  user: db_config.user || "root",
  password: db_config.password,
  database: db_config.database,
  debug: false,
});

const Transfer = casper_sequelize.define(
  "transfer",
  {
    deploy_hash: {
      type: Sequelize.STRING(64),
      primaryKey: true,
    },
    timestamp: {
      type: Sequelize.STRING(25),
    },
    from_address: {
      type: Sequelize.STRING(64),
    },
    to_address: {
      type: Sequelize.STRING(64),
    },
    value: {
      type: Sequelize.STRING(25),
    },
    fee: {
      type: Sequelize.STRING(25),
    },
    from_balance: {
      type: Sequelize.STRING(25),
    },
    to_balance: {
      type: Sequelize.STRING(25),
    },
  },
  { timestamps: false }
);

// `SELECT * FROM transfer ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
async function getRangeTransfers(start, size) {
  return await Transfer.findAll({
    order: [["timestamp", "DESC"]],
    offset: start,
    limit: size,
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

//`SELECT COUNT(*) AS number_of_transfers FROM transfer`;
async function getTotalNumberOfTransfers() {
  const numberOfTransfers = await Transfer.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("*")), "number_of_transfers"],
    ],
  });
  return numberOfTransfers[0].dataValues.number_of_transfers;
}

async function getNumberOfTransfersByDate(from, to) {
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

async function getVolumeByDate(from, to) {
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

async function getInflowOfAddressByDate(account_hash, from, to) {
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

async function getOutflowOfAddressByDate(account_hash, from, to) {
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
  Transfer,
  getTransfersByAccountHash,
  getTotalNumberOfTransfers,
  getNumberOfTransfersByDate,
  getVolumeByDate,
  getRangeTransfers,
  getInflowOfAddressByDate,
  getOutflowOfAddressByDate,
  getTransfersByDeployHash,
};
