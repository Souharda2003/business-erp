const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.getAllUsers = (req, res) => {
  const sql = `

SELECT

id,

name,

mobile,

email,

role,

status,

created_at

FROM users

ORDER BY id DESC

`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
exports.deleteUser = (req, res) => {
  const id = req.params.id;
 const userName = req.user.name;
  db.query(
    "SELECT * FROM users WHERE id=?",

    [id],

    (err, user) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (user.length === 0) {
        return res.json({
          message: "User Not Found",
        });
      }

      db.query(
        "DELETE FROM users WHERE id=?",

        [id],

        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

saveActivity(
  req.user.id,
  req.user.name,
  "DELETE",
  "Users",
  `${user[0].name} deleted`
);
          res.json({
            success: true,

            message: "User Deleted",
          });
        },
      );
    },
  );
};
exports.changeStatus = (req, res) => {

  const {
    id,

    status,
  } = req.body;

  db.query(
    "UPDATE users SET status=? WHERE id=?",

    [status, id],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

saveActivity(
  req.user.id,
  req.user.name,
  "UPDATE",
  "Users",
  `User Status Changed to ${status}`
);
      res.json({
        success: true,
      });
    },
  );
};
