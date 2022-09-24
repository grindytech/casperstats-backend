const router = require('express').Router();
const chain_controller = require('../controllers/chain_controller');

const verifyBlock = (req, res, next) => {
    try {
        const block = req.params.block
        if (chain_controller.get_block_cache.has(block)) {
            return res.status(200).json(chain_controller.get_block_cache.get(block));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};

router.route("/get-block/:block").get(verifyBlock, chain_controller.GetBlock);

const verifyLatestBlock = (req, res, next) => {
    try {
        const num = req.params.number
        if (chain_controller.get_latest_block_cache.has(num)) {
            return res.status(200).json(chain_controller.get_latest_block_cache.get(num));
        }
        return next();
    } catch (err) {  
        throw new Error(err);
    }
};

router.route("/get-latest-blocks/:number").get(verifyLatestBlock, chain_controller.GetLatestBlocks);

const verifyBlockTransfers = (req, res, next) => {
    try {
        const block = req.params.block
        if (chain_controller.get_block_transfers_cache.has(block)) {
            return res.status(200).json(chain_controller.get_block_transfers_cache.get(block));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-block-transfers/:block").get(verifyBlockTransfers, chain_controller.GetBlockTx);
router.route("/get-state-root-hash/:block").get(chain_controller.GetStateRootHash);
router.route("/get-range-block").get(chain_controller.GetRangeBlock);

const verifyBlockDeploys = (req, res, next) => {
    try {
        const block = req.params.block
        if (chain_controller.get_block_deploys_cache.has(block)) {
            return res.status(200).json(chain_controller.get_block_deploys_cache.get(block));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-block-deploy/:block").get(verifyBlockDeploys, chain_controller.GetBlockDeployTx);

// router for transaction
router.route("/count-transfers").get(chain_controller.CountTransfers);

const verifyLatestTx = (req, res, next) => {
    try {
        const start = req.query.start
        const count = req.query.count
        if (chain_controller.get_latest_tx_cache.has(`'${start}'-'${count}'`)) {
            return res.status(200).json(chain_controller.get_latest_tx_cache.get(`'${start}'-'${count}'`));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};
router.route("/get-latest-txs/").get(verifyLatestTx, chain_controller.GetLatestTx);

// blocks
router.route("/get-proposer-blocks").get(chain_controller.GetBlocksByProposer);

// status
router.route("/status/").get(chain_controller.GetStatus);
router.route("/get-network-rpc").get(chain_controller.GetNetworkRPC);
router.route("/get-block-time").get(chain_controller.GetBlockTime);

module.exports = router;
