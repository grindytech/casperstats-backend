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
  EVERY_1_HOUR_ON_20TH_MINUTE_15TH_SECOND: "15 20 * * * *",
  EVERY_1_HOUR_ON_20TH_MINUTE_17TH_SECOND: "17 20 * * * *",
};

module.exports = { RpcApiName, ELEMENT_TYPE, CRONJOB_TIME };
