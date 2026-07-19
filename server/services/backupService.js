const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const mysqldump = require("mysqldump");
const db = require("../config/db");
const BACKUP_DIR = path.join(__dirname, "..", "backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function getDateTime() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hour = String(now.getHours()).padStart(2, "0");

  const minute = String(now.getMinutes()).padStart(2, "0");

  const second = String(now.getSeconds()).padStart(2, "0");

  return {
    fileName: `ERP_Backup_${year}_${month}_${day}_${hour}_${minute}_${second}`,

    displayDate: `${day}-${month}-${year}`,

    displayTime: `${hour}:${minute}:${second}`,
  };
}

async function createBackup(user = "System") {
  try {
    const dateInfo = getDateTime();

    const sqlPath = path.join(
      BACKUP_DIR,

      `${dateInfo.fileName}.sql`,
    );

    const zipPath = path.join(
      BACKUP_DIR,

      `${dateInfo.fileName}.zip`,
    );

    await mysqldump({
      connection: {
        host: process.env.DB_HOST,

        port: process.env.DB_PORT,

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD,

        database: process.env.DB_NAME,
      },

      dumpToFile: sqlPath,
    });

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);

      const archive = archiver("zip", {
        zlib: {
          level: 9,
        },
      });

      output.on("close", () => {
        resolve();
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);

      archive.file(sqlPath, {
        name: path.basename(sqlPath),
      });

      archive.finalize();
    });

    if (fs.existsSync(sqlPath)) {
      fs.unlinkSync(sqlPath);
    }

    const stats = fs.statSync(zipPath);

    const backupSize =

(stats.size/1024/1024).toFixed(2);

    const backupData = {
      backup_name: `${dateInfo.fileName}.zip`,

      backup_date: dateInfo.displayDate,

      backup_time: dateInfo.displayTime,

      backup_size: backupSize + " MB",

      status: "Success",

      created_by: user,
    };

    db.query(
      `INSERT INTO backup_history
            (
                backup_name,
                backup_date,
                backup_time,
                backup_size,
                status,
                created_by
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,

      [
        backupData.backup_name,

        backupData.backup_date,

        backupData.backup_time,

        backupData.backup_size,

        backupData.status,

        backupData.created_by,
      ],
    );

    db.query(
      `INSERT INTO activity_log

(
user_id,
user_name,

action,

module_name,

description

)

VALUES

(
?,
?,

?,

?,

?

)`,

      [1,user, "Create", "Backup", "Manual Backup Created"],
    );
    return {
      success: true,

      message: "Backup Created Successfully",

      backup: backupData,

      download: "/api/backup/download/" + backupData.backup_name,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,

      message: error.message,
    };
  }
}

function getBackupHistory() {
  return new Promise((resolve, reject) => {
    db.query(
      `

            SELECT *

            FROM backup_history

            ORDER BY id DESC

            `,

      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
}

function getBackupFile(fileName) {
  const filePath = path.join(
    BACKUP_DIR,

    fileName,
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return filePath;
}
// =========================
// Part - 1C
// Continue backupService.js
// =========================

const { exec } = require("child_process");

function deleteBackup(fileName, user = "System") {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.join(BACKUP_DIR, fileName);

      if (!fs.existsSync(filePath)) {
        return resolve({
          success: false,

          message: "Backup File Not Found",
        });
      }

      fs.unlinkSync(filePath);

      db.query(
        "DELETE FROM backup_history WHERE backup_name=?",

        [fileName],
      );

      db.query(
        `INSERT INTO activity_log
                (
        user_id,
                    user_name,
                    action,
                    module_name,
                    description
                )
                VALUES
                (
                ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,

        [1,user, "Delete", "Backup", `${fileName} backup deleted`],
      );
      if (!fs.existsSync(filePath)) {
        return resolve({
          success: false,

          message: "Backup File Not Found",
        });
      }
      resolve({
        success: true,

        message: "Backup Deleted Successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getLatestBackup() {
  return new Promise((resolve, reject) => {
    db.query(
      `

            SELECT *

            FROM backup_history

            ORDER BY id DESC

            LIMIT 1

            `,

      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length ? result[0] : null);
        }
      },
    );
  });
}

function restoreBackup(fileName, user = "System") {
  return new Promise((resolve, reject) => {
    try {
      const zipPath = path.join(BACKUP_DIR, fileName);

      if (!fs.existsSync(zipPath)) {
        return resolve({
          success: false,

          message: "Backup File Not Found",
        });
      }

      const extractFolder = path.join(
        BACKUP_DIR,

        "restore_temp",
      );

      if (!fs.existsSync(extractFolder)) {
        fs.mkdirSync(extractFolder);
      }

      const unzipper = require("unzipper");

      fs.createReadStream(zipPath)

        .pipe(
          unzipper.Extract({
            path: extractFolder,
          }),
        )

        .on("close", () => {
          const sqlFile = fs
            .readdirSync(extractFolder)

            .find((file) => file.endsWith(".sql"));

          if (!sqlFile) {
            return reject(new Error("SQL File Not Found"));
          }

          const sqlPath = path.join(
            extractFolder,

            sqlFile,
          );

          const command =
            `mysql -h ${process.env.DB_HOST} ` +
            `-P ${process.env.DB_PORT} ` +
            `-u ${process.env.DB_USER} ` +
            `-p${process.env.DB_PASSWORD} ` +
            `${process.env.DB_NAME} < "${sqlPath}"`;

          exec(command, (err) => {
            if (err) {
              return reject(err);
            }

            db.query(
              `INSERT INTO activity_log
                            (
              user_id,
                                user_name,
                                action,
                                module_name,
                                description
                            )
                            VALUES
                            (
                            ?,
                                ?,
                                ?,
                                ?,
                                ?
                            )`,

              [1,user, "Restore", "Backup", `${fileName} restored successfully`],
            );
            if (fs.existsSync(extractFolder)) {
              fs.rmSync(
                extractFolder,

                {
                  recursive: true,

                  force: true,
                },
              );
            }
            resolve({
              success: true,

              message: "Restore Completed Successfully",
            });
          });
        });
    } catch (error) {
      reject(error);
    }
  });
}

async function autoBackup() {

    console.log("Auto Backup Running...");

    return await createBackup("Auto Scheduler");

}

function uploadBackup(file){

return{

success:true,

file:file.filename

};
}
module.exports = {
  createBackup,

  getBackupHistory,

  getBackupFile,

  deleteBackup,

  restoreBackup,

  getLatestBackup,

  autoBackup,
  uploadBackup
};

