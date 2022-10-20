const { getBlockchainDataCache } = require("../controllers/info_controller");
const { chart_config } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function stakingChart() {
  // Get transfer volume
  const staking = await getBlockchainDataCache(TYPE_CHART.staking);
  const staking_tx = await getBlockchainDataCache(TYPE_CHART.staking_tx);
  const unstaking = await getBlockchainDataCache(TYPE_CHART.unstaking);
  const unstaking_tx = await getBlockchainDataCache(TYPE_CHART.unstaking_tx);

  const option = {
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

  const chartOption = chart_config(option);

  return chartOption;
}

module.exports = {
  stakingChart,
};
