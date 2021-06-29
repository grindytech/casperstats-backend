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

async function GetBlocksByValidator(validator_public_key, start, count) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT * FROM block WHERE validator = '${validator_public_key}' ORDER BY height DESC LIMIT ${start}, ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetSwitchBlockByDate(date) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT era , MAX(height) as height FROM block WHERE DATE(timestamp) BETWEEN '${date}' AND '${date}' GROUP BY era ORDER BY height DESC`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetBlockHashByHeight(height) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT hash FROM block WHERE height = ${height}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if(result.length > 0) {
                resolve(result[0]);
            } else {
                resolve("");
            }
        });
    })
}


async function GetBlockHeight() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT height FROM block WHERE height = (SELECT MAX(height) FROM block)`;
        pool.query(sql, function (err, result, fields) {
            if(err) resolve(false);
            if(result != undefined && result.length > 0) {
                const height = result[0].height;
                resolve(height);
            } else {
                resolve(-1);
            }
        });

    })
}

module.exports = { GetBlocksByValidator, GetSwitchBlockByDate,GetBlockHashByHeight, GetBlockHeight } 
