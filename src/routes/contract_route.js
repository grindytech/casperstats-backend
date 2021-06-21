const router = require('express').Router();
const contract_controller = require('../controllers/contract_controller');

router.route("/get-contract").get(contract_controller.GetContract);
router.route("/deploy").post(contract_controller.DeployContract);


module.exports = router;
