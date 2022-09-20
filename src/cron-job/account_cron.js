const cron = require('node-cron');
const { GetRangeRichestCache } = require('../controllers/account_controller');
const { GetRichestCache } = require('../utils/account');

async function start() {
    // Get richest list
    CronJobGetRichest();
    CronJobGetRangeRichest();
}

async function CronJobGetRichest() {
    cron.schedule('9 */10 * * * *', async function() {
        try{
            await GetRichestCache();
            console.log("Update get-richest-list-cache successful");
        }catch(err) {
            console.log(err);
        }
    })
}

async function CronJobGetRangeRichest() {
    cron.schedule('10 */11 * * * *', async function() {
        try{
            await GetRangeRichestCache(0,20);
            console.log("Update get-range-richest-list-cache successful")
        }catch(err) {
            console.log(err)
        }
    })
}

module.exports = { start }