const cron = require("node-cron");
const { getLatestTxCache } = require("../controllers/chain_controller");
const { CRONJOB_TIME } = require("../service/constant");

async function start() {
  // Get 20 latest tx
  cronJobGetLatestTx();
}

async function cronJobGetLatestTx() {
  cron.schedule(CRONJOB_TIME.EVERY_20_SECONDS, async function () {
    try {
      await getLatestTxCache(0, 19);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
