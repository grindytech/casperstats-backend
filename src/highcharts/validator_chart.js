const { getBlockchainDataCache } = require("../controllers/info_controller");
const { TYPE_CHART } = require("../service/constant");

async function validatorChart() {
  // Get data of auction info
  let bids = await getBlockchainDataCache(TYPE_CHART.bid);
  let active_bids = await getBlockchainDataCache(TYPE_CHART.active_bid);
  let validators = await getBlockchainDataCache(TYPE_CHART.validator);

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
        data: bids.reverse(),
      },
      {
        data: active_bids.reverse(),
      },
      {
        data: validators.reverse(),
      },
    ],
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        align: "center",
      },
    },
  };

  return chartOption;
}

module.exports = { validatorChart };
