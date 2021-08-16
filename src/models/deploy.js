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

async function GetDeployOfPublicKeyByType(public_key, type, start, count) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' AND type = '${type}' ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetAllDeployOfPublicKeyByType(public_key, type) {
    return new Promise((resolve, reject) => {

        var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' AND type = '${type}' ORDER BY timestamp DESC`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function CountDeployByType(public_key, type) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) as total FROM deploy WHERE public_key = '${public_key}' AND type = '${type}'`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result != undefined && result != null && result.length == 1) {
                resolve(result[0]);
            } else {
                resolve(0);
            }
        });
    })
}

async function GetDeployByDate(type, from, to) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM deploy WHERE type = '${type}' AND (DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}'))`;
        pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

module.exports = {
    GetDeploysByPublicKey, GetAllDeployByPublicKey,
    GetDeployOfPublicKeyByType, CountDeployByType, GetAllDeployOfPublicKeyByType,
    GetDeployByDate
}
