const cron = require("node-cron");
const {
  getEconomicsCache,
  getStatsCache,
  GetExchangeVolumeCache,
  getTotalRewardCache,
  getBlockchainDataCache,
} = require("../controllers/info_controller");
const { CRONJOB_TIME } = require("../utils/constant");

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

  // Get auction info
  cronJobGetTotalBid();
  cronJobGetActiveBid();
  cronJobGetTotalValidator();
  cronJobGetTotalDelegator();

  // Get daily total rewards chart
  cronJobGetDailyTotalReward();
}

async function cronJobGetStats() {
  await getStatsCache();
  cron.schedule(CRONJOB_TIME.EVERY_3_MINUTES_ON_3RD_SECOND, async function () {
    try {
      await getStatsCache();
      console.log("Update get-stats-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetTotalReward() {
  cron.schedule(CRONJOB_TIME.EVERY_10_MINUTES_ON_3RD_SECOND, async function () {
    try {
      await getTotalRewardCache();
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetEconomics() {
  await getEconomicsCache();
  cron.schedule(CRONJOB_TIME.EVERY_2_MINUTES_ON_4TH_SECOND, async function () {
    try {
      await getEconomicsCache();
      console.log("Update get-economics-cache successfull");
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetDeployVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_9TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("deploy");
        console.log("Update get-deploy-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetDeployTxs() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_9TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("deploy_tx");
        console.log("Update get-deploy-tx-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetTransferVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_5TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("transfer");
        console.log("Update get-transfer-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetTransferTxs() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_5TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("transfer_tx");
        console.log("Update get-transfer-tx-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetStakingVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_6TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("staking");
        console.log("Update get-staking-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetUnstakingVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_7TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("unstaking");
        console.log("Update get-unstaking-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetStakingTxVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_6TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("staking_tx");
        console.log("Update get-staking-tx-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetUnstakingTxVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_7TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("unstaking_tx");
        console.log("Update get-unstaking-tx-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetExchangeVolume() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_15TH_MINUTE_8TH_SECOND,
    async function () {
      try {
        await GetExchangeVolumeCache(10);
        console.log("Update get-exchange-volume-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetTotalBid() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("bid");
        console.log("Update get-total-bid-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetActiveBid() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("active_bid");
        console.log("Update get-total-active-bid-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetTotalValidator() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("validator");
        console.log("Update get-total-validator-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetTotalDelegator() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("delegator");
        console.log("Update get-total-delegator-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetDailyTotalReward() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_20TH_MINUTE_17TH_SECOND,
    async function () {
      try {
        await getBlockchainDataCache("reward");
        console.log("Update get-daily-total-rewards-cache successfull");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

module.exports = { start };
