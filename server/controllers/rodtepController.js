const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addRODTEP = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  const {
    bill_no,
    licence_no,
    date_of_issue,
    total_credit,
    hsn,
    rate,
    add_gst_rate,
    tcs_rate,
    round_off,
    financial_year,
    amount,
  } = req.body;

  const sql = `

    INSERT INTO rodtep(
        user_id,
        bill_no,
        licence_no,
        date_of_issue,
        total_credit,
        hsn,
        rate,
        add_gst_rate,
        tcs_rate,
        round_off,
        financial_year,
        amount

    )

    VALUES(

       ?, ?,?,?,?,?,?,?,?,?,?,?

    )

    `;

  db.query(
    sql,

    [
      userId,
      bill_no,
      licence_no,
      date_of_issue,
      total_credit,
      hsn,
      rate,
      add_gst_rate,
      tcs_rate,
      round_off,
      financial_year,
      amount,
    ],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
 userName,
        "ADD",

        "RODTEP",

        `RODTEP Bill ${bill_no} Added`,
      );
      res.json({
        success: true,

        message: "RODTEP Saved Successfully",
      });
    },
  );
};
exports.getRODTEP = (req, res) => {
  const userId=req.user.id;
  db.query(
    `

        SELECT *

        FROM rodtep
        WHERE user_id=?
        ORDER BY date_of_issue DESC

        `,
[userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getRODTEPById = (req, res) => {
const userId=req.user.id;
  db.query(
    `

        SELECT *

        FROM rodtep

        WHERE id=? AND user_id=?

        `,

    [req.params.id,userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);
    },
  );
};
exports.updateRODTEP = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  console.log(req.body);
  console.log("PARAM ID =", req.params.id);
  const {
    bill_no,
    licence_no,
    date_of_issue,
    total_credit,
    hsn,
    rate,
    add_gst_rate,
    tcs_rate,
    round_off,
    financial_year,
    amount,
  } = req.body;

  db.query(
    `

        UPDATE rodtep

        SET

        bill_no=?,

        licence_no=?,

        date_of_issue=?,

        total_credit=?,

        hsn=?,

        rate=?,

        add_gst_rate=?,

        tcs_rate=?,

        round_off=?,
        financial_year=?,
        amount=?

        WHERE id=?
        AND user_id=?

        `,

    [
      bill_no,

      licence_no,

      date_of_issue,

      total_credit,

      hsn,

      rate,

      add_gst_rate,

      tcs_rate,

      round_off,
      financial_year,
      amount,

      req.params.id,
      userId
    ],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,userName,

        "UPDATE",

        "RODTEP",

        `RODTEP Bill ${bill_no} Updated`,
      );
      res.json({
        success: true,

        message: "RODTEP Updated Successfully",
      });
    },
  );
};
exports.deleteRODTEP = (req, res) => {
   const userId = req.user.id;
const userName = req.user.name;
  db.query(
    `

        DELETE FROM rodtep

        WHERE id=?
        AND user_id=?

        `,

    [req.params.id,userId],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity( userId, userName,

        "DELETE",

        "RODTEP",

        `RODTEP Bill Deleted`,
      );
      res.json({
        success: true,

        message: "RODTEP Deleted Successfully",
      });
    },
  );
};
exports.searchRODTEP = (req, res) => {
  const userId=req.user.id;
  const keyword = req.params.keyword;

  db.query(
    `
SELECT *

FROM rodtep

WHERE user_id=?

AND(

bill_no LIKE ?

OR licence_no LIKE ?

OR hsn LIKE ?

OR financial_year LIKE ?

)

ORDER BY date_of_issue DESC

        `,

    [userId,`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.filterRODTEP = (req, res) => {
  const userId=req.user.id;
  const {
    type,

    value,

    year,
  } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

        SELECT *

        FROM rodtep

        WHERE user_id=? AND MONTH(date_of_issue)=?

        AND YEAR(date_of_issue)=?

        ORDER BY date_of_issue DESC

        `;

    params = [userId,value, year];
  } else if (type === "year") {
    sql = `

        SELECT *

        FROM rodtep

        WHERE user_id=? AND  YEAR(date_of_issue)=?

        ORDER BY date_of_issue DESC

        `;

    params = [userId,value];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
