const Sequelize = require("sequelize");
const { sequelize } = require("../service/common");

const Blockchain = sequelize.define(
  "blockchain",
  {
    group: {
      type: Sequelize.STRING(25),
    },
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

async function getBlockchainDataByKey(key) {
  return await Blockchain.findAll({
    where: {
      key: key,
    },
  });
}

module.exports = {
  Blockchain,
  getBlockchainDataByKey,
};
