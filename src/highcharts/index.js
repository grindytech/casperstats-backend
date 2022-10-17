const chartExporter = require("highcharts-export-server");
const { TYPE_CHART } = require("../service/constant");
const { delegatorChart } = require("./delegator_chart");
const { deployChart } = require("./deploy_chart");
const { marketCapChart } = require("./marketCap_chart");
const { priceChart } = require("./price_chart");
const { stakingChart } = require("./staking_chart");
const { totalVolumeChart } = require("./totalVolume_chart");
const { transferChart } = require("./transfer_chart");
const { validatorChart } = require("./validator_chart");
require("dotenv").config();

async function generateChartsIntoImage(type) {
  let charOption;

  if (type === TYPE_CHART.staking) {
    charOption = await stakingChart();
  }
  if (type === TYPE_CHART.transfer) {
    charOption = await transferChart();
  }
  if (type === TYPE_CHART.deploy) {
    charOption = await deployChart();
  }
  if (type === TYPE_CHART.price) {
    charOption = await priceChart();
  }
  if (type === TYPE_CHART.total_volume) {
    charOption = await totalVolumeChart();
  }
  if (type === TYPE_CHART.market_cap) {
    charOption = await marketCapChart();
  }
  if (type === TYPE_CHART.validator) {
    charOption = await validatorChart();
  }
  if (type === TYPE_CHART.delegator) {
    charOption = await delegatorChart();
  }

  // Initialize the exporter
  chartExporter.initPool();

  // Export chart using these options
  chartExporter.export(
    {
      type: "svg",
      options: charOption,
      outfile: process.env.CHART_ASSETS_URL + `${type}.svg`,
    },
    (err, res) => {
      console.log(
        `The chart has been succesfully generated at ${res.filename}!`
      );

      chartExporter.killPool();
    }
  );
}

module.exports = { generateChartsIntoImage };
