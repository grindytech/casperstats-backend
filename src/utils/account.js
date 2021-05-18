const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');


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
        public_key = address;
    } catch (err) {
        account_hash = "account-hash-" + address;
        public_key = null;
    }
    
    const balance = await common.GetBalanceByAccountHash(account_hash);
    const account = {
        "public_key": public_key,
        "account_hash": account_hash.replace(/\n/g, '').replace('account-hash-', ''),
        "balance": balance.balance_value
    }
    return account;
}

module.exports = {
    GetAccountData
}

