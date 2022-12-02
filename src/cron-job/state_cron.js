const cron = require("node-cron");
const {
  getBidsCache,
  getCurrentEraValidatorsCache,
  getNextEraValidatorsCache,
} = require("../controllers/state_controller");
const { CRONJOB_TIME } = require("../service/constant");

async function start() {
  // Get validator
  cronJobGetBids();
  cronJobGetCurrentEra();
  cronJobGetNextEra();
}

async function cronJobGetBids() {
  cron.schedule(CRONJOB_TIME.EVERY_10_MINUTES, async function () {
    try {
      await getBidsCache();
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetCurrentEra() {
  cron.schedule(CRONJOB_TIME.EVERY_10_MINUTES, async function () {
    try {
      await getCurrentEraValidatorsCache();
    } catch (err) {
      console.log(err);
    }
  });
}

async function cronJobGetNextEra() {
  cron.schedule(CRONJOB_TIME.EVERY_10_MINUTES, async function () {
    try {
      await getNextEraValidatorsCache(1, 10);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
