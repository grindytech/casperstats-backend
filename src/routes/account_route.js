const router = require("express").Router();
const account_controller = require("../controllers/account_controller");
const {
  verifyAccountData,
  verifyRangeWithAccount,
  verifyRange,
} = require("../service/schemas");

// verify input to get account
const verifyAccount = (req, res, next) => {
  let account = req.params.account;
  const params = {
    account: account,
  };
  const response = verifyAccountData(params);
  if (response.error) {
    res.status(402).json(response);
    return;
  }
  return next();
};
router
  .route("/get-account/:account")
  .get(verifyAccount, account_controller.getAccount);
// router.route("/get-holder/:account").get(account_controller.GetHolder);

// verify input to get transfers
const verifyGetRangeWithAccount = (req, res, next) => {
  const account = req.query.account;
  const start = req.query.start;
  const count = req.query.count;

  const params = {
    account: account,
    start: start,
    count: count,
  };

  const response = verifyRangeWithAccount(params);
  if (response.error) {
    res.status(402).json(response);
    return;
  }
  return next();
};
router
  .route("/get-transfers")
  .get(verifyGetRangeWithAccount, account_controller.getAccountTransfers);
router
  .route("/get-deploys/")
  .get(verifyGetRangeWithAccount, account_controller.getAccountDeploys);
router.route("/get-balance/:public_key").get(account_controller.getBalance);
router
  .route("/get-account-hash/:public_key")
  .get(account_controller.getAccountHash);

// cache for get-bids
const verifyRichAccount = (req, res, next) => {
  try {
    const start = req.query.start;
    const count = req.query.count;
    const params = {
      start: start,
      count: count,
    };

    const response = verifyRange(params);
    if (response.error) {
      res.status(402).json(response);
      return;
    }
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
router
  .route("/get-rewards")
  .get(verifyGetRangeWithAccount, account_controller.getRewardV2);
router.route("/get-era-reward").get(account_controller.getEraReward);
// router.route("/get-reward-v2").get(account_controller.GetRewardV2);
router
  .route("/undelegate/")
  .get(verifyGetRangeWithAccount, account_controller.getUndelegate);
router
  .route("/delegate/")
  .get(verifyGetRangeWithAccount, account_controller.getDelegate);
router.route("/get-bids/").get(account_controller.getBids);

module.exports = router;
