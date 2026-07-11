const cron = require("node-cron");

const db = require("../config/db");

const { createBackup } = require("../services/backupService");

// =========================================
// Auto Backup Scheduler
// =========================================

function startAutoBackup() {
  console.log("================================");

  console.log("Auto Backup Scheduler Started");

  console.log("Backup Time : 11:00 PM Daily");

  console.log("================================");

  cron.schedule(
    "0 23 * * *",

    async () => {
      try {
        console.log("================================");

        console.log("Starting Auto Backup");

        console.log(new Date());

        console.log("================================");

        const result = await createBackup("System Auto Backup");

        if (result.success) {
          console.log("Backup Completed Successfully");

          db.query(
            `

                        INSERT INTO activity_log

                        (

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

                            ?

                        )

                        `,

            [
              "System",

              "Auto Backup",

              "Backup",

              "Automatic Daily Backup Completed",
            ],
          );
        } else {
          console.log("Backup Failed");

          db.query(
            `

                        INSERT INTO activity_log

                        (

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

                            ?

                        )

                        `,

            ["System", "Backup Failed", "Backup", result.message],
          );
        }
      } catch (error) {
        console.log(error);

        db.query(
          `

                    INSERT INTO activity_log

                    (

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

                        ?

                    )

                    `,

          ["System", "Backup Error", "Backup", error.message],
        );
      }
    },

    {
      timezone: "Asia/Kolkata",
    },
  );
}

module.exports = {
  startAutoBackup,
};
