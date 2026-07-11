const db = require("../config/db");

exports.getActivityLog = (req, res) => {

    console.log("Activity API Called");
  const userId = req.user.id;
const sql = `
SELECT
activity_log.*,
users.timezone
FROM activity_log
JOIN users
ON users.id = activity_log.user_id
WHERE activity_log.user_id=?
ORDER BY activity_log.created_at DESC
`;

db.query(sql,[userId],(err,result)=>{

    if(err){
        return res.status(500).json(err);
    }

    res.json(result);
});};