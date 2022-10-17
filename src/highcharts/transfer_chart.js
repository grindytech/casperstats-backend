const { getBlockchainDataCache } = require("../controllers/info_controller");
const { TYPE_CHART } = require("../service/constant");

async function transferChart() {
  // Get data daily transfer volume and number of transfers
  let transfer = await getBlockchainDataCache(TYPE_CHART.transfer);
  let transfer_tx = await getBlockchainDataCache(TYPE_CHART.transfer_tx);

  let chartOption = {
    chart: {
      numberFormatter(v) {
        return numeral(v).format("0.[00] a");
      },
    },
    legend: {
      enabled: false,
    },
    title: {
      text: "",
    },
    colors: ["#B6B6B4"],
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1.3,
          },
          stops: [
            [0, "rgba(0, 0, 0, 0.2)"],
            [1, "rgba(255,255,255,0)"],
          ],
        },
      },
    },
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
    xAxis: {
      type: "datetime",
    },
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

  return chartOption;
}

module.exports = { transferChart };
