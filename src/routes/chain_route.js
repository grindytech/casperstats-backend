const router = require('express').Router();
const chain_controller = require('../controllers/chain_controller');

router.route("/get-block/:block").get(chain_controller.GetBlock);
router.route("/get-latest-blocks/:number").get(chain_controller.GetLatestBlocks);
router.route("/get-block-transfers/:block").get(chain_controller.GetBlockTx);
router.route("/get-state-root-hash/:block").get(chain_controller.GetStateRootHash);
router.route("/get-range-block").get(chain_controller.GetRangeBlock);

router.route("/get-block-transfer/:block").get(chain_controller.GetBlockTransferTx);
router.route("/get-block-deploy/:block").get(chain_controller.GetBlockDeployTx);

// router for transaction
router.route("/get-total-tx").get(chain_controller.GetTotalNumberTx);
router.route("/get-latest-txs/:number").get(chain_controller.GetLatestTx);

// blocks
router.route("/get-proposer-blocks").get(chain_controller.GetBlocksByProposer);

module.exports = router;
