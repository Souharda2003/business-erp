const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  register,

  login,

  changePassword,

  logout,
} = require("../controllers/authController");

const {
  sendOTP,

  verifyOTP,

  resetPassword,

  resendOTP,
} = require("../controllers/otpController");

// Authentication

router.post("/register", register);

router.post("/login", login);

router.post("/logout", auth, logout);

// Password

router.put("/change-password", auth, changePassword);

// Forgot Password OTP

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

router.post("/resend-otp", resendOTP);

module.exports = router;
