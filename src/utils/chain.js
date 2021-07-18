const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName, ELEMENT_TYPE } = require('./constant');
const account_fn = require('./account');
const { GetHeight, RequestRPC, GetAccountHash, Execute, GetNetWorkRPC } = require("./common");
const request = require('request');
const { GetNumberOfTransfersByDate } = require("../models/transfer");
const { GetBlockHeight } = require("../models/block_model");

const GetDeployhashes = async (url, block) => {
    return new Promise((resolve, reject) => {
        let params;
        // check b is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }
        RequestRPC(url, RpcApiName.get_block, params).then(value => {
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

const GetDeploy = async (url, deployhash) => {

    let params = [deployhash];
    let deploy_data = await RequestRPC(url, RpcApiName.get_deploy, params);
    if (deploy_data.error) {
        throw deploy_data.error;
    }
    const result = deploy_data.result;

    // add more common information to header
    {
        let first_block_hash = result.execution_results[0].block_hash;
        const first_block_height = await GetBlockHeightByBlock(url, first_block_hash);
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
        result.deploy.header["type"] = "deploy";
    }

    return result;
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

const GetBlockHeightByBlock = async (url, blockhash) => {
    let params;
    params = [{ "Hash": blockhash }]
    let block_data = await RequestRPC(url, RpcApiName.get_block, params);
    const height = block_data.result.block.header.height;
    return height;
}

const GetBlock = async (url, block) => {
    const height = await GetHeight(url);
    return new Promise((resolve, reject) => {
        let params;
        // check b is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }

        RequestRPC(url, RpcApiName.get_block, params).then(value => {
            // add current_height to getblock
            value.result["current_height"] = height;
            delete value.result.block.proofs;
            resolve(value);
        }).catch(err => {
            reject(err);
        })
    })
}


const GetDeploysInBlock = async (block) => {
    const rpc_url = await GetNetWorkRPC();
    return new Promise((resolve, reject) => {

        let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${rpc_url}`;

        if (block) {
            command = command + ` -b ${block}`;
        }

        Execute(command).then(value => {
            resolve(value);
        }).catch(err => {
            reject(err);
        })
    })
}

const GetTransfersInBlock = async (url, block) => {
    return new Promise((resolve, reject) => {
        let params;
        // check block is a number or string to change the params
        if (isNaN(block)) {
            params = [{ "Hash": block }]
        } else {
            params = [{ "Height": parseInt(block) }]
        }

        RequestRPC(url, RpcApiName.get_block_transfers, params).then(value => {
            resolve(value.result);
        }).catch(err => {
            reject(err);
        })
    })
}

async function IsBlockHeight(param) {

    if (isNaN(param) == false) {
        const height = await GetBlockHeight();
        if (param < 0 || param > height) {
            return false;
        }
        return true;
    }
    return false;
}

async function IsBlockHash(url, param) {
    if (param.length == 64) {  //block hash
        // check block hash
        let params = [{ "Hash": param }]
        try {
            await RequestRPC(url, RpcApiName.get_block, params);
            return true;
        } catch (err) { }

    }
    return false;
}

async function IsDeployHash(url, param) {
    if (param.length == 64) {
        try {
            const value = await GetDeploy(url, param);
            if (value.deploy.header.type == "deploy") {
                return true;
            }
        } catch (err) { }
    }
    return false;
}

async function IsTransferHash(url, param) {
    if (param.length == 64) {
        try {
            let deploy_info = await GetDeploy(url, param);
            if (deploy_info.deploy.header.type == "transfer") {
                return true;
            }
        } catch (err) { }
    }
    return false;
}

async function IsValidatorAddress(url, param) {
    try {
        const is_pk = await IsPublicKeyHex(param);
        if (is_pk) {
            const auction_info = await (RequestRPC(url, RpcApiName.get_auction_info, []));
            const current_validator_weights = auction_info.result.auction_state.era_validators[0].validator_weights;
            let element = current_validator_weights.find(el => el.public_key == param);
            if (element) {
                return true;
            }
        }
    } catch (err) { }
    return false;
}

async function IsAccountHash(param) {
    try {
        if (param.includes("account-hash-")) {
            return true
        } else
            if (param.length == 64) {
                return true;
            }
    } catch (err) { }
    return false;
}

async function IsPublicKeyHex(param) {
    try {
        await GetAccountHash(param);
        return true;
    } catch (err) { }
    return false;
}

const GetType = async (param) => {

    // clean the input
    const imput = param.replace(/\s+/g, '');
    const url = await GetNetWorkRPC();

    const is_blockheight = await IsBlockHeight(imput);
    if (is_blockheight) {
        return {
            value: imput,
            type: ELEMENT_TYPE.BLOCK_HEIGHT,
        };
    }

    const is_block_hash = await IsBlockHash(url, imput);
    if (is_block_hash) {
        return {
            value: imput,
            type: ELEMENT_TYPE.BLOCK_HASH,
        };
    }

    const is_deploy_hash = await IsDeployHash(url, imput);
    if (is_deploy_hash) {
        return {
            value: imput,
            type: ELEMENT_TYPE.DEPLOY_HEX,
        }
    }

    const is_transfer_hash = await IsTransferHash(url, imput);
    if (is_transfer_hash) {
        return {
            value: imput,
            type: ELEMENT_TYPE.TRANSFER_HEX,
        }
    }

    const is_validator_address = await IsValidatorAddress(url, imput);
    if (is_validator_address) {
        return {
            value: imput,
            type: ELEMENT_TYPE.VALIDATOR,
        }
    }

    const is_account_hash = await IsAccountHash(imput);
    if (is_account_hash) {
        return {
            value: imput,
            type: ELEMENT_TYPE.PUBLIC_KEY_HASH,
        }
    }

    const is_pk_hex = await IsPublicKeyHex(imput);
    if (is_pk_hex) {
        return {
            value: imput,
            type: ELEMENT_TYPE.PUBLIC_KEY_HEX,
        }
    }

    return {
        value: imput,
        type: ELEMENT_TYPE.UNKNOWN,
    }
}

const GetRecentCirculatingSupply = async () => {

    let options = {
        url: process.env.TOKEN_METRICS_URL,
        method: "get",
        headers:
        {
            "content-type": "application/json"
        }
    };

    return new Promise((resolve, reject) => {

        request(options, (error, response, body) => {
            const result = JSON.parse(body);
            if (result.error) {
                reject(result.error);
            } else {
                resolve({ circulating_supply: result.data.circulating + "000000000" });
            }
        });
    })
}

const GetRecentTotalSupply = async () => {
    let options = {
        url: process.env.TOKEN_METRICS_URL,
        method: "get",
        headers:
        {
            "content-type": "application/json"
        }
    };

    return new Promise((resolve, reject) => {

        request(options, (error, response, body) => {
            const result = JSON.parse(body);
            if (result.error) {
                reject(result.error);
            } else {
                resolve({ total_supply: result.data.total + "000000000" });
            }
        });
    })
}

const GetCasperlabsSupply = async () => {
    let options = {
        url: process.env.TOKEN_METRICS_URL,
        method: "get",
        headers:
        {
            "content-type": "application/json"
        }
    };

    return new Promise((resolve, reject) => {

        request(options, (error, response, body) => {
            const result = JSON.parse(body);
            if (result.error) {
                reject(result.error);
            } else {
                resolve(result);
            }
        });
    })
}

const GetTransfersVolume = async (count) => {
    var datetime = new Date();
    let result = [];
    for (let i = 0; i < count; i++) {
        let the_date = new Date();
        the_date.setDate(datetime.getDate() - i);
        the_date = the_date.toISOString().slice(0, 10);
        let data = await GetNumberOfTransfersByDate(the_date, the_date);
        const paser_data = [
            Math.floor(new Date(the_date).getTime()),
            data.number_of_transfers,
        ]
        result.push(paser_data);
    }
    return result;
}

module.exports = {
    GetDeployhashes,
    GetDeploy, GetTransfersFromDeploy,
    GetTransferDetail, GetBlock,
    GetTransfersInBlock, GetType, GetDeploysInBlock,
    GetRecentCirculatingSupply, GetRecentTotalSupply,
    GetCasperlabsSupply, GetTransfersVolume
}
