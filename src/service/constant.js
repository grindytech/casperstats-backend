const RpcApiName = {
  get_block: "chain_get_block",
  get_state_root_hash: "chain_get_state_root_hash",
  get_block_transfers: "chain_get_block_transfers",
  get_deploy: "info_get_deploy",
  get_balance: "state_get_balance",
  get_auction_info: "state_get_auction_info",
  get_era_info_by_switch_block: "chain_get_era_info_by_switch_block",
  get_status: "info_get_status",
};

const ELEMENT_TYPE = {
  PUBLIC_KEY_HEX: "PUBLIC_KEY_HEX", //account address
  PUBLIC_KEY_HASH: "PUBLIC_KEY_HASH",
  BLOCK_HEIGHT: "BLOCK_HEIGHT",
  BLOCK_HASH: "BLOCK_HASH",
  DEPLOY_HEX: "DEPLOY_HEX",
  TRANSFER_HEX: "TRANSFER_HEX",
  VALIDATOR: "VALIDATOR",
  UNKNOWN: "UNKNOWN",
};

const TYPE_CHART = {
  staking: "staking",
  staking_tx: "staking_tx",
  unstaking: "unstaking",
  unstaking_tx: "unstaking_tx",
  transfer: "transfer",
  transfer_tx: "transfer_tx",
  deploy: "deploy",
  deploy_tx: "deploy_tx",
  price: "price",
  total_volume: "total_volume",
  market_cap: "market_cap",
  bid: "bid",
  active_bid: "active_bid",
  validator: "validator",
  delegator: "delegator",
  total_supply: "total_supply",
};

const PROPERTY_TYPE = {
  body: "body",
  query: "query",
  params: "params",
};

const CRONJOB_TIME = {
  EVERY_4_SECONDS: "*/4 * * * * *",
  EVERY_20_SECONDS: "*/20 * * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_3_MINUTES_ON_3RD_SECOND: "3 */3 * * * *",
  EVERY_2_MINUTES_ON_4TH_SECOND: "4 */2 * * * *",
  EVERY_10_MINUTES_ON_3RD_SECOND: "3 */10 * * * *",
  EVERY_10_MINUTES_ON_25TH_SECOND: "25 */10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_20TH_SECOND: "20 10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_50TH_SECOND: "50 10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_9TH_SECOND: "9 10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_5TH_SECOND: "5 10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_6TH_SECOND: "6 10 * * * *",
  EVERY_1_HOUR_ON_10TH_MINUTE_7TH_SECOND: "7 10 * * * *",
  EVERY_1_HOUR_ON_15TH_MINUTE_8TH_SECOND: "8 15 * * * *",
  EVERY_1_HOUR_ON_15TH_MINUTE_10TH_SECOND: "10 15 * * * *",
  EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND: "15 20 * * * *",
  EVERY_1_HOUR_ON_20TH_MINUTE_17TH_SECOND: "17 20 * * * *",
  AT_0_OCLOCK_EVERYDAY: "0 0 0 * * *",
  AT_0_OCLOCK_IN_THE_1ST_SECOND_EVERYDAY: "1 0 0 * * *",
  AT_0_OCLOCK_IN_THE_2ND_SECOND_EVERYDAY: "2 0 0 * * *",
  AT_0_OCLOCK_IN_THE_3RD_SECOND_EVERYDAY: "3 0 0 * * *",
  AT_0_OCLOCK_IN_THE_4TH_SECOND_EVERYDAY: "4 0 0 * * *",
  AT_0_OCLOCK_IN_THE_5TH_SECOND_EVERYDAY: "5 0 0 * * *",
  AT_0_OCLOCK_IN_THE_6TH_SECOND_EVERYDAY: "6 0 0 * * *",
  AT_0_OCLOCK_IN_THE_7TH_SECOND_EVERYDAY: "7 0 0 * * *",
  AT_0_OCLOCK_IN_THE_8TH_SECOND_EVERYDAY: "8 0 0 * * *",
};

module.exports = {
  RpcApiName,
  ELEMENT_TYPE,
  CRONJOB_TIME,
  TYPE_CHART,
  PROPERTY_TYPE,
};
