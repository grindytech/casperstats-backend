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

async function GetDeploysByPublicKey(public_key, start, count) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetAllDeployByPublicKey(public_key) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' ORDER BY timestamp DESC`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

module.exports = { GetDeploysByPublicKey, GetAllDeployByPublicKey}
