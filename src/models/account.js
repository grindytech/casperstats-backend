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


async function GetHolder(account) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM account WHERE account_hash = '${account}' OR public_key_hex = '${account}' LIMIT 1`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}
async function GetNumberOfAccountFromDate(date) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) AS number_of_holders FROM account WHERE DATE(active_date) > '${date}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }

            if (result.length == 1) {
                resolve(result[0]);
            } else {
                resolve(0);
            }
        });
    })
}

async function GetTotalNumberOfAccount() {

    return new Promise((resolve, reject) => {
        var sql = 'SELECT COUNT(*) AS number_of_holders FROM account';
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }

            if (result.length == 1) {
                resolve(result[0]);
            } else {
                resolve(0);
            }
        });
    })

}

async function GetRichAccounts(start, count) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM account ORDER BY balance * 1 DESC LIMIT ${start}, ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetCirculatingSupply() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(account.balance AS UNSIGNED INTEGER)) as CHAR) as circulating_supply FROM account`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}


module.exports = {
    GetHolder, GetRichAccounts, GetCirculatingSupply,
    GetTotalNumberOfAccount, GetNumberOfAccountFromDate
}
