const { Execute, RequestRPC } = require('../utils/chain');
const { RpcApiName } = require('../utils/constant');
const { GetAccountData } = require('../utils/account');

require('dotenv').config();

module.exports = {

    GetAccount: async function (req, res) {
        let address = req.params.address;
        try{
          const account = await GetAccountData(address);
          res.json(account);

        }catch(err) {
          res.send(err);
        }
      },

};
