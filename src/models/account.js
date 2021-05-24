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

async function GetRichAccounts(count) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM account ORDER BY balance * 1 DESC LIMIT ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetCircleSupply() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT CAST(SUM(CAST(account.balance AS UNSIGNED INTEGER)) as CHAR) as circle_supply FROM account`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}


module.exports = {
   GetHolder, GetRichAccounts, GetCircleSupply
}
