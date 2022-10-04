const Sequelize = require("sequelize");
const { sequelize } = require("../utils/common");

const Blockchain = sequelize.define(
    "blockchain",
    {
      key: {
        type: Sequelize.STRING(25),
        primaryKey: true,
      },
      value: {
        type: Sequelize.STRING(50),
      },
      timestamp: {
        type: Sequelize.STRING(25),
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
);

function GetBlockchainDataByKey(key) {
    return new Promise((resolve, reject) => {
        Blockchain
        .findAll({
            where: {
                key: key
            }
        })
        .then(result => {
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    Blockchain, GetBlockchainDataByKey
}