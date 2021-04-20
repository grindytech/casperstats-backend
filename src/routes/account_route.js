const router = require('express').Router();
const account_controller = require('../controllers/account_controller');

router.route("/state").get(account_controller.GetStateRootHash);

module.exports = router;
