const Joi = require("joi");

const validate = (schema, params) => {
  const response = schema.validate(params);
  if (response.error) {
    const message = response.error.details[0].message.replace(/['"]/g, "");
    return {
      status: "failed",
      error: message,
    };
  }
  return { status: "success" };
};

// The account-hash is a 32-byte hash of the public key
// Casper networks are compatible with both Ed25519 and secp256k1 public key cryptography.
const account = Joi.string().alphanum().min(64).max(68).required();

const start = Joi.number().min(0);
const count = Joi.number().min(1);

function verifyAccountData(params) {
  const schema = Joi.object().keys({
    account: account,
  });

  if (params.account.includes("account-hash-")) {
    params.account = params.account.replace("account-hash-", "");
  }
  const response = validate(schema, params);
  return response;
}

function verifyRangeWithAccount(params) {
  const schema = Joi.object().keys({
    account: account,
    start: start,
    count: count,
  });

  if (params.account.includes("account-hash-")) {
    params.account = params.account.replace("account-hash-", "");
  }

  const response = validate(schema, params);
  return response;
}

function verifyRange(params) {
  const schema = Joi.object().keys({
    start: start,
    count: count,
  });

  const response = validate(schema, params);
  return response;
}

module.exports = { verifyAccountData, verifyRangeWithAccount, verifyRange };
