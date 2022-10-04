var mysql = require("mysql");
require("dotenv").config();
const {db_config} = require("../utils/common")
const { sequelize } = require("../utils/common");
const { Blockchain } = require("./blockchain");

var db = mysql.createConnection({
    host: db_config.host || "localhost",
    user: db_config.user || "root",
    password: db_config.password,
    database: db_config.database,
});

sequelize.authenticate().then(() => {
    console.log('Connect to stats database successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

