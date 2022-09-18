const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');
const { GetAccounts } = require("../models/account");
const math = require('mathjs');
const { GetAllDeployOfPublicKeyByType } = require("../models/deploy");
const { GetDeployByRPC } = require("./chain");
const { GetEraByBlockHash } = require("../models/block_model");
const { GetAllKnownAddress } = require("../models/address");
const { GetInflowOfAddressByDate, GetOutflowOfAddressByDate } = require("../models/transfer");
const {GetAddress} = require('../models/address');
const { GetValidatorInformation } = require("./validator");
const { GetAllValidator } = require("../models/validator");
const { GetAllDelegator } = require("../models/delegator");
const { GetLatestEra } = require("../models/era_id");


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
    //const url = await common.GetNetWorkRPC();
    {
        // get all accounts
        const accounts = await GetAccounts();
        let stakers = []; // stake order
        {
            // get all staking accounts
            const auction_info = await GetAllValidator();

            for (let i = 0; i < auction_info.length; i++) {
                stakers.push({
                    "public_key_hex": auction_info[i].public_key_hex,
                    "staked_amount": auction_info[i].self_stake.toString(),
                })
            }

            const delegators = await GetAllDelegator()
            for (let j = 0; j < delegators.length; j++) {
                stakers.push({
                    "public_key_hex": delegators[j].public_key,
                    "staked_amount": delegators[j].staked_amount.toString(),
                })
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
        //result = accounts.concat(stakers);
        result = accounts;
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
    // {
    //     for (let i = 0; i < result.length; i++) {
    //         if (result[i].account_hash == undefined) {
    //             result[i].account_hash = await common.GetAccountHash(result[i].public_key_hex);

    //             result[i].active_date = "";
    //             result[i].transferrable = (await common.GetBalanceByAccountHash(url, "account-hash-" + result[i].account_hash)).balance_value;
    //             result[i].balance = (Number(result[i].staked_amount) + Number(result[i].transferrable)).toString();
    //         }
    //     }
    // }
    return result;
}

async function GetUnstakingAmount(url, public_key) {
    const deploys = await GetAllDeployOfPublicKeyByType(public_key, "undelegate");
    const current_era = await GetLatestEra();
    let total = 0;
    for (let i = 0; i < deploys.length; i++) {
        if (deploys[i].status == "success") {
            const era_of_creation = await GetEraByBlockHash(deploys[i].hash);
            if (Number(era_of_creation) + 8 <= Number(current_era)) break;
            const deploy_data = await GetDeployByRPC(url, deploys[i].deploy_hash);
            const args = deploy_data.result.deploy.session.StoredContractByHash.args;
            const amount = args.find(value => {
                return value[0] == "amount";
            })[1].parsed;
            total += Number(amount);
        }
    }
    return total;
}

async function GetDexAddressesTraffic(type, from, to) {

    let get_traffic;
    if (type == "in") {
        get_traffic = GetInflowOfAddressByDate;
    } else {
        get_traffic = GetOutflowOfAddressByDate;
    }
    let accounts = await GetAllKnownAddress();
    let traffic_value = {};
    let total = 0;
    for (let i = 0; i < accounts.length; i++) {
        const amount = await get_traffic(accounts[i].account_hash, from, to);
        const cspr = Math.round(amount / Math.pow(10, 9));
        if (cspr > 0) {
            if (traffic_value[accounts[i].name]) {
                traffic_value[accounts[i].name].amount += Number(cspr);
            } else {
                traffic_value[accounts[i].name] = {};
                traffic_value[accounts[i].name]["amount"] = 0;
                traffic_value[accounts[i].name].amount += Number(cspr);
            }
            total += Number(cspr);
        }
    }

    let value = []; // turn to array
    for (var key in traffic_value) {
        let obj = traffic_value[key];
        const percentage = obj.amount / total * 100;
        value.push({
            name: key,
            amount: obj.amount,
            percentage: percentage
        })
    }

    value.sort(function (a, b) {
        return b.amount - a.amount;
    });

    return {
        total,
        value
    };
}

async function GetExchangeVolumeByDate(date) {
    let accounts = await GetAllKnownAddress();
    let in_total = 0;
    let out_total = 0;
    for (let i = 0; i < accounts.length; i++) {
        const in_amount = await GetInflowOfAddressByDate(accounts[i].account_hash, date, date);
        in_total += Number(in_amount);
        const out_amount = await GetOutflowOfAddressByDate(accounts[i].account_hash, date, date);
        out_total += Number(out_amount);
    }
    in_total = Math.round(in_total / Math.pow(10, 9));
    out_total = Math.round(out_total / Math.pow(10, 9));
    const timestamp = (new Date(date)).getTime();
    return [
        timestamp,
        in_total,
        out_total
    ]
}

async function GetAccountName(account) {
    let address_name = await GetAddress(account);
    if (address_name && address_name.length > 0) {
       return address_name[0].name;
    }
    let validator_name = await GetValidatorInformation(account);
    if (validator_name) {
        return validator_name.name;
    }
    return null;
}

function WithoutTime(dateTime) {
    var date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);
    return date;
}

module.exports = {
    GetAccountData, GetRichest,
    GetUnstakingAmount, GetDexAddressesTraffic,
    GetAccountName, GetExchangeVolumeByDate,
    WithoutTime
}

