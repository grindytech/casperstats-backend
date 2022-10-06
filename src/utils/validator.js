const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require("./constant");
const { RequestRPC, GetNetWorkRPC } = require("./common");
const math = require("mathjs");
const {
  GetTotalRewardByPublicKey,
  GetLatestEra,
  GetTotalRewardByEra,
  GetPublicKeyTotalRewardByDate,
  GetRewardByPublicKey,
} = require("../models/era");
const {
  GetValidator,
  GetCurrentEraValidator,
  GetNextEraValidator,
  GetTotalStakeNextEra,
  GetTotalStakeCurrentEra,
  GetAllValidator,
  GetTotalValidator,
  GetTotalActiveValidator,
  GetRangeValidator,
  GetValidatorInfo,
} = require("../models/validator");
const { GetDelegatorsOfValidator } = require("../models/delegator");
const request = require("request");
const { GetDeployByRPC } = require("./chain");
const { GetStats } = require("../models/stats");

function GetTotalBid(bids, address) {
  // get total bid
  let element = bids.find((el) => el.public_key == address);
  let self_bid = math.bignumber(element.bid.staked_amount);
  let total_token_delegated = math.bignumber("0");
  let delegators = element.bid.delegators;
  for (let j = 0; j < delegators.length; j++) {
    const delegated_amount = math.bignumber(delegators[j].staked_amount);
    total_token_delegated = math.add(total_token_delegated, delegated_amount);
  }
  const total_bid = math.add(self_bid, total_token_delegated).toString();
  return total_bid;
}

/**
 * Returns x raised to the n-th power.
 *
 * @param {number} auction_state The object result from get-auction-info.
 * @param {number} era_index The era index of era_validators, it's only 0 or 1 with 0 is the current ear and 1 is the next era.
 * @return {Array} result return top 10 validators by height and also add more information to them.
 */
async function GetTopValidators(number_of_validator) {
  // const bids = auction_state.bids;
  // const era_validator = auction_state.era_validators[era_index];
  // let top_weights = [];
  // let weights = era_validator.validator_weights;

  // // add total_bid
  // {
  //     for (let i = 0; i < weights.length; i++) {
  //         const total_stake = GetTotalBid(bids, weights[i].public_key);
  //         weights[i]["total_stake"] = total_stake;
  //     }
  // }

  // //Get top 10 validators by weight
  // {
  //     weights.sort((first, second) => {
  //         return math.compare(second.total_stake, first.total_stake);
  //     })
  //     top_weights = weights.slice(0, number_of_validator);
  // }

  // // add more data to top weights
  // let top_validators = [];
  // {
  //     for (let i = 0; i < top_weights.length; i++) {
  //         let element = bids.find(el => el.public_key == top_weights[i].public_key);
  //         const total_stake = GetTotalBid(bids, element.public_key);
  //         element.bid["total_stake"] = total_stake;

  //         // Add number of delegatee
  //         let number_delegators = 0;
  //         if (element.bid.delegators !== undefined) {
  //             number_delegators = element.bid.delegators.length;
  //         }

  //         delete element.bid["bonding_purse"];
  //         element.bid["delegators"] = number_delegators;
  //         delete element.bid["inactive"];

  //         // add information to top validators
  //         try {
  //             const information = await getValidatorInformation(element.public_key);
  //             element.information = information;
  //         } catch (err) {
  //             element.information = null;
  //         }

  //         top_validators.push(element);
  //     }
  // }

  let validators = await GetNextEraValidator();
  let top_validators = [];
  validators.sort((first, second) => {
    return math.compare(second.total_stake, first.total_stake);
  });

  top_validators = validators.slice(0, number_of_validator);
  for (let i = 0; i < top_validators.length; i++) {
    top_validators[i].information = await getValidatorInformation(
      top_validators[i].public_key_hex
    );
  }
  const result = {
    validators: top_validators,
  };

  return result;
}

async function GetTotalStake(auction_state, era_index) {
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
    let supply = await GetStats();

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
    let total_stake = await GetTotalStakeCurrentEra();

    result.total_stake = total_stake.toString();
    result.total_active_validators = await GetTotalActiveValidator();
    result.total_bid_validators = await GetTotalValidator();

    // get top 10 validators with height
    //    current era
    const top_validators = await GetTopValidators(number_of_validator);
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

  const block_info = (await RequestRPC(url, RpcApiName.get_block, [])).result;

  const era_id = block_info.block.header.era_id;

  result.era_id = era_id;

  const total_stake_current_era = await GetTotalStakeCurrentEra();
  result.total_stake = total_stake_current_era.toString();

  let auction_info = await GetCurrentEraValidator();

  auction_info.sort((first, second) => {
    return math.compare(Number(second.total_stake), Number(first.total_stake));
  });

  result.validators = auction_info;

  for (let i = 0; i < auction_info.length; i++) {
    const total_weight_current_era = auction_info[i].total_stake;
    const percentage_of_network_current_era = (
      (Number(total_weight_current_era) * 100) /
      Number(total_stake_current_era)
    )
      .toFixed(2)
      .toString();

    result.validators[i].percentage_of_network =
      percentage_of_network_current_era;

    try {
      const validator_info = await GetValidatorInfo(
        auction_info[i].public_key_hex
      );
      if (validator_info != null) {
        result.validators[i].name = validator_info[0].name;
        if (validator_info[0].icon) {
          result.validators[i].icon =
            process.env.ICON_IMAGE_URL + validator_info[0].icon;
        }
      }
    } catch {}
  }

  return result;
};

