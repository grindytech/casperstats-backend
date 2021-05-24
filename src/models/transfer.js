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

async function GetTransfersByAccountHash(account_hash, count) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM transfer WHERE from_address = '${account_hash}' OR to_address = '${account_hash}' LIMIT ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetTotalNumberOfTransfers() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) AS number_of_transfers FROM transfer`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetNumberOfTransfersByDate(from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) AS number_of_transfers FROM transfer WHERE DATE(timestamp) BETWEEN '${from}' AND '${to}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

module.exports = { GetTransfersByAccountHash, GetTotalNumberOfTransfers, GetNumberOfTransfersByDate }
