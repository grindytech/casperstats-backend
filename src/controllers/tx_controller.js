const { EventService, CasperServiceByJsonRPC } = require('casper-client-sdk');
const { exec } = require("child_process");
const { Execute } = require('../utils/utils');

require('dotenv').config();

module.exports = {

  // Retrieves all transfers for a block from the network
  GetBlockTx: function (req, res) {


    let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
    let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let command = `${process.env.CASPER_CLIENT} get-block-transfers --node-address ${process.env.NETWORK_RPC_API}`;

    if (id) {
      command = command + ` --id ${id}`;
    }

    if (b) {
      command = command + ` -b ${b}`;
    }

    Execute(command).then(value => {
      res.status(200);
      res.json(value);
    }).catch(err => {
      res.status(500);
      res.json(err)
    })
  }
};
