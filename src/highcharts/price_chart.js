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
        data: data.reverse(),
        name: "CSPR to USD",
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
        text: "CSPR to USD",
      },
    },
  };

  return chartOption;
}

module.exports = { priceChart };
