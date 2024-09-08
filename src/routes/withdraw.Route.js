const express = require("express");
const router = express.Router();
const withDrawController = require("../controllers/withdrawController");
router.post("/withdrawRequest", withDrawController.handleWithdrawRequest);

module.exports = router;
