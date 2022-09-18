const validator_db = require('../models/validator');
const { GetValidatorInformation } = require('../utils/validator');
require('dotenv').config();

module.exports = {

    GetValidatorInfo: async function (req, res) {
        const public_key = req.params.address;
        GetValidatorInformation(public_key).then(value => {
            res.status(200).json(value);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Can not get validator"
            });
        })

    },

    GetValidatorsInfo: async function (req, res) {
        validator_db.GetValidatorsInfoWithNameAndPublicKey().then(value => {
            res.status(200).json(value);
        }).catch(err => {
            console.log(err);
            res.status(500).json("can not get validators");
        })
    },

    AddValidatorInfo: async function (req, res) {
        const public_key = req.body.public_key;
        const name = req.body.name;
        const email = req.body.email;
        const icon = req.body.icon;
        const website = req.body.website;
        const twitter = req.body.twitter || "";
        const facebook = req.body.facebook || "";
        const telegram = req.body.telegram || "";
        const github = req.body.github || "";
        const details = req.body.details;

        // parser link
        const links = `[{\"tag\": \"Twitter\", \"link\": \"${twitter}\"}, {\"tag\": \"Facebook\", \"link\": \"${facebook}\"}, { \"tag\": \"Telegram\", \"link\": \"${telegram}\"}, {\"tag\": \"Github\", \"link\": \"${github}\"}]`

        validator_db.InsertValidatorInfo(public_key, name, email, icon, website, links, details).then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Can not add new validator"
            });
        })
    },

    UpdateValidatorInfo: async function (req, res) {
        const public_key = req.body.public_key;

        let validator = await validator_db.GetValidatorInfo(public_key);
        if (validator == undefined || validator == null || validator.length < 1) {
            res.status(500).json("Validator not found");
            return;
        }
        validator = validator[0];
        let links;
        {
            links = JSON.parse(validator.links);
            links = links.filter(value => {
                link = value.link.replace(/\s/g, '');
                return link != '';
            })
        }

        const name = req.body.name;
        const email = req.body.email;
        const icon = req.body.icon;
        const website = req.body.website;
        const details = req.body.details;
        const twitter = req.body.twitter != undefined ? req.body.twitter : links.twitter;
        const facebook = req.body.facebook != undefined ? req.body.facebook : links.facebook;
        const telegram = req.body.telegram != undefined ? req.body.telegram : links.telegram;
        const github = req.body.github != undefined ? req.body.github : links.github;

        let update_status;
        try {

            if (name != undefined) {
                update_status = await validator_db.UpdateName(public_key, name);
            }

            if (email != undefined) {
                update_status = await validator_db.UpdateEmail(public_key, email);
            }

            if (icon != undefined) {

            }

            if (website != undefined) {
                update_status = await validator_db.UpdateWebsite(public_key, website);
            }

            if (details != undefined) {

            }
            if (twitter != undefined || facebook != undefined || telegram != undefined || github != undefined) {
                const links = `[{\"tag\": \"Twitter\", \"link\": \"${twitter}\"}, {\"tag\": \"Facebook\", \"link\": \"${facebook}\"}, { \"tag\": \"Telegram\", \"link\": \"${telegram}\"}, {\"tag\": \"Github\", \"link\": \"${github}\"}]`
                update_status = await validator_db.UpdateLinks(public_key, links);
            }
            res.status(200).json(update_status);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                error: "Can not update validator"
            });
        }

    },

    DeleteValidatorInfo: async function (req, res) {
        const public_key = req.params.address;

        validator_db.DeleteValidatorInfo(public_key).then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json("Can not delete validator");
        })
    },

    Init: async function (req, res) {
        validator_db.CreateValidatorInfoTable().then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    Drop: async function (req, res) {
        validator_db.DropValidatorInfo().then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json(err);
        })
    }
}
