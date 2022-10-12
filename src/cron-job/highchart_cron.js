const cron = require("node-cron");
const { CRONJOB_TIME } = require("../service/constant");
const highcharts = require("../highcharts");

async function start() {
  // Generate daily staking chart
  cronJobStakingChart();

  // Generate daily transfer chart
  cronJobTransferChart();
}

async function cronJobStakingChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_20TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("staking");
      console.log("generate daily staking chart successfully");
    }
  );
}

async function cronJobTransferChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_20TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("transfer");
      console.log("generate daily transfer chart successfully");
    }
  );
}

module.exports = { start };