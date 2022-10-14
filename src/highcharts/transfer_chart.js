const { getBlockchainDataCache } = require("../controllers/info_controller");

async function transferChart() {
  // Get data daily transfer volume and number of transfers
  let transfer = await getBlockchainDataCache("transfer");
  let transfer_tx = await getBlockchainDataCache("transfer_tx");

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
        data: transfer_tx.reverse(),
        name: "Transfer TXs",
      },
      {
        type: "column",
        name: "Transfer Volumes CSPR",
        data: transfer.reverse(),
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

module.exports = { transferChart };
