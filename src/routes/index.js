const router = require("express").Router();
const path = require("path");

const block_route = require('./block_route');
const tx_route = require('./tx_route');
const deploy_route = require('./deploy_route');
const account_route = require('./account_route');

// API routes
router.use("/api/block", block_route); // route for the action relative to block
router.use("/api/tx", tx_route); // route for transaction
router.use("/api/deploy", deploy_route);
router.use("/api/account", account_route);

// If no API routes are hit, send the React app
router.get("*", (req, res) => {
    res.status(200);
    res.json("Welcome to Casper Stats");
});

module.exports = router;
