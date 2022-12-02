const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require("./constant");
const {
  requestRPC,
  pagination,
  checkNextAndPreviousPage,
} = require("./common");
const math = require("mathjs");
const { getLatestEra, getTotalRewardByEra } = require("../models/era");
const {
  getValidator,
  getCurrentEraValidator,
  getRangeNextEraValidator,
  getNextEraValidator,
  getTotalStakeNextEra,
  getTotalStakeCurrentEra,
  getAllValidator,
  getTotalBids,
  getTotalActiveValidator,
  getRangeBidsWithSort,
  getValidatorInfo,
  getTotalNextEraValidators,
} = require("../models/validator");
const { getDelegatorsOfValidator } = require("../models/delegator");
const { getStats } = require("../models/stats");

/**
 * Returns x raised to the n-th power.
 *
 * @param {number} auction_state The object result from get-auction-info.
 * @param {number} era_index The era index of era_validators, it's only 0 or 1 with 0 is the current ear and 1 is the next era.
 * @return {Array} result return top 10 validators by height and also add more information to them.
 */
async function getTopValidators(number_of_validator) {
  let validators = await getNextEraValidator();
  let top_validators = [];

  top_validators = validators.slice(0, number_of_validator);
  for (let i = 0; i < top_validators.length; i++) {
    top_validators[i].dataValues.information = await getValidatorInformation(
      top_validators[i].dataValues.public_key_hex
    );
  }
  const result = {
    validators: top_validators,
  };

  return result;
}

async function getTotalStake(auction_state, era_index) {
  let total_stake = 0;
  const current_era = auction_state.era_validators[era_index].validator_weights;
  for (let i = 0; i < current_era.length; i++) {
    let stake = current_era[i].weight;
    total_stake += Number(stake);
  }
  return total_stake;
}

const getValidators = async (number_of_validator) => {
  let result = {
    total_active_validators: 0,
    total_bid_validators: 0,
    total_stake: "",
    circulating_supply: 0,
    total_supply: 0,
    APY: 0,
    era_validators: {},
  };

  try {
    //circle supply
    let supply = await getStats();

    if (supply) {
      result.circulating_supply = supply.circulating_supply;
      result.total_supply = supply.total_supply;
    }

    // total_supply

    //APY

    // calculate APY
    const apy = await getAPY();
    result.APY = apy;

    // calculate total_stake
    let total_stake = await getTotalStakeCurrentEra();

    result.total_stake = total_stake.toString();
    result.total_active_validators = await getTotalActiveValidator();
    result.total_bid_validators = await getTotalBids();

    // get top 10 validators with height
    //    current era
    const top_validators = await getTopValidators(number_of_validator);
    result.era_validators = top_validators;
  } catch (err) {
    throw err.message;
  }
  return result;
};

const getCurrentEraValidators = async (url) => {
  let result = {
    era_id: 0,
    total_stake: "",
    validators: {},
  };

  const block_info = (await requestRPC(url, RpcApiName.get_block, [])).result;

  const era_id = block_info.block.header.era_id;

  // Get total stake
  const total_stake = await getTotalStakeCurrentEra();

  // Get all validators in current era and then sort by total stake
  let auction_info = await getCurrentEraValidator();
  auction_info.sort((first, second) => {
    return math.compare(Number(second.total_stake), Number(first.total_stake));
  });

  result.era_id = era_id;
  result.total_stake = total_stake.toString();
  result.validators = auction_info;

  // Get percentage of staking of each validator on network in current era
  for (let i = 0; i < auction_info.length; i++) {
    const total_weight = auction_info[i].total_stake;
    const percentage_of_network = (
      (Number(total_weight) * 100) /
      Number(total_stake)
    )
      .toFixed(2)
      .toString();

    result.validators[i].percentage_of_network = percentage_of_network;

    // Get information of validator if exists
    try {
      const validator_info = await getValidatorInfo(
        auction_info[i].public_key_hex
      );
      if (validator_info != null) {
        result.validators[i].name = validator_info[0].name;
        if (validator_info[0].icon) {
          result.validators[i].icon = validator_info[0].icon;
        }
      }
    } catch {}
  }

  return result;
};

const getNextEraValidators = async (page, size, total_stake) => {
  let result = pagination;
  result.currentPage = page;
  result.size = size;

  // get total of validator
  let totalValidators = await getTotalNextEraValidators();
  result.total = totalValidators;

  // get total pages
  const totalPages = Math.ceil(totalValidators / size);
  result.pages = totalPages;

  // check if current page has next page and previous page
  const check = checkNextAndPreviousPage(page, totalPages);
  result.hasNext = check.hasNext;
  result.hasPrevious = check.hasPrevious;

  // get range of validator next era
  const start = Number(size * (page - 1));
  const validators = await getRangeNextEraValidator(start, size);

  // Get percentage of staking of each validator on network
  for (let i = 0; i < validators.length; i++) {
    const total_weight = validators[i].dataValues.total_stake;
    const percentage_of_network = (
      (Number(total_weight) * 100) /
      Number(total_stake)
    )
      .toFixed(2)
      .toString();

    validators[i].dataValues.percentage_of_network = percentage_of_network;

    // Get information of validators if exists
    try {
      const validator_info = await getValidatorInfo(
        validators[i].public_key_hex
      );
      if (validator_info != null) {
        validators[i].dataValues.name = validator_info[0].name;
        if (validator_info[0].icon) {
          validators[i].dataValues.icon = validator_info[0].icon;
        }
      }
    } catch {}
  }
  result.items = validators;

  return result;
};

