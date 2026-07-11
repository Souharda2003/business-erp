const db = require("../config/db");

const Profile = require("../models/profileModel");

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  Profile.getProfile(
    userId,

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);
    },
  );
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;

  const data = req.body;

  Profile.updateUser(
    userId,

    data,

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      Profile.updateCompany(
        userId,

        data,

        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,

            message: "Profile Updated",
          });
        },
      );
    },
  );
};
exports.deleteProfile = (req, res) => {

    const userId = req.user.id;

    db.beginTransaction((err) => {

        if (err) {
            return res.status(500).json(err);
        }

        const queries = [

            "DELETE FROM purchase WHERE user_id=?",

            "DELETE FROM sales WHERE user_id=?",

            "DELETE FROM lc WHERE user_id=?",

            "DELETE FROM payment WHERE user_id=?",

            "DELETE FROM gst WHERE user_id=?",

            "DELETE FROM drawback WHERE user_id=?",

            "DELETE FROM rodtep WHERE user_id=?",

            "DELETE FROM other_sales WHERE user_id=?",

            "DELETE FROM importer_billing WHERE user_id=?",

            "DELETE FROM government_fee WHERE user_id=?",

            "DELETE FROM gst_fee WHERE user_id=?",

            "DELETE FROM income_tax_fee WHERE user_id=?",

            "DELETE FROM tax_audit_fee WHERE user_id=?",

            "DELETE FROM tds_fee WHERE user_id=?",

            "DELETE FROM activity_log WHERE user_id=?",

            "DELETE FROM company_profile WHERE user_id=?",

            "DELETE FROM users WHERE id=? AND user_id=?"

        ];

        let index = 0;

        function runQuery() {

            if (index === queries.length) {

                return db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            res.status(500).json(err);

                        });

                    }

                    return res.json({

                        success: true,

                        message: "Profile Deleted Successfully"

                    });

                });

            }

            db.query(

                queries[index],

                [userId],

                (err) => {

                    if (err) {

                        return db.rollback(() => {

                            res.status(500).json(err);

                        });

                    }

                    index++;

                    runQuery();

                }

            );

        }

        runQuery();

    });

};
exports.getProfitSummary = (req, res) => {
  const userId = req.user.id;
  const { searchType, searchValue, currentYear } = req.query;

  let salesQuery = "";
  let drawbackQuery = "";
  let rodtepQuery = "";
  let gstQuery = "";
  let otherSalesQuery = "";
  let purchaseQuery = "";

  if (searchType === "month") {
    salesQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM sales
       WHERE user_id=? AND MONTH(sales_date)=?
       AND YEAR(sales_date)=?`;

    drawbackQuery = `SELECT IFNULL(SUM(drawback_amount),0) total
       FROM drawback
       WHERE user_id=? AND MONTH(export_date)=?
       AND YEAR(export_date)=?`;

    rodtepQuery = `SELECT IFNULL(SUM(amount),0) total
       FROM rodtep
       WHERE user_id=? AND MONTH(date_of_issue)=?
       AND YEAR(date_of_issue)=?`;

    gstQuery = `
SELECT IFNULL(SUM(total_gst),0) total
FROM purchase
WHERE user_id=? AND MONTH(purchase_date)=?
AND YEAR(purchase_date)=?
`;
    otherSalesQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM other_sales
       WHERE user_id=? AND MONTH(entry_date)=?
       AND YEAR(entry_date)=?`;

    purchaseQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM purchase
       WHERE user_id=? AND MONTH(purchase_date)=?
       AND YEAR(purchase_date)=?`;
  } else {
    salesQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM sales
       WHERE user_id=? AND YEAR(sales_date)=?`;

    drawbackQuery = `SELECT IFNULL(SUM(drawback_amount),0) total
       FROM drawback
       WHERE user_id=? AND YEAR(export_date)=?`;

    rodtepQuery = `SELECT IFNULL(SUM(amount),0) total
       FROM rodtep
       WHERE user_id=? AND YEAR(date_of_issue)=?`;

    gstQuery = `
SELECT IFNULL(SUM(total_gst),0) total
FROM purchase
WHERE user_id=? AND YEAR(purchase_date)=?
`;
    otherSalesQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM other_sales
       WHERE user_id=? AND YEAR(entry_date)=?`;

    purchaseQuery = `SELECT IFNULL(SUM(total_amount),0) total
       FROM purchase
       WHERE user_id=? AND YEAR(purchase_date)=?`;
  }

  const params =
    searchType === "month" ? [userId,searchValue, currentYear] : [userId,searchValue];

  db.query(salesQuery, params, (err, sales) => {
    if (err) {
      console.log(err);

      return res.status(500).json(err);
    }

    db.query(drawbackQuery, params, (err, drawback) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      db.query(rodtepQuery, params, (err, rodtep) => {
        if (err) {
          console.log(err);

          return res.status(500).json(err);
        }

        db.query(gstQuery, params, (err, gst) => {
          if (err) {
            console.log(err);

            return res.status(500).json(err);
          }

          db.query(otherSalesQuery, params, (err, otherSales) => {
            if (err) {
              console.log(err);

              return res.status(500).json(err);
            }

            db.query(purchaseQuery, params, (err, purchase) => {
              if (err) {
                console.log(err);

                return res.status(500).json(err);
              }
              console.log({
                sales: sales[0].total,

                drawback: drawback[0].total,

                rodtep: rodtep[0].total,

                gst: gst[0].total,

                otherSales: otherSales[0].total,

                purchase: purchase[0].total,
              });
              res.json({
                sales: Number(sales[0].total || 0),

                drawback: Number(drawback[0].total || 0),

                rodtep: Number(rodtep[0].total || 0),

                gst: Number(gst[0].total || 0),

                otherSales: Number(otherSales[0].total || 0),

                purchase: Number(purchase[0].total || 0),
              });
            });
          });
        });
      });
    });
  });
};
exports.getProfitHistory = (req, res) => {
  const userId = req.user.id;
  const sql = `

    SELECT

      s.sales_date,

      s.customer_name,

      s.product_name,

      s.quantity,

      s.unit,

      s.total_amount AS sales_amount,

      (

        SELECT IFNULL(MAX(p.total_amount),0)

        FROM purchase p

        WHERE TRIM(UPPER(p.product_name))

        =

        TRIM(UPPER(s.product_name))

      ) AS purchase_amount

    FROM sales s WHERE s.user_id=?

    ORDER BY s.sales_date DESC

  `;

  db.query(sql,[userId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json(err);
    }

    const data = result.map((item) => ({
      ...item,
      profit:
        Number(item.sales_amount || 0) - Number(item.purchase_amount || 0),
    }));

    res.json(data);
  });
};
