const { GetBlocksByValidator } = require('../models/block_model');
const { GetTotalNumberOfTransfers, GetTransfers } = require('../models/transfer');
const {
  GetDeployhashes, GetDeploy, GetBlock,
  GetTransfersInBlock,
  GetDeploysInBlock } = require('../utils/chain');
const common = require('../utils/common');
const { RequestRPC, GetHeight, GetNetWorkRPC } = require('../utils/common');
const { RpcApiName } = require('../utils/constant');
const request = require('request');

const NodeCache = require("node-cache");
const get_block_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_BLOCK || 20 });

require('dotenv').config();

module.exports = {
  get_block_cache,
  GetBlock: async function (req, res) {
    const b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used
    const url = await GetNetWorkRPC();
    const height = await GetHeight(url);

    // Check valid block input
    if (isNaN(b)) {

      if (b.length != 64) {
        res.send({
          "code": -32001,
          "message": "block not known",
          "data": null
        });
        return;
      }

      params = [{ "Hash": b }]
    } else {
      if (parseInt(b) < 0 || parseInt(b) > height) {
        res.send({
          "code": -32001,
          "message": "block not known",
          "data": null
        });
        return;
      }
      params = [{ "Height": parseInt(b) }]
    }
    RequestRPC(url, RpcApiName.get_block, params).then(value => {
      value.result["current_height"] = height;
      get_block_cache.set(b, value);
      res.status(200).json(value);
    }).catch(err => {
      console.log(err);
      res.status(500).send("Can not get block data");
    })
  },

  GetBlockTx: async function (req, res) {
    let b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;
    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ "Hash": b }]
    } else {
      params = [{ "Height": parseInt(b) }]
    }
    const url = await GetNetWorkRPC();
    RequestRPC(url, RpcApiName.get_block_transfers, params).then(value => {
      res.status(200);
      res.json(value.result.transfers);
    }).catch(err => {
      console.log(err);
      res.status(500).send("Can not get tx data");
    })
  },

  GetStateRootHash: async function (req, res) {
    let b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;

    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ "Hash": b }]
    } else {
      params = [{ "Height": parseInt(b) }]
    }
    const url = await GetNetWorkRPC();
    RequestRPC(url, RpcApiName.get_state_root_hash, params).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      console.log(err);
      res.status(500).send("Can not get state_root_hash");
    })
  },

  GetLatestBlocks: async function (req, res) {
    let num = req.params.number; // Number of block

    try {
      const url = await GetNetWorkRPC();
      let height = await GetHeight(url);
      let datas = [];
      for (let i = height; i > height - num; i--) {
        let block_data = await GetBlock(url, i);
        datas.push(block_data.result.block);
      }
      res.status(200);
      res.json(datas);

    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get latest block");
    }
  },

  GetRangeBlock: async function (req, res) {
    let start = Number(req.query.start);
    let end = Number(req.query.end);

    try {
      const url = await GetNetWorkRPC();
      let height = await GetHeight(url);
      let data = {};
      data["current_height"] = height;
      data["result"] = [];
      for (let i = end; i >= start; i--) {
        let block_data = await GetBlock(url, i);
        data.result.push(block_data.result.block);
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block by range");
    }
  },

  GetBlockDeployTx: async function (req, res) {
    let b = req.params.block;
    try {
      const url = await GetNetWorkRPC();
      let deploy_hashes = await GetDeployhashes(url, b);
      let data = [];
      for (let i = 0; i < deploy_hashes.length; i++) {
        let deploy_data = await GetDeploy(url, deploy_hashes[i]);
        data.push(deploy_data);
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block tx data");
    }
  },

  CountTransfers: async function (req, res) {
    GetTotalNumberOfTransfers().then(value => {
      if (value.length === 1) {
        res.json(value[0]);
      } else {
        res.json({});
      }
    }).catch(err => {
      res.send(err);
    })
  },

  GetLatestTx: async function (req, res) {
    try {
      const start = req.query.start;
      const count = req.query.count;
      let result = await GetTransfers(start, count);

      for (let i = 0; i < result.length; i++) {
        if (result[i].to_address === "null") {
          result[i].to_address = null;
        }
      }

      res.status(200);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not latest txs");
    }
  },

  GetBlocksByProposer: async function (req, res) {
    const validator = req.query.validator;
    const start = req.query.start;
    const count = req.query.count;

    try {
      const url = await GetNetWorkRPC();
      let data = await GetBlocksByValidator(validator, start, count);

      for (let i = 0; i < data.length; i++) {
        delete data[i]["parent_hash"];
        delete data[i]["state_root_hash"];
        delete data[i]["validator"];

        const deploys = await GetDeploysInBlock(url, data[i].height);
        const transfers = await GetTransfersInBlock(url, data[i].height);
        data[i]["deploys"] = deploys.deploy_hashes.length + deploys.transfer_hashes.length;
        data[i]["transfers"] = transfers.transfers.length;
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block proposer");
    }
  },

  GetStatus: async function (req, res) {
    try {
      const url = await GetNetWorkRPC();
      const status = await common.RequestRPC(url, RpcApiName.get_status, []);
      res.json(status).status(200);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get network status");
    }
  },

  GetNetworkRPC: async function (req, res) {
    try {
      const rpc = await common.GetNetWorkRPC();
      res.json(rpc);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get network rpc");
    }
  },

  GetBlockTime: async function (req, res) {
    try {
      const url = await GetNetWorkRPC();
      let current_height = 0;
      let current_timestamp = 0;
      {
        const params = [];
        const block_data = await RequestRPC(url, RpcApiName.get_block, params);
        current_height = block_data.result.block.header.height;
        current_timestamp = (new Date(block_data.result.block.header.timestamp)).getTime();

      }
      let last_timestamp = 0;
      {
        params = [{ "Height": Number(current_height) - 1}]
        const block_data = await RequestRPC(url, RpcApiName.get_block, params);
        last_timestamp = (new Date(block_data.result.block.header.timestamp)).getTime();
      }

      const block_time = current_timestamp - last_timestamp;

      res.status(200).json({
        "current_block": current_height,
        "next_block": Number(current_height) + 1,
        "block_time": block_time
      })

    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block time");
    }
  }
};
