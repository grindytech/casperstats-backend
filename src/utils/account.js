const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const common = require('./common');


async function GetAccountData (address) {
    
    const account_hash = await common.GetAccountHash(address);
    const balance = await  common.GetBalance(address);

    const account = {
        "public_key": address,
        "account_hash": account_hash.replace(/\n/g, ''),
        "balance": balance.result.balance_value
    }
    return account;
}

module.exports = {
    GetAccountData
}

