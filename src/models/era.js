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

async function GetRewardByPublicKey(public_key) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE (validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}'`;
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

async function GetLatestEraByDate(from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT MAX(era) as era_id FROM era WHERE timestamp BETWEEN '${from}' AND '${to}'`;
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

async function GetPublicKeyRewardByDate(public_key, from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as reward FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND timestamp BETWEEN '${from}' AND '${to}'`;
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

async function GetPublicKeyRewardByEra(public_key, era) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as reward FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND era = ${era}`;
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

async function GetPublicKeyTotalRewardByDate(account, from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(era.amount AS UNSIGNED INTEGER)) as CHAR) as total_reward FROM era WHERE (validator = '${account}' OR delegator = '${account}') AND timestamp BETWEEN '${from}' AND '${to}'`;
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

async function GetTimestampByEra(era) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT timestamp FROM era WHERE era = '${era}' LIMIT 1`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(0)
            }
        });
    })
}

async function GetEraValidatorOfPublicKey(public_key, era) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT validator FROM era WHERE ((validator = '${public_key}' AND delegator = "") OR delegator = '${public_key}') AND era = ${era}`;
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

async function GetLatestTimestampByPublicKey(public_key) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT timestamp FROM era WHERE (validator = '${public_key}' OR delegator = '${public_key}') ORDER BY timestamp DESC LIMIT 1`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({timestamp: null})
            }
        });
    })
}

module.exports = {
    GetTotalRewardByPublicKey, GetTotalRewardByEra,
    GetLatestEra, GetPublicKeyTotalRewardByDate,
    GetTotalDelegator, GetTotalReward, GetRewardByPublicKey,
    GetPublicKeyRewardByDate, GetPublicKeyRewardByEra,
    GetTimestampByEra, GetLatestEraByDate, GetEraValidatorOfPublicKey,
    GetLatestTimestampByPublicKey
}
