const address_db = require("../models/address");
const { getAccountHash } = require("../service/common");
require("dotenv").config();

module.exports = {
  getAddress: async function (req, res) {
    const address = req.params.address;
    try {
      const value = await address_db.getAddress(address);
      if (value.length == 1) {
        res.status(200).json(value[0]);
      } else {
        res.status(200).json({});
      }
    } catch (err) {
      res.status(500).json({ error: "Can not get address" });
    }
  },

  addAddress: async function (req, res) {
    const public_key = req.body.public_key;
    const name = req.body.name;
    let account_hash = req.body.account_hash;

    if (public_key != undefined && account_hash == undefined) {
      account_hash = await getAccountHash(public_key);
    }

    try {
      await address_db.insertAddress(public_key, account_hash, name);
      res.status(200).json({ message: "Insert address successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Can not insert new address" });
    }
  },

  updateAddress: async function (req, res) {
    const public_key = req.body.public_key;
  },

  deleteAddress: async function (req, res) {
    const address = req.params.address;
    try {
      await address_db.deleteAddress(address);
      res.status(200).json({ message: "Delete account successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not delete account");
    }
  },

  init: async function (req, res) {
    try {
      await address_db.createAddressTable();
      res.status(200).json({ message: "Create address table successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not create address table");
    }
  },

  drop: async function (req, res) {
    try {
      await address_db.dropAddress();
      res.status(200).json({ message: "Drop address table successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not drop address table");
    }
  },
};
