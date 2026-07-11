const express = require("express");

const router = express.Router();

const auth=require("../middleware/auth");
const reportController = require("../controllers/reportController");
const {
  getDashboard,getPurchaseTrend,
  getAccountingSummary,
} = require("../controllers/reportController");

router.get("/dashboard", auth,getDashboard);
router.get(

"/purchase-trend",

auth,

reportController.getPurchaseTrend

);
router.get(
  "/accounting-summary",auth,
  getAccountingSummary
);

module.exports = router;