const { EventService, CasperServiceByJsonRPC } = require('casper-client-sdk');
const { exec } = require("child_process");
const { RequestRPC } = require('../utils/utils');

const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

module.exports = {

  // Retrieves all transfers for a block from the network
  GetBlockTx: function (req, res) {


    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ "Hash": b }]
    } else {
      params = [{ "Height": b }]
    }

    RequestRPC(id, RpcApiName.get_block_transfers, params).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      res.status(500);
      res.json(err)
    })
  }
};
