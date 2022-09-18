const mysql = require('mysql');
require('dotenv').config();

const delegator_pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    debug: false,
});

async function GetDelegatorsOfValidator(address) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM delegator WHERE delegatee = '${address}'`;
        delegator_pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

async function GetTotalDelegator() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(distinct public_key) as total_delegator FROM delegator`;
        delegator_pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].total_delegator);
        })
    })
}

async function GetRangeDelegator(validator, start, count) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM delegator WHERE delegatee = '${validator}' ORDER BY CONVERT(stake_amount, UNSIGNED) DESC LIMIT ${start}, ${count}`;
        delegator_pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

async function GetAllDelegator() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM delegator`;
        delegator_pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

async function GetTotalStakeAsDelegator(public_key) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT SUM(CONVERT(staked_amount, UNSIGNED)) as total_staked_as_delegator FROM delegator WHERE public_key = '${public_key}'`
        delegator_pool.query(sql, function(err,result) {
            if(err){
                reject(err);
            }
            resolve(result[0].total_staked_as_delegator);
        })
    })
}

module.exports = {
    GetDelegatorsOfValidator, GetTotalDelegator, GetRangeDelegator,
    GetAllDelegator,GetTotalStakeAsDelegator
}