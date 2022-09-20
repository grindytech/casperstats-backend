const cron = require('node-cron');
const { GetLatestTxCache } = require('../controllers/chain_controller');

async function start() {
    // Get 20 latest tx
    CronJobGetLatestTx();
}

async function CronJobGetLatestTx() {
    cron.schedule('*/20 * * * * *', async function() {
        try{
            await GetLatestTxCache(0, 19);
            console.log("Update get-latest-tx-cache successful");
        }catch (err) {
            console.log(err);
        }
    })
}

module.exports={ start }