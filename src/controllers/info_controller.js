const { GetDeploy, GetType } = require('../utils/common');

const { RpcApiName, ELEMENT_TYPE } = require('../utils/constant');

require('dotenv').config();

module.exports = {
    GetDeploy: async function (req, res) {
        let hex = req.params.hex; // Hex-encoded deploy hash

        GetDeploy(hex).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.send(err)
        })
    },

    GetListDeploys: async function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

        let command = `${process.env.CASPER_CLIENT} list-deploys --node-address ${process.env.NETWORK_RPC_API}`;

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
            res.send(err)
        })
    },

    GetType: async function (req, res) {
        const param = req.params.param;
        try {
            const type = await GetType(param);
            res.status(200);
            res.json(type);
        }catch(err) {
            res.json({
                value: param,
                type: ELEMENT_TYPE.UNKNOWN,
            });
        }

    }
};
