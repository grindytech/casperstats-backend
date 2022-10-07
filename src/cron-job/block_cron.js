const cron = require("node-cron");
const { getLatestBlocksCache } = require("../controllers/chain_controller");
const { CRONJOB_TIME } = require("../service/constant");

async function start() {
  // Get-20-latest-block
  cronJobGetLatestBlock(20);

  // Get-10-latest-block
  cronJobGetLatestBlock(15);
}

async function cronJobGetLatestBlock(num) {
  cron.schedule(CRONJOB_TIME.EVERY_4_SECONDS, async function () {
    try {
      await getLatestBlocksCache(num);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
