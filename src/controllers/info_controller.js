const { GetDeploy, GetType, GetRecentCirculatingSupply } = require('../utils/chain');

const { RpcApiName, ELEMENT_TYPE } = require('../utils/constant');
const { Execute } = require('../utils/common');
require('dotenv').config();

const { GetCirculatingSupply, GetTotalNumberOfAccount, GetNumberOfAccountFromDate } = require('../models/account');
const { GetNumberOfTransfersByDate, GetVolumeByDate } = require('../models/transfer');

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

    GetCirculatingSupply: async function (req, res) {



        // CasperLabs APIs
        GetRecentCirculatingSupply().then(value => {
            res.json(value);
        }).catch(err => {
            res.send(err);
        })
    },

    GetSupply: async function (req, res) {
        GetCirculatingSupply().then(value => {
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

                const paser_data = [
                    Math.floor(new Date(the_date).getTime()),
                    data.number_of_transfers,
                ]

                result.push(paser_data);
            }
            res.json(result);
        } catch (err) {
            res.send(err);
        }
    },

    GetVolume: async function (req, res) {

        try {
            const count = req.params.count;
            var datetime = new Date();

            let result = [];

            for (let i = 0; i < count; i++) {
                let the_date = new Date();
                the_date.setDate(datetime.getDate() - i);
                the_date = the_date.toISOString().slice(0, 10);
                let data = await GetVolumeByDate(the_date, the_date);
                data = data[0];

                const paser_data = [
                    Math.floor(new Date(the_date).getTime()),
                    data.volume,
                ]

                result.push(paser_data);
            }
            res.json(result);
        } catch (err) {
            res.send(err);
        }
    },

    GetStats: async function (req, res) {
        let stats = {
            holders: 0,
            last_holders: 0, // last 30 days 
            validators: 0,
            last_validators: 0,// last 30 days  
            circulating: 0,
            last_circulating: 0, // last 30 days  
            total_supply: 0,
            last_total_supply: 0, // last 30 days  
            price: 0,
            last_price: 0,// last 30 days  
            marketcap: 0,
            last_marketcap: 0,// last 30 days  
            transactions: 0,
            last_transactions: 0, // last 24h
            transfers: [], // last 60 days transfer
        }

        let last_30_days = new Date();
        {
            var datetime = new Date();
            last_30_days.setDate(datetime.getDate() - 30);
            last_30_days = last_30_days.toISOString().slice(0, 10);
        }

        // holder
        {
            const holders = (await GetTotalNumberOfAccount()).number_of_holders;
            const last_holders = (await GetNumberOfAccountFromDate(last_30_days)).number_of_holders;
            stats.holders = holders;
            stats.last_holders = last_holders;
        }

        res.json(stats);
    }
};
