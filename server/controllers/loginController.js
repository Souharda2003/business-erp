const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const {
    mobile,

    password,
  } = req.body;

  db.query(
    "SELECT * FROM users WHERE mobile=?",

    [mobile],

    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.json({
          success: false,

          message: "User Not Found",
        });
      }

      const user = result[0];
      if (user.status !== "Active") {
        return res.json({
          success: false,

          message: "Your Account is Disabled",
        });
      }

      const match = await bcrypt.compare(
        password,

        user.password,
      );

      if (!match) {
        return res.json({
          success: false,

          message: "Wrong Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,

          name: user.name,

          role: user.role,
        },

        "tradeerpsecret",

        {
          expiresIn: "7d",
        },
      );

      res.json({
        success: true,

        message: "Login Successful",

        token,

        user: {
          id: user.id,

          name: user.name,

          mobile: user.mobile,

          email: user.email,

          role: user.role,

          status: user.status,
        },
      });
    },
  );
};
