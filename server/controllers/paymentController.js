const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addPayment = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  const {
    invoice_date,
    invoice_no,
    payment_date,
    customer_name,
    bank_name = "",
    payment_type,
    currency = "INR",
    amount,
    reference_no = "",
    remarks,
  } = req.body;

  db.query(
    "SELECT id FROM payment WHERE user_id=? AND invoice_no=?",

    [userId,invoice_no],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.status(400).json({
          success: false,

          message: "This Invoice No Payment Already Done",
        });
      }

      const sql = `

INSERT INTO payment(
user_id,
invoice_date,
invoice_no,
payment_date,
customer_name,
bank_name,
payment_type,
currency,
amount,
reference_no,
remarks

)

VALUES(?,?,?,?,?,?,?,?,?,?,?)

`;

      db.query(
        sql,

        [
          userId,
          invoice_date,
          invoice_no,
          payment_date,
          customer_name,
          bank_name,
          payment_type,
          currency,
          amount,
          reference_no,
          remarks,
        ],

        (err) => {
          if (err) {
            return res.status(500).json(err);
          }
          saveActivity(
            userId,
userName,
            "Payment",

            `Payment Added`,
          );
          res.json({
            success: true,

            message: "Payment Saved Successfully",
          });
        },
      );
    },
  );
};
exports.getPaymentSummary = (req, res) => {
   const userId = req.user.id;
  const sql = `

    SELECT

    (

        SELECT IFNULL(SUM(total_amount),0)

        FROM purchase WHERE user_id=?

    ) AS total_purchase,

    (

        SELECT IFNULL(SUM(amount),0)

        FROM payment p

        INNER JOIN purchase pur

        ON p.invoice_no = pur.invoice_no WHERE p.user_id=? AND pur.user_id=?

    ) AS total_payment

    `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    const purchase = Number(result[0].total_purchase || 0);

    const payment = Number(result[0].total_payment || 0);

    const difference = payment - purchase;

    let status = "DONE";

    let due_amount = 0;

    let advance_amount = 0;

    if (difference < 0) {
      status = "PENDING";

      due_amount = Math.abs(difference);
    } else if (difference > 0) {
      status = "ADVANCE";

      advance_amount = difference;
    }

    res.json({
      total_purchase: purchase,

      total_payment: payment,

      due_amount,

      advance_amount,

      status,
    });
  });
};
exports.getPaymentHistory = (req, res) => {
   const userId = req.user.id;
  const sql = `

    SELECT *

    FROM payment WHERE user_id=?

    ORDER BY payment_date DESC,id DESC

    `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
exports.deletePayment = (req, res) => {
   const userId = req.user.id;
const userName = req.user.name;
  const { id } = req.params;

  db.query(
    "DELETE FROM payment WHERE id=? AND user_id=?",

    [id,userId],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
userId,userName,
        "DELETE",

        "Payment",

        `Payment Deleted`,
      );
      res.json({
        success: true,

        message: "Payment Deleted",
      });
    },
  );
};
exports.filterPayment = (req, res) => {
   const userId = req.user.id;
  const { type, value, year } = req.query;

  let sql = "";
  let params = [];

  if (type === "month") {
    sql = `
SELECT

*,

'SUCCESS' AS status

FROM payment

WHERE user_id=? AND MONTH(payment_date)=?

AND YEAR(payment_date)=?

ORDER BY payment_date DESC
`;

    params = [userId,value, year];
  } else {
    sql = `
SELECT

*,

'SUCCESS' AS status

FROM payment

WHERE user_id=? AND YEAR(payment_date)=?

ORDER BY payment_date DESC
`;

    params = [userId,value];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.getPaymentById = (req, res) => {
   const userId = req.user.id;
  db.query(
    "SELECT * FROM payment WHERE id=? AND user_id=?",

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);
    },
  );
};
exports.updatePayment = (req, res) => {
   const userId = req.user.id;
const userName = req.user.name;
  const {
    invoice_date,
    invoice_no,
    payment_date,
    customer_name,
    payment_type,
    amount,
    remarks,
  } = req.body;

  db.query(
    `UPDATE payment
SET
invoice_date=?,
invoice_no=?,
payment_date=?,
customer_name=?,
payment_type=?,
amount=?,
remarks=?
WHERE id=?
AND user_id=?`,

    [
      invoice_date,
      invoice_no,
      payment_date,
      customer_name,
      payment_type,
      amount,
      remarks,
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
        "UPDATE",

        "Payment",

        `Payment Updated`,
      );
      res.json({
        success: true,

        message: "Payment Updated Successfully",
      });
    },
  );
};
