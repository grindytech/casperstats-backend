const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');
const { GetTotalRewardByPublicKey, GetTimestampByEra } = require("../models/era");
const { GetAccounts } = require("../models/account");
const math = require('mathjs');
const { GetAllDeployByPublicKey } = require("../models/deploy");


async function GetAccountData(address) {

    let account_hash = "";
    let public_key = null;
    if (address.includes('account-hash-')) { // account hash
        account_hash = address;
        public_key = null;
    } else
        // try to get account hash if it's publickey otherwise it's an account hash
        try {
            account_hash = await common.GetAccountHash(address);
            account_hash = "account-hash-" + account_hash.replace(/\n/g, '');
            public_key = address;
        } catch (err) {
            account_hash = "account-hash-" + address;
            public_key = null;
        }
    const account = {
        "account_hash": account_hash.replace('account-hash-', ''),
        "public_key_hex": public_key,
        "active_date": "",
    }
    return account;
}

async function GetRichest(start, count) {

    let result = [];
    {
        // get all accounts
        const accounts = await GetAccounts();
        let stakers = []; // stake order
        {
            // get all staking accounts
            const auction_info = (await common.RequestRPC(RpcApiName.get_auction_info, [])).result;

            // get total bid
            let bids = auction_info.auction_state.bids;

            for (let i = 0; i < bids.length; i++) {
                const bid = bids[i].bid;
                stakers.push({
                    "public_key_hex": bids[i].public_key,
                    "staked_amount": bid.staked_amount.toString(),
                })

                const delegators = bid.delegators;
                for (let j = 0; j < delegators.length; j++) {
                    stakers.push({
                        "public_key_hex": delegators[j].public_key,
                        "staked_amount": delegators[j].staked_amount.toString(),
                    })
                }
            }
        }

        // merge stakers to accounts
        for (let i = 0; i < accounts.length; i++) {
            const public_key_hex = accounts[i].public_key_hex;
            let staked_amount = 0;
            const transferrable = accounts[i].balance === null ? 0 : accounts[i].balance;
            const filter_pk = stakers.filter(value => {
                return value.public_key_hex == public_key_hex;
            })

            for (let j = 0; j < filter_pk.length; j++) {
                staked_amount += Number(filter_pk[j].staked_amount);
            }
            let total_balance = (Number(transferrable) + Number(staked_amount));
            if (!total_balance) {
                total_balance = 0;
            }
            accounts[i].balance = total_balance.toString();
            accounts[i].transferrable = transferrable.toString();
            accounts[i].staked_amount = staked_amount.toString();

            // remove account that just merge from stakers
            stakers = stakers.filter(value => {
                return value.public_key_hex != public_key_hex;
            })
        }
        result = accounts.concat(stakers);
    }

    result.sort((first, second) => {
        let first_balance = first.balance;
        if (!first_balance) {
            first_balance = first.staked_amount;
        }

        let second_balance = second.balance;
        if (!second_balance) {
            second_balance = second.staked_amount;
        }
        return math.compare(second_balance, first_balance);
    })

    result = result.slice(start, start + count);
    // add more information
    {
        for (let i = 0; i < result.length; i++) {
            if (result[i].account_hash == undefined) {
                result[i].account_hash = await common.GetAccountHash(result[i].public_key_hex);

                result[i].balance = result[i].staked_amount;
                result[i].active_date = "";
                result[i].transferrable = "0";
            }
        }
    }
    return result;
}

async function GetUndelegating(account) {
    // get all deploy
    const deploys = await GetAllDeployByPublicKey(account);

    // filter undelegate deploy
    let success_withdraws = [];
    {
        for (let i = 0; i < deploys.length; i++) {
            let params = [deploys[i].deploy_hash];
            let deploy_data = await common.RequestRPC(RpcApiName.get_deploy, params);

            const execution_results = deploy_data.result.execution_results;
            {
                for (let j = 0; j < execution_results.length; j++) {
                    try {
                        const transforms = execution_results[j].result.Success.effect.transforms;
                        const withdraws = transforms.filter(value => {
                            return value.key.includes("withdraw");
                        })
                        success_withdraws.push(...withdraws);
                    } catch (err) { }
                }
            }

        }
    }
    // parser data
    let result = [];
    {
        for (let i = 0; i < success_withdraws.length; i++) {
            const write_withdraws = success_withdraws[i].transform.WriteWithdraw;
            for (let j = 0; j < write_withdraws.length; j++) {

                let release_timestamp = 0;
                {
                    let era_timestamp = (await GetTimestampByEra(write_withdraws[j].era_of_creation)).timestamp;
                    if (era_timestamp == null) {
                        era_timestamp = (await GetTimestampByEra(Number(write_withdraws[j].era_of_creation) - 1)).timestamp;
                        release_timestamp = Number(new Date(era_timestamp).getTime()) + 3600000 * 14;
                    } else {
                        release_timestamp = Number(new Date(era_timestamp).getTime()) + 3600000 * 16;
                    }
                }

                result.push({
                    "public_key": write_withdraws[j].unbonder_public_key,
                    "validator": write_withdraws[j].validator_public_key,
                    "era_of_creation": write_withdraws[j].era_of_creation,
                    "amount": write_withdraws[j].amount,
                    "release_timestamp": release_timestamp,
                })
            }
        }
    }

    // filter only undelegating for publickey
    result = result.filter(value => {
        return value.public_key = account;
    })
    return result;
}


module.exports = {
    GetAccountData, GetRichest, GetUndelegating
}

