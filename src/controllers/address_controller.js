const address_db = require("../models/address");
const { getAccountHash } = require("../service/common");
require("dotenv").config();

module.exports = {
  GetAddress: async function (req, res) {
    const address = req.params.address;
    address_db
      .GetAddress(address)
      .then((value) => {
        if (value.length == 1) {
          res.status(200).json(value[0]);
        } else {
          res.status(200).json({});
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Can not get address" });
      });
  },

  AddAddress: async function (req, res) {
    const public_key = req.body.public_key;
    const name = req.body.name;
    let account_hash = req.body.account_hash;

    if (public_key != undefined && account_hash == undefined) {
      account_hash = await getAccountHash(public_key);
    }

    address_db
      .InsertAddress(public_key, account_hash, name)
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: "Can not insert new address" });
      });
  },

  UpdateAddress: async function (req, res) {
    const public_key = req.body.public_key;
  },

  DeleteAddress: async function (req, res) {
    const address = req.params.address;
    address_db
      .DeleteAddress(address)
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        res.status(500).send("Can not delete account");
      });
  },

  Init: async function (req, res) {
    address_db
      .CreateAddressTable()
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Can not create address table");
      });
  },

  Drop: async function (req, res) {
    address_db
      .DropAddress()
      .then((value) => {
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Can not drop address table");
      });
  },
};
