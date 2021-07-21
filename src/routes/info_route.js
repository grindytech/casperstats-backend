const router = require('express').Router();
const info_controller = require('../controllers/info_controller');

router.route("/get-deploy/:hex").get(info_controller.GetDeploy);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);
router.route("/get-type/:param").get(info_controller.GetType);
router.route("/get-circulating-supply/").get(info_controller.GetCirculatingSupply);
router.route("/get-supply/").get(info_controller.GetSupply);


// cache for daily transfer volume
const verifyGetTransferVolume = (req, res, next) => {
    try {
        const count = req.params.count;
        if (info_controller.transfer_volume_cache.has(`transfer-volume-${count}`)) {
            return res.status(200).json(info_controller.transfer_volume_cache.get(`transfer-volume-${count}`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-transfer-volume/:count").get(verifyGetTransferVolume, info_controller.GetTransferVolume);

// cache for daily volume
const verifyGetVolume = (req, res, next) => {
    try {
        console.log("come here");
        const count = req.params.count;
        if (info_controller.get_volume_cache.has(`get-volume-${count}`)) {
            return res.status(200).json(info_controller.get_volume_cache.get(`get-volume-${count}`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-volume/:count").get(verifyGetVolume, info_controller.GetVolume);

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
