const Joi = require("joi");

// The account-hash is a 32-byte hash of the public key
// Casper networks are compatible with both Ed25519 and secp256k1 public key cryptography.
const account = Joi.string().alphanum().min(64).max(68).required();

const start = Joi.number().min(0);
const count = Joi.number().min(1);

const schemas = {
  account: Joi.object().keys({
    account: account,
  }),
  startToCount: Joi.object().keys({
    start: start,
    count: count,
  }),
  startToCountWithAccount: Joi.object().keys({
    account: account,
    start: start,
    count: count,
  }),
};

module.exports = schemas;
