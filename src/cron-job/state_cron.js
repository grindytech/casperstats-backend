
const cron = require('node-cron');
const { GetBidsCache, GetCurrentEraValidatorsCache, GetNextEraValidatorsCache } = require('../controllers/state_controller');


async function start() {
    // Get validator
    CronJobGetBids();
    CronJobGetCurrentEra();
    CronJobGetNextEra();
}

async function CronJobGetBids(){
    cron.schedule('*/10 * * * *', async function() {
        try{
            await GetBidsCache();
            
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetCurrentEra(){
    cron.schedule('*/10 * * * *',async function() {
        try{
            await GetCurrentEraValidatorsCache();
            
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetNextEra(){
    cron.schedule('*/10 * * * *', async function() {
        try{
            await GetNextEraValidatorsCache();
            
        }catch (err) {
            console.log(err)
        }

    });
}

module.exports = { start }