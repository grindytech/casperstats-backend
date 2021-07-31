const { GetDeploy, GetType, GetTransfersVolume } = require('../utils/chain');

const { RpcApiName, ELEMENT_TYPE } = require('../utils/constant');
const { Execute, RequestRPC, GetNetWorkRPC } = require('../utils/common');
require('dotenv').config();

const { GetTotalNumberOfAccount, GetNumberOfAccountFromDate } = require('../models/account');
const { GetNumberOfTransfersByDate, GetVolumeByDate } = require('../models/transfer');
const CoinGecko = require('coingecko-api');
const { GetEraValidators, GetAPY, GetTotalStake, GetCasperlabsSupply } = require('../utils/validator');
const { GetTotalReward } = require('../models/era');
const CoinGeckoClient = new CoinGecko();

const NodeCache = require("node-cache");
const get_stats_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_STATS || 1800 });
const economics_cache = new NodeCache({ stdTTL: process.env.CACHE_ECONOMICS || 3600 });

const transfer_volume_cache = new NodeCache({ stdTTL: process.env.CACHE_TRANSFER_VOLUME || 1800 });
const get_volume_cache = new NodeCache({ stdTTL: process.env.CACHE_VOLUME || 1800 });

module.exports = {
    get_stats_cache,
    economics_cache,
    transfer_volume_cache,
    get_volume_cache,
    
    GetDeploy: async function (req, res) {
        let hex = req.params.hex; // Hex-encoded deploy hash
        const url = await GetNetWorkRPC();
        GetDeploy(url, hex).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },

    GetListDeploys: async function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used
        const rpc_url = await GetNetWorkRPC();
        let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${rpc_url}`;

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
        res.status(200).json("comming soon");
    },

    GetSupply: async function (req, res) {
        res.status(200).json("comming soon");
    },

    GetTransferVolume: async function (req, res) {
        try {
            const count = req.params.count;
            const result = await GetTransfersVolume(count);
            transfer_volume_cache.set(`transfer-volume-${count}`, result);
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
                    Number((Number(data.volume) / 1000000000).toFixed(2))
                ]

                result.push(paser_data);
            }
            get_volume_cache.set(`get-volume-${count}`, result);
            res.json(result);
        } catch (err) {
            res.send(err);
        }
    },

    GetStats: async function (req, res) {
        let stats = {
            holders: 0,
            holders_change: 0, // last 24 hours 
            validators: 0,
            validators_change: 0,// last 24 hours  
            circulating: 0,
            circulating_change: 0, // last 24 hours  
            total_supply: 0,
            total_supply_change: 0, // last 24 hours  
            price: 0,
            price_change: 0,// last 24 hours  
            marketcap: 0,
            marketcap_change: 0,// last 24 hours  
            transactions: 0,
            transactions_change: 0, // last 24 hours
            transfers: [], // last 60 days transfer
        }
        try{
        const url = await GetNetWorkRPC();
        // holder
        {
            var datetime = new Date();
            let yesterday = new Date();
            {
                yesterday.setDate(datetime.getDate() - 1);
                yesterday = yesterday.toISOString();
            }

            const holders = (await GetTotalNumberOfAccount()).number_of_holders;
            const last_holders = (await GetNumberOfAccountFromDate(yesterday)).number_of_holders;
            stats.holders = holders;
            stats.holders_change = (Number(holders) - Number(last_holders)) / Number(holders) * 100;
        }


        // validator
        {
            const era_validators = await GetEraValidators(url);
            const current_validators = era_validators.auction_state.era_validators[0].validator_weights.length;
            stats.validators = current_validators;

        }

        // circulating + total supply
        {
            const supply = await GetCasperlabsSupply();
            stats.circulating = supply.data.circulating + "000000000";
            stats.total_supply = supply.data.total + "000000000";
        }

        // price + marketcap 
        {
            const params = {
                tickers: false,
                community_data: false,
                developer_data: false,
                localization: false,

            }
            let data = await CoinGeckoClient.coins.fetch('casper-network', params);
            stats.price = data.data.market_data.current_price.usd;
            stats.price_change = data.data.market_data.price_change_percentage_24h;
            stats.marketcap = data.data.market_data.market_cap.usd;
            stats.marketcap_change = data.data.market_data.market_cap_change_percentage_24h;
        }

        // volume
        {
            // const params = {
            //     days: 1,
            //     vs_currency: 'usd',
            // }
            // let data = await CoinGeckoClient.coins.fetchMarketChart('casper-network', params);

            // const length = data.data.total_volumes.length;
            // const current_transaction =  data.data.total_volumes[0][1];
            // const last_transaction = data.data.total_volumes[282][length - 1];
            // stats.volume = current_transaction;
            // stats.volume_change = (Number(last_transaction) - Number(current_transaction)) / Number(current_transaction) * 100

            let now = new Date();
            now = now.toISOString();

            const the_time = new Date();
            let yesterday = new Date();
            {
                yesterday.setDate(the_time.getDate() - 1);
                yesterday = yesterday.toISOString();
            }

            let before_yesterday = new Date();
            {
                before_yesterday.setDate(the_time.getDate() - 2);
                before_yesterday = before_yesterday.toISOString();
            }

            let today_transfers = (await GetNumberOfTransfersByDate(yesterday, now)).number_of_transfers;
            let yesterday_transfers = (await GetNumberOfTransfersByDate(before_yesterday, yesterday)).number_of_transfers;

            stats.transactions = today_transfers;
            stats.transactions_change = ((Number(today_transfers) - Number(yesterday_transfers)) / Number(yesterday_transfers)) * 100;
        }

        // transfers
        {

            const count = 60;
            const data = await GetTransfersVolume(count);
            stats.transfers = data;
        }
        get_stats_cache.set("get-stats", stats);
        res.json(stats);
    }catch(err) {
        res.send(err);
    }

    },

    GetEconomics: async function (req, res) {

        let economics = {
        }
        try {
            const supply = await GetCasperlabsSupply();
            const url = await GetNetWorkRPC();
            const auction_info = await RequestRPC(url, RpcApiName.get_auction_info, []);
            const auction_state = auction_info.result.auction_state;
            economics.block_height = auction_state.block_height;
            economics.total_supply = supply.data.total.toString() + "000000000";
            economics.circulating_supply = supply.data.circulating.toString() + "000000000";

            // calculate APY
            const apy = await GetAPY(url);
            economics.APY = apy;

            // calculate total_stake
            let total_stake = 0;
            total_stake = await GetTotalStake(auction_state, 0);

            economics.total_stake = total_stake.toString();
            economics.total_active_validators = auction_state.era_validators[0].validator_weights.length;
            economics.total_bid_validators = auction_state.bids.length;

            // delegators
            let total_delegators = 0;
            {
                let bids = auction_state.bids;
                let delegators_array = [];
                for (let i = 0; i < bids.length; i++) {
                    delegators_array.push(bids[i].public_key);
                    let delegators = bids[i].bid.delegators;
                    for (let j = 0; j < delegators.length; j++) {
                        delegators_array.push(delegators[j].public_key);
                    }
                }

                var counts = {};
                for (var i = 0; i < delegators_array.length; i++) {
                    counts[delegators_array[i]] = 1 + (counts[delegators_array[i]] || 0);
                }

                total_delegators = Object.keys(counts).length
            }
            economics.total_delegators = total_delegators;

            // total reward
            let total_reward = (await GetTotalReward()).total_reward;
            economics.total_reward = total_reward;
            economics_cache.set("economics", economics);
            res.status(200).json(economics);
        } catch (err) {
            res.send(err);
        }
    }
};
