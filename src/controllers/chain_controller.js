const { RequestRPC, GetHeight, GetTxhashes, GetDeployhashes, GetDeploy, DoesDeploySuccess, GetTransfersFromDeploy, GetTransferDetail } = require('../utils/utils');
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
      // add current_height to getblock
      const height = await GetHeight();
      block_data.result["current_height"] = height;
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
      res.json(value.result);
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

  GetLatestBlocks: async function (req, res) {
    let num = req.query.num; // Number of block

    try {
      let height = await GetHeight();
      let datas = [];
      for (let i = height; i > height - num; i--) {
        let params = [{ "Height": parseInt(i) }];

        let block_data = await RequestRPC(RpcApiName.get_block, params);
        datas.push(block_data.result.block);
      }

      res.status(200);
      res.json(datas);

    } catch (err) {
      res.status(500);
      res.json(err);
    }
  },

  GetRangeBlock: async function (req, res) {
    let start = req.query.start;
    let end = req.query.end;

    try {
      let height = await GetHeight();
      let data = {};
      data["current_height"] = height;
      data["result"] = [];
      for (let i = start; i <= end; i++) {
        let params = [{ "Height": parseInt(i) }];
        let block_data = await RequestRPC(RpcApiName.get_block, params);
        data.result.push(block_data.result.block);
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  },

  GetBlockTransferTx: async function (req, res) {
    let b = req.params.block;
    try {
      let txhashes = await GetTxhashes(b);
      let data = [];
      for (let i = 0; i < txhashes.length; i++) {
          let pass = await DoesDeploySuccess(txhashes[i]);
          if(pass) {
            let transfers = await GetTransfersFromDeploy("deploy-" + txhashes[i]);
            for ( let j =0; j<transfers.length; j++ ) {
              let transfer_detail = await GetTransferDetail(transfers[j]);
              data.push(transfer_detail);
            }
          } else {
            let deploy_detail = await GetDeploy(txhashes[i]);
            data.push(deploy_detail);
          }
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      res.status(500);
      res.json(err);
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
      res.status(500);
      res.json(err);
    }
  }
};
