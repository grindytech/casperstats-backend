const { Execute, RequestRPC } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData } = require('../utils/account');

const mysql = require('mysql');
require('dotenv').config();

const { GetHolder, GetRichAccounts, GetTotalNumberOfAccount } = require('../models/account');
const { GetTransfersByAccountHash } = require('../models/transfer');
const { GetDeploysByPublicKey } = require('../models/deploy');
const { GetAccountHash } = require('../utils/common');

require('dotenv').config();

module.exports = {

  GetAccount: async function (req, res) {

    const account = req.params.account;

    GetHolder(account).then(value => {
      if (value.length == 1) {
        res.json(value[0]);
      } else {
        GetAccountData(account).then(acc => {
          res.json(acc);
        }).catch(err => {
          console.log(err)
          res.send(err);
        })
      }
    }).catch(err => {
      res.send(err);
    })
  },

  CountHolders: async function (req, res) {
    const account = req.params.account;

    GetTotalNumberOfAccount().then(value => {
        res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetAccountTransfers: async function (req, res) {

    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;

    let account_hash = account;

    // Get account_hash if possible
    try {
      const hash = await GetAccountHash(account);
      account_hash = hash;
    } catch (err) { }

    GetTransfersByAccountHash(account_hash, start, count).then(value => {

      // add type in or out
      for (let i = 0; i < value.length; i++) {

        if(value[i].to_address === "null") {
          value[i].to_address = null;
        }

        if (account_hash == value[i].from_address) {
          value[i]["type"] = "out";
        } else {
          value[i]["type"] = "in";
        }
      }
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  },

  GetAccountDeploys: async function (req, res) {
    const account = req.query.account;
    const start = req.query.start;
    const count = req.query.count;

    let public_key_hex = "";
    {
      try {
        const get_holder = await GetHolder(account);
        const holder = get_holder[0];
        public_key_hex = holder.public_key_hex;
      } catch (err) {
        public_key_hex = account;
      }
    }
    GetDeploysByPublicKey(public_key_hex, start, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })

  },

  GetRichAccounts: async function (req, res) {
    const start = req.query.start;
    const count = req.query.count;
    GetRichAccounts(start, count).then(value => {
      res.json(value);
    }).catch(err => {
      res.send(err);
    })
  }
};
