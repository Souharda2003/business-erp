const db = require("../config/db");

exports.getDashboard = (req, res) => {
  const userId = req.user.id;

  try {
    let financialYear = req.query.financialYear || "";

    let startDate;
    let endDate;

    if (financialYear) {
      const years = financialYear.split("-");

      startDate = `${years[0]}-04-01`;
      endDate = `${years[1]}-03-31`;
    } else {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      if (month >= 4) {
        financialYear = `${year}-${year + 1}`;
        startDate = `${year}-04-01`;
        endDate = `${year + 1}-03-31`;
      } else {
        financialYear = `${year - 1}-${year}`;
        startDate = `${year - 1}-04-01`;
        endDate = `${year}-03-31`;
      }
    }

    const sql = `

SELECT

(

SELECT IFNULL(SUM(quantity),0)

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

)

AS purchase_quantity,

(

SELECT IFNULL(SUM(total_amount),0)

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

)

AS purchase_amount,

(

SELECT unit

FROM purchase

WHERE user_id=?

ORDER BY id DESC

LIMIT 1

)

AS purchase_unit,

(

SELECT IFNULL(SUM(total_amount),0)

FROM sales

WHERE user_id=?

AND sales_date BETWEEN ? AND ?

)

AS sales,

(

SELECT IFNULL(SUM(dollar_amount),0)

FROM lc

WHERE user_id=?

AND issue_date BETWEEN ? AND ?

)

AS lc,

(

SELECT IFNULL(SUM(drawback_amount),0)

FROM drawback

WHERE user_id=?

AND export_date BETWEEN ? AND ?

)

AS drawback,

(

SELECT IFNULL(SUM(total_gst),0)

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

)

AS gst,

(

SELECT IFNULL(SUM(pay.amount),0)

FROM payment pay

INNER JOIN purchase pur

ON pay.invoice_no=pur.invoice_no

WHERE pay.user_id=?

AND pur.user_id=?

AND pay.payment_date BETWEEN ? AND ?

)

AS payment,

(

SELECT IFNULL(SUM(pay.amount),0)

FROM payment pay

LEFT JOIN purchase pur

ON pay.invoice_no=pur.invoice_no

WHERE pay.user_id=?

AND pur.user_id=?

AND pur.invoice_no IS NULL

AND pay.payment_date BETWEEN ? AND ?

)

AS unmatched_payment,

(

SELECT IFNULL(SUM(total_amount),0)

FROM other_sales

WHERE user_id=?

AND entry_date BETWEEN ? AND ?

)

AS other_sales,

(

SELECT IFNULL(SUM(amount),0)

FROM rodtep

WHERE user_id=?

AND date_of_issue BETWEEN ? AND ?

)

AS rodtep,
(

SELECT IFNULL(SUM(total_amount),0)

FROM government_fee

WHERE user_id=? AND financial_year=?

)

+

(

SELECT IFNULL(SUM(amount),0)

FROM gst_fee

WHERE user_id=?

AND financial_year=? 

)

+

(

SELECT IFNULL(SUM(amount),0)

FROM income_tax_fee

WHERE user_id=?

AND financial_year=?

)

+

(

SELECT IFNULL(SUM(amount),0)

FROM tax_audit_fee

WHERE user_id=?

AND financial_year=?

)

+

(

SELECT IFNULL(SUM(tds_payable),0)

FROM tds_fee

WHERE user_id=? AND financial_year=?

)

AS accounting_charge,

(

(

SELECT IFNULL(SUM(total_amount),0)

FROM sales

WHERE user_id=?

AND sales_date BETWEEN ? AND ?

)

+

(

SELECT IFNULL(SUM(drawback_amount),0)

FROM drawback

WHERE user_id=?

AND export_date BETWEEN ? AND ?

)

+

(

SELECT IFNULL(SUM(amount),0)

FROM rodtep

WHERE user_id=?

AND date_of_issue BETWEEN ? AND ?

)

+

(

SELECT IFNULL(SUM(total_gst),0)

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

)

+

(

SELECT IFNULL(SUM(total_amount),0)

FROM other_sales

WHERE user_id=?

AND entry_date BETWEEN ? AND ?

)

-

(

SELECT IFNULL(SUM(total_amount),0)

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

)

)

AS profit

`;
    db.query(
      sql,
      [
        // Purchase Quantity
        userId,
        startDate,
        endDate,

        // Purchase Amount
        userId,
        startDate,
        endDate,

        // Purchase Unit
        userId,

        // Sales
        userId,
        startDate,
        endDate,

        // LC
        userId,
        startDate,
        endDate,

        // Drawback
        userId,
        startDate,
        endDate,

        // GST
        userId,
        startDate,
        endDate,

        // Payment
        userId,
        userId,
        startDate,
        endDate,

        // Unmatched Payment
        userId,
        userId,
        startDate,
        endDate,

        // Other Sales
        userId,
        startDate,
        endDate,

        // RODTEP
        userId,
        startDate,
        endDate,

        // Government Fee
        userId,
        financialYear,
        // GST Fee
        userId,
        financialYear,

        // Income Tax Fee
        userId,
        financialYear,

        // Tax Audit Fee
        userId,
        financialYear,

        // TDS Fee
        userId,
        financialYear,
        // Profit - Sales
        userId,
        startDate,
        endDate,

        // Profit - Drawback
        userId,
        startDate,
        endDate,

        // Profit - RODTEP
        userId,
        startDate,
        endDate,

        // Profit - GST
        userId,
        startDate,
        endDate,

        // Profit - Other Sales
        userId,
        startDate,
        endDate,

        // Profit - Purchase
        userId,
        startDate,
        endDate,
      ],

      (err, result) => {
        if (err) {
          console.log("DASHBOARD ERROR =", err);

          return res.status(500).json({
            success: false,
            message: "Database Error",
            error: err,
          });
        }

        const data = result[0];

        data.financialYear = financialYear;

        const purchaseAmount = Number(data.purchase_amount || 0);

        const matchedPayment = Number(data.payment || 0);

        const unmatchedPayment = Number(data.unmatched_payment || 0);

        // Pending Amount

        data.pending_amount = Math.max(0, purchaseAmount - matchedPayment);

        // Excess Amount

        data.excess_amount = unmatchedPayment;

        // Payment Status

        if (data.pending_amount > 0 && data.excess_amount > 0) {
          data.payment_status = "Pending + Excess";
        } else if (data.pending_amount > 0) {
          data.payment_status = "Payment Pending";
        } else if (data.excess_amount > 0) {
          data.payment_status = "Payment Excess";
        } else {
          data.payment_status = "All Payment Clear";
        }

        return res.status(200).json({
          success: true,
          data,
        });
      },
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",

      error: error.message,
    });
  }
};
exports.getPurchaseTrend = (req, res) => {
  const userId = req.user.id;

  let financialYear = req.query.financialYear;

  let startDate;
  let endDate;

  if (financialYear) {
    const years = financialYear.split("-");

    startDate = `${years[0]}-04-01`;

    endDate = `${years[1]}-03-31`;
  }

  const sql = `
SELECT

MONTH(purchase_date) AS month_no,

DATE_FORMAT(purchase_date,'%b') AS month,

SUM(total_amount) AS amount

FROM purchase

WHERE user_id=?

AND purchase_date BETWEEN ? AND ?

GROUP BY

MONTH(purchase_date),

DATE_FORMAT(purchase_date,'%b')

ORDER BY month_no
`;
  db.query(
    sql,

    [userId, startDate, endDate],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
        });
      }

      res.json({
        success: true,

        data: result,
      });
    },
  );
};
exports.getAccountingSummary = (req, res) => {
  const userId = req.user.id;
  let { financialYear } = req.query;

  if (!financialYear) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  const sql = `
    SELECT

    (
      SELECT IFNULL(SUM(total_amount),0)
      FROM government_fee
      WHERE user_id = ? AND financial_year=?
    ) AS government_fee,

    (
      SELECT IFNULL(SUM(amount),0)
      FROM gst_fee
      WHERE user_id = ?
      AND financial_year = ?
    ) AS gst_fee,

    (
      SELECT IFNULL(SUM(amount),0)
      FROM income_tax_fee
      WHERE user_id = ?
      AND financial_year = ?
    ) AS income_tax_fee,

    (
      SELECT IFNULL(SUM(amount),0)
      FROM tax_audit_fee
      WHERE user_id = ?
      AND financial_year = ?
    ) AS tax_audit_fee,

    (
      SELECT IFNULL(SUM(tds_payable),0)
      FROM tds_fee
      WHERE user_id = ?
      AND financial_year = ?
    ) AS tds_fee
  `;

  db.query(
    sql,
    [
      // Government Fee
      userId,
      financialYear,
      // GST Fee
      userId,
      financialYear,

      // Income Tax Fee
      userId,
      financialYear,

      // Tax Audit Fee
      userId,
      financialYear,

      // TDS Fee
      userId,
      financialYear,
    ],
    (err, result) => {
      if (err) {
        console.log("ACCOUNTING SUMMARY ERROR =", err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        financialYear,
        data: result[0],
      });
    },
  );
};
