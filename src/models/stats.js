const mysql = require("mysql");
const { db_config } = require("../service/common");

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: db_config.host || "localhost",
  user: db_config.user || "root",
  password: db_config.password,
  database: db_config.database,
  debug: false,
});

async function getStats() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM stats`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0]);
    });
  });
}

module.exports = {
  getStats,
};
