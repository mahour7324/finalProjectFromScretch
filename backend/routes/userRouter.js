const express = require("express");
const { registerUser, loginUser ,logout} = require("../controller/userController");
const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout);
// router.route("/password/forgot").post(forgotPassword);

module.exports = router;