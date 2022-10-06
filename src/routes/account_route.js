const router = require("express").Router();
const account_controller = require("../controllers/account_controller");

router.route("/get-account/:account").get(account_controller.getAccount);
// router.route("/get-holder/:account").get(account_controller.GetHolder);
router.route("/get-transfers").get(account_controller.getAccountTransfers);
router.route("/get-deploys/").get(account_controller.getAccountDeploys);
router.route("/get-balance/:public_key").get(account_controller.getBalance);
router
  .route("/get-account-hash/:public_key")
  .get(account_controller.getAccountHash);

// cache for get-bids
const verifyRichAccount = (req, res, next) => {
  try {
    const start = req.query.start;
    const count = req.query.count;
    if (
      account_controller.get_rich_accounts_cache.has(
        `start: ${start} count ${count}`
      )
    ) {
      return res
        .status(200)
        .json(
          account_controller.get_rich_accounts_cache.get(
            `start: ${start} count ${count}`
          )
        );
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-rich-accounts/")
  .get(verifyRichAccount, account_controller.getRichAccounts);
router.route("/count-holders/").get(account_controller.countHolders);
router.route("/get-rewards").get(account_controller.getRewardV2);
router.route("/get-era-reward").get(account_controller.getEraReward);
// router.route("/get-reward-v2").get(account_controller.GetRewardV2);
router.route("/undelegate/").get(account_controller.getUndelegate);
router.route("/delegate/").get(account_controller.getDelegate);
router.route("/get-bids/").get(account_controller.getBids);

module.exports = router;
