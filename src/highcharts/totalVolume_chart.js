const { getBlockchainDataCache } = require("../controllers/info_controller");

async function totalVolumeChart() {
  // Get daily data of prices
  const data = await getBlockchainDataCache("total_volume");

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
        text: "Total volumes",
      },
    },
  };

  return chartOption;
}

module.exports = { totalVolumeChart };
