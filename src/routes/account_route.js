const router = require('express').Router();
const account_controller = require('../controllers/account_controller');

router.route("/root").get(account_controller.GetStateRootHash);
router.route("/query").get(account_controller.QueryState);
router.route("/balance").get(account_controller.GetBalance);

module.exports = router;
