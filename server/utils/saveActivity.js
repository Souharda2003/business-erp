const db = require("../config/db");

const saveActivity = (
  user_id,
  user_name,
  action,
  module_name,
  description
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO activity_log
      (
        user_id,
        user_name,
        action,
        module_name,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_id || null,
        user_name || "Unknown User",
        action,
        module_name,
        description,
      ],
      (err, result) => {
        if (err) {
          console.error("Activity Log Error:", err.message);
          return reject(err);
        }

        resolve(result);
      }
    );
  });
};

module.exports = saveActivity;