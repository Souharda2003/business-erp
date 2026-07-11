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
VALUES
(
?,
?,
?,
?,
?
)
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
      console.log("INSERT ERROR");
      console.log(err);
      return reject(err);
    }

    console.log("INSERT SUCCESS");
    console.log(result);

    resolve(result);
  }
);
  });
};

module.exports = saveActivity;