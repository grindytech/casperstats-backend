const { getBlockchainDataCache } = require("../controllers/info_controller");

async function priceChart() {
  // Get daily data of prices
  const data = await getBlockchainDataCache("price");

  let chartOption = {
    title: {
      text: "",
    },
    series: [
      {
        type: "area",
        data: data.reverse(),
      },
    ],
    legend: {
      enabled: false,
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
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "CSPR to USD",
      },
    },
  };

  return chartOption;
}

module.exports = { priceChart };
