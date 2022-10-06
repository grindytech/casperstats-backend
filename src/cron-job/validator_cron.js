const cron = require("node-cron");
const { getValidatorsCache } = require("../controllers/state_controller");
const { CRONJOB_TIME } = require("../utils/constant");

async function start() {
  // Get 10 validators
  cronJobGetValidators();
}

async function cronJobGetValidators() {
  cron.schedule(
    CRONJOB_TIME.EVERY_10_MINUTES_ON_25TH_SECOND,
    async function () {
      try {
        await getValidatorsCache(5);
      } catch (err) {
        console.log(err);
      }
    }
  );
}

module.exports = { start };
