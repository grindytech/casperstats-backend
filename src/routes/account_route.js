const router = require('express').Router();
const account_controller = require('../controllers/account_controller');

router.route("/get-account/:address").get(account_controller.GetAccount);
router.route("/get-pk/:account").get(account_controller.GetPublicKeyHex);
router.route("/get-transfers").get(account_controller.GetAccountTransfers);
router.route("/get-deploys/").get(account_controller.GetAccountDeploys);

module.exports = router;
