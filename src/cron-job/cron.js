const cron = require('node-cron');
const router = require('express').Router();
const { GetEconomicsCache, GetStatsCache, GetVolumeCache, GetStakingVolumeCache, 
    GetStakingTxVolumeCache, GetExchangeVolumeCache} = require('../controllers/info_controller');
const state_controller = require('../controllers/state_controller');
require('dotenv').config();


async function start(){
    // Get validator
    // CronJobGetBids();
    // CronJobGetCurrentEra();
    // CronJobGetNextEra();

    // Get Stats
    CronJobGetStats();

    // Get Economics
    CronJobGetEconomics();

    // Get daily volume
    CronJobGetDailyVolume();

    // Get staking volume
    CronJobGetDelegateVolume();
    CronJobGetUndelegateVolume();
    CronJobGetDelegateTxVolume();
    CronJobGetUndelegateTxVolume();

    // Get exchange volume
    CronJobGetExchangeVolume();
}

async function CronJobGetBids(){
    cron.schedule(' * */2 * * *', function() {
        try{
            //router
            console.log("reset get-bids-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetCurrentEra(){
    cron.schedule('1 * */2 * * *', function() {
        try{
            state_controller.GetCurrentEraValidators;
            console.log("reset get-current-era-validator-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetNextEra(){
    cron.schedule('2 * */2 * * *', function() {
        try{
            state_controller.GetNextEraValidators;
            console.log("reset get-next-era-validator-cache successful")
        }catch (err) {
            console.log(err)
        }

    });
}

async function CronJobGetStats() {
    await GetStatsCache();
    cron.schedule('3 */5 * * * *', async function() {
        try{
            await GetStatsCache();
            console.log("Update get-stats-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetEconomics() {
    await GetEconomicsCache();
    cron.schedule('4 */3 * * * *', async function() {
        try{
            
            console.log("Update get-economics-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetDailyVolume() {
    cron.schedule('5 */10 * * * *', async function() {
        try{
            await GetVolumeCache(60);
            console.log("Update get-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetDelegateVolume() {
    cron.schedule('6 */10 * * * *', async function() {
        try{
            await GetStakingVolumeCache("delegate", 60);
            console.log("Update get-delegate-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetUndelegateVolume() {
    cron.schedule('7 */10 * * * *', async function() {
        try{
            await GetStakingVolumeCache("undelegate", 60);
            console.log("Update get-undelegate-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetDelegateTxVolume() {
    cron.schedule('6 */10 * * * *', async function() {
        try{
            await GetStakingTxVolumeCache("delegate", 60);
            console.log("Update get-delegate-tx-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetUndelegateTxVolume() {
    cron.schedule('7 */10 * * * *', async function() {
        try{
            await GetStakingTxVolumeCache("undelegate", 60);
            console.log("Update get-undelegate-tx-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetExchangeVolume() {
    cron.schedule('8 */10 * * * *', async function() {
        try{
            await GetExchangeVolumeCache(10);
            console.log("Update get-exchange-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

module.exports = {
    start
}