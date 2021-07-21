const validator_db = require('../models/validator');
const { GetValidatorInformation } = require('../utils/validator');
require('dotenv').config();

module.exports = {

    GetValidator: async function (req, res) {
        const public_key = req.params.address;
       GetValidatorInformation(public_key).then(value => {
           res.status(200).json(value);
       }).catch(err => {
           console.log(err);
           res.status(500).json(err);
       })

    },

    AddValidator: async function (req, res) {
        const public_key = req.body.public_key;
        const name = req.body.name;
        const email = req.body.email;
        const icon = req.body.icon;
        const websites = req.body.websites;
        const links = req.body.links;
        const details = req.body.details;

        validator_db.InsertValidator(public_key, name, email, icon, websites, links, details).then(result => {
                res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    DeleteValidator: async function (req, res) {
        const public_key = req.params.address;

        validator_db.DeleteValidator(public_key).then(result => {
                res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    Init: async function (req, res) {
        validator_db.CreateValidatorTable().then(result => {
                res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    Drop: async function (req, res) {
        validator_db.DropValidator().then(result => {
                res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    }
}
