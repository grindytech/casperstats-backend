const {
  GetDeployhashes, GetDeploy, GetBlock,
  GetLatestTx } = require('../utils/chain');
const { RequestRPC, GetHeight } = require('../utils/common');
const { RpcApiName } = require('../utils/constant');
const { GetBlocksByProposer } = require('../utils/validator');

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

  GetTotalNumberTx: async function (req, res) {

  },

  GetLatestTx: async function (req, res) {
    try {
      const num = req.params.number;
      const result = await GetLatestTx(num);
      res.status(200);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  },

  GetBlocksByProposer: async function (req, res) {
    const validator = req.query.validator;
    const number_of_blocks = req.query.num;
    try {
      const data = await GetBlocksByProposer(validator, number_of_blocks);
      res.status(200);
      res.json(data);
    } catch (err) {
      res.send(err);
    }
  }


};
