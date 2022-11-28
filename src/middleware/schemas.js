const Joi = require("joi");

// The account-hash is a 32-byte hash of the public key
// Casper networks are compatible with both Ed25519 and secp256k1 public key cryptography.
const account = Joi.string().alphanum().min(64).max(68).required();

const start = Joi.number().min(0).required();
const count_or_end = Joi.number().min(1).required();

const block = Joi.number().min(0).required();
const number = Joi.number().min(1).max(30).required();

const hex = Joi.string().alphanum().length(64).required();

// type to get blockchain data
const blockchain_data_type = Joi.string().valid(
  "transfer",
  "transfer_tx",
  "deploy_tx",
  "deploy",
  "delegator",
  "validator",
  "bid",
  "active_bid",
  "price",
  "market_cap",
  "total_volume",
  "staking",
  "staking_tx",
  "unstaking",
  "unstaking_tx",
  "total_supply"
);

const schemas = {
  account: Joi.object().keys({
    account: account,
  }),
  startToCount: Joi.object().keys({
    start: start,
    count: count_or_end,
  }),
  startToCountWithAccount: Joi.object().keys({
    account: account,
    start: start,
    count: count_or_end,
  }),
  startToCountWithValidator: Joi.object().keys({
    validator: account,
    start: start,
    count: count_or_end,
  }),
  block: Joi.object().keys({
    block: block,
  }),
  number: Joi.object().keys({
    number: number,
  }),
  startToEnd: Joi.object().keys({
    start: start,
    end: count_or_end,
  }),
  hex: Joi.object().keys({
    hex: hex,
  }),
  blockchain_data_type: Joi.object().keys({
    type: blockchain_data_type,
  }),
};

module.exports = schemas;
