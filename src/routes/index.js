const router = require("express").Router();
const path = require("path");

const block_route = require('./block_route');
// API routes
router.use("/api/block", block_route);
// If no API routes are hit, send the React app
router.get("*", (req, res) => {
    res.status(200);
    res.json("Welcome to Casper Stats");
});

module.exports = router;
