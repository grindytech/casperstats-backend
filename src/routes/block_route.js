const router = require('express').Router();
const block_controller = require('../controllers/block_controller');

router.route("/").get(block_controller.GetLatestBlock);

module.exports = router;
