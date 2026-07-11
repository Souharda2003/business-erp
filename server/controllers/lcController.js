const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  console.log("BODY =", req.body);
  const {
    lc_number,
    bank_name,
    customer_name,
    invoice_no,
    customs_location,
    dollar_amount,
    issue_date,
    expiry_date,
  } = req.body;
  const payment_received = 0;

  const pending_amount = Number(dollar_amount);

  const status = "Pending";
  const sql = `
    INSERT INTO lc(
    user_id,
lc_number,
bank_name,
customer_name,
invoice_no,
customs_location,
dollar_amount,
issue_date,
expiry_date,
payment_received,
pending_amount,
status
)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
    `;

  db.query(
    sql,
    [
      userId,
      lc_number,
      bank_name,
      customer_name,
      invoice_no,
      customs_location,
      dollar_amount,
      issue_date,
      expiry_date,
      payment_received,
      pending_amount,
      status,
    ],
    (err) => {
      if (err) {
        console.log("MYSQL ERROR =", err);
        return res.status(500).json({
          success: false,
          error: err.sqlMessage,
          code: err.code,
        });
      }
      saveActivity(
        userId,
        userName,
        "ADD",

        "LC",

        `LC No ${lc_number} Added`,
      );
      res.json({
        success: true,
        message: "LC Saved Successfully",
      });
    },
  );
};

exports.getCurrentLC = (req, res) => {
  const userId = req.user.id;
  db.query(
    `
        SELECT
        COALESCE(SUM(dollar_amount),0) AS totalLC
        FROM lc WHERE user_id=?
        `,
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result[0]);
    },
  );
};
exports.getAllLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const sql = `
    SELECT
    l.*,
    CASE
    WHEN EXISTS(
        SELECT 1
        FROM sales s
        WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
AND s.payment_received>0
    )
    THEN 'Success'
    ELSE 'Pending'
    END AS status
    FROM lc l WHERE l.user_id=?
    ORDER BY l.issue_date DESC
    `;
  
  db.query(sql,[userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};
exports.getLCById = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const sql = `
    SELECT *
    FROM lc
    WHERE id=? AND user_id=?
    `;

  db.query(
    sql,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if(result.length===0){

return res.status(404).json({

success:false,

message:"LC Not Found"

});

}
      res.json(result[0]);
    },
  );
};
exports.updateLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const {
    lc_number,
    bank_name,
    invoice_no,
    customs_location,

    customer_name,
    dollar_amount,
    issue_date,
    expiry_date,
  } = req.body;
 db.query(
  "SELECT payment_received FROM lc WHERE id=? AND user_id=?",
  [req.params.id, userId],
  (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    const payment_received =
      result[0]?.payment_received || 0;

    const pending_amount =
      Number(dollar_amount) -
      Number(payment_received);

    const status =
      pending_amount <= 0 ? "Success" : "Pending";
  const sql = `
    UPDATE lc
    SET
    lc_number=?,
    invoice_no=?,
customs_location=?,
    bank_name=?,
    customer_name=?,
    dollar_amount=?,
    issue_date=?,
    expiry_date=?,
    payment_received=?,
    pending_amount=?,
    status=?
    WHERE id=? AND user_id=?
    `;
  db.query(
    sql,
    [
      lc_number,
      invoice_no,
      customs_location,
      bank_name,
      customer_name,
      dollar_amount,
      issue_date,
      expiry_date,
      payment_received,
      pending_amount,
      status,
      req.params.id,
      userId
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,
        "Admin",

        "UPDATE",

        "LC",

        `LC No ${lc_number} Updated`,
      );
      res.json({
        success: true,
        message: "LC Updated Successfully",
      });
    }
  );
  });
};

exports.deleteLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  db.query(
    `
       DELETE FROM lc
WHERE id=? AND user_id=?
        `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,
        "Admin",
        "DELETE",
        "LC",
        `LC Record Deleted`,
      );
      res.json({
        success: true,

        message: "LC Deleted Successfully",
      });
    },
  );
};
exports.searchLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const keyword = req.params.keyword;

  const sql = `
    SELECT *
FROM lc

WHERE user_id=?

AND
(
lc_number LIKE ?
OR bank_name LIKE ?
OR customer_name LIKE ?
)

ORDER BY id DESC
    `;

  db.query(
    sql,

    [userId, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.filterLC = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const { type, value, year } = req.query;
  let sql = "";
  let params = [];
  if (type === "month") {
    sql = `
SELECT
l.*,

COALESCE(
(
SELECT s.payment_received
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
LIMIT 1
),0
) AS payment_received,

CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
AND s.payment_received>0
)
THEN 'Success'
ELSE 'Pending'
END AS status

FROM lc l

WHERE user_id=?
AND MONTH(issue_date)=?
AND YEAR(issue_date)=?

ORDER BY issue_date DESC`;
    params = [
  userId,
  value,
  year
];
  } else if (type === "year") {
    sql = `
SELECT
l.*,

COALESCE(
(
SELECT s.payment_received
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id = l.user_id
LIMIT 1
),0
) AS payment_received,

CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
AND s.payment_received>0
)
THEN 'Success'
ELSE 'Pending'
END AS status

FROM lc l
WHERE user_id=?
AND YEAR(issue_date)=?

ORDER BY issue_date DESC
`;
    params = [
  userId,
  value
];
  } else if (type === "lc") {
    sql = `
SELECT
l.*,

COALESCE(
(
SELECT s.payment_received
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
LIMIT 1
),0
) AS payment_received,

CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=l.invoice_no
AND s.user_id=l.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status

FROM lc l

WHERE user_id=?
AND lc_number LIKE ?

ORDER BY issue_date DESC
`;
    params = [
  userId,
  `%${value}%`
];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
