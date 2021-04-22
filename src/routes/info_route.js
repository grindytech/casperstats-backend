const router = require('express').Router();
const info_controller = require('../controllers/info_controller');

router.route("/get-deploy").get(info_controller.GetDeploy);
router.route("/get-list-deploys").get(info_controller.GetListDeploys);

module.exports = router;
