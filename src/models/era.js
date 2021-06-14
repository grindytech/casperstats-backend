const mysql = require('mysql');
const { db_config } = require('../utils/common');

const pool = mysql.createPool({
    connectionLimit: 100, //important
    host: db_config.host || 'localhost',
    user: db_config.user || 'root',
    password: db_config.password,
    database: db_config.database,
    debug: false
});

async function GetTotalRewardByPublicKey(public_key) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE validator = '${public_key}' OR delegator = '${public_key}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ total_reward: 0 })
            }
        });
    })
}

async function GetTotalRewardByEra(era_id) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE era = '${era_id}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ total_reward: 0 })
            }
        });
    })
}

async function GetLatestEra() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT MAX(era) as era_id FROM era`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ era_id: null })
            }
        });
    })
}

async function GetPublicKeyTotalRewardByDate(account, from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE validator = '${account}' OR delegator = '${account}' AND timestamp BETWEEN '${from}' AND '${to}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ total_reward: 0 })
            }
        });
    })
}

async function GetTotalDelegator(era) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(DISTINCT validator, delegator) as total_delegators from era WHERE era = ${era}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ total_delegators: 0 })
            }
        });
    })
}

async function GetTotalReward() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({ total_delegators: 0 })
            }
        });
    })
}

module.exports = {
    GetTotalRewardByPublicKey, GetTotalRewardByEra,
    GetLatestEra, GetPublicKeyTotalRewardByDate,
    GetTotalDelegator, GetTotalReward
}
