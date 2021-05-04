const { RequestRPC, Execute, GetLatestStateRootHash, QueryState} = require('../utils/utils');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

module.exports = {
   
    GetBalance: function (req, res) {

        let id = req.query.id;
        let s = req.query.s; //Hex-encoded hash of the state root
        let p = req.query.p; //The URef under which the purse is stored. This must be a properly formatted URef "uref-<HEX STRING>-<THREE DIGIT INTEGER>"

        let params = [s, p];

        RequestRPC(RpcApiName.get_balance, params, id).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    },

    GetBalanceV2: async function (req, res) {
        let address = req.params.address;

        let s = await GetLatestStateRootHash(); // get latest root hash
        let URef = await QueryState(address, s); // URef for address
        let main_purse = URef.result.stored_value.Account.main_purse;

        let params = [s, main_purse];

        RequestRPC(RpcApiName.get_balance, params).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err.message)
        })

    },

    QueryState: function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let s = req.query.s; // Hex-encoded hash of the state root

        let k = req.query.k;
        //key must be a formatted PublicKey or Key. This will take one of the following forms:
        //     01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
        // account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
        // hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
        // uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
        // transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
        // deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo

        QueryState(k, s, id).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err.message);
        })


    },
};
