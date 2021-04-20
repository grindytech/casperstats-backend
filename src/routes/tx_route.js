const router = require('express').Router();
const tx_controller = require('../controllers/tx_controller');

router.route("/block").get(tx_controller.GetBlockTx);

module.exports = router;
