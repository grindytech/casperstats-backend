const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance-v2/:account_hash").get(state_controller.GetBalanceAccountHash);
router.route("/get-balance/:address").get(state_controller.GetBalanceAddress);
router.route("/get-balance-state/").get(state_controller.GetBalanceState);
router.route("/query-state/:key").get(state_controller.QueryState);

// Auction and staking
router.route("/get-auction-info").get(state_controller.GetAuctionInfo);

//cache for get-current-era-validators
const verifyGetCurrentEraValidators = (req, res, next) => {
    try {
        if (state_controller.get_current_era_validators_cache.has("get-era-validators")) {
            return res.status(200).json(state_controller.get_current_era_validators_cache.get("get-era-validators"));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-current-era-validators").get(verifyGetCurrentEraValidators, state_controller.GetCurrentEraValidators);

//cache for get-next-era-validators
const verifyGetNextEraValidators = (req, res, next) => {
    try {
        if (state_controller.get_next_era_validators_cache.has("get-era-validators")) {
            return res.status(200).json(state_controller.get_next_era_validators_cache.get("get-era-validators"));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-next-era-validators").get(verifyGetNextEraValidators, state_controller.GetNextEraValidators);

// cache for get-bids
const verifyGetBids = (req, res, next) => {
    try {
        if (state_controller.get_bids_cache.has("get-bids")) {
            return res.status(200).json(state_controller.get_bids_cache.get("get-bids"));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route('/get-bids').get(state_controller.GetBids);
router.route('/get-range-bids').get(state_controller.getRangeBids)

// cache for get-validators
const verifyGetValidators = (req, res, next) => {
    try {
        const number = req.params.number;
        if (state_controller.get_validators_cache.has(number)) {
            return res.status(200).json(state_controller.get_validators_cache.get(number));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-validators/:number").get(verifyGetValidators, state_controller.GetValidators);
// cache for get-validator
const verifyGetValidator = (req, res, next) => {
    try {
        const address = req.params.address;
        if (state_controller.get_validator_cache.has(address)) {
            return res.status(200).json(state_controller.get_validator_cache.get(address));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-validator/:address").get(verifyGetValidator, state_controller.GetValidator);
//cache for get-range-delegator
const verifyGetRangeDelegator = (req, res, next) => {
    try {
        const validator = req.query.validator;
        const start = Number(req.query.start);
        const count = Number(req.query.count);

        if (state_controller.get_range_delegator_cache.has(`validato: '${validator}' start: ${start} count: ${count}`)) {
            return res.status(200).json(state_controller.get_range_delegator_cache.get(`validato: '${validator}' start: ${start} count: ${count}`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-range-delegator").get(verifyGetRangeDelegator, state_controller.GetRangeDelegator);

//cache for get-range-era-rewards
const verifyGetRangeEraRewards = (req, res, next) => {
    try {
        const validator = req.query.validator;
        const start = Number(req.query.start);
        const count = Number(req.query.count);

        if (state_controller.get_range_era_rewards_cache.has(`validator: '${validator}' start: ${start} count: ${count}`)) {
            return res.status(200).json(state_controller.get_range_era_rewards_cache.get(`validator: '${validator}' start: ${start} count: ${count}`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-range-era-rewards").get(verifyGetRangeEraRewards, state_controller.GetRangeEraRewards);
router.route("/get-fee/:type").get(state_controller.GetLatestTransaction);

module.exports = router;
