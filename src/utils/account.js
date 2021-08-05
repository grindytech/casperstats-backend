const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');
const { GetTotalRewardByPublicKey, GetTimestampByEra } = require("../models/era");
const { GetAccounts } = require("../models/account");
const math = require('mathjs');
const { GetAllDeployByPublicKey } = require("../models/deploy");
const { GetEraByBlockHash } = require("../models/block_model");
const { GetValidatorInformation } = require("./validator");


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
    const url = await common.GetNetWorkRPC();
    {
        // get all accounts
        const accounts = await GetAccounts();
        let stakers = []; // stake order
        {
            // get all staking accounts
            const auction_info = (await common.RequestRPC(url, RpcApiName.get_auction_info, [])).result;

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

    result = result.slice(Number(start), Number(start) + Number(count));

    // add more information for genesis account
    {
        for (let i = 0; i < result.length; i++) {
            if (result[i].account_hash == undefined) {
                result[i].account_hash = await common.GetAccountHash(result[i].public_key_hex);

                result[i].balance = result[i].staked_amount;
                result[i].active_date = "";
                result[i].transferrable =  (await common.GetBalanceByAccountHash(url, "account-hash-" + result[i].account_hash)).balance_value;
            }
        }
    }
    return result;
}

async function GetDelegating(account) {
    // get all deploy
    const deploys = await GetAllDeployByPublicKey(account);

    // filter delegate deploy
    let result = [];
    {
        const url = await common.GetNetWorkRPC();
        for (let i = 0; i < deploys.length; i++) {
            let params = [deploys[i].deploy_hash];
            let deploy_data = await common.RequestRPC(url, RpcApiName.get_deploy, params);
            let value = undefined;
            // incase undelegate
            try {
                const storedContractByHash = deploy_data.result.deploy.session.StoredContractByHash;
                if (storedContractByHash.entry_point == "delegate") {
                    const args = storedContractByHash.args;
                    const delegator = args.filter(value => {
                        return value[0].toString() == "delegator";
                    })[0][1].parsed;
                    const validator = args.filter(value => {
                        return value[0].toString() == "validator";
                    })[0][1].parsed;
                    const amount = args.filter(value => {
                        return value[0].toString() == "amount";
                    })[0][1].parsed;
                    value = {
                        delegator,
                        validator,
                        amount
                    };
                }
            } catch (err) { }

            if (value) {
                // add status
                let status = false;
                try {
                    if (deploy_data.result.execution_results[0].result.Success)
                        status = true;
                } catch (err) { }
                value.status = status;
                // try to add information to validator
                try {
                    const validator_info = await GetValidatorInformation(value.validator);
                    if (validator_info != null) {
                        value.validator_name = validator_info.name;
                        value.validator_icon = validator_info.icon;
                    }
                } catch (err) { }
                result.push(value);
            }
        }
    }
    //parser result
    return result;
}

async function GetUndelegating(account) {
    // get all deploy
    const deploys = await GetAllDeployByPublicKey(account);

    let result = [];
    {
        const url = await common.GetNetWorkRPC();
        for (let i = 0; i < deploys.length; i++) {
            let params = [deploys[i].deploy_hash];
            let deploy_data = await common.RequestRPC(url, RpcApiName.get_deploy, params);
            let value = undefined;

            // incase undelegate
            try {
                const storedContractByHash = deploy_data.result.deploy.session.StoredContractByHash;
                if (storedContractByHash.entry_point == "undelegate") {
                    const args = storedContractByHash.args;

                    const delegator = args.filter(value => {
                        return value[0].toString() == "delegator";
                    })[0][1].parsed;

                    const validator = args.filter(value => {
                        return value[0].toString() == "validator";
                    })[0][1].parsed;

                    const amount = args.filter(value => {
                        return value[0].toString() == "amount";
                    })[0][1].parsed;

                    value = {
                        delegator,
                        validator,
                        amount
                    };
                }
            } catch (err) { }

            // incase unbonding for validator
            try {
                const args = deploy_data.result.deploy.session.ModuleBytes.args;

                const if_unbond = args.filter(value => {
                    return value[0].toString() == "unbond_purse";
                });

                if (if_unbond) {
                    const delegator = args.filter(value => {
                        return value[0].toString() == "public_key";
                    })[0][1].parsed;

                    const validator = delegator;

                    const amount = args.filter(value => {
                        return value[0].toString() == "amount";
                    })[0][1].parsed;

                    value = {
                        delegator,
                        validator,
                        amount
                    };
                }

            } catch (err) { }

            if (value) {
                // add status
                let status = false;
                try {
                    if (deploy_data.result.execution_results[0].result.Success)
                        status = true;
                } catch (err) { }
                // timestamp
                value.timestamp = deploy_data.result.deploy.header.timestamp;
                // calculate exact time receive token
                let release_timestamp = null;
                if (status) {
                    const era = await GetEraByBlockHash(deploy_data.result.execution_results[0].block_hash.toString());
                    if (era) {
                        let era_timestamp = (await GetTimestampByEra(era)).timestamp;
                        if (era_timestamp == null) {
                            era_timestamp = (await GetTimestampByEra(Number(era) - 1)).timestamp;
                            release_timestamp = Number(new Date(era_timestamp).getTime()) + 3600000 * 14;
                        } else {
                            release_timestamp = Number(new Date(era_timestamp).getTime()) + 3600000 * 16;
                        }
                    }
                }
                value.release_timestamp = release_timestamp;
                value.status = status;
                try {
                    const validator_info = await GetValidatorInformation(value.validator);
                    if (validator_info != null) {
                        value.validator_name = validator_info.name;
                        value.validator_icon = validator_info.icon;
                    }
                } catch (err) { }
                result.push(value);
            }
        }
    }
    //parser result
    return result;
}

module.exports = {
    GetAccountData, GetRichest,
    GetDelegating, GetUndelegating
}

