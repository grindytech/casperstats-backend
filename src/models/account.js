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

const Account = casper_sequelize.define(
  "account",
  {
    account_hash: {
      type: Sequelize.STRING(64),
      primaryKey: true,
    },
    public_key_hex: {
      type: Sequelize.STRING(68),
    },
    balance: {
      type: Sequelize.STRING(25),
    },
    active_date: {
      type: Sequelize.STRING(25),
    },
  },
  { timestamps: false }
);

async function GetAccounts() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM account`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// `SELECT * FROM account WHERE account_hash = '${account}' OR public_key_hex = '${account}' LIMIT 1`
async function getHolder(account) {
  return await Account.findAll({
    where: {
      [Op.or]: [
        {
          account_hash: {
            [Op.eq]: account,
          },
        },
        {
          public_key_hex: {
            [Op.eq]: account,
          },
        },
      ],
    },
    limit: 1,
  });
}

async function getNumberOfAccountFromDate(date) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) AS number_of_holders FROM account WHERE DATE(active_date) < '${date}'`;
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

async function getTotalNumberOfAccount() {
  return new Promise((resolve, reject) => {
    var sql = "SELECT COUNT(*) AS number_of_holders FROM account";
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

async function GetRichAccounts(start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM account ORDER BY balance * 1 DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getPublicKeyByAccountHash(account_hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT public_key_hex FROM account WHERE account_hash = '${account_hash}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  Account,
  getHolder,
  GetRichAccounts,
  getTotalNumberOfAccount,
  getNumberOfAccountFromDate,
  GetAccounts,
  getPublicKeyByAccountHash,
};
