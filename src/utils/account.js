const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');
const { GetTotalRewardByPublicKey } = require("../models/era");
const { GetAccounts } = require("../models/account");
const math = require('mathjs');


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

    let balance = 0;
    try {
        balance = (await common.GetBalanceByAccountHash(account_hash)).balance_value;
    } catch (err) {
        balance = 0;
    }
    const account = {
        "account_hash": account_hash.replace('account-hash-', ''),
        "public_key_hex": public_key,
        "balance": balance,
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
                    "staked_amount": bid.staked_amount,
                })

                const delegators = bid.delegators;
                for (let j = 0; j < delegators.length; j++) {
                    stakers.push({
                        "public_key_hex": delegators[j].public_key,
                        "staked_amount": delegators[j].staked_amount,
                    })
                }
            }
        }

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
            accounts[i].balance = (Number(transferrable) + Number(staked_amount)).toString();
            accounts[i].transferrable = transferrable.toString();
            accounts[i].staked_amount = staked_amount.toString();
        }
        result = accounts;
    }

    result.sort((a, b) => {
        return math.compare(b.balance, a.balance);
    })
    return result.slice(start, start + count);
}

module.exports = {
    GetAccountData, GetRichest
}

