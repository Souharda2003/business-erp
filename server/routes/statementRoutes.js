const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const { getStatement } = require("../controllers/statementController");

router.get(
  "/",

  auth,

  getStatement,
);

module.exports = router;
