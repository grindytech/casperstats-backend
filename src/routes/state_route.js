const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance-v2/:account_hash").get(state_controller.GetBalanceAccountHash);
router.route("/get-balance/:address").get(state_controller.GetBalanceAddress);
router.route("/get-balance-state/").get(state_controller.GetBalanceState);
router.route("/query-state/:key").get(state_controller.QueryState);

// Auction and staking
router.route("/get-auction-info").get(state_controller.GetAuctionInfo);
router.route("/get-current-era-validators").get(state_controller.GetCurrentEraValidators);
router.route("/get-next-era-validators").get(state_controller.GetNextEraValidators);
router.route('/get-bids').get(state_controller.GetBids);
router.route('/get-range-bids').get(state_controller.getRangeBids)

router.route("/get-validators/:number").get(state_controller.GetValidators);
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