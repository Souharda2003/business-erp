const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addGST = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    invoice_no,
    taxable_amount,
    gst_percentage,
    gst_amount,
    invoice_date,
  } = req.body;

  db.query(
    `

    INSERT INTO gst(

      user_id,
      invoice_no,
      taxable_amount,
      gst_percentage,
      gst_amount,
      invoice_date

    )

    VALUES(?,?,?,?,?,?)

    `,

    [
      userId,
      invoice_no,
      taxable_amount,
      gst_percentage,
      gst_amount,
      invoice_date,
    ],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "ADD",

        "GST",

        "GST Entry Added",
      );

      res.json({
        success: true,

        message: "GST Saved Successfully",
      });
    },
  );
};
exports.getGSTHistory = (req, res) => {
  const userId = req.user.id;
  db.query(
    `
    SELECT
      id,
      invoice_no,
      purchase_date,
      supplier,
      taxable_amount,
      cgst_amount,
      sgst_amount,
      total_gst
    FROM purchase
    WHERE user_id=?
    ORDER BY id DESC
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
exports.getGSTById = (req, res) => {
  db.query(
    `
SELECT
id,
invoice_no,
taxable_amount,
gst_percentage,
invoice_date
FROM gst
WHERE id=? AND user_id=?
`,

    [req.params.id, req.user.id],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "GST Record Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
exports.deleteGST = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;
  db.query(
    "DELETE FROM purchase WHERE id=? AND user_id=?",

    [req.params.id, req.user.id],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,
        "DELETE",

        "GST",

        `GST Deleted`,
      );
      res.json({
        success: true,

        message: "GST Deleted Successfully",
      });
    },
  );
};
exports.filterGST = (req, res) => {
  const userId = req.user.id;
  const { type, value, year } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

    SELECT
        id,
        invoice_no,
        purchase_date,
        supplier,
        taxable_amount,
        cgst_amount,
        sgst_amount,
        total_gst

    FROM purchase

    WHERE user_id=? AND  MONTH(purchase_date) = ?
    AND YEAR(purchase_date) = ?

    ORDER BY purchase_date DESC

    `;

    params = [userId, value, year];
  } else {
    sql = `

SELECT

id,

invoice_no,

purchase_date,

supplier,

taxable_amount,

cgst_amount,

sgst_amount,

total_gst

FROM purchase

WHERE user_id=? AND YEAR(purchase_date)=?

ORDER BY purchase_date DESC

`;

    params = [userId, value];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
exports.updateGST = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;
  const {
    invoice_no,
    taxable_amount,
    gst_percentage,
    gst_amount,
    invoice_date,
  } = req.body;

  db.query(
    `UPDATE gst

SET

invoice_no=?,

taxable_amount=?,

gst_percentage=?,

gst_amount=?,

invoice_date=?

WHERE id=? AND user_id=?`,

    [
      invoice_no,

      taxable_amount,

      gst_percentage,

      gst_amount,

      invoice_date,

      req.params.id,
      req.user.id,
    ],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,
        "UPDATE",

        "GST",

        `GST Updated`,
      );
      res.json({
        success: true,

        message: "GST Updated Successfully",
      });
    },
  );
};
exports.searchGST = (req, res) => {
  const userId = req.user.id;
  const keyword = req.params.keyword;

  db.query(
    `
SELECT *

FROM purchase

WHERE user_id=? AND 

invoice_no LIKE ?

OR supplier LIKE ?

ORDER BY purchase_date DESC

`,

    [userId, `%${keyword}%`, `%${keyword}%`],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getGSTInvoiceById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
SELECT

id,
invoice_no,
purchase_date,
supplier,
taxable_amount,
cgst_percent,
sgst_percent,
cgst_amount,
sgst_amount,
total_gst

FROM purchase

WHERE id=?
AND user_id=?

`,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Invoice Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
