const { RequestRPC, GetTransactionInBlock } = require('../utils/utils');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

module.exports = {
  GetBlock: async function (req, res) {

    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;

    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ "Hash": b }]
    } else {
      params = [{ "Height": parseInt(b) }]
    }

    try {
      let block_data = await RequestRPC(RpcApiName.get_block, params, id);

      // let txs = block_data.result.block.body.transfer_hashes;
      // console.log("block_data: ", txs);
      res.status(200);
      res.json(block_data);

    } catch (err) {
      res.status(500);
      res.json(err);
    }
  },

  GetBlockTx: function (req, res) {
    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;
    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ "Hash": b }]
    } else {
      params = [{ "Height": parseInt(b) }]
    }

    RequestRPC(RpcApiName.get_block_transfers, params, id).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      res.status(500);
      res.json(err)
    })
  },

  GetStateRootHash: function (req, res) {
    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

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
      res.status(500);
      res.json(err)
    })
  },

  GetLatestBlock: async function (req, res) {
    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned

    let params = [{}];

    try {
      let block_data = await RequestRPC(RpcApiName.get_block, params, id);

      // let txs = block_data.result.block.body.transfer_hashes;
      // console.log("block_data: ", txs);
      res.status(200);
      res.json(block_data);

    } catch (err) {
      res.status(500);
      res.json(err);
    }
  },

  GetTxBlock: async function (req, res) {
    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used


    try {
      
      let value = await GetTransactionInBlock(b, id);

      res.status(200);
      res.json(value);

    } catch (err) {
      res.status(500);
      res.json(err);
    }
  }
};
