// backend/routes/backupRoutes.js

const express = require("express");

const router = express.Router();
const upload=require("../middleware/uploadBackup");
const {

createManualBackup,

getAllBackupHistory,

getBackupStatus,

latestBackup,

downloadBackup,

restoreBackupController,

deleteBackupController,

backupHealth,

uploadBackupController

} = require("../controllers/backupController");

// =======================================
// Manual Backup
// =======================================

router.post(
  "/create",

  createManualBackup,
);

// =======================================
// Backup History
// =======================================

router.get(
  "/history",

  getAllBackupHistory,
);

// =======================================
// Backup Status
// =======================================

router.get(
  "/status",

  getBackupStatus,
);

// =======================================
// Latest Backup
// =======================================

router.get(
  "/latest",

  latestBackup,
);

// =======================================
// Download Backup
// =======================================

router.get(
  "/download/:fileName",

  downloadBackup,
);

// =======================================
// Restore Backup
// =======================================

router.post(
  "/restore/:fileName",

  restoreBackupController,
);

// =======================================
// Delete Backup
// =======================================

router.delete(
  "/delete/:fileName",

  deleteBackupController,
);

router.get(
  "/health",

  backupHealth,
);
router.post(
  "/upload",

  upload.single("backup"),

  uploadBackupController,
);
module.exports = router;
