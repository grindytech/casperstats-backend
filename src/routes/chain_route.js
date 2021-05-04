const router = require('express').Router();
const chain_controller = require('../controllers/chain_controller');

router.route("/get-block").get(chain_controller.GetBlock);
router.route("/get-latest-blocks").get(chain_controller.GetLatestBlocks);
router.route("/get-block-tranfers").get(chain_controller.GetBlockTx);
router.route("/get-state-root-hash").get(chain_controller.GetStateRootHash);
router.route("/get-transactions").get(chain_controller.GetTxBlock);
router.route("/get-range-block").get(chain_controller.GetRangeBlock);

module.exports = router;
