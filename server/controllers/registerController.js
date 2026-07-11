const db = require("../config/db");

const bcrypt = require("bcrypt");

exports.register = (req, res) => {
  const {
    name,

    mobile,

    email,

    password,
  } = req.body;

  const mobileRegex = /^[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,

      message: "Invalid Mobile Number",
    });
  }

  db.query(
    "SELECT * FROM users WHERE mobile=? OR email=?",

    [mobile, email],

    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.json({
          success: false,

          message: "User Already Exists",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      db.query(
        `INSERT INTO users

(name,mobile,email,password)

VALUES(?,?,?,?)`,

        [name, mobile, email, hashPassword],

        (err, data) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,

            message: "Register Success",
          });
        },
      );
    },
  );
};
