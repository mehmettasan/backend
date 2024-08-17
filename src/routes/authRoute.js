const express = require("express")
const authController = require("../controllers").authController

const router = express.Router();

router.post("/register",authController.register)
router.post("/login",authController.login)
router.get("/verificition",authController.eMailVerificition)
router.post("/forgotpassword",authController.forgotPassword)
router.post("/resetPassword",authController.resetPassword)

module.exports = router