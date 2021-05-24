const { GetDeploy, GetType } = require('../utils/chain');

const { RpcApiName, ELEMENT_TYPE } = require('../utils/constant');
const { Execute } = require('../utils/common');
require('dotenv').config();

const { GetCircleSupply } = require('../models/account');
const { GetNumberOfTransfersByDate } = require('../models/transfer');

module.exports = {
    GetDeploy: async function (req, res) {
        let hex = req.params.hex; // Hex-encoded deploy hash

        GetDeploy(hex).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.send(err)
        })
    },

    GetListDeploys: async function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

        let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${process.env.NETWORK_RPC_API}`;

        if (id) {
            command = command + ` --id ${id}`;
        }

        if (b) {
            command = command + ` -b ${b}`;
        }

        Execute(command).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.send(err)
        })
    },

    GetType: async function (req, res) {
        const param = req.params.param;
        try {
            const type = await GetType(param);
            res.status(200);
            res.json(type);
        } catch (err) {
            res.json({
                value: param,
                type: ELEMENT_TYPE.UNKNOWN,
            });
        }
    },

    GetCircleSupply: async function (req, res) {
        GetCircleSupply().then(value => {
            res.json(value[0]);
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    },

    GetTransferVolume: async function (req, res) {

        try {
            const count = req.params.count;
            var datetime = new Date();

            let result = [];

            for (let i = 0; i < count; i++) {
                let the_date = new Date();
                the_date.setDate(datetime.getDate() - i);
                the_date = the_date.toISOString().slice(0, 10);
                let data = await GetNumberOfTransfersByDate(the_date, the_date);
                data = data[0];

                const paser_data = {
                    "date": the_date,
                    "number_of_transfers": data.number_of_transfers,
                }

                result.push(paser_data);
            }
            res.json(result);
        } catch (err) {
            res.send(err);
        }
    }
};
