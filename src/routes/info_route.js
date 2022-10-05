const router = require("express").Router();
const info_controller = require("../controllers/info_controller");

router.route("/get-deploy/:hex").get(info_controller.GetDeploy);
router.route("/get-deploy-info/:hex").get(info_controller.GetDeployInfo);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);
router.route("/get-type/:param").get(info_controller.GetType);
router
  .route("/get-circulating-supply/")
  .get(info_controller.GetCirculatingSupply);
router.route("/get-supply/").get(info_controller.GetSupply);

// cache for get blockchain data
const verifyBlockchainData = (req, res, next) => {
  try {
    const type = req.query.type;
    if (info_controller.blockchain_data_cache.has(`${type}`)) {
      return res
        .status(200)
        .json(info_controller.blockchain_data_cache.get(`${type}`));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-blockchain-data")
  .get(verifyBlockchainData, info_controller.GetBlockchainData);

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
  .get(verifyGetVolume, info_controller.GetVolume);

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
router.route("/get-stats").get(verifyGetStats, info_controller.GetStats);

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
router.route("/economics").get(verifyEconomics, info_controller.GetEconomics);

router.route("/get-dex-traffic").get(info_controller.GetDexTraffic);

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
  .get(verifyExchangeVolume, info_controller.GetExchangeVolume);

module.exports = router;