const getBids = async () => {
  let result = {
    total_validator: 0,
    validators: {},
  };
  const total_validator = await getTotalBids();
  result.total_validator = total_validator;

  // Get all bids
  let auction_info = await getAllValidator();
  for (let i = 0; i < auction_info.length; i++) {
    let total_bid = auction_info[i].total_stake_next_era;
    let inactive = auction_info[i].inactive;
    if (inactive == 0) {
      auction_info[i].inactive = false;
    } else {
      auction_info[i].inactive = true;
    }
    auction_info[i].total_bid = total_bid;

    // Get information of validators if exists
    try {
      const validator_info = await getValidatorInfo(
        auction_info[i].public_key_hex
      );
      if (validator_info != null) {
        auction_info[i].name = validator_info[0].name;
        if (validator_info[0].icon) {
          auction_info[i].icon = validator_info[0].icon;
        }
      }
    } catch {}
  }

  // sort all bids by total stake
  auction_info.sort((first, second) => {
    return math.compare(Number(second.total_bid), Number(first.total_bid));
  });
  result.validators = auction_info;

  return result;
};

const getRangeBidsPagination = async (
  page,
  size,
  order_by,
  order_direction
) => {
  const data = pagination;
  data.currentPage = page;
  data.size = size;

  // get total bids
  const totalBids = await getTotalBids();
  data.total = totalBids;

  // get total pages
  const totalPages = Math.ceil(totalBids / size);
  data.pages = totalPages;

  // check if current page has next page and previous page
  const check = checkNextAndPreviousPage(page, totalPages);
  data.hasNext = check.hasNext;
  data.hasPrevious = check.hasPrevious;

  // get range bids
  const start = Number(size * (page - 1));
  const rangeBids = await getRangeBidsWithSort(
    start,
    size,
    order_by,
    order_direction
  );

  // try to get validator info
  for (let i = 0; i < rangeBids.length; i++) {
    try {
      const validator_info = await getValidatorInfo(
        rangeBids[i].public_key_hex
      );
      if (validator_info != null) {
        rangeBids[i].dataValues.name = validator_info[0].name;
        if (validator_info[0].icon) {
          rangeBids[i].dataValues.icon = validator_info[0].icon;
        }
      }
    } catch {}
  }
  data.items = rangeBids;

  return data;
};

const getAPY = async (total_stake) => {
  const latest_era = await getLatestEra();
  const latest_total_reward = (await getTotalRewardByEra(latest_era.era_id))
    .total_reward;

  // let total_stake = 0;
  // {
  //     total_stake = Number(await getTotalStakeCurrentEra());
  // }

  const apy = ((latest_total_reward * 12 * 365) / total_stake) * 100;
  // with compound interest
  const compound = 100 * (math.pow(1 + apy / 438000, 4380) - 1);
  return compound;
};

const getValidatorData = async (url, address) => {
  const validator = await getValidator(address);
  if (validator.length == 0) {
    throw {
      code: -32000,
      message: "validator not known",
      data: null,
    };
  }
  let element = {
    public_key: "",
    staked_amount: "",
    delegation_rate: 0,
    inactive: false,
    total_stake: "",
    information: null,
    delegators: [],
  };

  element.public_key = validator[0].public_key_hex;
  element.staked_amount = validator[0].self_stake;
  element.total_stake = validator[0].total_stake_next_era;
  element.delegation_rate = validator[0].delegation_rate;

  let status = false;
  if (validator[0].inactive === "true") {
    status = true;
  }

  element.inactive = status;
  const delegators = await getDelegatorsOfValidator(address);
  delegators.sort((first, second) => {
    return math.compare(
      Number(second.staked_amount),
      Number(first.staked_amount)
    );
  });
  element.delegators = delegators;

  return element;
};

async function getValidatorInformation(address) {
  const information = {
    name: "",
    email: "",
    icon: "",
    website: "",
    links: [],
    details: "",
  };

  let validator = await getValidatorInfo(address);
  if (validator == undefined || validator == null || validator.length < 1)
    return null;
  validator = validator[0];

  information.name = validator.name;
  information.email = validator.email;
  if (validator.icon) {
    information.icon = validator.icon;
  }
  information.website = validator.website;

  {
    let links = JSON.parse(validator.links);
    links = links.filter((value) => {
      link = value.link.replace(/\s/g, "");
      return typeof link !== "undefined" && link != null && link != "";
    });
    information.links = links;
  }
  information.details = validator.details;

  return information;
}

module.exports = {
  getValidators,
  getCurrentEraValidators,
  getBids,
  getValidatorData,
  getAPY,
  getTotalStake,
  getValidatorInformation,
  getNextEraValidators,
  getRangeBidsPagination,
};
