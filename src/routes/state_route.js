const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance").get(state_controller.GetBalance);
router.route("/get-balance/:address").get(state_controller.GetBalanceV2);

router.route("/query-state").get(state_controller.QueryState);
router.route("/get-auction-info").get(state_controller.GetAuctionInfo);

module.exports = router;
