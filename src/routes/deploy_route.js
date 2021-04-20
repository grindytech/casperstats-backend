const router = require('express').Router();
const deploy_controller = require('../controllers/deploy_controller');

router.route("/").get(deploy_controller.GetDeploy);
router.route("/block").get(deploy_controller.GetDeployBlock);

module.exports = router;
