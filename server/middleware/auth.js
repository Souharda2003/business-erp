const jwt = require("jsonwebtoken");
const db = require("../config/db");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,

      message: "No Token",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, "tradeerpsecret");

    db.query(
      "SELECT token_version FROM users WHERE id=?",

      [decoded.id],

      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,

            message: "Database Error",
          });
        }

        if (result.length === 0) {
          return res.status(401).json({
            success: false,

            message: "User Not Found",
          });
        }

        if (result[0].token_version !== decoded.tokenVersion) {
          return res.status(401).json({
            success: false,

            message: "Session Expired. Login Again.",
          });
        }

        req.user = decoded;

        next();
      },
    );
  } catch (err) {
    return res.status(401).json({
      success: false,

      message: "Invalid Token",
    });
  }
};

module.exports = auth;
