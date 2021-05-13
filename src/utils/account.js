const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');


async function GetAccountData(address) {

    let account_hash = "";
    let public_key = null;
    if (address.includes('account-hash-')) { // account hash
        account_hash = address.replace("account-hash-", "");
    } else
        if (address.length == 64) { // account hash
            account_hash = address;
        } else { // public_key
            account_hash = await common.GetAccountHash(address);
            public_key = address;
        }
    
    const balance = await common.GetBalance(address);
    const account = {
        "public_key": public_key,
        "account_hash": account_hash.replace(/\n/g, ''),
        "balance": balance.result.balance_value
    }
    return account;
}

module.exports = {
    GetAccountData
}

