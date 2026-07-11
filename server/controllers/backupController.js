const service = require("../services/backupService");

console.log(service);
const {

createBackup,

getBackupHistory,

getBackupFile,

restoreBackup,

deleteBackup,

getLatestBackup,

uploadBackup

}

=
require("../services/backupService");
exports.createManualBackup = async (req, res) => {
  try {
    const userName = req.body.user_name || req.body.user || "Admin";

    const result = await createBackup(userName);

    if (!result.success) {
      return res.status(500).json({
        success: false,

        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Backup Created Successfully",

      data: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =============================
// Backup History
// =============================

exports.getAllBackupHistory = async (req, res) => {
  try {
    const history = await getBackupHistory();

    return res.status(200).json({
      success: true,

      total: history.length,

      data: history,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =============================
// Backup Status
// =============================

exports.getBackupStatus = async (req, res) => {
  try {
    const history = await getBackupHistory();

    if (history.length === 0) {
      return res.json({
        success: true,

        backupExists: false,

        lastBackup: null,
      });
    }

    return res.json({
      success: true,

      backupExists: true,

      lastBackup: history[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    const filePath = getBackupFile(fileName);

    if (!filePath) {
      return res.status(404).json({
        success: false,

        message: "Backup File Not Found",
      });
    }

    return res.download(
      filePath,

      fileName,

      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// Get Latest Backup
// =====================================

exports.latestBackup = async (req, res) => {
  try {
    const latest = await getLatestBackup();

    if (!latest) {
      return res.json({
        success: true,

        backupExists: false,

        data: null,
      });
    }

    return res.json({
      success: true,

      backupExists: true,

      data: latest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
// =====================================
// Restore Backup
// =====================================

exports.restoreBackupController = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    const userName = req.body.user_name || req.body.user || "Admin";

    const result = await restoreBackup(
      fileName,

      userName,
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,

        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Backup Restored Successfully",

      data: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// Delete Backup
// =====================================

exports.deleteBackupController = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    const userName = req.body.user_name || req.body.user || "Admin";

    const result = await deleteBackup(
      fileName,

      userName,
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,

        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Backup Deleted Successfully",

      data: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// Backup Health Check
// =====================================

exports.backupHealth = async (req, res) => {
  try {
    const latest = await getLatestBackup();

    return res.status(200).json({
      success: true,

      server: "Running",

      backup_status: latest ? "Available" : "Not Available",

      last_backup: latest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
// =====================================
// Upload Backup
// =====================================

exports.uploadBackupController = async (

    req,

    res

) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No Backup File Selected"

            });

        }

        return res.json({

            success: true,

            message: "Backup Uploaded Successfully",

            file: req.file.filename

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
