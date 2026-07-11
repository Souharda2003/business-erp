const db = require("../config/db");

const moduleConfig = {
  Purchase: {
    table: "purchase",
    dateField: "purchase_date",
  },

  Sales: {
    table: "sales",
    dateField: "sales_date",
  },

  Payment: {
    table: "payment",
    dateField: "payment_date",
  },

  LC: {
    table: "lc",
    dateField: "issue_date",
  },

  GST: {
    table: "gst",
    dateField: "invoice_date",
  },

  Drawback: {
    table: "drawback",
    dateField: "export_date",
  },

  RODTEP: {
    table: "rodtep",
    dateField: "date_of_issue",
  },

  "Other Sales": {
    table: "other_sales",
    dateField: "entry_date",
  },

  "Importer Billing": {
    table: "importer_billing",
    dateField: "entry_date",
  },
};

exports.getStatement = (req, res) => {
  const userId = req.user.id;

  const { module, type, financialYear, month, year, from, to } = req.query;
  if (module === "Accounting Charges") {
    const accountingSql = `
SELECT
'Government Fee' AS category,
entry_date,
fee_description AS description,
total_amount AS amount,
financial_year
FROM government_fee
WHERE user_id=? AND financial_year=?

    UNION ALL
SELECT
'GST Fee' AS category,
entry_date,
applicant_name AS description,
amount AS amount,
financial_year
FROM gst_fee
WHERE user_id=? AND financial_year=?

    UNION ALL
SELECT
'Income Tax Fee' AS category,
entry_date,
applicant_name AS description,
amount AS amount,
financial_year
FROM income_tax_fee
WHERE user_id=? AND financial_year=?

    UNION ALL
SELECT
'Tax Audit Fee' AS category,
date AS entry_date,
name AS description,
amount AS amount,
financial_year
FROM tax_audit_fee
WHERE user_id=? AND financial_year=?

    UNION ALL
SELECT
'TDS Fee' AS category,
invoice_date AS entry_date,
name_of_party AS description,
tds_payable AS amount,
financial_year
FROM tds_fee
WHERE user_id=? AND financial_year=?

    ORDER BY entry_date DESC
    `;

    db.query(
      accountingSql,
      [
        userId,
        financialYear,
        userId,
        financialYear,
        userId,
        financialYear,
        userId,
        financialYear,
        userId,
        financialYear,
      ],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        const grandTotal = result.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0,
        );

        return res.json({
          success: true,
          module: "Accounting Charges",
          financialYear,
          totalRecords: result.length,
          grandTotal,
          data: result,
        });
      },
    );

    return;
  }
  const config = moduleConfig[module];

  if (!config) {
    return res.json({
      success: false,
      message: "Invalid Module",
    });
  }

  const table = config.table;

  const dateField = config.dateField;
  if (type === "yearly") {
    if (!financialYear || !financialYear.includes("-")) {
      return res.json({
        success: false,
        message: "Invalid Financial Year",
      });
    }
  }
  if (type === "monthly") {
    if (!month || !year) {
      return res.json({
        success: false,
        message: "Select Month & Year",
      });
    }
  }
  if (type === "custom") {
    if (!from || !to) {
      return res.json({
        success: false,
        message: "Select Date Range",
      });
    }
  }
  let sql = "";

  let params = [];

  if (type === "yearly") {
    const years = financialYear.split("-");

    const startDate = `${years[0]}-04-01`;

    const endDate = `${years[1]}-03-31`;
    if (module === "Importer Billing") {
      sql = `

SELECT

b.id,

b.entry_date,

b.lc_no,

b.importer_name,

b.item_total,

b.extra_charge,

b.grand_total,

COUNT(i.id) AS total_items

FROM importer_billing b

LEFT JOIN importer_billing_items i

ON b.id=i.billing_id

WHERE

b.user_id=?

AND

b.entry_date BETWEEN ? AND ?

GROUP BY b.id

ORDER BY b.entry_date DESC,b.id DESC

`;
    } else {
      sql = `

SELECT *

FROM ${table}

WHERE

user_id=?

AND

${dateField}

BETWEEN ? AND ?

ORDER BY

${dateField} DESC,

id DESC

`;
    }

    params = [userId, startDate, endDate];
  } else if (type === "monthly") {
    if (module === "Importer Billing") {
      sql = `

SELECT

b.id,

b.entry_date,

b.lc_no,

b.importer_name,

b.item_total,

b.extra_charge,

b.grand_total,

COUNT(i.id) AS total_items

FROM importer_billing b

LEFT JOIN importer_billing_items i

ON b.id=i.billing_id

WHERE

b.user_id=?

AND

MONTH(b.entry_date)=?

AND

YEAR(b.entry_date)=?

GROUP BY b.id

ORDER BY b.entry_date DESC,b.id DESC

`;
    } else {
      sql = `

SELECT *

FROM ${table}

WHERE

user_id=?

AND

MONTH(${dateField})=?

AND

YEAR(${dateField})=?

ORDER BY

${dateField} DESC,

id DESC

`;
    }

    params = [userId, month, year];
  } else {
    if (module === "Importer Billing") {
      sql = `

SELECT

b.id,

b.entry_date,

b.lc_no,

b.importer_name,

b.item_total,

b.extra_charge,

b.grand_total,

COUNT(i.id) AS total_items

FROM importer_billing b

LEFT JOIN importer_billing_items i

ON b.id=i.billing_id

WHERE

b.user_id=?

AND

b.entry_date BETWEEN ? AND ?

GROUP BY b.id

ORDER BY b.entry_date DESC,b.id DESC

`;
    } else {
      sql = `

SELECT *

FROM ${table}

WHERE

user_id=?

AND

${dateField}

BETWEEN ? AND ?

ORDER BY

${dateField} DESC,

id DESC

`;
    }

    params = [userId, from, to];
  }
  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log("STATEMENT ERROR =", err);

        return res.status(500).json({
          success: false,

          message: "Database Error",

          error: err.message,
        });
      }
      const totalRecords = result.length;

      const amountFields = [
        "grand_total",

        "total_amount",

        "amount",

        "item_total",

        "dollar_amount",

        "taxable_amount",

        "payment_amount",

        "tds_payable",

        "net_amount",

        "gross_amount",
      ];

      let grandTotal = 0;

      result.forEach((row) => {
        const amount =
          row.grand_total ??
          row.total_amount ??
          row.amount ??
          row.item_total ??
          row.dollar_amount ??
          row.taxable_amount ??
          row.payment_amount ??
          row.tds_payable ??
          row.net_amount ??
          row.gross_amount ??
          0;

        grandTotal += Number(amount);
      });
      let totalQuantity = 0;

      result.forEach((row) => {
        if (row.quantity !== undefined) {
          totalQuantity += Number(row.quantity) || 0;
        }
      });
      const averageAmount = totalRecords > 0 ? grandTotal / totalRecords : 0;
      let highestAmount = 0;

      result.forEach((row) => {
        amountFields.forEach((field) => {
          if (row[field] !== undefined) {
            const value = Number(row[field]) || 0;

            if (value > highestAmount) {
              highestAmount = value;
            }
          }
        });
      });
      return res.status(200).json({
        success: true,

        module,

        statementType: type,

        financialYear,

        totalRecords,

        totalQuantity,

        grandTotal,

        averageAmount,

        highestAmount,

        generatedDate: new Date().toLocaleDateString(),

        generatedTime: new Date().toLocaleTimeString(),

        data: result,
      });
    },
  );
};
