const db = require("../config/db");

const saveActivity = (
  user_id,
  user_name,
  action,
  module_name,
  description
) => {
  db.query(
    `
    INSERT INTO activity_log
    (
      user_id,
      user_name,
      action,
      module_name,
      description
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      user_id,
      user_name,
      action,
      module_name,
      description,
    ],
    (err) => {
      if (err) {
        console.error("Activity Log Error:", err.message);
        return;
      }
    }
  );
};

module.exports = saveActivity;