const cron = require("node-cron");
const { GetValidatorsCache } = require("../controllers/state_controller");

async function start() {
  // Get 10 validators
  CronJobGetValidators();
}

async function CronJobGetValidators() {
  cron.schedule("15 */10 * * * *", async function () {
    try {
      await GetValidatorsCache(5);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { start };
