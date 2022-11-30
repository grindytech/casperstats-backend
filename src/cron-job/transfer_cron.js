const cron = require("node-cron");
const { getRangeTxCache } = require("../controllers/chain_controller");
const { CRONJOB_TIME } = require("../service/constant");

async function start() {
  // Get range tx for page 1
  cronJobGetRangeTx();
}

async function cronJobGetRangeTx() {
  cron.schedule(CRONJOB_TIME.EVERY_20_SECONDS, async function () {
    try {
      await getRangeTxCache(1, 20);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
