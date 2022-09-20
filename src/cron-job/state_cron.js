
const cron = require('node-cron');
const { GetBidsCache, GetCurrentEraValidatorsCache, GetNextEraValidatorsCache } = require('../controllers/state_controller');


async function start() {
    // Get validator
    CronJobGetBids();
    CronJobGetCurrentEra();
    CronJobGetNextEra();
}

async function CronJobGetBids(){
    cron.schedule('0 0 * * * *', async function() {
        try{
            await GetBidsCache();
            console.log("reset get-bids-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetCurrentEra(){
    cron.schedule('1 0 * * * *',async function() {
        try{
            await GetCurrentEraValidatorsCache();
            console.log("reset get-current-era-validator-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetNextEra(){
    cron.schedule('2 0 * * * *', async function() {
        try{
            await GetNextEraValidatorsCache();
            console.log("reset get-next-era-validator-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

module.exports = { start }