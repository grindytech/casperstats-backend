var mysql = require('mysql');
require('dotenv').config();
const {db_config} = require('../utils/common')

var db = mysql.createConnection({
    host: db_config.host || "localhost",
    user: db_config.user || "root",
    password: db_config.password,
    database: db_config.database,
});


db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

