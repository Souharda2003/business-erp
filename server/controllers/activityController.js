const db = require("../config/db");

exports.getActivityLog = (req, res) => {

    console.log("Activity API Called");
  const userId = req.user.id;
    const sql = `
        SELECT *
        FROM activity_log
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql,[userId], (err, result) => {

        if (err) {

            console.log("SQL ERROR");

            console.log(err);

            return res.status(500).json(err);

        }

        console.log("Activity Result =", result);

        res.json(result);

    });

};