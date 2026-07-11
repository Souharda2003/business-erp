const multer = require("multer");

const path = require("path");

const fs = require("fs");

const BACKUP_FOLDER = path.join(
  __dirname,

  "..",

  "backups",
);

if (!fs.existsSync(BACKUP_FOLDER)) {
  fs.mkdirSync(
    BACKUP_FOLDER,

    {
      recursive: true,
    },
  );
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,

      BACKUP_FOLDER,
    );
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + "_" + file.originalname;

    cb(
      null,

      fileName,
    );
  },
});

const fileFilter = (
  req,

  file,

  cb,
) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".zip" || extension === ".sql") {
    cb(
      null,

      true,
    );
  } else {
    cb(
      new Error("Only ZIP and SQL files are allowed."),

      false,
    );
  }
};

const uploadBackup = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

module.exports = uploadBackup;
