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
  const sql = `

SELECT

(
SELECT IFNULL(SUM(total_amount),0)
FROM purchase WHERE user_id=?
) purchase,

(
SELECT IFNULL(SUM(total_amount),0)
FROM sales WHERE user_id=?
) sales,

(
SELECT IFNULL(SUM(drawback_amount),0)
FROM drawback WHERE user_id=?
) drawback,

(
SELECT IFNULL(SUM(amount),0)
FROM rodtep WHERE user_id=?
) rodtep,

(
SELECT IFNULL(SUM(total_amount),0)
FROM other_sales WHERE user_id=?
) otherSales,

(
SELECT IFNULL(SUM(total_gst),0)
FROM purchase WHERE user_id=?
) gst,

(

(
SELECT IFNULL(SUM(total_amount),0)
FROM government_fee WHERE user_id=?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM gst_fee WHERE user_id=?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM income_tax_fee WHERE user_id=?
)

+

(
SELECT IFNULL(SUM(amount),0)
FROM tax_audit_fee WHERE user_id=?
)

+

(
SELECT IFNULL(SUM(tds_payable),0)
FROM tds_fee WHERE user_id=?
)

)

AS accountingCharge

`;

  db.query(sql,  [

        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,

    ],(err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json(err);
    }

    const data = result[0];

    const totalIncome =
      Number(data.sales) +
      Number(data.drawback) +
      Number(data.rodtep) +
      Number(data.otherSales) +
      Number(data.gst);

    const totalPurchase = Number(data.purchase);

    const accountingCharge = Number(data.accountingCharge);

    const netProfit = totalIncome - totalPurchase - accountingCharge;
    const lineChart = [
      {
        name: "Purchase",

        amount: totalPurchase,
      },

      {
        name: "Sales",

        amount: Number(data.sales),
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

        amount: Number(data.sales),
      },
    ];

    const incomeDistribution = [
      {
        name: "GST",

        amount: Number(data.gst),
      },

      {
        name: "Drawback",

        amount: Number(data.drawback),
      },

      {
        name: "RODTEP",

        amount: Number(data.rodtep),
      },

      {
        name: "Other Sales",

        amount: Number(data.otherSales),
      },

      {
        name: "Accounting",

        amount: accountingCharge,
      },
    ];
    res.json({
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
