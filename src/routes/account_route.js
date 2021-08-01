const router = require('express').Router();
const account_controller = require('../controllers/account_controller');

router.route("/get-account/:account").get(account_controller.GetAccount);
// router.route("/get-holder/:account").get(account_controller.GetHolder);
router.route("/get-transfers").get(account_controller.GetAccountTransfers);
router.route("/get-deploys/").get(account_controller.GetAccountDeploys);
router.route("/get-balance/:public_key").get(account_controller.GetBalance);
router.route("/get-account-hash/:public_key").get(account_controller.GetAccountHash);

// cache for get-bids
const verifyRichAccount = (req, res, next) => {
    try {
        const start = req.query.start;
        const count = req.query.count;
        if (account_controller.get_rich_accounts_cache.has(`start: ${start} count ${count}`)) {
            return res.status(200).json(account_controller.get_rich_accounts_cache.get(`start: ${start} count ${count}`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-rich-accounts/").get(verifyRichAccount, account_controller.GetRichAccounts);
router.route("/count-holders/").get(account_controller.CountHolders);
router.route("/get-rewards").get(account_controller.GetRewards);
router.route("/get-era-reward").get(account_controller.GetEraReward);
router.route("/staking/").get(account_controller.GetStaking);
router.route("/undelegate/").get(account_controller.GetUndelegate);
router.route("/delegate/").get(account_controller.GetDelegate);
router.route("/get-bids/").get(account_controller.GetBids);

module.exports = router;
