const { re } = require("mathjs");
var mysql = require("mysql");
require("dotenv").config();
const { db_config, sequelize, casper_sequelize } = require("../service/common");
const { Blockchain } = require("./blockchain");
const { Block } = require("./block_model");
const { Transfer } = require("./transfer");
const { Account } = require("./account");
const { Deploy } = require("./deploy");

var db = mysql.createConnection({
  host: db_config.host || "localhost",
  user: db_config.user || "root",
  password: db_config.password,
  database: db_config.database,
});

casper_sequelize
  .authenticate()
  .then(() => {
    console.log("Connect to casper_chain database successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connect to stats database successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

db.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
