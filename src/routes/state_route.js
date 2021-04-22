const router = require('express').Router();
const state_controller = require('../controllers/state_controller');

router.route("/get-balance").get(state_controller.GetBalance);
router.route("/query-state").get(state_controller.QueryState);

module.exports = router;
