const router = require('express').Router();
const chain_controller = require('../controllers/chain_controller');

const verifyBlock = (req, res, next) => {
    try {
        const block = req.params.block
        if (chain_controller.cache.has(block)) {
            return res.status(200).json(chain_controller.cache.get(block));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};

router.route("/get-block/:block").get(verifyBlock, chain_controller.GetBlock);

router.route("/get-latest-blocks/:number").get(chain_controller.GetLatestBlocks);
router.route("/get-block-transfers/:block").get(chain_controller.GetBlockTx);
router.route("/get-state-root-hash/:block").get(chain_controller.GetStateRootHash);
router.route("/get-range-block").get(chain_controller.GetRangeBlock);

router.route("/get-block-deploy/:block").get(chain_controller.GetBlockDeployTx);

// router for transaction
router.route("/count-transfers").get(chain_controller.CountTransfers);
router.route("/get-latest-txs/").get(chain_controller.GetLatestTx);

// blocks
router.route("/get-proposer-blocks").get(chain_controller.GetBlocksByProposer);
router.route("/status/").get(chain_controller.GetStatus);

module.exports = router;
