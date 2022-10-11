const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName, ELEMENT_TYPE } = require("./constant");
const account_fn = require("./account");
const {
  getHeight,
  requestRPC,
  getAccountHash,
  execute,
  getNetWorkRPC,
} = require("./common");
const request = require("request");
const {
  getNumberOfTransfersByDate,
  getTransfersByDeployHash,
} = require("../models/transfer");
const { getDeployByDeployHash } = require("../models/deploy");
const { getBlockHeightByHash } = require("../models/block_model");
const { getAllValidator } = require("../models/validator");

const getDeployhashes = async (url, block) => {
  return new Promise((resolve, reject) => {
    let params;
    // check b is a number or string to change the params
    if (isNaN(block)) {
      params = [{ Hash: block }];
    } else {
      params = [{ Height: parseInt(block) }];
    }
    requestRPC(url, RpcApiName.get_block, params)
      .then((value) => {
        resolve(value.result.block.body.deploy_hashes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getTotalDeployCost = async (execution_results) => {
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
};

async function get_deploy_type(deploy_data) {
  const type = "unknown";
  {
    // undelegate
    try {
      const transfer = await deploy_data.deploy.session.Transfer;
      if (transfer) {
        return "transfer";
      }
    } catch (err) {}
    try {
      const entry_point = await deploy_data.deploy.session.StoredContractByHash
        .entry_point;
      if (entry_point) {
        return entry_point;
      }
    } catch (err) {}
  }
  return type;
}

const getDeploy = async (hex) => {
  let result = {
    deploy_hash: "",
    public_key: "",
    block_hash: "",
    block_height: 0,
    cost: "",
    gas_price: 0,
    timestamp: "",
    status: "",
    amount: "",
    to_address: null,
    type: "",
    error_message: null,
  };

  let deploy_data = await getDeployByDeployHash(hex); //edited
  if (deploy_data) {
    deploy_data = deploy_data[0];
  }

  // Get block height
  let block_height = await getBlockHeightByHash(deploy_data.hash);
  if (block_height) {
    block_height = block_height[0].height;
  }

  // Get error_message
  if (deploy_data.error_message != null) {
    result.error_message = deploy_data.error_message;
  }

  result.deploy_hash = hex;
  result.public_key = deploy_data.public_key;
  result.block_hash = deploy_data.deploy_hash;
  result.block_height = block_height;
  result.cost = deploy_data.cost;
  result.gas_price = deploy_data.gas_price;
  result.timestamp = deploy_data.timestamp;
  result.status = deploy_data.status;
  result.amount = deploy_data.amount;
  result.type = deploy_data.type;

  // Get to_address if type is transfer
  if (result.type === "transfer") {
    let transfer_data = await getTransfersByDeployHash(deploy_data.deploy_hash);
    result.to_address = transfer_data.to;
  }

  return result;
};

const getDeployFromRPC = async (url, hex) => {
  let deploy_data = await getDeployByRPC(url, hex);
  const result = deploy_data.result;
  // add more common information to header
  if (result.execution_results.length > 0) {
    let first_block_hash = result.execution_results[0].block_hash;
    let first_block_height = await getBlockHeightByHash(first_block_hash);
    if (first_block_height.length > 0) {
      first_block_height = first_block_height[0].height;
    } else {
      first_block_height = await getBlockHeightByBlock(url, first_block_hash);
    }
    let total_cost = await getTotalDeployCost(result.execution_results);

    result.deploy.header["block_hash"] = first_block_hash;
    result.deploy.header["block_height"] = first_block_height;
    result.deploy.header["cost"] = total_cost.toString();
    // add type
    const type = await get_deploy_type(deploy_data.result);
    result.deploy.header["type"] = type;
  }
  return result;
};

const getTransfersFromDeploy = async (deploy_hash) => {
  return new Promise((resolve, reject) => {
    QueryState(deploy_hash)
      .then((value) => {
        const transfers = value.result.stored_value.DeployInfo.transfers;
        resolve(transfers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getTransferDetail = async (transfer_hex) => {
  return new Promise((resolve, reject) => {
    QueryState(transfer_hex)
      .then((value) => {
        const data = value.result.stored_value.Transfer;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getBlockHeightByBlock = async (url, blockhash) => {
  let params;
  params = [{ Hash: blockhash }];
  let block_data = await requestRPC(url, RpcApiName.get_block, params);
  const height = block_data.result.block.header.height;
  return height;
};

const getBlock = async (url, block) => {
  return new Promise((resolve, reject) => {
    let params;
    // check b is a number or string to change the params
    if (isNaN(block)) {
      params = [{ Hash: block }];
    } else {
      params = [{ Height: parseInt(block) }];
    }

    requestRPC(url, RpcApiName.get_block, params)
      .then((value) => {
        // add current_height to getblock
        delete value.result.block.proofs;
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getDeploysInBlock = async (url, block) => {
  return new Promise((resolve, reject) => {
    let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${url}`;
    if (block) {
      command = command + ` -b ${block}`;
    }

    execute(command)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getDeployByRPC = async (url, hex) => {
  return new Promise((resolve, reject) => {
    let command = `${process.env.CASPER_CLIENT} get-deploy --node-address ${url} ${hex}`;
    execute(command)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getTransfersInBlock = async (url, block) => {
  return new Promise((resolve, reject) => {
    let params;
    // check block is a number or string to change the params
    if (isNaN(block)) {
      params = [{ Hash: block }];
    } else {
      params = [{ Height: parseInt(block) }];
    }

    requestRPC(url, RpcApiName.get_block_transfers, params)
      .then((value) => {
        resolve(value.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

async function isBlockHeight(url, param) {
  if (isNaN(param) == false) {
    const height = await getHeight(url);
    if (param < 0 || param > height) {
      return false;
    }
    return true;
  }
  return false;
}

async function isBlockHash(url, param) {
  if (param.length == 64) {
    //block hash
    // check block hash
    let params = [{ Hash: param }];
    try {
      const block_data = await requestRPC(url, RpcApiName.get_block, params);
      if (block_data.error == undefined || block_data.error == null)
        return true;
    } catch (err) {}
  }
  return false;
}

async function isDeployHash(url, param) {
  if (param.length == 64) {
    try {
      const value = await getDeployFromRPC(url, param);
      if (value != null) {
        return true;
      }
    } catch (err) {}
  }
  return false;
}

async function isTransferHash(url, param) {
  if (param.length == 64) {
    try {
      let deploy_info = await getDeployFromRPC(url, param);
      if (deploy_info.deploy.header.type == "transfer") {
        return true;
      }
    } catch (err) {}
  }
  return false;
}

async function isValidatorAddress(url, param) {
  try {
    const is_pk = await isPublicKeyHex(param);
    if (is_pk) {
      const auction_info = await getAllValidator();
      let element = auction_info.find((el) => el.public_key_hex == param);
      if (element) {
        return true;
      }
    }
  } catch (err) {}
  return false;
}

async function isAccountHash(param) {
  try {
    if (param.includes("account-hash-")) {
      return true;
    } else if (param.length == 64) {
      return true;
    }
  } catch (err) {}
  return false;
}

async function isPublicKeyHex(param) {
  try {
    await getAccountHash(param);
    return true;
  } catch (err) {}
  return false;
}

const getType = async (param) => {
  // clean the input
  const imput = param.replace(/\s+/g, "");
  const url = await getNetWorkRPC();

  const is_blockheight = await isBlockHeight(url, imput);
  if (is_blockheight) {
    return {
      value: imput,
      type: ELEMENT_TYPE.BLOCK_HEIGHT,
    };
  }

  const is_block_hash = await isBlockHash(url, imput);
  if (is_block_hash) {
    return {
      value: imput,
      type: ELEMENT_TYPE.BLOCK_HASH,
    };
  }

  const is_deploy_hash = await isDeployHash(url, imput);
  if (is_deploy_hash) {
    return {
      value: imput,
      type: ELEMENT_TYPE.DEPLOY_HEX,
    };
  }

  const is_transfer_hash = await isTransferHash(url, imput);
  if (is_transfer_hash) {
    return {
      value: imput,
      type: ELEMENT_TYPE.TRANSFER_HEX,
    };
  }

  const is_validator_address = await isValidatorAddress(url, imput);
  if (is_validator_address) {
    return {
      value: imput,
      type: ELEMENT_TYPE.VALIDATOR,
    };
  }

  const is_account_hash = await isAccountHash(imput);
  if (is_account_hash) {
    return {
      value: imput,
      type: ELEMENT_TYPE.PUBLIC_KEY_HASH,
    };
  }

  const is_pk_hex = await isPublicKeyHex(imput);
  if (is_pk_hex) {
    return {
      value: imput,
      type: ELEMENT_TYPE.PUBLIC_KEY_HEX,
    };
  }

  return {
    value: imput,
    type: ELEMENT_TYPE.UNKNOWN,
  };
};

const getTransfersVolume = async (count) => {
  var datetime = new Date();
  let result = [];
  for (let i = 0; i < count; i++) {
    let the_date = new Date();
    the_date.setDate(datetime.getDate() - i);
    the_date = the_date.toISOString().slice(0, 10);
    let data = await getNumberOfTransfersByDate(the_date, the_date);
    const paser_data = [
      Math.floor(new Date(the_date).getTime()),
      data.number_of_transfers,
    ];
    result.push(paser_data);
  }
  return result;
};

module.exports = {
  getDeployhashes,
  getDeploy,
  getTransfersFromDeploy,
  getTransferDetail,
  getBlock,
  getTransfersInBlock,
  getType,
  getDeploysInBlock,
  getTransfersVolume,
  getDeployByRPC,
  getDeployFromRPC,
};
