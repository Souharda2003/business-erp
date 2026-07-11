const db = require("../config/db");


const saveActivity = require("../utils/saveActivity");

exports.getPurchase=(req,res)=>{

const userId=req.user.id;

db.query(

`SELECT *

FROM purchase

WHERE user_id=?

ORDER BY id DESC`,

[userId],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json(result);

});

}

exports.filterPurchase = (req, res) => {
  const userId=req.user.id;
  const {
    type,

    value,

    year,
  } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

      SELECT *

FROM purchase

WHERE user_id=?

AND MONTH(purchase_date)=?

AND YEAR(purchase_date)=?

ORDER BY id DESC

    `;

    params=[

userId,

Number(value),

Number(year)

];
  } else {
    sql = `

     SELECT *

FROM purchase

WHERE user_id=?

AND YEAR(purchase_date)=?

ORDER BY id DESC

    `;

    params=[

userId,

Number(value)

];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      res.json(result);
    },
  );
};

exports.addPurchase = (req, res) => {
  const userId=req.user.id;

const userName=req.user.name;
  const {
    
    purchase_date,

    product_name,

    supplier,

    invoice_no,

    quantity,

    unit,

    unit_price,

    taxable_amount,

    cgst_percent,

    sgst_percent,

    cgst_amount,

    sgst_amount,

    total_gst,

    round_off,

    total_amount,
  } = req.body;

  if (Number(quantity) < 0) {
    return res.status(400).json({
      success: false,

      message: "Quantity cannot be negative",
    });
  }

  if (Number(unit_price) < 0) {
    return res.status(400).json({
      success: false,

      message: "Unit Price cannot be negative",
    });
  }

  if (Number(total_amount) < 0) {
    return res.status(400).json({
      success: false,

      message: "Total Amount cannot be negative",
    });
  }

  const sql = `

    INSERT INTO purchase(
  user_id,
      purchase_date,

      product_name,

      quantity,

      unit,

      unit_price,

      taxable_amount,

      cgst_percent,

      sgst_percent,

      cgst_amount,

      sgst_amount,

      total_gst,

      round_off,

      total_amount,

      supplier,

      invoice_no

    )

    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

  `;
  db.query(
    sql,

    [
      userId,
      purchase_date,

      product_name,

      quantity,

      unit,

      unit_price,

      taxable_amount,

      cgst_percent,

      sgst_percent,

      cgst_amount,

      sgst_amount,

      total_gst,

      round_off,

      total_amount,

      supplier,

      invoice_no,
    ],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,

          error: err.sqlMessage,
        });
      }
      saveActivity(
        userId,
        userName,

"ADD",

"Purchase",

`Purchase Invoice ${invoice_no} Added`

);

console.log("Activity Saved");
      res.json({
        success: true,

        message: "Purchase Saved Successfully",
      });
    },
  );
};


exports.updatePurchase = (req, res) => {
  const { id } = req.params;
const userId=req.user.id;

const userName=req.user.name;
  const {
    purchase_date,

    product_name,

    invoice_no,

    supplier,

    quantity,

    unit,

    unit_price,

    taxable_amount,

    cgst_percent,

    sgst_percent,

    cgst_amount,

    sgst_amount,

    total_gst,

    round_off,

    total_amount,
  } = req.body;

  if (Number(quantity) < 0) {
    return res.status(400).json({
      success: false,

      message: "Quantity cannot be negative",
    });
  }

  if (Number(unit_price) < 0) {
    return res.status(400).json({
      success: false,

      message: "Unit Price cannot be negative",
    });
  }

  if (Number(total_amount) < 0) {
    return res.status(400).json({
      success: false,

      message: "Total Amount cannot be negative",
    });
  }

  const formattedDate = purchase_date ? purchase_date.split("T")[0] : null;

  const sql = `

    UPDATE purchase

    SET

      purchase_date=?,

      product_name=?,

      supplier=?,

      quantity=?,

      unit=?,

      unit_price=?,

      taxable_amount=?,

      cgst_percent=?,

      sgst_percent=?,

      cgst_amount=?,

      sgst_amount=?,

      total_gst=?,

      round_off=?,

      total_amount=?,

      invoice_no=?

    WHERE id=? AND user_id=?

  `;

  db.query(
    sql,

    [
      formattedDate,

      product_name,

      supplier,

      quantity,

      unit,

      unit_price,

      taxable_amount,

      cgst_percent,

      sgst_percent,

      cgst_amount,

      sgst_amount,

      total_gst,

      round_off,

      total_amount,

      invoice_no,

      id,
      userId,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,

          error: err.sqlMessage,
        });
      }
saveActivity(
  userId,
  userName,

"UPDATE",

"Purchase",

`Purchase Invoice ${invoice_no} Updated`

);
      res.json({
        success: true,

        message: "Purchase Updated Successfully",
      });
    },
  );
};
exports.deletePurchase = (req, res) => {
const userId=req.user.id;

const userName=req.user.name;
  const sql = "DELETE FROM purchase WHERE id=? AND user_id=?";

  db.query(sql, [req.params.id,userId], (err, result) => {

    if (err) {

      return res.status(500).json(err);

    }
saveActivity(
  userId,
  userName,

"DELETE",

"Purchase",

`Purchase Invoice ${req.params
  .id
} Deleted`

);
    res.json({

      message: "Purchase Deleted Successfully",

    });

  });

};
exports.getPurchaseById = (req, res) => {
  const { id } = req.params;
const userId=req.user.id;
  db.query(
    `

      SELECT *

      FROM purchase

      WHERE id=? AND user_id=?

    `,

    [id,userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,

          error: err.sqlMessage,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "Purchase Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
