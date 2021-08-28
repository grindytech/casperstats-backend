const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance-v2/:account_hash").get(state_controller.GetBalanceAccountHash);
router.route("/get-balance/:address").get(state_controller.GetBalanceAddress);
router.route("/get-balance-state/").get(state_controller.GetBalanceState);
router.route("/query-state/:key").get(state_controller.QueryState);

// Auction and staking
router.route("/get-auction-info").get(state_controller.GetAuctionInfo);

//cache for get-era-validators
const verifyGetEraValidators = (req, res, next) => {
    try {
        if (state_controller.get_era_validators_cache.has("get-era-validators")) {
            return res.status(200).json(state_controller.get_era_validators_cache.get("get-era-validators"));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-era-validators").get(verifyGetEraValidators, state_controller.GetEraValidators);

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
router.route('/get-bids').get(verifyGetBids, state_controller.GetBids);

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
router.route("/get-validator/:address").get(state_controller.GetValidator);
router.route("/get-fee/:type").get(state_controller.GetLatestTransaction);

module.exports = router;