const getNextEraValidators = async (url) => {
  let result = {
    era_id: 0,
    total_stake: "",
    validators: {},
  };

  const block_info = (await RequestRPC(url, RpcApiName.get_block, [])).result;

  const era_id = block_info.block.header.era_id;

  result.era_id = math.add(Number(era_id), 1);

  const total_stake_next_era = await GetTotalStakeNextEra();
  result.total_stake = total_stake_next_era.toString();

  let auction_info = await GetNextEraValidator();

  auction_info.sort((first, second) => {
    return math.compare(Number(second.total_stake), Number(first.total_stake));
  });

  result.validators = auction_info;

  for (let i = 0; i < auction_info.length; i++) {
    const total_weight_next_era = auction_info[i].total_stake;
    const percentage_of_network_next_era = (
      (Number(total_weight_next_era) * 100) /
      Number(total_stake_next_era)
    )
      .toFixed(2)
      .toString();

    result.validators[i].percentage_of_network = percentage_of_network_next_era;

    try {
      const validator_info = await GetValidatorInfo(
        auction_info[i].public_key_hex
      );
      if (validator_info != null) {
        result.validators[i].name = validator_info[0].name;
        if (validator_info[0].icon) {
          result.validators[i].icon =
            process.env.ICON_IMAGE_URL + validator_info[0].icon;
        }
      }
    } catch {}
  }

  return result;
};

const getBids = async () => {
  let result = {
    total_validator: 0,
    validators: {},
  };
  const total_validator = await GetTotalValidator();
  result.total_validator = total_validator;

  let auction_info = await GetAllValidator();

  for (let i = 0; i < auction_info.length; i++) {
    let total_bid = auction_info[i].total_stake_next_era;
    let inactive = auction_info[i].inactive;
    if (inactive == 0) {
      auction_info[i].inactive = false;
    } else {
      auction_info[i].inactive = true;
    }
    auction_info[i].total_bid = total_bid;

    try {
      const validator_info = await GetValidatorInfo(
        auction_info[i].public_key_hex
      );
      if (validator_info != null) {
        auction_info[i].name = validator_info[0].name;
        if (validator_info[0].icon) {
          auction_info[i].icon =
            process.env.ICON_IMAGE_URL + validator_info[0].icon;
        }
      }
    } catch {}
  }

  auction_info.sort((first, second) => {
    return math.compare(Number(second.total_bid), Number(first.total_bid));
  });
  result.validators = auction_info;

  return result;
};

const getRangeBids = async (start, count) => {
  let result = {
    total_validator: 0,
    validators: {},
  };

  const total_validator = await GetTotalValidator();
  result.total_validator = total_validator;

  let auction_info = await GetRangeValidator(start, count);
  result.validators = auction_info;

  return result;
};

const getAPY = async (total_stake) => {
  const latest_era = await GetLatestEra();
  const latest_total_reward = (await GetTotalRewardByEra(latest_era.era_id))
    .total_reward;

  // let total_stake = 0;
  // {
  //     total_stake = Number(await GetTotalStakeCurrentEra());
  // }

  const apy = ((latest_total_reward * 12 * 365) / total_stake) * 100;
  // with compound interest
  const compound = 100 * (math.pow(1 + apy / 438000, 4380) - 1);
  return compound;
};

const getValidatorData = async (url, address) => {
  // const auction_info = (await RequestRPC(url, RpcApiName.get_auction_info, [])).result;

  // // get total bid
  // let bids = auction_info.auction_state.bids;
  // let element = bids.find(el => el.public_key == address);

  // if (element) {
  //     const total_stake = GetTotalBid(bids, element.public_key);
  //     element.bid["total_stake"] = total_stake;

  //     // sort delegator by stake
  //     const sort_value = element.bid.delegators.sort(function (a, b) {
  //         return math.compare(b.staked_amount, a.staked_amount);
  //     })
  //     element.bid.delegators = sort_value;

  //     // today reward
  //     // let last_24h_reward = 0;
  //     // {
  //     //     try {
  //     //         var datetime = new Date();
  //     //         let yesterday = new Date();
  //     //         {
  //     //             yesterday.setDate(datetime.getDate() - 1);
  //     //             yesterday = yesterday.toISOString();
  //     //         }
  //     //         last_24h_reward = (await GetPublicKeyTotalRewardByDate(element.public_key, yesterday, datetime.toISOString())).total_reward;
  //     //     }
  //     //     catch (err) {

  //     //     }
  //     // }
  //     // if (last_24h_reward == null) {
  //     //     last_24h_reward = 0;
  //     // }
  //     // element.last_24h_reward = last_24h_reward.toString();

  //     // add total rewards paid
  //     // const total_reward = await GetRewardByPublicKey(element.public_key);
  //     // element.total_reward = total_reward.total_reward;

  //     // const total_reward_paid = await GetTotalRewardByPublicKey(element.public_key);
  //     // element.total_reward_paid = total_reward_paid.total_reward;
  // } else {
  //     throw ({
  //         "code": -32000,
  //         "message": "validator not known",
  //         "data": null
  //     })
  // }
  const validator = await GetValidator(address);
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
  const delegators = await GetDelegatorsOfValidator(address);
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

  let validator = await GetValidatorInfo(address);
  if (validator == undefined || validator == null || validator.length < 1)
    return null;
  validator = validator[0];

  information.name = validator.name;
  information.email = validator.email;
  if (validator.icon) {
    information.icon =
      process.env.ICON_IMAGE_URL + validator.icon + "?raw=true";
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
  GetTotalStake,
  getValidatorInformation,
  getNextEraValidators,
  getRangeBids,
};
