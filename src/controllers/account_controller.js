const { Execute, RequestRPC } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData } = require('../utils/account');

const mysql = require('mysql');
require('dotenv').config();

const { GetPublicKeyHexByAccountHash, GetRichAccounts } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey } = require('../models/deploy');
const { GetAccountHash } = require('../utils/common');

require('dotenv').config();

module.exports = {

  GetAccount: async function (req, res) {

    // address or account hash
    let address = req.params.address;
    try {
      const account = await GetAccountData(address);
      res.json(account);

    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  GetPublicKeyHex: async function (req, res) {
    const account = req.params.account;

    GetPublicKeyHexByAccountHash(account).then(value => {
      if (value.length == 1) {
        res.json(value[0]);
      } else {
        res.send(null);
      }
    }).catch(err => {
      res.send(err);
    })
  },

  GetAccountTransfers: async function (req, res) {

    const account = req.query.account;
    const count = req.query.count;

    let account_hash = account;
    try {
      const hash = await GetAccountHash(account);
      account_hash = hash;
    } catch (err) {
      res.send(err);
      return;
    }

    GetTransfersByAccountHash(account_hash, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetAccountDeploys: async function (req, res) {
    const account = req.query.account;
    const count = req.query.count;

    GetDeploysByPublicKey(account, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetRichAccounts: async function (req, res) {
    const count = req.params.count;
    GetRichAccounts(count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  }
};
