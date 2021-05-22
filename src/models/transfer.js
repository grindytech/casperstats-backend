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
                console.log(err)
                reject(err);
            }
            console.log(result);
            resolve(result);
        });
    })
}

module.exports = { GetTransfersByAccountHash }
