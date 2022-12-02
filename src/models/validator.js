const mysql = require("mysql");
require("dotenv").config();
const { casper_sequelize, validator_sequelize } = require("../service/common");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

const validator_pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.VALIDATOR_DB_NAME,
  debug: false,
  charset: "utf8mb4",
});

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false,
});

// validator in casper_chain
const Validator = casper_sequelize.define(
  "validator",
  {
    public_key_hex: {
      type: Sequelize.STRING(68),
      primaryKey: true,
    },
    self_stake: {
      type: Sequelize.STRING(25),
    },
    total_stake_current_era: {
      type: Sequelize.STRING(25),
    },
    total_stake_next_era: {
      type: Sequelize.STRING(25),
    },
    inactive: {
      type: Sequelize.BOOLEAN,
    },
    current_era_flag: {
      type: Sequelize.BOOLEAN,
    },
    next_era_flag: {
      type: Sequelize.BOOLEAN,
    },
    delegation_rate: {
      type: Sequelize.INTEGER,
    },
    number_of_delegators: {
      type: Sequelize.INTEGER,
    },
  },
  { timestamps: false }
);

// validator info in validator database
const validatorInfo = validator_sequelize.define(
  "validator",
  {
    public_key: {
      type: Sequelize.STRING(68),
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
    },
    icon: {
      type: Sequelize.STRING(200),
    },
    website: {
      type: Sequelize.STRING(200),
    },
    links: {
      type: Sequelize.STRING(500),
    },
    details: {
      type: Sequelize.STRING(1000),
    },
  },
  { timestamps: false }
);
async function createValidatorInfoTable() {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS validator (public_key VARCHAR(68) NOT NULL PRIMARY KEY, name VARCHAR(50), email VARCHAR(50), icon TEXT, website VARCHAR(200), links VARCHAR(500), details VARCHAR(1000))`;
    validator_pool.query(sql, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

async function insertValidatorInfo(
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

async function deleteValidatorInfo(public_key) {
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

// `SELECT * FROM validator WHERE public_key = '${public_key}'`
async function getValidatorInfo(public_key) {
  return await validatorInfo.findAll({
    where: {
      public_key: {
        [Op.eq]: public_key,
      },
    },
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

async function dropValidatorInfo() {
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

async function updateName(public_key, name) {
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

async function updateEmail(public_key, email) {
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

async function updateWebsite(public_key, website) {
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

async function updateLinks(public_key, links) {
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

//`SELECT public_key_hex, total_stake_next_era as total_stake, delegation_rate, number_of_delegators FROM validator WHERE next_era_flag = 1`
async function getRangeNextEraValidator(start, size) {
  return await Validator.findAll({
    attributes: [
      "public_key_hex",
      ["total_stake_next_era", "total_stake"],
      "delegation_rate",
      "number_of_delegators",
    ],
    where: {
      next_era_flag: {
        [Op.eq]: 1,
      },
    },
    order: [
      [
        Sequelize.cast(Sequelize.col("total_stake_next_era"), "UNSIGNED"),
        "DESC",
      ],
    ],
    offset: start,
    limit: size,
  });
}

async function getNextEraValidator() {
  return await Validator.findAll({
    attributes: [
      "public_key_hex",
      ["total_stake_next_era", "total_stake"],
      "delegation_rate",
      "number_of_delegators",
    ],
    where: {
      next_era_flag: {
        [Op.eq]: 1,
      },
    },
    order: [
      [
        Sequelize.cast(Sequelize.col("total_stake_next_era"), "UNSIGNED"),
        "DESC",
      ],
    ],
  });
}

async function getTotalNextEraValidators() {
  const total = await Validator.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("*")), "total_validator"],
    ],
    where: {
      next_era_flag: {
        [Op.eq]: 1,
      },
    },
  });
  return total[0].dataValues.total_validator;
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

// `SELECT public_key_hex, self_stake, total_stake_next_era as total_bid, inactive, delegation_rate, number_of_delegators FROM validator ORDER BY (CONVERT(total_stake_next_era, UNSIGNED)) DESC limit ${start}, ${count}`
async function getRangeBidsWithSort(start, size, order_by, order_direction) {
  return await Validator.findAll({
    order: [
      [Sequelize.cast(Sequelize.col(order_by), "UNSIGNED"), order_direction],
    ],
    offset: start,
    limit: size,
  });
}

// `SELECT COUNT(*) as total_validator FROM validator`
async function getTotalBids() {
  const total = await Validator.findAll({
    attributes: [[Sequelize.fn("COUNT", Sequelize.col("*")), "total_bids"]],
  });
  return total[0].dataValues.total_bids;
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

// `SELECT SUM(total_stake_next_era) as total_stake_next FROM validator WHERE next_era_flag = 1`;
async function getTotalStakeNextEra() {
  const totalStake = await Validator.findAll({
    attributes: [
      [
        Sequelize.fn("SUM", Sequelize.col("total_stake_next_era")),
        "total_stake_next",
      ],
    ],
    where: {
      next_era_flag: {
        [Op.eq]: 1,
      },
    },
  });
  return totalStake[0].dataValues.total_stake_next;
}

module.exports = {
  Validator,
  validatorInfo,
  getNextEraValidator,
  createValidatorInfoTable,
  insertValidatorInfo,
  getValidator,
  dropValidatorInfo,
  deleteValidatorInfo,
  getValidatorInfoByName,
  getValidatorsInfoWithNameAndPublicKey,
  updateEmail,
  updateName,
  updateLinks,
  updateWebsite,
  getCurrentEraValidator,
  getTotalStakeCurrentEra,
  getTotalStakeNextEra,
  getAllValidator,
  getTotalBids,
  getTotalActiveValidator,
  getRangeNextEraValidator,
  getRangeBidsWithSort,
  getValidatorInfo,
  getTotalActiveBids,
  getTotalNextEraValidators,
};
