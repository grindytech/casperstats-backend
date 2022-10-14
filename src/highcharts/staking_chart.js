const { getBlockchainDataCache } = require("../controllers/info_controller");

async function stakingChart() {
  // Get transfer volume
  let staking = await getBlockchainDataCache("staking");
  let staking_tx = await getBlockchainDataCache("staking_tx");
  let unstaking = await getBlockchainDataCache("unstaking");
  let unstaking_tx = await getBlockchainDataCache("unstaking_tx");

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
    series: [
      {
        data: staking_tx.reverse(),
      },
      {
        type: "column",
        data: staking.reverse(),
        yAxis: 1,
      },
      {
        data: unstaking_tx.reverse(),
      },
      {
        type: "column",
        data: unstaking.reverse(),
        yAxis: 1,
      },
    ],
    xAxis: {
      type: "datetime",
    },
    yAxis: [
      {
        title: false,
        labels: {
          align: "center",
        },
        height: "80%",
        resize: {
          enabled: true,
        },
      },
      {
        title: false,
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

module.exports = {
  stakingChart,
};
