const cron = require('node-cron');
const { GetLatestBlocksCache } = require('../controllers/chain_controller');

async function start() {
    // Get-20-latest-block
    CronJobGetLatestBlock(20);

    // Get-10-latest-block
    CronJobGetLatestBlock(10);
}

async function CronJobGetLatestBlock(num) {
    cron.schedule('*/15 * * * * *', async function() {
        try{
            await GetLatestBlocksCache(num);
            console.log("Update get-latest-block successfull");
        }catch (err) {
            console.log(err);
        }
    })
}

module.exports = {start}