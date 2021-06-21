const { GetBlocksByValidator } = require('../models/block_model');
const { GetTotalNumberOfTransfers, GetTransfers } = require('../models/transfer');
const {
  GetDeployhashes, GetDeploy, GetBlock,
  GetTransfersInBlock,
  GetDeploysInBlock } = require('../utils/chain');
const { RequestRPC, GetHeight } = require('../utils/common');
const { RpcApiName } = require('../utils/constant');
const request = require('request');

require('dotenv').config();

module.exports = {
  GetBlock: async function (req, res) {
    let b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    const height = await GetHeight();

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

    RequestRPC(RpcApiName.get_block, params).then(value => {
      value.result["current_height"] = height;
      res.status(200);
      res.json(value);

    }).catch(err => {
      res.send(err);
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

    RequestRPC(RpcApiName.get_block_transfers, params).then(value => {
      res.status(200);
      res.json(value.result.transfers);
    }).catch(err => {
      res.send(err);
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

    RequestRPC(RpcApiName.get_state_root_hash, params).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      res.send(err)
    })
  },

  GetLatestBlocks: async function (req, res) {
    let num = req.params.number; // Number of block

    try {
      let height = await GetHeight();
      let datas = [];
      for (let i = height; i > height - num; i--) {
        let block_data = await GetBlock(i);
        datas.push(block_data.result.block);
      }

      res.status(200);
      res.json(datas);

    } catch (err) {
      res.send(err)
    }
  },

  GetRangeBlock: async function (req, res) {
    let start = Number(req.query.start);
    let end = Number(req.query.end);

    try {
      let height = await GetHeight();
      let data = {};
      data["current_height"] = height;
      data["result"] = [];
      for (let i = end; i >= start; i--) {
        let block_data = await GetBlock(i);
        data.result.push(block_data.result.block);
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      res.send(err)
    }
  },

  GetBlockDeployTx: async function (req, res) {
    let b = req.params.block;
    try {
      let deploy_hashes = await GetDeployhashes(b);
      let data = [];
      for (let i = 0; i < deploy_hashes.length; i++) {
        let deploy_data = await GetDeploy(deploy_hashes[i]);
        data.push(deploy_data);
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      res.send(err)
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
      res.send(err);
    }
  },

  GetBlocksByProposer: async function (req, res) {
    const validator = req.query.validator;
    const start = req.query.start;
    const count = req.query.count;

    try {
      let data = await GetBlocksByValidator(validator, start, count);

      for (let i = 0; i < data.length; i++) {
        delete data[i]["parent_hash"];
        delete data[i]["state_root_hash"];
        delete data[i]["validator"];

        const deploys = await GetDeploysInBlock(data[i].height);
        const transfers = await GetTransfersInBlock(data[i].height);
        data[i]["deploys"] = deploys.deploy_hashes.length + deploys.transfer_hashes.length;
        data[i]["transfers"] = transfers.transfers.length;
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      res.send(err);
    }
  },

  GetStatus: async function (req, res) {
    try {
      let options = {
        url: process.env.STATUS_API + "/status",
        method: "get",
        headers:
        {
          "content-type": "application/json"
        }
      };
      request(options, (error, response, body) => {
        const result = JSON.parse(body);
        res.status(200);
        res.json(result);
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
};
