const { getBlockchainDataCache } = require("../controllers/info_controller");
const { common_option, chart_config } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function priceChart() {
  // Get daily data of prices
  const data = await getBlockchainDataCache(TYPE_CHART.price);

  const config = {
    data: data,
    title: "CSPR to USD",
  };

  const option = common_option(config);

  const chartOption = chart_config(option);

  return chartOption;
}

module.exports = { priceChart };
