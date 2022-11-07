const router = require("express").Router();

const account_route = require("./account_route");
const chain_route = require("./chain_route");
const info_route = require("./info_route");
const state_route = require("./state_route");
const contract_route = require("./contract_route");
const validator_roure = require("./validator_route");
const address_roure = require("./address_route");

// API routes
router.use("/account", account_route);
router.use("/chain", chain_route);
router.use("/info", info_route);
router.use("/state", state_route);
router.use("/contract", contract_route);
router.use("/validator", validator_roure);
router.use("/address", address_roure);

// If no API routes are hit, send the error
router.get("*", (req, res) => {
  res.status(500).send();
});

module.exports = router;
