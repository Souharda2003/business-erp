const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addDrawback = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  const {
    shipping_bill,
    shipping_bill_date,
    invoice_no,
    product_name,
    quantity,
    unit,
    dollar_rate,
    drawback_rate,
    drawback_amount,
    customs_location,
    export_date,
    status,
  } = req.body;
  const sql = `
INSERT INTO drawback(
user_id,
shipping_bill,
shipping_bill_date,
invoice_no,
product_name,
quantity,
unit,
dollar_rate,
drawback_rate,
drawback_amount,
customs_location,
export_date,
status
)
VALUES(
?,?,?,?,?,?,?,?,?,?,?,?,?
)
`;
  db.query(
    sql,
    [
      userId,
      shipping_bill,
      shipping_bill_date,
      invoice_no,
      product_name,
      quantity,
      unit,
      dollar_rate,
      drawback_rate,
      drawback_amount,
      customs_location,
      export_date,
      status,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,
        "ADD",

        "Drawback",

        `Shipping Bill ${shipping_bill} Added`
      );
      res.json({
        success: true,
        message: "Drawback Saved Successfully",
      });
    },
  );
};
exports.getAllDrawback = (req, res) => {
  const sql = `SELECT
d.*,
CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=d.invoice_no
AND s.user_id=d.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status
FROM drawback d
WHERE d.user_id=?
ORDER BY d.export_date DESC
    `;

  db.query(sql,[req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
exports.getDrawbackById = (req, res) => {
  db.query(
    "SELECT * FROM drawback WHERE id=? AND user_id=?",

    [req.params.id,req.user.id],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log("BACKEND DATE =", result[0].shipping_bill_date);
if(result.length===0){

return res.status(404).json({

success:false,

message:"Drawback Not Found"

});

}
      res.json(result[0]);
    },
  );
};
exports.updateDrawback = (req, res) => {
  const userId=req.user.id;
const userName=req.user.name;
  const {
    shipping_bill,
    shipping_bill_date,
    invoice_no,
    product_name,
    quantity,
    unit,
    dollar_rate,
    drawback_rate,
    drawback_amount,
    customs_location,
    export_date,
    status,
  } = req.body;
  const sql = `
UPDATE drawback
SET
shipping_bill=?,
shipping_bill_date=?,
invoice_no=?,
product_name=?,
quantity=?,
unit=?,
dollar_rate=?,
drawback_rate=?,
drawback_amount=?,
customs_location=?,
export_date=?,
status=?
WHERE id=?
AND user_id=?
`;
  db.query(
    sql,
    [
      shipping_bill,
      shipping_bill_date,
      invoice_no,
      product_name,
      quantity,
      unit,
      dollar_rate,
      drawback_rate,
      drawback_amount,
      customs_location,
      export_date,
      status,
      req.params.id,
      req.user.id
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        userName,

        "UPDATE",

        "Drawback",

        `Shipping Bill ${shipping_bill} Updated`
      );
      res.json({
        success: true,
        message: "Drawback Updated Successfully",
      });
    },
  );
};
exports.deleteDrawback = (req, res) => {
  const userId=req.user.id;
const userName=req.user.name;
  db.query("DELETE FROM drawback WHERE id=? AND user_id=?", [req.params.id,req.user.id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    saveActivity(
      userId,userName,
      "DELETE",

      "Drawback",

      `Shipping Bill ${shipping_bill} Deleted`
    );
    res.json({
      success: true,
      message: "Drawback Deleted Successfully",
    });
  });
};
exports.searchDrawback = (req, res) => {
  const userId=req.user.id;
  const keyword = req.params.keyword;
  const sql = `
SELECT
d.*,
CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=d.invoice_no
AND s.user_id=d.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status
FROM drawback d
WHERE d.user_id=?
AND
(
shipping_bill LIKE ?
OR invoice_no LIKE ?
OR product_name LIKE ?
)
ORDER BY d.export_date DESC
`;
  db.query(
    sql,
    [req.user.id,`%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result);
    },
  );
};
exports.filterDrawback = (req, res) => {
  const userId=req.user.id;
  const { type, value, year } = req.query;
  let sql = "";
  let params = [];
  if (type === "month") {
    sql = `
SELECT
d.*,
CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=d.invoice_no
AND s.user_id=d.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status
FROM drawback d
WHERE d.user_id=?
AND MONTH(export_date)=?
AND YEAR(export_date)=?
ORDER BY export_date DESC
`;
    params = [req.user.id,value, year];
  } else if (type === "year") {
    sql = `
SELECT
d.*,
CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=d.invoice_no
AND s.user_id=d.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status
FROM drawback d
WHERE d.user_id=? AND YEAR(export_date)=?
ORDER BY export_date DESC
`;
    params = [req.user.id,value];
  } else if (type === "shipping") {
    sql = `
SELECT
d.*,
CASE
WHEN EXISTS(
SELECT 1
FROM sales s
WHERE s.invoice_no=d.invoice_no
AND s.user_id=d.user_id
)
THEN 'Success'
ELSE 'Pending'
END AS status
FROM drawback d
WHERE d.user_id=? AND shipping_bill LIKE ?
ORDER BY export_date DESC
`;
    params = [req.user.id,`%${value}%`];
  }
  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};
exports.getInvoiceList = (req, res) => {
  const userId=req.user.id;
  const sql = `
SELECT DISTINCT invoice_no
FROM sales
WHERE user_id=?
ORDER BY invoice_no
`;

  db.query(sql,
[
req.user.id
], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};
exports.getProductList = (req, res) => {
  const userId=req.user.id;
  db.query(
    `
SELECT DISTINCT product_name
FROM purchase
WHERE user_id=?
ORDER BY product_name
`,[req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
