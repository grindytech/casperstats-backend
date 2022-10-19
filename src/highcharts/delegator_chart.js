const { getBlockchainDataCache } = require("../controllers/info_controller");
const { chart_config, common_option } = require("../service/common");
const { TYPE_CHART } = require("../service/constant");

async function delegatorChart() {
  // Get data of auction info
  const delegators = await getBlockchainDataCache(TYPE_CHART.delegator);

  const config = {
    data: delegators,
    title: "Number of delegators",
  };

  const option = common_option(config);

  const chartOption = chart_config(option);

  return chartOption;
}

module.exports = { delegatorChart };
