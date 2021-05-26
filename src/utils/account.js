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
        account_hash = "account-hash-" + account_hash.replace(/\n/g, '');
        public_key = address;
    } catch (err) {
        account_hash = "account-hash-" + address;
        public_key = null;
    }
    
    console.log(account_hash);
    const balance = await common.GetBalanceByAccountHash(account_hash);
    const account = {
        "account_hash": account_hash.replace('account-hash-', ''),
        "public_key_hex": public_key,
        "balance": balance.balance_value,
        "active_date": "",
    }
    return account;
}

module.exports = {
    GetAccountData
}

