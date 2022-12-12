const Joi = require("joi");

// The account-hash is a 32-byte hash of the public key
// Casper networks are compatible with both Ed25519 and secp256k1 public key cryptography.
const account = Joi.alternatives()
  .try(
    Joi.string().alphanum().length(64),
    Joi.string().alphanum().length(66),
    Joi.string().alphanum().length(68)
  )
  .required();

const start = Joi.number().min(0).required();
const count_or_end = Joi.number().min(1).required();

const block = Joi.alternatives()
  .try(Joi.number().min(0), Joi.string().alphanum().length(64))
  .required();
const number = Joi.number().min(1).max(30).required();

const hex = Joi.string().alphanum().length(64).required();

const page = Joi.number().min(1).required();
const size = Joi.number().valid(10, 20, 30).required();

const order_by = Joi.string()
  .valid(
    "inactive",
    "total_stake_next_era",
    "delegation_rate",
    "number_of_delegators"
  )
  .required();
const order_direction = Joi.string().valid("DESC", "ASC").required();

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
  pagination: Joi.object().keys({
    page: page,
    size: size,
  }),
  paginationWithAccount: Joi.object().keys({
    account: account,
    page: page,
    size: size,
  }),
  paginationWithValidator: Joi.object().keys({
    validator: account,
    page: page,
    size: size,
  }),
  paginationWithSortType: Joi.object().keys({
    page: page,
    size: size,
    order_by: order_by,
    order_direction: order_direction,
  }),
};

module.exports = schemas;
