const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");

const {
    
    getActivityLog
    
} = require("../controllers/activityController");
router.get(
    "/",
    auth,
    getActivityLog
);

module.exports = router;