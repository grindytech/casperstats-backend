const chartExporter = require("highcharts-export-server");
const { deployChart } = require("./deploy_chart");
const { priceChart } = require("./price_chart");
const { stakingChart } = require("./staking_chart");
const { transferChart } = require("./transfer_chart");
require("dotenv").config();

async function generateChartsIntoImage(type) {
  let charOption;

  if (type === "staking") {
    charOption = await stakingChart();
  }
  if (type === "transfer") {
    charOption = await transferChart();
  }
  if (type === "deploy") {
    charOption = await deployChart();
  }
  if (type === "price") {
    charOption = await priceChart();
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
