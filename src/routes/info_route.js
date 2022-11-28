const router = require("express").Router();
const info_controller = require("../controllers/info_controller");
const validateInput = require("../middleware");
const schemas = require("../middleware/schemas");
const { PROPERTY_TYPE } = require("../service/constant");

router
  .route("/get-deploy/:hex")
  .get(
    validateInput(schemas.hex, PROPERTY_TYPE.params),
    info_controller.getDeploy
  );
router
  .route("/get-deploy-info/:hex")
  .get(
    validateInput(schemas.hex, PROPERTY_TYPE.params),
    info_controller.getDeployInfo
  );
router.route("/get-list-deploys").get(info_controller.getListDeploys);
router.route("/get-type/:param").get(info_controller.getType);
router
  .route("/get-circulating-supply/")
  .get(info_controller.getCirculatingSupply);
router.route("/get-supply/").get(info_controller.getSupply);
router
  .route("/get-blockchain-data")
  .get(
    validateInput(schemas.blockchain_data_type, PROPERTY_TYPE.query),
    info_controller.getBlockchainData
  );

// cache for daily volume
const verifyGetVolume = (req, res, next) => {
  try {
    const count = req.params.count;
    if (info_controller.get_volume_cache.has(`get-volume-${count}`)) {
      return res
        .status(200)
        .json(info_controller.get_volume_cache.get(`get-volume-${count}`));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-volume/:count")
  .get(verifyGetVolume, info_controller.getVolume);

//cache for get stats
const verifyGetStats = (req, res, next) => {
  try {
    if (info_controller.get_stats_cache.has("get-stats")) {
      return res
        .status(200)
        .json(info_controller.get_stats_cache.get("get-stats"));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router.route("/get-stats").get(verifyGetStats, info_controller.getStats);

// cache for economics
const verifyEconomics = (req, res, next) => {
  try {
    if (info_controller.economics_cache.has("economics")) {
      return res
        .status(200)
        .json(info_controller.economics_cache.get("economics"));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router.route("/economics").get(verifyEconomics, info_controller.getEconomics);

router.route("/get-dex-traffic").get(info_controller.getDexTraffic);

const verifyExchangeVolume = (req, res, next) => {
  try {
    const count = req.query.count;
    if (info_controller.exchange_volume_cache.has(count)) {
      return res
        .status(200)
        .json(info_controller.exchange_volume_cache.get(count));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/exchange-volume")
  .get(verifyExchangeVolume, info_controller.getExchangeVolume);

router.route("/get-all-highcharts").get(info_controller.getHighCharts);

module.exports = router;
