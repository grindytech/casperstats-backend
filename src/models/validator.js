const mysql = require("mysql");
require("dotenv").config();

const validator_pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.VALIDATOR_DB_NAME,
  debug: false,
});

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false,
});

async function CreateValidatorInfoTable() {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS validator (public_key VARCHAR(68) NOT NULL PRIMARY KEY, name VARCHAR(50), email VARCHAR(50), icon TEXT, website VARCHAR(200), links VARCHAR(500), details VARCHAR(1000))`;
    validator_pool.query(sql, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

async function InsertValidatorInfo(
  public_key,
  name,
  email,
  icon,
  website,
  links,
  details
) {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO validator (public_key, name, email, icon, website, links, details) VALUES ('${public_key}', '${name}', '${email}', '${icon}', '${website}', '${links}', '${details}')`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function DeleteValidatorInfo(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `DELETE FROM validator WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getValidatorInfo(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM validator WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getValidator(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM validator WHERE public_key_hex = '${public_key}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getValidatorInfoByName(name) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM validator WHERE name = '${name}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function DropValidatorInfo() {
  return new Promise((resolve, reject) => {
    var sql = "DROP TABLE validator_";
    validator_pool.query(sql, function (err, result) {
      if (err) resolve(false);
      resolve(result);
    });
  });
}

async function getValidatorsInfoWithNameAndPublicKey() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT name, public_key FROM validator`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function UpdateName(public_key, name) {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE validator SET name = '${name}' WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function UpdateEmail(public_key, email) {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE validator SET email = '${email}' WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function UpdateWebsite(public_key, website) {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE validator SET website = '${website}' WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function UpdateLinks(public_key, links) {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE validator SET links = '${links}' WHERE public_key = '${public_key}'`;
    validator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getCurrentEraValidator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT public_key_hex, total_stake_current_era as total_stake, delegation_rate, number_of_delegators FROM validator WHERE current_era_flag = true`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getNextEraValidator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT public_key_hex, total_stake_next_era as total_stake, delegation_rate, number_of_delegators FROM validator WHERE next_era_flag = 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTotalActiveValidator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) as total_validator FROM validator WHERE current_era_flag=1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_validator);
    });
  });
}

async function getTotalActiveBids() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) as total_bids FROM validator WHERE inactive=0`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_bids);
    });
  });
}

async function getAllValidator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT public_key_hex, self_stake, total_stake_current_era, total_stake_next_era , inactive, delegation_rate, number_of_delegators FROM validator`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getRangeValidator(start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT public_key_hex, self_stake, total_stake_next_era as total_bid, inactive, delegation_rate, number_of_delegators FROM validator ORDER BY (CONVERT(total_stake_next_era, UNSIGNED)) DESC limit ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTotalValidator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) as total_validator FROM validator`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_validator);
    });
  });
}

async function getTotalStakeCurrentEra() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT SUM(total_stake_current_era) as total_stake_current FROM validator WHERE current_era_flag = 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_stake_current);
    });
  });
}

async function getTotalStakeNextEra() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT SUM(total_stake_next_era) as total_stake_next FROM validator WHERE next_era_flag = 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_stake_next);
    });
  });
}

module.exports = {
  CreateValidatorInfoTable,
  InsertValidatorInfo,
  getValidator,
  DropValidatorInfo,
  DeleteValidatorInfo,
  getValidatorInfoByName,
  getValidatorsInfoWithNameAndPublicKey,
  UpdateEmail,
  UpdateName,
  UpdateLinks,
  UpdateWebsite,
  getCurrentEraValidator,
  getTotalStakeCurrentEra,
  getTotalStakeNextEra,
  getAllValidator,
  getTotalValidator,
  getTotalActiveValidator,
  getNextEraValidator,
  getRangeValidator,
  getValidatorInfo,
  getTotalActiveBids,
};
