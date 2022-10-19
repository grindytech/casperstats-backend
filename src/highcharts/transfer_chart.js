const { getBlockchainDataCache } = require("../controllers/info_controller");
const { chart_config } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function transferChart() {
  // Get data daily transfer volume and number of transfers
  const transfer = await getBlockchainDataCache(TYPE_CHART.transfer);
  const transfer_tx = await getBlockchainDataCache(TYPE_CHART.transfer_tx);

  const option = {
    series: [
      {
        type: "area",
        data: transfer_tx.reverse(),
      },
      {
        type: "column",
        data: transfer.reverse(),
        yAxis: 1,
      },
    ],
    yAxis: [
      {
        title: {
          text: "Number of transfers",
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

module.exports = { transferChart };
