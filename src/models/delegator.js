const mysql = require("mysql");
require("dotenv").config();
const { casper_sequelize } = require("../service/common");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

const delegator_pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false,
});

const Delegator = casper_sequelize.define(
  "delegator",
  {
    public_key: {
      type: Sequelize.STRING(68),
      primaryKey: true,
    },
    staked_amount: {
      type: Sequelize.STRING(25),
    },
    delegatee: {
      type: Sequelize.STRING(68),
      primaryKey: true,
    },
  },
  { timestamps: false }
);

async function getDelegatorsOfValidator(address) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM delegator WHERE delegatee = '${address}'`;
    delegator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTotalDelegator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(distinct public_key) as total_delegator FROM delegator`;
    delegator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_delegator);
    });
  });
}

async function getTotalDelegatorByValidator(account) {
  const total = await Delegator.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("*")), "total_delegators"],
    ],
    where: {
      delegatee: {
        [Op.eq]: account,
      },
    },
  });
  return total[0].dataValues.total_delegators;
}

//`SELECT * FROM delegator WHERE delegatee = '${validator}' ORDER BY CONVERT(stake_amount, UNSIGNED) DESC LIMIT ${start}, ${count}`;
async function getRangeDelegator(validator, start, size) {
  return await Delegator.findAll({
    where: {
      delegatee: {
        [Op.eq]: validator,
      },
    },
    order: [
      [Sequelize.cast(Sequelize.col("staked_amount"), "UNSIGNED"), "DESC"],
    ],
    offset: start,
    limit: size,
  });
}

async function getAllDelegator() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM delegator`;
    delegator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getTotalStakeAsDelegator(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT SUM(CONVERT(staked_amount, UNSIGNED)) as total_staked_as_delegator FROM delegator WHERE public_key = '${public_key}'`;
    delegator_pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0].total_staked_as_delegator);
    });
  });
}

module.exports = {
  Delegator,
  getDelegatorsOfValidator,
  getTotalDelegator,
  getRangeDelegator,
  getAllDelegator,
  getTotalStakeAsDelegator,
  getTotalDelegatorByValidator,
};
