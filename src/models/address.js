const mysql = require("mysql");
require("dotenv").config();

const address_pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.VALIDATOR_DB_NAME,
  debug: false,
});

async function createAddressTable() {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS address (account_hash VARCHAR(68) NOT NULL PRIMARY KEY, public_key VARCHAR(68),  name VARCHAR(50))`;
    address_pool.query(sql, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

async function insertAddress(public_key, account_hash, name) {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO address (public_key, account_hash, name) VALUES ('${public_key}', '${account_hash}', '${name}')`;
    address_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function deleteAddress(account) {
  return new Promise((resolve, reject) => {
    var sql = `DELETE FROM address WHERE public_key = '${account}' OR account_hash = '${account}'`;
    address_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getAddress(account) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM address WHERE public_key = '${account}' OR account_hash = '${account}'`;
    address_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function dropAddress() {
  return new Promise((resolve, reject) => {
    var sql = "DROP TABLE address";
    address_pool.query(sql, function (err, result) {
      if (err) resolve(false);
      resolve(result);
    });
  });
}

async function updateName(public_key, name) {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE address SET name = '${name}' WHERE public_key = '${public_key}'`;
    address_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getAllKnownAddress() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * from address`;
    address_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  createAddressTable,
  insertAddress,
  getAddress,
  dropAddress,
  deleteAddress,
  updateName,
  getAllKnownAddress,
};
