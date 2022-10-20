const { getBlockchainDataCache } = require("../controllers/info_controller");
const { chart_config } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function deployChart() {
  // Get data daily transfer volume and number of transfers
  const deploy = await getBlockchainDataCache(TYPE_CHART.deploy);
  const deploy_tx = await getBlockchainDataCache(TYPE_CHART.deploy_tx);

  const option = {
    series: [
      {
        type: "area",
        data: deploy_tx.reverse(),
      },
      {
        type: "column",
        data: deploy.reverse(),
        yAxis: 1,
      },
    ],
    yAxis: [
      {
        title: {
          text: "Number of deploys",
        },
        labels: {
          align: "center",
        },
        height: "80%",
        resize: {
          enabled: true,
        },
      },
      {
        title: {
          text: "Volume",
        },
        labels: {
          align: "center",
        },
        top: "85%",
        height: "15%",
        offset: 0,
      },
    ],
  };

  const chartOption = chart_config(option);

  return chartOption;
}

module.exports = { deployChart };
