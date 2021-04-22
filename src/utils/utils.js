
const dotenv = require("dotenv");
dotenv.config();
const request = require('request');

const { exec } = require("child_process");

const Execute = async (command) => {
    return new Promise((resolve, reject) => {

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(JSON.parse(stdout));
        });
    })
}

const RequestRPC = async (id, method, params) => {

    return new Promise((resolve, reject) => {
        let options = {
            url: process.env.NETWORK_RPC_API + "/rpc",
            method: "post",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify({ "jsonrpc": "2.0", "id": id, "method": method, "params": params })
        };

        console.log("Option: ", options )

        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });

    })
}




module.exports = { Execute, RequestRPC }
