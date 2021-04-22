const router = require('express').Router();
const chain_controller = require('../controllers/chain_controller');

router.route("/get-block").get(chain_controller.GetBlock);
router.route("/get-block-tranfers").get(chain_controller.GetBlockTx);
router.route("/get-state-root-hash").get(chain_controller.GetStateRootHash);

module.exports = router;
