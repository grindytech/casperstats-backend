const dotenv = require("dotenv");
dotenv.config();
const request = require('request');
const { RpcApiName } = require('./constant');
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
            if (error) {
                reject(error);
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

// const GetTransactionInBlock = async (b, id) => {

//     let transfer_hashes = [];
//     let deploy_hashes = [];
//     {
//         let params;
//         // check b is a number or string to change the params
//         if (isNaN(b)) {
//             params = [{ "Hash": b }]
//         } else {
//             params = [{ "Height": parseInt(b) }]
//         }
//         let block_data = await RequestRPC(RpcApiName.get_block, params, id);
//         transfer_hashes = block_data.result.block.body.transfer_hashes;
//         deploy_hashes = block_data.result.block.body.deploy_hashes;
//     }


//     let transaction_keys = [];
//     {
//         for (let i = 0; i < transfer_hashes.length; i++) {
//             let deploy_value = await QueryState("deploy-" + transfer_hashes[i]);
//             transaction_keys.push(...deploy_value.result.stored_value.DeployInfo.transfers);
//         }
//     }

//     let transaction_datas = [];
//     {
//         // Get deploy data
//         for (let i = 0; i < deploy_hashes.length; i++) {

//             // check if deplou succeed
//             const succeed = await IsTxSucceed(deploy_hashes[i]);
//             let data;
//             if (!succeed) {
//                 let params = [deploy_hashes[i]];
//                 let value = await RequestRPC(RpcApiName.get_deploy, params);
//                 data = value.result;

//             } else {
//                 let deploy_value = await QueryState("deploy-" + deploy_hashes[i]);
//                 data = deploy_value.result.stored_value.DeployInfo;
//             }
//             data.type = "deploy"
//             data.deploy = 'deploy-' + deploy_hashes[i];

//             transaction_datas.push(data);

//         }

//         // Get transfer data
//         for (let i = 0; i < transaction_keys.length; i++) {

//             let data;

//             let tx_value = await QueryState(transaction_keys[i]);
//             data = tx_value.result.stored_value.Transfer;

//             data.type = "transfer"
//             data.transfer = transaction_keys[i];
//             transaction_datas.push(data);
//         }
//     }

//     return transaction_datas;
// }

// const IsTxSucceed = async (hash) => {
//     let params = [hash];

//     let value = await RequestRPC(RpcApiName.get_deploy, params);
//     const result = value.result.execution_results;
//     for (let i = 0; i < result.length; i++) {
//         if (result[i].result.Failure != undefined) {
//             return false;
//         }
//     }
//     return true;

// }

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


const GetDeploy = async (deployhash) => {

    let params = [deployhash];
    let deploy_data = await RequestRPC(RpcApiName.get_deploy, params);
    let result = deploy_data.result;

    for(let i = 0; i< result.execution_results.length; i++) {
        const block_height = await GetBlockHeightByBlock(result.execution_results[i].block_hash);
        result.execution_results[i]["block_height"] = block_height;
    }

    delete result.deploy.session;
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

module.exports = {
    Execute, RequestRPC, GetLatestStateRootHash,
    QueryState, GetHeight, GetTxhashes, GetDeployhashes,
    GetDeploy, DoesDeploySuccess, GetTransfersFromDeploy,
    GetTransferDetail
}
