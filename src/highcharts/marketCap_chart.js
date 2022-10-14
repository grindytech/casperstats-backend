const { getBlockchainDataCache } = require("../controllers/info_controller");

async function marketCapChart() {
  // Get daily data of prices
  const data = await getBlockchainDataCache("market_cap");

  let chartOption = {
    title: {
      text: "",
    },
    series: [
      {
        data: data.reverse(),
      },
    ],
    legend: {
      enabled: false,
    },
    colors: ["#B6B6B4"],
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Market caps",
      },
    },
  };

  return chartOption;
}

module.exports = { marketCapChart };
