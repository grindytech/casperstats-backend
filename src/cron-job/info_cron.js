const cron = require("node-cron");
const {
  GetEconomicsCache,
  GetStatsCache,
  GetExchangeVolumeCache,
  GetTotalRewardCache,
  GetBlockchainDataCache,
} = require("../controllers/info_controller");

async function start() {
  // Get Stats
  cronJobGetStats();

  // Get Total Reward
  cronJobGetTotalReward();

  // Get Economics
  cronJobGetEconomics();

  // Get daily deploy volume chart
  cronJobGetDeployVolume();
  cronJobGetDeployTxs();

  // Get daily transfer volume chart
  cronJobGetTransferVolume();
  cronJobGetTransferTxs();

  // Get daily staking volume chart
  cronJobGetStakingVolume();
  cronJobGetUnstakingVolume();
  cronJobGetStakingTxVolume();
  cronJobGetUnstakingTxVolume();

  // Get exchange volume
  cronJobGetExchangeVolume();
}

async function cronJobGetStats() {
  await GetStatsCache();
  cron.schedule("3 */3 * * * *", async function () {
    try {
      await GetStatsCache();
      console.log("Update get-stats-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetTotalReward() {
  cron.schedule("3 */10 * * * *", async function () {
    try {
      await GetTotalRewardCache();
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetEconomics() {
  await GetEconomicsCache();
  cron.schedule("4 */2 * * * *", async function () {
    try {
      await GetEconomicsCache();
      console.log("Update get-economics-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetDeployVolume() {
  cron.schedule("9 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("deploy");
      console.log("Update get-deploy-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetDeployTxs() {
  cron.schedule("9 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("deploy_tx");
      console.log("Update get-deploy-tx-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetTransferVolume() {
  cron.schedule("5 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("transfer");
      console.log("Update get-transfer-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetTransferTxs() {
  cron.schedule("5 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("transfer_tx");
      console.log("Update get-transfer-tx-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetStakingVolume() {
  cron.schedule("6 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("staking");
      console.log("Update get-staking-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetUnstakingVolume() {
  cron.schedule("7 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("unstaking");
      console.log("Update get-unstaking-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetStakingTxVolume() {
  cron.schedule("6 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("staking_tx");
      console.log("Update get-staking-tx-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetUnstakingTxVolume() {
  cron.schedule("7 10 * * * *", async function () {
    try {
      await GetBlockchainDataCache("unstaking_tx");
      console.log("Update get-unstaking-tx-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetExchangeVolume() {
  cron.schedule("8 10 * * * *", async function () {
    try {
      await GetExchangeVolumeCache(10);
      console.log("Update get-exchange-volume-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
