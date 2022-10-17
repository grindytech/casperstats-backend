const { getBlockchainDataCache } = require("../controllers/info_controller");
const { TYPE_CHART } = require("../service/constant");

async function delegatorChart() {
  // Get data of auction info
  let delegators = await getBlockchainDataCache(TYPE_CHART.delegator);

  let chartOption = {
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
        data: delegators.reverse(),
      },
    ],
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Number of delegators",
      },
      labels: {
        align: "center",
      },
    },
  };

  return chartOption;
}

module.exports = { delegatorChart };
