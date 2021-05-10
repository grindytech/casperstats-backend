const dotenv = require("dotenv");
dotenv.config();
const request = require('request');
const { RpcApiName, ELEMENT_TYPE } = require('./constant');
const { exec } = require("child_process");

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

const GetTxhashes = async (block) => {
    return new Promise((resolve, reject) => {
        let params;
        // check b is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }
        RequestRPC(RpcApiName.get_block, params).then(value => {
            resolve(value.result.block.body.transfer_hashes);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetDeployhashes = async (block) => {
    return new Promise((resolve, reject) => {
        let params;
        // check b is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }
        RequestRPC(RpcApiName.get_block, params).then(value => {
            resolve(value.result.block.body.deploy_hashes);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetTotalDeployCost = async (execution_results) => {

    let total_cost = 0;
    for (let i = 0; i < execution_results.length; i++) {
        let cost = 0;
        if (execution_results[i].result.Success) {
            cost = Number(execution_results[i].result.Success.cost);
        } else if (execution_results[i].result.Failure) {
            cost = Number(execution_results[i].result.Failure.cost);
        }
        total_cost += cost;
    }
    return total_cost;
}

const GetDeploy = async (deployhash) => {

    let params = [deployhash];
    let deploy_data = await RequestRPC(RpcApiName.get_deploy, params);
    if (deploy_data.error) {
        throw deploy_data.error;
    }
    const result = deploy_data.result;

    // add more common information to header
    {
        let first_block_hash = result.execution_results[0].block_hash;
        const first_block_height = await GetBlockHeightByBlock(first_block_hash);
        let total_cost = await GetTotalDeployCost(result.execution_results);
        let to = "unknown";

        result.deploy.header["block_hash"] = first_block_hash;
        result.deploy.header["block_height"] = first_block_height;
        result.deploy.header["to"] = to;
        result.deploy.header["cost"] = total_cost.toString();
    }

    // add type
    if (result.deploy.session.Transfer) {
        result.deploy.header["type"] = "transfer";
    } else {
        delete result.deploy.session;
        result.deploy.header["type"] = "deploy";
    }

    return result;
}

const DoesDeploySuccess = async (hash) => {
    let params = [hash];

    let value = await RequestRPC(RpcApiName.get_deploy, params);
    const result = value.result.execution_results;
    for (let i = 0; i < result.length; i++) {
        if (result[i].result.Failure != undefined) {
            return false;
        }
    }
    return true;
}

const GetTransfersFromDeploy = async (deploy_hash) => {
    return new Promise((resolve, reject) => {
        QueryState(deploy_hash).then(value => {
            const transfers = value.result.stored_value.DeployInfo.transfers;
            resolve(transfers);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetTransferDetail = async (transfer_hex) => {
    return new Promise((resolve, reject) => {
        QueryState(transfer_hex).then(value => {
            const data = value.result.stored_value.Transfer;
            resolve(data);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetBlockHeightByBlock = async (blockhash) => {
    let params;
    params = [{ "Hash": blockhash }]
    let block_data = await RequestRPC(RpcApiName.get_block, params);
    const height = block_data.result.block.header.height;
    return height;
}

const GetBlock = async (block) => {
    const height = await GetHeight();
    return new Promise((resolve, reject) => {
        let params;
        // check b is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }

        RequestRPC(RpcApiName.get_block, params).then(value => {
            // add current_height to getblock
            value.result["current_height"] = height;
            delete value.result.block.proofs;
            resolve(value);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetTransfersInBlock = async (block) => {
    return new Promise((resolve, reject) => {
        let params;
        // check block is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }

        RequestRPC(RpcApiName.get_block_transfers, params).then(value => {
            resolve(value.result);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetLatestTx = async (number_of_tx) => {

    // get current block_height
    const block_height = await GetHeight();

    let result = [];
    // get list txhash
    let i = block_height;
    while (true) {
        let transfer = await GetTransfersInBlock(i);
        result.push(...transfer.transfers);

        if (result.length >= number_of_tx) {
            break;
        }
        i--;
    }
    // query tx information
    return result;
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

const GetType = async (param) => {
    if (param.length == 66) { // public_key hex
        await GetBalance(param)
        return {
            value: param,
            type: ELEMENT_TYPE.PUBLIC_KEY_HEX,
        };

    } else if (!isNaN(param)) { //block height
        let params = [{ "Height": parseInt(param) }]

        await RequestRPC(RpcApiName.get_block, params);

        return {
            value: param,
            type: ELEMENT_TYPE.BLOCK_HEIGHT,
        };
    } else if (param.length == 64) {  //block hash | deploy hex | transfer hex

        // check block hash
        try {
            let params = [{ "Hash": param }]

            await RequestRPC(RpcApiName.get_block, params);

            return {
                value: param,
                type: ELEMENT_TYPE.BLOCK_HASH,
            };
        } catch (err) {

        }

        let deploy_info = await GetDeploy(param);
        if(deploy_info.deploy.header.type == "deploy") {
            return {
                value: param,
                type: ELEMENT_TYPE.DEPLOY_HEX,
            };
        } else if (deploy_info.deploy.header.type == "transfer") {
            return {
                value: param,
                type: ELEMENT_TYPE.TRANSFER_HEX,
            };
        }

    } else {
        return {
            value: param,
            type: ELEMENT_TYPE.UNKNOWN,
        }
    }
}

module.exports = {
    Execute, RequestRPC, GetLatestStateRootHash,
    QueryState, GetHeight, GetTxhashes, GetDeployhashes,
    GetDeploy, DoesDeploySuccess, GetTransfersFromDeploy,
    GetTransferDetail, GetBlock, GetLatestTx, GetTransfersInBlock,
    GetBalance, GetType
}
