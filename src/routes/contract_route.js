const router = require('express').Router();
const contract_controller = require('../controllers/contract_controller');

router.route("/get-contract").get(contract_controller.GetContract);


module.exports = router;
