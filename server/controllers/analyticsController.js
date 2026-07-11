const db = require("../config/db");

exports.getAnalytics = (req, res) => {
  res.json({
    purchase: 0,
    sales: 0,
    profit: 0,
  });
};

exports.getBusinessAnalytics = (req, res) => {
  const user_id = req.user.id;
  const financialYear = req.query.financialYear;

  let startDate;
  let endDate;

  if (financialYear) {
    const [startYear, endYear] = financialYear.split("-");

    startDate = `${startYear}-04-01`;
    endDate = `${endYear}-03-31`;
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 4) {
      startDate = `${year}-04-01`;
      endDate = `${year + 1}-03-31`;
    } else {
      startDate = `${year - 1}-04-01`;
      endDate = `${year}-03-31`;
    }
  }

  const sql = `
SELECT

(
SELECT IFNULL(SUM(total_amount),0)
FROM purchase
WHERE user_id=?
AND purchase_date BETWEEN ? AND ?
) purchase,

(
SELECT IFNULL(SUM(total_amount),0)
FROM sales
WHERE user_id=?
AND sales_date BETWEEN ? AND ?
) sales,

(
SELECT IFNULL(SUM(drawback_amount),0)
FROM drawback
WHERE user_id=?
AND export_date BETWEEN ? AND ?
) drawback,

(
SELECT IFNULL(SUM(amount),0)
FROM rodtep
WHERE user_id=?
AND date_of_issue BETWEEN ? AND ?
) rodtep,

(
SELECT IFNULL(SUM(total_amount),0)
FROM other_sales
WHERE user_id=?
AND entry_date BETWEEN ? AND ?
) otherSales,

(
SELECT IFNULL(SUM(total_gst),0)
FROM purchase
WHERE user_id=?
AND purchase_date BETWEEN ? AND ?
) gst,

(
(
SELECT IFNULL(SUM(total_amount),0)
FROM government_fee
WHERE user_id=?
AND entry_date BETWEEN ? AND ?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM gst_fee
WHERE user_id=?
AND entry_date BETWEEN ? AND ?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM income_tax_fee
WHERE user_id=?
AND entry_date BETWEEN ? AND ?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM tax_audit_fee
WHERE user_id=?
AND date BETWEEN ? AND ?
)

+

(
SELECT IFNULL(SUM(tds_payable),0)
FROM tds_fee
WHERE user_id=?
AND invoice_date BETWEEN ? AND ?
)

) AS accountingCharge
`;

  const params = [
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,

    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
    user_id, startDate, endDate,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
        const data = result[0];

    const totalIncome =
      Number(data.sales || 0) +
      Number(data.drawback || 0) +
      Number(data.rodtep || 0) +
      Number(data.otherSales || 0) +
      Number(data.gst || 0);

    const totalPurchase = Number(data.purchase || 0);

    const accountingCharge = Number(data.accountingCharge || 0);

    const netProfit =
      totalIncome -
      totalPurchase -
      accountingCharge;

    const lineChart = [
      {
        name: "Purchase",
        amount: totalPurchase,
      },
      {
        name: "Sales",
        amount: Number(data.sales || 0),
      },
      {
        name: "Profit",
        amount: netProfit,
      },
    ];

    const purchaseSalesChart = [
      {
        name: "Purchase",
        amount: totalPurchase,
      },
      {
        name: "Sales",
        amount: Number(data.sales || 0),
      },
    ];

    const incomeDistribution = [
      {
        name: "Sales",
        amount: Number(data.sales || 0),
      },
      {
        name: "GST",
        amount: Number(data.gst || 0),
      },
      {
        name: "Drawback",
        amount: Number(data.drawback || 0),
      },
      {
        name: "RODTEP",
        amount: Number(data.rodtep || 0),
      },
      {
        name: "Other Sales",
        amount: Number(data.otherSales || 0),
      },
      {
        name: "Accounting",
        amount: accountingCharge,
      },
    ];

    return res.json({
      success: true,
      financialYear,
      startDate,
      endDate,

      summary: {
        totalIncome,
        totalPurchase,
        accountingCharge,
        netProfit,
      },

      lineChart,
      purchaseSalesChart,
      incomeDistribution,
    });
  });
};