const { Execute, RequestRPC } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData } = require('../utils/account');

require('dotenv').config();

module.exports = {

    GetAccount: async function (req, res) {

        // address or account hash
        let address = req.params.address;
        try{
          const account = await GetAccountData(address);
          res.json(account);

        }catch(err) {
          console.log(err);
          res.send(err);
        }
      },
};
