const chartExporter = require("highcharts-export-server");
const { TYPE_CHART } = require("../service/constant");
const { delegatorChart } = require("./delegator_chart");
const { deployChart } = require("./deploy_chart");
const { marketCapChart } = require("./marketCap_chart");
const { priceChart } = require("./price_chart");
const { stakingChart } = require("./staking_chart");
const { totalSupplyChart } = require("./supplyGrowth_chart");
const { totalVolumeChart } = require("./totalVolume_chart");
const { transferChart } = require("./transfer_chart");
const { validatorChart } = require("./validator_chart");
require("dotenv").config();

// Get type of charts
const CHARTS = {};
CHARTS[TYPE_CHART.staking] = stakingChart;
CHARTS[TYPE_CHART.transfer] = transferChart;
CHARTS[TYPE_CHART.deploy] = deployChart;
CHARTS[TYPE_CHART.price] = priceChart;
CHARTS[TYPE_CHART.total_volume] = totalVolumeChart;
CHARTS[TYPE_CHART.market_cap] = marketCapChart;
CHARTS[TYPE_CHART.validator] = validatorChart;
CHARTS[TYPE_CHART.delegator] = delegatorChart;
CHARTS[TYPE_CHART.total_supply] = totalSupplyChart;
async function getTypeChart(type) {
  let result = {};
  result = await CHARTS[type]();
  return result;
}

async function generateChartsIntoImage(type) {
  let charOption = await getTypeChart(type);

  // Initialize the exporter
  chartExporter.initPool();

  // Export chart using these options
  await chartExporter.export(
    {
      type: "svg",
      options: charOption,
      outfile: process.env.CHART_ASSETS_URL + `${type}.svg`,
    },
    (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(
        `The chart has been succesfully generated at ${res.filename}!`
      );

      chartExporter.killPool();
    }
  );
}

module.exports = { generateChartsIntoImage };
