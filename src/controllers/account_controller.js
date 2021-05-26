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

    // address or account hash
    // let address = req.params.address;
    // try {
    //   const account = await GetAccountData(address);
    //   res.json(account);

    // } catch (err) {
    //   console.log(err);
    //   res.send(err);
    // }

    const account = req.params.account;

    GetHolder(account).then(value => {
      if (value.length == 1) {
        res.json(value[0]);
      } else {
        console.log("account old")
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

  // GetHolder: async function (req, res) {
  //   const account = req.params.account;

  //   GetHolder(account).then(value => {
  //     if (value.length == 1) {
  //       res.json(value[0]);
  //     } else {
  //       res.send(null);
  //     }
  //   }).catch(err => {
  //     res.send(err);
  //   })
  // },

  CountHolders: async function (req, res) {
    const account = req.params.account;

    GetTotalNumberOfAccount().then(value => {
      if (value.length == 1) {
        res.json(value[0]);
      } else {
        res.send(0);
      }
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

  GetAccountDeploysRange: async function (req, res) {
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
