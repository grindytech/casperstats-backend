const cron = require("node-cron");
const {
  getLatestBlocksCache,
  getRangeBLocksCache,
} = require("../controllers/chain_controller");
const { CRONJOB_TIME } = require("../service/constant");

async function start() {
  // Get range block for page 1
  cronJobGetRangeBlock(1, 20);

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

async function cronJobGetRangeBlock(page, size) {
  cron.schedule(CRONJOB_TIME.EVERY_4_SECONDS, async function () {
    try {
      await getRangeBLocksCache(page, size);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
