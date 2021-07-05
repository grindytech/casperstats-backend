const router = require('express').Router();
const info_controller = require('../controllers/info_controller');

router.route("/get-deploy/:hex").get(info_controller.GetDeploy);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);
router.route("/get-type/:param").get(info_controller.GetType);
router.route("/get-circulating-supply/").get(info_controller.GetCirculatingSupply);
router.route("/get-supply/").get(info_controller.GetSupply);
router.route("/get-transfer-volume/:count").get(info_controller.GetTransferVolume);
router.route("/get-volume/:count").get(info_controller.GetVolume);

// cache for get-stats
const verifyGetStats = (req, res, next) => {
    try {
        if (info_controller.get_stats_cache.has("get-stats")) {
            return res.status(200).json(info_controller.get_stats_cache.get("get-stats"));
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
            return res.status(200).json(info_controller.economics_cache.get("economics"));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/economics").get(verifyEconomics, info_controller.GetEconomics);

module.exports = router;
