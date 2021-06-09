const router = require('express').Router();
const info_controller = require('../controllers/info_controller');

router.route("/get-deploy/:hex").get(info_controller.GetDeploy);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);
router.route("/get-type/:param").get(info_controller.GetType);
router.route("/get-circulating-supply/").get(info_controller.GetCirculatingSupply);
router.route("/get-supply/").get(info_controller.GetSupply);
router.route("/get-transfer-volume/:count").get(info_controller.GetTransferVolume);
router.route("/get-volume/:count").get(info_controller.GetVolume);
router.route("/get-stats").get(info_controller.GetStats);

module.exports = router;
