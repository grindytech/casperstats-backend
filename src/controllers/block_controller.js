const { EventService, CasperServiceByJsonRPC } = require('casper-client-sdk');
const { exec } = require("child_process");

require('dotenv').config();

module.exports = {
  GetLatestBlock: function (req, res) {
    // console.log(process.env.NETWORK_RPC_API);

    // let service = new CasperServiceByJsonRPC(process.env.NETWORK_RPC_API);

    // service.getLatestBlockInfo().then(value => {
    //   console.log("Value: ", value);
    // }).catch(err => {
    //   console.log("Err: ", err);
    // })

    exec(`./casper-client get-block --node-address ${process.env.NETWORK_RPC_API}`, (error, stdout, stderr) => {
      if (error) {
        res.status(500);
        res.json(error);
        return;
      }
      if (stderr) {
        res.status(500);
        res.json(stderr);
        return;

      }
      res.status(200);
      res.json(JSON.parse(stdout));
    });
  }
};
