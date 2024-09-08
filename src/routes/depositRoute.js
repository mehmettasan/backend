const express = require("express")
const depositItemController = require("../controllers").depositItemController

const router = express.Router();

router.post("/addItems",depositItemController.addItems)


module.exports = router