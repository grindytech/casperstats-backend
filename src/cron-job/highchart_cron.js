const cron = require("node-cron");
const { CRONJOB_TIME } = require("../service/constant");
const highcharts = require("../highcharts");

async function start() {
  // Generate daily stakings chart
  cronJobStakingChart();

  // Generate daily transfers chart
  cronJobTransferChart();

  // Generate daliy deploys chart
  cronJobDeployChart();

  // Generate daily prices chart
  cronJobPriceChart();

  // Generate daily total volumes chart
  cronJobTotalVolumeChart();

  // Generate daily market caps chart
  cronJobMarketCapChart();
}

async function cronJobStakingChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_5TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("staking");
      console.log("generate daily staking chart successfully");
    }
  );
}

async function cronJobTransferChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_6TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("transfer");
      console.log("generate daily transfer chart successfully");
    }
  );
}

async function cronJobDeployChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_9TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("deploy");
      console.log("generate daily deploys chart successfully");
    }
  );
}

async function cronJobPriceChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_7TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("price");
      console.log("generate daily prices chart successfully");
    }
  );
}

async function cronJobTotalVolumeChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_10TH_MINUTE_8TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("total_volume");
      console.log("generate daily total volume chart successfully");
    }
  );
}

async function cronJobMarketCapChart() {
  cron.schedule(
    CRONJOB_TIME.EVERY_1_HOUR_ON_15TH_MINUTE_10TH_SECOND,
    async function () {
      await highcharts.generateChartsIntoImage("market_cap");
      console.log("generate daily market caps chart successfully");
    }
  );
}

module.exports = { start };
