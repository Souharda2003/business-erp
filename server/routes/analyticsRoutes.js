const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");

const {
  getAnalytics,
  getBusinessAnalytics
  
}=require("../controllers/analyticsController");

router.get("/summary", auth, getAnalytics);
router.get(
  "/business",
  auth,
  getBusinessAnalytics
);

module.exports = router;  