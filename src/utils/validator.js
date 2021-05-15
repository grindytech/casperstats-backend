const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const { RequestRPC, GetHeight } = require('./common')
const math = require('mathjs');


function GetTotalBid(bids, address) {
    // get total bid
    let element = bids.find(el => el.public_key == address);
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
async function GetTopValidators(auction_state, era_index, number_of_validator) {

    const bids = auction_state.bids;
    const era_validator = auction_state.era_validators[era_index];
    let top_weights = [];
    let weights = era_validator.validator_weights;

    // add total_bid
    {
        for (let i = 0; i < weights.length; i++) {
            const total_stake = GetTotalBid(bids, weights[i].public_key);
            weights[i]["total_stake"] = total_stake;
        }
    }

    //Get top 10 validators by weight
    {
        weights.sort((first, second) => {
            return math.compare(second.total_stake, first.total_stake);
        })
        top_weights = weights.slice(0, number_of_validator);
    }

    // add more data to top weights
    let top_validators = [];
    {
        for (let i = 0; i < top_weights.length; i++) {
            let element = bids.find(el => el.public_key == top_weights[i].public_key);
            const total_stake = GetTotalBid(bids, element.public_key);
            element.bid["total_stake"] = total_stake;

            // Add number of delegatee
            let number_delegators = 0;
            if (element.bid.delegators !== undefined) {
                number_delegators = element.bid.delegators.length;
            }

            delete element.bid["bonding_purse"];
            element.bid["delegators"] = number_delegators;
            delete element.bid["inactive"];
            top_validators.push(element);
        }
    }

    const result = {
        era_id: era_validator.era_id,
        validators: top_validators,
    }

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

const GetValidators = async (number_of_validator) => {

    let result = {
        block_height: 0,
        total_active_validators: 0,
        total_bid_validators: 0,
        total_stake: "",
        era_validators: {}
    }

    const auction_info = await RequestRPC(RpcApiName.get_auction_info, []);

    try {

        const auction_state = auction_info.result.auction_state;

        result.block_height = auction_state.block_height;

        // calculate total_stake
        let total_stake = 0;
        total_stake = await GetTotalStake(auction_state, 0);

        result.total_stake = total_stake.toString();
        result.total_active_validators = auction_state.era_validators[0].validator_weights.length;
        result.total_bid_validators = auction_state.bids.length;

        // get top 10 validators with height
        //    current era
        const top_validators = await GetTopValidators(auction_state, 0, number_of_validator);
        result.era_validators = top_validators;
    } catch (err) {
        throw err.message;
    }
    return result;
}


const GetEraValidators = async () => {
    let auction_info = (await RequestRPC(RpcApiName.get_auction_info, [])).result;

    // get total stake
    const total_stake_current_era = await GetTotalStake(auction_info.auction_state, 0);
    const total_stake_next_era = await GetTotalStake(auction_info.auction_state, 1);

    auction_info.auction_state.era_validators[0]["total_stake"] = total_stake_current_era.toString();
    auction_info.auction_state.era_validators[1]["total_stake"] = total_stake_next_era.toString();


    // Add number of delegators
    {
        const bids = auction_info.auction_state.bids;
        for (let era_index = 0; era_index < 2; era_index++) {
            const validator_weights = auction_info.auction_state.era_validators[era_index].validator_weights;
            for (let i = 0; i < validator_weights.length; i++) {
                let public_key = validator_weights[i].public_key;

                let element = bids.find(el => el.public_key == public_key);

                const num_of_delegators = element.bid.delegators.length;
                validator_weights[i]["delegators"] = num_of_delegators;
            }
        }
    }

    //remove bids
    delete auction_info.auction_state.bids;

    // sort validators by weight
    for (let era_index = 0; era_index < 2; era_index++) {
        auction_info.auction_state.era_validators[era_index].validator_weights.sort((first, second) => {
            return math.compare(second.weight, first.weight);
        })
    }

    return auction_info;
}

const GetBids = async () => {
    const auction_info = (await RequestRPC(RpcApiName.get_auction_info, [])).result;

    // get total bid
    let bids = auction_info.auction_state.bids;

    for (let i = 0; i < bids.length; i++) {
        let self_bid = math.bignumber(bids[i].bid.staked_amount);

        let total_token_delegated = math.bignumber("0");
        let delegators = bids[i].bid.delegators;
        for (let j = 0; j < delegators.length; j++) {
            const delegated_amount = math.bignumber(delegators[j].staked_amount);
            total_token_delegated = math.add(total_token_delegated, delegated_amount);
        }

        bids[i]["total_bid"] = math.add(self_bid, total_token_delegated).toString();
        bids[i]["total_delegated"] = total_token_delegated.toString();
    }

    //remove bids
    delete auction_info.auction_state.era_validators;

    // sort bids by total_bid
    auction_info.auction_state.bids.sort((first, second) => {
        return math.compare(second.total_bid, first.total_bid);
    })
    return auction_info;
}


const GetValidatorData = async (address) => {
    const auction_info = (await RequestRPC(RpcApiName.get_auction_info, [])).result;

    // get total bid
    let bids = auction_info.auction_state.bids;
    let element = bids.find(el => el.public_key == address);

    if (element) {
        const total_stake = GetTotalBid(bids, element.public_key);
        element.bid["total_stake"] = total_stake;
    } else {
        throw ({
            "code": -32000,
            "message": "validator not known",
            "data": null
            })
    }
    return element;
}

const GetBlocksByProposer = async (validator_address, number_of_block) => {
    const height = await GetHeight();

    let blocks = [];
    for (let i = height; i >= 0; i--) {
        let params = [{ "Height": parseInt(i) }]
        const block = await RequestRPC(RpcApiName.get_block, params);

        if(block.result.block.body.proposer == validator_address) {

            let brief_data = {
                block_height: block.result.block.header.height,
                era_id:  block.result.block.header.era_id,
                deploys: block.result.block.body.deploy_hashes.length,
                transfers: block.result.block.body.transfer_hashes.length,
                timestamp: block.result.block.header.timestamp,
                block_hash: block.result.block.hash,
            }

            blocks.push(brief_data);
            if(blocks.length == number_of_block) {
                break;
            }
        }
    }
    return blocks;
}

module.exports = {
    GetValidators, GetEraValidators, GetBids, GetValidatorData, GetBlocksByProposer
}

