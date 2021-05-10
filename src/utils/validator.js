const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require('./constant');
const { RequestRPC } = require('./utils')
const  math = require('mathjs');

/**
 * Returns x raised to the n-th power.
 *
 * @param {number} auction_state The object result from get-auction-info.
 * @param {number} era_index The era index of era_validators, it's only 0 or 1 with 0 is the current ear and 1 is the next era.
 * @return {Array} result return top 10 validators by height and also add more information to them.
 */
async function GetTopValidators(auction_state, era_index, number_of_validator) {

    const bids = auction_state.bids;
    const era_validators = auction_state.era_validators[era_index];
    let top_weights = [];
    //Get top 10 validators by weight
    {
        let weights = era_validators.validator_weights;
        weights.sort((first, second) => {
            if (first.weight > second.weight) {
                return -1;
            }
            if (first.weight < second.weight) {
                return 1;
            }
            return 0;
        })
        top_weights = weights.slice(0, number_of_validator);
    }

    // add more data to top weights
    let top_validators = [];
    {
        for (let i = 0; i < top_weights.length; i++) {
            let element = bids.find(el => el.public_key == top_weights[i].public_key);
            
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
        era_id: era_validators.era_id,
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

const GetValidator = async (number_of_validator) => {

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
        const bids  = auction_info.auction_state.bids;
        for(let era_index = 0 ; era_index < 2; era_index++) {
            const validator_weights = auction_info.auction_state.era_validators[era_index].validator_weights;
            for(let i = 0; i< validator_weights.length; i++) {
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
    for(let era_index =0 ; era_index < 2; era_index++) {
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

    for( let i=0 ;i < bids.length ; i++) {
        let self_bid =  math.bignumber(bids[i].bid.staked_amount);

        let total_token_delegated = math.bignumber("0");
        let delegators = bids[i].bid.delegators;
        for ( let j = 0; j < delegators.length; j++) {
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

module.exports = {
    GetValidator, GetEraValidators, GetBids
}

