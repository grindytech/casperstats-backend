const mysql = require('mysql');
require('dotenv').config();

const validator_pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.PASSWORD,
    database: process.env.VALIDATOR_DB_NAME,
    debug: false,
});


async function CreateValidatorTable() {
    return new Promise((resolve, reject) => {

        var sql = `CREATE TABLE IF NOT EXISTS validator (public_key VARCHAR(68) NOT NULL PRIMARY KEY,
    name VARCHAR(50), email VARCHAR(50), icon VARCHAR(50), websites VARCHAR(50), links VARCHAR(100), details VARCHAR(200))`;
        validator_pool.query(sql, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    })
}

async function InsertValidator(public_key, name, email, icon, websites, links, details) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO validator (public_key, name, email, icon, websites, links, details)
         VALUES ('${public_key}', '${name}', '${email}', '${icon}', '${websites}', '${links}', '${details}')`;
        validator_pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            };
            resolve(result);
        });
    })
}

async function DeleteValidator(public_key) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM validator WHERE public_key = '${public_key}'`;
        validator_pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function GetValidator(public_key) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM validator WHERE public_key = '${public_key}'`;
        validator_pool.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

async function DropValidator() {
    return new Promise((resolve, reject) => {
        var sql = "DROP TABLE validator";
        validator_pool.query(sql, function (err, result) {
            if (err) resolve(false);
            resolve(result);
        });

    })
}

module.exports = {
    CreateValidatorTable, InsertValidator, GetValidator,
    DropValidator, DeleteValidator
}
