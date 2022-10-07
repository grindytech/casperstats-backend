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

async function gerEraIdByDate(from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT era FROM era_id WHERE timestamp BETWEEN DATE('${from}') AND DATE('${to}')`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getDateByEra(era) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT timestamp FROM era_id WHERE era = ${era}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].timestamp);
    });
  });
}

async function getLatestEra() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT MAX(era) as latest_era FROM era_id`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].latest_era);
    });
  });
}

module.exports = {
  gerEraIdByDate,
  getDateByEra,
  getLatestEra,
};
