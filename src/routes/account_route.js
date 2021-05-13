const router = require('express').Router();
const account_controller = require('../controllers/account_controller');

router.route("/get-account/:address").get(account_controller.GetAccount);

module.exports = router;
