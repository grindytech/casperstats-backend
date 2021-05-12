const router = require("express").Router();
const path = require("path");

const account_route = require('./account_route');
const chain_route = require('./chain_route');
const info_route = require('./info_route');
const state_route = require('./state_route');

// API routes
router.use("/account", account_route);
router.use("/chain", chain_route);
router.use("/info", info_route);
router.use("/state", state_route);

// If no API routes are hit, send the React app
router.get("*", (req, res) => {
    res.status(500).send();
});

module.exports = router;
