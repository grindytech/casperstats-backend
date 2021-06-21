require('dotenv').config();
const path = require('path');
const fs = require('fs');

const { CasperClient, CasperServiceByJsonRPC} = require('casper-client-sdk');
const casperClient = new CasperClient(process.env.NETWORK_RPC_API);
const deployService = new CasperServiceByJsonRPC(process.env.NETWORK_RPC_API);

module.exports = {

    GetContract: async function (req, res) {

        try {
            const name = req.query.name;
            const contract_folder = path.join('./', 'contracts/release/');

            let contract_bytes;
            if (name == "delegate") {
                contract_bytes = fs.readFileSync(contract_folder + 'delegate.wasm');
            } else if (name == "undelegate") {
                contract_bytes = fs.readFileSync(contract_folder + 'undelegate.wasm');
            } else if (name == "transfer") {
                contract_bytes = fs.readFileSync(contract_folder + 'transfer_to_account.wasm');
            }
            res.status(200);
            res.send({ contract_bytes });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    },

    DeployContract: async function (req, res) {
        try {
            const message = req.body.message;
            console.log("message: ", message);
            const result = await deployService.deploy(message);
            console.log("result: ", result);
            res.status(200);
            res.send(result)
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

}
