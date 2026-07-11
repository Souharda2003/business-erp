const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfitHistory,
  getProfitSummary,
  getProfile,

  updateProfile,
  deleteProfile,
} = require("../controllers/profitController");

router.get("/history",auth, getProfitHistory);
router.get("/summary",auth, getProfitSummary);
router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.delete(
  "/",

  auth,

  deleteProfile,
);
module.exports = router;
