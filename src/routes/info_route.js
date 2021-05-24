const router = require('express').Router();
const info_controller = require('../controllers/info_controller');

router.route("/get-deploy/:hex").get(info_controller.GetDeploy);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);
router.route("/get-type/:param").get(info_controller.GetType);
router.route("/get-circle-supply/").get(info_controller.GetCircleSupply);
router.route("/get-transfer-volume/:count").get(info_controller.GetTransferVolume);

module.exports = router;
