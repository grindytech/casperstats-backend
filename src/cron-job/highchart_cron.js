const cron = require("node-cron");
const { CRONJOB_TIME, TYPE_CHART } = require("../service/constant");
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

  // Generate daily auction info chart
  cronJobValidatorChart();

  // Generate daily delegator chart
  cronJobDelegatorChart();
}

async function cronJobStakingChart() {
  cron.schedule(CRONJOB_TIME.AT_0_OCLOCK_EVERYDAY, async function () {
    await highcharts.generateChartsIntoImage(TYPE_CHART.staking);
    console.log("generate daily staking chart successfully");
  });
}

async function cronJobTransferChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_1ST_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.transfer);
      console.log("generate daily transfer chart successfully");
    }
  );
}

async function cronJobDeployChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_2ND_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.deploy);
      console.log("generate daily deploys chart successfully");
    }
  );
}

async function cronJobPriceChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_3RD_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.price);
      console.log("generate daily prices chart successfully");
    }
  );
}

async function cronJobTotalVolumeChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_4TH_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.total_volume);
      console.log("generate daily total volume chart successfully");
    }
  );
}

async function cronJobMarketCapChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_5TH_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.market_cap);
      console.log("generate daily market caps chart successfully");
    }
  );
}

async function cronJobValidatorChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_6TH_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.validator);
      console.log("generate daily validators chart successfully");
    }
  );
}

async function cronJobDelegatorChart() {
  cron.schedule(
    CRONJOB_TIME.AT_0_OCLOCK_IN_THE_7TH_SECOND_EVERYDAY,
    async function () {
      await highcharts.generateChartsIntoImage(TYPE_CHART.delegator);
      console.log("generate daily validators chart successfully");
    }
  );
}

module.exports = { start };
