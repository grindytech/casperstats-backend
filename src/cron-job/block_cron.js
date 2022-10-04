const cron = require('node-cron');
const { GetLatestBlocksCache } = require('../controllers/chain_controller');

async function start() {
    // Get-20-latest-block
    CronJobGetLatestBlock(20);

    // Get-10-latest-block
    CronJobGetLatestBlock(15);
}

async function CronJobGetLatestBlock(num) {
    cron.schedule('*/4 * * * * *', async function() {
        try{
            await GetLatestBlocksCache(num);
        }catch (err) {
            console.log(err);
        }
    })
}

module.exports = {start}