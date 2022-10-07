require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { getNetWorkRPC } = require("../service/common");

const { CasperClient, CasperServiceByJsonRPC } = require("casper-client-sdk");

module.exports = {
  getContract: async function (req, res) {
    const rpc_url = await getNetWorkRPC();
    const casperClient = new CasperClient(rpc_url);
    const deployService = new CasperServiceByJsonRPC(rpc_url);
    try {
      const name = req.query.name;
      const contract_folder = path.join("./", "contracts/release/");

      let contract_bytes;
      if (name == "delegate") {
        contract_bytes = fs.readFileSync(contract_folder + "delegate.wasm");
      } else if (name == "undelegate") {
        contract_bytes = fs.readFileSync(contract_folder + "undelegate.wasm");
      } else if (name == "transfer_u512") {
        contract_bytes = fs.readFileSync(
          contract_folder + "transfer_to_account_u512.wasm"
        );
      }
      res.status(200);
      res.send({ contract_bytes });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
