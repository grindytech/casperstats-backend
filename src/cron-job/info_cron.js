const cron = require('node-cron');
const { GetEconomicsCache, GetStatsCache, GetStakingVolumeCache, 
    GetStakingTxCache, GetExchangeVolumeCache, GetTotalRewardCache,
    GetTransferVolumeCache, GetTransferTxsCache} = require('../controllers/info_controller');

async function start() {
    // Get Stats
    CronJobGetStats();

    // Get Total Reward
    CronJobGetTotalReward();

    // Get Economics
    CronJobGetEconomics();

    // Get daily volume chart
    // CronJobGetTransferVolume();
    // CronJobGetTransferTxs();

    // Get staking volume chart
    // CronJobGetDelegateVolume();
    // CronJobGetUndelegateVolume();
    // CronJobGetDelegateTxVolume();
    // CronJobGetUndelegateTxVolume();

    // Get exchange volume
    CronJobGetExchangeVolume();
}

async function CronJobGetStats() {
    await GetStatsCache();
    cron.schedule('3 */3 * * * *', async function() {
        try{
            await GetStatsCache();
            console.log("Update get-stats-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetTotalReward() {
    cron.schedule('3 */10 * * * *', async function() {
        try{
            await GetTotalRewardCache();
        }catch (err) {
            console.log(err);
        }
    })
}

async function CronJobGetEconomics() {
    await GetEconomicsCache();
    cron.schedule('4 */2 * * * *', async function() {
        try{
            await GetEconomicsCache();
            console.log("Update get-economics-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetTransferVolume() {
    cron.schedule('5 10 * * * *', async function() {
        try{
            await GetTransferVolumeCache();
            console.log("Update get-transfer-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetTransferTxs() {
    cron.schedule('5 10 * * * *', async function() {
        try{
            await GetTransferTxsCache();
            console.log("Update get-transfer-tx-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetDelegateVolume() {
    cron.schedule('6 11 * * * *', async function() {
        try{
            await GetStakingVolumeCache("delegate");
            console.log("Update get-delegate-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetUndelegateVolume() {
    cron.schedule('7 11 * * * *', async function() {
        try{
            await GetStakingVolumeCache("undelegate");
            console.log("Update get-undelegate-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetDelegateTxVolume() {
    cron.schedule('6 11 * * * *', async function() {
        try{
            await GetStakingTxCache("delegate");
            console.log("Update get-delegate-tx-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetUndelegateTxVolume() {
    cron.schedule('7 11 * * * *', async function() {
        try{
            await GetStakingTxCache("undelegate");
            console.log("Update get-undelegate-tx-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

async function CronJobGetExchangeVolume() {
    cron.schedule('8 10 * * * *', async function() {
        try{
            await GetExchangeVolumeCache(10);
            console.log("Update get-exchange-volume-cache successfull");
        }catch (err){
            console.log(err);
        }
    })
}

module.exports = { start }