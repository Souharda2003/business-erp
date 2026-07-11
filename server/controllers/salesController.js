const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addSales = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;
  const {
    sales_date,
    invoice_no,
    customer_name,
    product_name,
    quantity,
    unit,
    bank_name,
    total_amount,
    payment_received,
  } = req.body;

  const due_amount = Number(total_amount || 0) - Number(payment_received || 0);

  const sql = `
    INSERT INTO sales(

user_id,

sales_date,

invoice_no,

customer_name,

product_name,

quantity,

unit,
bank_name,
total_amount,

payment_received,

due_amount

)

VALUES(?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      userId,

      sales_date,

      invoice_no,

      customer_name,

      product_name,

      quantity,

      unit,
bank_name,
      total_amount,

      payment_received || 0,

      due_amount,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }
      saveActivity(
        userId,

        userName,

        "ADD",

        "Sales",

        `Sales Invoice ${invoice_no} Added`,
      );
      res.json({
        success: true,
        message: "Sales Saved Successfully",
      });
    },
  );
};
exports.getSales = (req, res) => {
  const userId = req.user.id;
  db.query(
    `
   SELECT *

FROM sales

WHERE user_id=?

ORDER BY sales_date DESC,id DESC
    `,
    [userId],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json(result);
    },
  );
};
exports.getSalesById = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.query(
    `
    SELECT *
    FROM sales
    WHERE id=? AND user_id=?
    `,
    [id, userId],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Sales Record Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
exports.updateSales = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;
  const { id } = req.params;
  const {
    sales_date,
    invoice_no,
    customer_name,
    product_name,
    quantity,
    unit,
    bank_name,
    total_amount,
    payment_received,
  } = req.body;

  const due_amount = Number(total_amount || 0) - Number(payment_received || 0);

  const sql = `
    UPDATE sales
    SET
      sales_date=?,
      invoice_no=?,
      customer_name=?,
      product_name=?,
      quantity=?,
      unit=?,
      bank_name=?,
      total_amount=?,
      payment_received=?,
      due_amount=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      sales_date,
      invoice_no,
      customer_name,
      product_name,
      quantity,
      unit,
      bank_name,
      total_amount,
      payment_received || 0,
      due_amount,
      id,
      userId,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }
      saveActivity(
        userId,
        userName,
        "UPDATE",

        "Sales",

        `Sales Invoice ${invoice_no} Updated`,
      );
      res.json({
        success: true,
        message: "Sales Updated Successfully",
      });
    },
  );
};
exports.deleteSales = (req, res) => {
  const userId = req.user.id;

  const userName = req.user.name;

  const id = req.params.id;

  db.query(
    "SELECT * FROM sales WHERE id=? AND user_id=?",

    [id, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.json({
          success: false,

          message: "Record Not Found",
        });
      }

      const invoiceNo = result[0].invoice_no;

      db.query(
        "DELETE FROM sales WHERE id=? AND user_id=?",

        [id, userId],

        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          saveActivity(
            userId,

            userName,

            "DELETE",

            "Sales",

            `Sales Invoice ${invoiceNo} Deleted`,
          );

          res.json({
            success: true,

            message: "Deleted Successfully",
          });
        },
      );
    },
  );
};
exports.filterSales = (req, res) => {
  const userId = req.user.id;
  const { type, value, year } = req.query;

  let sql = "";
  let params = [];

  if (type === "month") {
    sql = `
      SELECT *
      FROM sales
      WHERE user_id=? AND MONTH(sales_date)=?
      AND YEAR(sales_date)=?
      ORDER BY sales_date DESC,id DESC
    `;

    params = [userId, value, year];
  } else {
    sql = `
      SELECT *

FROM sales

WHERE user_id=?

AND YEAR(sales_date)=?

ORDER BY sales_date DESC,id DESC
    `;

    params = [userId,value];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
};
exports.searchSales = (req, res) => {
  const userId=req.user.id;
  const { keyword } = req.params;

  const sql = `
    SELECT *
    FROM sales
    WHERE user_id=?AND(
      invoice_no LIKE ?
      OR customer_name LIKE ?
      OR product_name LIKE ?)
    ORDER BY sales_date DESC,id DESC
  `;

  const search = `%${keyword}%`;

  db.query(sql, [userId,search, search, search], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
};
exports.getTodaySales = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT *

FROM sales

WHERE user_id=?

AND DATE(sales_date)=CURDATE()

ORDER BY id DESC
  `;

  db.query(sql, [userId],(err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
};
exports.getMonthlySales = (req, res) => {
  const userId=req.user.id;
  const sql = `
    SELECT *
    FROM sales
    WHERE user_id=? AND 
      MONTH(sales_date)=MONTH(CURDATE())
      AND YEAR(sales_date)=YEAR(CURDATE())
    ORDER BY id DESC
  `;

  db.query(sql,[userId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
};
exports.getSalesSummary = (req, res) => {
  const userId=req.user.id;
  const sql = `
    SELECT

      COUNT(id) AS total_invoice,

      IFNULL(SUM(quantity),0) AS total_quantity,

      IFNULL(SUM(total_amount),0) AS total_sales,

      IFNULL(SUM(payment_received),0) AS total_received,

      IFNULL(SUM(due_amount),0) AS total_due

    FROM sales WHERE user_id=?
  `;

  db.query(sql, [userId],(err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result[0]);
  });
};
