const cron = require("node-cron");
const { getRangeRichestCache } = require("../controllers/account_controller");
const { getRichestCache } = require("../utils/account");
const { CRONJOB_TIME } = require("../utils/constant");

async function start() {
  // Get richest list
  cronJobGetRichest();
  cronJobGetRangeRichest();
}

async function cronJobGetRichest() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_20TH_SECOND,
    async function () {
      try {
        await getRichestCache();
        console.log("Update get-richest-list-cache successful");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

async function cronJobGetRangeRichest() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_50TH_SECOND,
    async function () {
      try {
        await getRangeRichestCache(0, 20);
        console.log("Update get-range-richest-list-cache successful");
      } catch (err) {
        console.log(err);
      }
    }
  );
}

module.exports = { start };
