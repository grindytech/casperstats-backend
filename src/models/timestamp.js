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

async function GetBlockUpdateTime() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT block FROM timestamp`;
        pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].block);
        })
    })
}

async function GetDeployUpdateTime() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT deploy FROM timestamp`;
        pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].deploy);
        })
    })
}

async function GetEraUpdateTime() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT era FROM timestamp`;
        pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].era);
        })
    })
}
async function GetAccountUpdateTime() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT account FROM timestamp`;
        pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].account);
        })
    })
}

async function GetValidatorUpdateTime() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT validator FROM timestamp`;
        pool.query(sql, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result[0].validator);
        })
    })
}

module.exports = {
    GetBlockUpdateTime, GetDeployUpdateTime, GetEraUpdateTime,
    GetAccountUpdateTime, GetValidatorUpdateTime
}