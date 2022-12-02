const router = require("express").Router();
const state_controller = require("../controllers/state_controller");
const validateInput = require("../middleware");
const schemas = require("../middleware/schemas");
const { PROPERTY_TYPE } = require("../service/constant");

router
  .route("/get-balance-v2/:account_hash")
  .get(state_controller.getBalanceAccountHash);
router
  .route("/get-balance/:account")
  .get(
    validateInput(schemas.account, PROPERTY_TYPE.params),
    state_controller.getBalanceAddress
  );
router.route("/get-balance-state/").get(state_controller.getBalanceState);
router.route("/query-state/:key").get(state_controller.queryState);

// Auction and staking
router.route("/get-auction-info").get(state_controller.getAuctionInfo);
router
  .route("/get-current-era-validators")
  .get(state_controller.getCurrentEraValidators);
router
  .route("/get-next-era-validators")
  .get(
    validateInput(schemas.pagination, PROPERTY_TYPE.query),
    state_controller.getNextEraValidators
  );
router.route("/get-bids").get(state_controller.getBids);
router
  .route("/get-range-bids")
  .get(
    validateInput(schemas.paginationWithSortType, PROPERTY_TYPE.query),
    state_controller.getRangeBids
  );

router
  .route("/get-validators/:number")
  .get(
    validateInput(schemas.number, PROPERTY_TYPE.params),
    state_controller.getValidators
  );
// cache for get-validator
const verifyGetValidator = (req, res, next) => {
  try {
    const account = req.params.account;
    if (state_controller.get_validator_cache.has(account)) {
      return res
        .status(200)
        .json(state_controller.get_validator_cache.get(account));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-validator/:account")
  .get(
    validateInput(schemas.account, PROPERTY_TYPE.params),
    verifyGetValidator,
    state_controller.getValidator
  );
//cache for get-range-delegator
const verifyGetRangeDelegator = (req, res, next) => {
  try {
    const validator = req.query.validator;
    const start = Number(req.query.start);
    const count = Number(req.query.count);

    if (
      state_controller.get_range_delegator_cache.has(
        `validato: '${validator}' start: ${start} count: ${count}`
      )
    ) {
      return res
        .status(200)
        .json(
          state_controller.get_range_delegator_cache.get(
            `validato: '${validator}' start: ${start} count: ${count}`
          )
        );
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-range-delegator")
  .get(
    validateInput(schemas.startToCountWithValidator, PROPERTY_TYPE.query),
    verifyGetRangeDelegator,
    state_controller.getRangeDelegator
  );

//cache for get-range-era-rewards
const verifyGetRangeEraRewards = (req, res, next) => {
  try {
    const validator = req.query.validator;
    const start = Number(req.query.start);
    const count = Number(req.query.count);

    if (
      state_controller.get_range_era_rewards_cache.has(
        `validator: '${validator}' start: ${start} count: ${count}`
      )
    ) {
      return res
        .status(200)
        .json(
          state_controller.get_range_era_rewards_cache.get(
            `validator: '${validator}' start: ${start} count: ${count}`
          )
        );
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-range-era-rewards")
  .get(
    validateInput(schemas.startToCountWithValidator, PROPERTY_TYPE.query),
    verifyGetRangeEraRewards,
    state_controller.getRangeEraRewards
  );
router.route("/get-fee/:type").get(state_controller.getLatestTransaction);

module.exports = router;
