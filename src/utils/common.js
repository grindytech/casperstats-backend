const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const request = require('request');
const { exec } = require("child_process");


async function GetAccountHash(address) {
    return new Promise((resolve, reject) => {
        let command = `${process.env.CASPER_CLIENT} account-address`;
        if (address) {
            command = command + ` --public-key ${address}`;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            return resolve(String(stdout));
        });

    })
}

const GetBalance = async (address) => {
    let s = await GetLatestStateRootHash(); // get latest root hash
    try {
        let URef = await QueryState(address, s); // URef for address
        let main_purse = URef.result.stored_value.Account.main_purse;

        let params = [s, main_purse];

        let result = await RequestRPC(RpcApiName.get_balance, params);
        return result;
    } catch (err) {
        throw ({
            "code": -32001,
            "message": "address not known",
            "data": null
        });
    }
}

const GetBalanceByAccountHash = async (account_hash) => {
    let s = await GetLatestStateRootHash(); //Hex-encoded hash of the state root
    
    const state = await QueryState(account_hash, s);
    const main_purse = state.result.stored_value.Account.main_purse;

    let params = [s, main_purse];
    const result = await RequestRPC(RpcApiName.get_balance, params);
    return {
        "balance_value": result.result.balance_value
    };
}


async function GetAccountData (address) {
 
    const account = {}

    account["balance"] = await GetBalance(address);
    account["account_hash"] = await GetAccountHash(address);

    return account;
}
const Execute = async (command) => {
    return new Promise((resolve, reject) => {

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(JSON.parse(stdout));
        });
    })
}

const RequestRPC = async (method, params, id = undefined) => {
    return new Promise((resolve, reject) => {
        let body = "";
        if (id == undefined) {
            let unique = new Date().getTime();
            body = JSON.stringify({ "jsonrpc": "2.0", "id": unique, "method": method, "params": params });
        } else {
            body = JSON.stringify({ "jsonrpc": "2.0", "id": id, "method": method, "params": params });
        }

        let options = {
            url: process.env.NETWORK_RPC_API + "/rpc",
            method: "post",
            headers:
            {
                "content-type": "application/json"
            },
            body
        };

        console.log("Option: ", options)

        request(options, (error, response, body) => {
            const result = JSON.parse(body);
            if (result.error) {
                reject(result.error);
            } else {
                resolve(JSON.parse(body));
            }
        });

    })
}

const GetLatestStateRootHash = async () => {

    return new Promise((resolve, reject) => {

        RequestRPC(RpcApiName.get_state_root_hash, []).then(value => {
            resolve(value.result.state_root_hash);
        }).catch(err => {
            reject(err);
        })
    })
}


/**
 * Retrieves a stored value from the network
 *
 * @param {string} key must be a formatted PublicKey or Key. This will take one of the following forms:
 * 01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
 * account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
 * hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
 * uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
 * transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
 * deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo
 * @param {string} state Hex-encoded hash of the state root.
 * @param {number} id optional
 * @return {object}.
 */
const QueryState = async (key, state = "", id = undefined) => {

    if (state == "") {
        state = await GetLatestStateRootHash();
    }

    return new Promise((resolve, reject) => {

        let command = `${process.env.CASPER_CLIENT} query-state --node-address ${process.env.NETWORK_RPC_API} -k ${key} -s ${state}`;

        console.log("command: ", command);
        if (id != undefined) {
            command = command + ` --id ${id}`;
        }

        Execute(command).then(value => {
            resolve(value);
        }).catch(err => {
            reject(err);
        })
    })

}

const GetHeight = async () => {
    let params = [{}];

    let block_data = await RequestRPC(RpcApiName.get_block, params);
    let height = block_data.result.block.header.height;
    return height;
}


module.exports = {
    GetAccountData, GetHeight, QueryState, 
    GetLatestStateRootHash, Execute, GetBalance,
    GetAccountHash, RequestRPC, GetBalanceByAccountHash
}

