const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance").get(state_controller.GetBalance);
router.route("/get-balance/:address").get(state_controller.GetBalanceV2);
router.route("/query-state").get(state_controller.QueryState);

// Auction and staking
router.route("/get-auction-info").get(state_controller.GetAuctionInfo);
router.route("/get-era-validators").get(state_controller.GetEraValidators);
router.route('/get-bids').get(state_controller.GetBids);
router.route("/get-validators/:number").get(state_controller.GetValidators);
router.route("/get-validator/:address").get(state_controller.GetValidator);

module.exports = router;
