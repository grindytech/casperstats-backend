const cron = require('node-cron');
const { GetValidatorsCache } = require('../controllers/state_controller');

async function start() {
    // Get 10 validators
    CronJobGetValidators();
}

async function CronJobGetValidators() {
    cron.schedule('15 0 * * * *', async function() {
        try{
            await GetValidatorsCache(10);
            console.log("Update get-validators successfull");
        } catch(err) {
            console.log(err)
        }
    })
}

module.exports = { start }