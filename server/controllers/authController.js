const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saveActivity = require("../utils/saveActivity");

exports.register = (req, res) => {
  const { name, mobile, email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE mobile=? OR email=?",
    [mobile, email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.length > 0) {
        return res.json({
          success: false,
          message: "User Already Exists",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      db.query(
        `
        INSERT INTO users
        (
            name,
            mobile,
            email,
            password
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
        `,
        [name, mobile, email, hash],
        (err, insertResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Registration Failed",
            });
          }

       saveActivity(
  insertResult.insertId,
  name,
  "REGISTER",
  "Authentication",
  `${name} created new account`
);

          return res.json({
            success: true,
            message: "Registration Successful",
          });
        },
      );
    },
  );
};

exports.login = (req, res) => {
  const { mobile, password, timezone } = req.body;
  console.log("REQ BODY =", req.body);
  console.log("TIMEZONE =", timezone);
  db.query(
    "SELECT * FROM users WHERE mobile=?",

    [mobile],

    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,

          message: "Database Error",
        });
      }

      if (result.length == 0) {
        return res.json({
          success: false,

          message: "User Not Found",
        });
      }

      const currentUser = result[0];

      if (
        currentUser.account_locked == 1 &&
        currentUser.lock_until &&
        new Date(currentUser.lock_until) > new Date()
      ) {
        return res.json({
          success: false,

          message: "Account Locked. Try Again Later.",
        });
      }

      const valid = await bcrypt.compare(
        password,

        currentUser.password,
      );

      if (!valid) {
        const failed = Number(currentUser.failed_login_attempt || 0) + 1;

        if (failed >= 5) {
          const lockTime = new Date(Date.now() + 15 * 60 * 1000);

          db.query(
            `
            UPDATE users
            SET
            failed_login_attempt=?,
            account_locked=1,
            lock_until=?
            WHERE id=?
            `,

            [failed, lockTime, currentUser.id],
          );

          return res.json({
            success: false,

            message: "Account Locked For 15 Minutes",
          });
        }

        db.query(
          `
          UPDATE users
          SET failed_login_attempt=?
          WHERE id=?
          `,

          [failed, currentUser.id],
        );

        return res.json({
          success: false,

          message: "Wrong Password",
        });
      }

      db.query(
        `
       UPDATE users
SET
failed_login_attempt=0,
account_locked=0,
lock_until=NULL,
last_login=NOW(),
timezone=?
WHERE id=?
        `,

        [timezone, currentUser.id],
      );

      db.query(
        `
        INSERT INTO login_history
        (
        user_id,
        login_time,
        status
        )
        VALUES
        (
        ?,
        NOW(),
        'ACTIVE'
        )
        `,

        [currentUser.id],
      );
      const token = jwt.sign(
        {
          id: currentUser.id,

          tokenVersion: currentUser.token_version || 0,
        },

        "tradeerpsecret",

        {
          expiresIn: "7d",
        },
      );

    saveActivity(
  currentUser.id,
  currentUser.name,
  "LOGIN",
  "Authentication",
  `${currentUser.name} logged in`
);

      return res.json({
        success: true,

        token,

        user: {
          id: currentUser.id,

          name: currentUser.name,

          email: currentUser.email,

          mobile: currentUser.mobile,

          role: currentUser.role,
          timezone: timezone
        },
      });
    },
  );
};
exports.changePassword = (req, res) => {
  const userId = req.user.id;

  const { newPassword } = req.body;

  db.query(
    "SELECT * FROM users WHERE id=?",

    [userId],

    async (err, userResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
        });
      }

      if (userResult.length == 0) {
        return res.json({
          success: false,

          message: "User Not Found",
        });
      }

      const user = userResult[0];

      const same = await bcrypt.compare(
        newPassword,

        user.password,
      );

      if (same) {
        return res.json({
          success: false,

          message: "New Password cannot be same as current password",
        });
      }

      db.query(
        `
        SELECT password
        FROM password_history
        WHERE user_id=?
        ORDER BY id DESC
        LIMIT 3
        `,

        [userId],

        async (err, history) => {
          if (err) {
            return res.status(500).json({
              success: false,
            });
          }

          for (const item of history) {
            const used = await bcrypt.compare(
              newPassword,

              item.password,
            );

            if (used) {
              return res.json({
                success: false,

                message: "You cannot use last 3 passwords",
              });
            }
          }

          const hash = await bcrypt.hash(
            newPassword,

            10,
          );

          db.query(
            `
          UPDATE users

SET

password=?,

password_changed_at=NOW(),

token_version=token_version+1

WHERE id=?
            `,

            [hash, userId],

            (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                });
              }

              db.query(
                `
                INSERT INTO password_history
                (
                user_id,
                password
                )
                VALUES
                (
                ?,
                ?
                )
                `,

                [userId, hash],
              );

          saveActivity(
  userId,
  user.name,
  "PASSWORD CHANGE",
  "Security",
  `${user.name} changed account password`
);

              return res.json({
                success: true,

                message: "Password Updated Successfully",
              });
            },
          );
        },
      );
    },
  );
};
exports.logout = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    UPDATE login_history

    SET

    logout_time=NOW(),

    status='LOGOUT'

    WHERE

    user_id=?

    AND status='ACTIVE'
    `,

    [userId],
  );

  db.query(
    `
 UPDATE users

SET

last_logout=NOW(),

token_version=token_version+1

WHERE id=?
    `,

    [userId],
  );

saveActivity(
  userId,
  req.user.name,
  "LOGOUT",
  "Authentication",
  "User Logged Out"
);;

  return res.json({
    success: true,

    message: "Logout Successful",
  });
};
