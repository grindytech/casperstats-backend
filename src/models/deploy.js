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

async function getDeploysByPublicKey(public_key, start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getAllDeployByPublicKey(public_key) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' ORDER BY timestamp DESC`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getAllDeployByHash(hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE hash = '${hash}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getDeployOfPublicKeyByType(public_key, type, start, count) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' AND type = '${type}' ORDER BY timestamp DESC LIMIT ${start}, ${count}`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getAllDeployOfPublicKeyByType(public_key, type) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE public_key = '${public_key}' AND type = '${type}' ORDER BY timestamp DESC`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function countDeployByType(public_key, type) {
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
  });
}

async function getDeployByDate(type, from, to) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE type = '${type}' AND (DATE(timestamp) BETWEEN DATE('${from}') AND DATE('${to}'))`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getDeployByDeployHash(deploy_hash) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM deploy WHERE deploy_hash = '${deploy_hash}'`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function getLatestDeployCostByType(type) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT cost FROM deploy WHERE type = '${type}' AND status = 'success' ORDER BY timestamp DESC LIMIT 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    });
  });
}

async function getLatestDeployByType() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT cost FROM deploy WHERE type = '${type}' AND status = 'success' ORDER BY timestamp DESC LIMIT 1`;
    pool.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  getDeploysByPublicKey,
  getAllDeployByPublicKey,
  getAllDeployByHash,
  getDeployOfPublicKeyByType,
  countDeployByType,
  getAllDeployOfPublicKeyByType,
  getDeployByDate,
  getLatestDeployCostByType,
  getLatestDeployByType,
  getDeployByDeployHash,
};
