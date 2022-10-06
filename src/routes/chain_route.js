const router = require("express").Router();
const chain_controller = require("../controllers/chain_controller");

const verifyBlock = (req, res, next) => {
  try {
    const block = req.params.block;
    if (chain_controller.get_block_cache.has(block)) {
      return res.status(200).json(chain_controller.get_block_cache.get(block));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

router.route("/get-block/:block").get(verifyBlock, chain_controller.getBlock);
router
  .route("/get-latest-blocks/:number")
  .get(chain_controller.getLatestBlocks);

const verifyBlockTransfers = (req, res, next) => {
  try {
    const block = req.params.block;
    if (chain_controller.get_block_transfers_cache.has(block)) {
      return res
        .status(200)
        .json(chain_controller.get_block_transfers_cache.get(block));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-block-transfers/:block")
  .get(verifyBlockTransfers, chain_controller.getBlockTx);
router
  .route("/get-state-root-hash/:block")
  .get(chain_controller.GetStateRootHash);
router.route("/get-range-block").get(chain_controller.getRangeBlock);

const verifyBlockDeploys = (req, res, next) => {
  try {
    const block = req.params.block;
    if (chain_controller.get_block_deploys_cache.has(block)) {
      return res
        .status(200)
        .json(chain_controller.get_block_deploys_cache.get(block));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
router
  .route("/get-block-deploy/:block")
  .get(verifyBlockDeploys, chain_controller.getBlockDeployTx);

// router for transaction
router.route("/count-transfers").get(chain_controller.countTransfers);
router.route("/get-latest-txs/").get(chain_controller.getLatestTx);

// blocks
router.route("/get-proposer-blocks").get(chain_controller.getBlocksByProposer);

// status
router.route("/status/").get(chain_controller.getStatus);
router.route("/get-network-rpc").get(chain_controller.getNetworkRPC);
router.route("/get-block-time").get(chain_controller.getBlockTime);

module.exports = router;
