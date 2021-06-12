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
            resolve(result[0]);
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
            resolve(result[0]);
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
            resolve(result[0]);
        });
    })
}

module.exports = { GetTotalRewardByPublicKey, GetTotalRewardByEra, GetLatestEra }
