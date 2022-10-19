const { getBlockchainDataCache } = require("../controllers/info_controller");
const { chart_config } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function validatorChart() {
  // Get data of auction info
  const bids = await getBlockchainDataCache(TYPE_CHART.bid);
  const active_bids = await getBlockchainDataCache(TYPE_CHART.active_bid);
  const validators = await getBlockchainDataCache(TYPE_CHART.validator);

  const option = {
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
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        align: "center",
      },
    },
  };

  const chartOption = chart_config(option);

  return chartOption;
}

module.exports = { validatorChart };
