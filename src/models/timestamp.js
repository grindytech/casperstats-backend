const { casper_sequelize } = require("../service/common");
const Sequelize = require("sequelize");

const Timestamp = casper_sequelize.define(
  "timestamp",
  {
    block: {
      type: Sequelize.STRING(25),
    },
    deploy: {
      type: Sequelize.STRING(25),
    },
    era: {
      type: Sequelize.STRING(25),
    },
    account: {
      type: Sequelize.STRING(25),
    },
    validator: {
      type: Sequelize.STRING(25),
    },
  },
  { timestamps: false }
);

async function getBlockUpdateTime() {
  const timestamp = await Timestamp.findAll({
    attributes: ["block"],
  });
  return timestamp[0].block;
}

async function getDeployUpdateTime() {
  const timestamp = await Timestamp.findAll({
    attributes: ["deploy"],
  });
  return timestamp[0].deploy;
}

async function getEraUpdateTime() {
  const timestamp = await Timestamp.findAll({
    attributes: ["era"],
  });
  return timestamp[0].era;
}
async function getAccountUpdateTime() {
  const timestamp = await Timestamp.findAll({
    attributes: ["account"],
  });
  return timestamp[0].account;
}

async function getValidatorUpdateTime() {
  const timestamp = await Timestamp.findAll({
    attributes: ["validator"],
  });
  return timestamp[0].validator;
}

module.exports = {
  Timestamp,
  getBlockUpdateTime,
  getDeployUpdateTime,
  getEraUpdateTime,
  getAccountUpdateTime,
  getValidatorUpdateTime,
};
