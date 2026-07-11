const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addOtherSales = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  console.log("BODY =", req.body);
  const {
    service_type,
    invoice_no,
    name,
    vehicle_number,
    challan_no,
    from_location,
    to_location,
    amount,
    cgst_percent,
    sgst_percent,
    total_gst,
    tds,
    total_amount,
    bill_no,
    entry_date,
  } = req.body;

  const sql = `
INSERT INTO other_sales(
user_id,
service_type,
invoice_no,
name,
vehicle_number,
challan_no,
from_location,
to_location,
amount,
cgst_percent,
sgst_percent,
total_gst,
tds,
total_amount,
bill_no,
entry_date
)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

  db.query(
    sql,
    [
      userId,
      service_type,
      invoice_no,
      name,
      vehicle_number,
      challan_no,
      from_location,
      to_location,
      amount,
      cgst_percent,
      sgst_percent,
      total_gst,
      tds,
      total_amount,
      bill_no,
      entry_date,
    ],
    (err, result) => {
      if (err) {
        console.log("MYSQL ERROR =", err);

        return res.status(500).json({
          error: err.message,
        });
      }

      console.log("INSERT SUCCESS =", result);
      saveActivity(
        userId,
         userName,

        "ADD",

        "Other Sales",

        `Other Sales Added`,
      );
      res.json({
        success: true,
        message: "Other Sales Saved Successfully",
      });
    },
  );
};
exports.getAllOtherSales = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT *
    FROM other_sales
    WHERE user_id=?
    ORDER BY entry_date DESC
    `,
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};
exports.getOtherSalesById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT *
    FROM other_sales
    WHERE id=?
    AND user_id=?
    `,
    [req.params.id, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);
    }
  );
};
exports.updateOtherSales = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    service_type,
    invoice_no,
    name,
    vehicle_number,
    challan_no,
    from_location,
    to_location,
    amount,
    cgst_percent,
    sgst_percent,
    total_gst,
    tds,
    total_amount,
    bill_no,
    entry_date,
  } = req.body;

  db.query(
    `
    UPDATE other_sales
    SET
    service_type=?,
    invoice_no=?,
    name=?,
    vehicle_number=?,
    challan_no=?,
    from_location=?,
    to_location=?,
    amount=?,
    cgst_percent=?,
    sgst_percent=?,
    total_gst=?,
    tds=?,
    total_amount=?,
    bill_no=?,
    entry_date=?
    WHERE id=?
    AND user_id=?
    `,
    [
      service_type,
      invoice_no,
      name,
      vehicle_number,
      challan_no,
      from_location,
      to_location,
      amount,
      cgst_percent,
      sgst_percent,
      total_gst,
      tds,
      total_amount,
      bill_no,
      entry_date,
      req.params.id,
      userId,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,
        "UPDATE",
        "Other Sales",
        "Other Sales Updated"
      );

      res.json({
        success: true,
        message: "Updated Successfully",
      });
    }
  );
};
exports.deleteOtherSales = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `
    DELETE FROM other_sales
    WHERE id=?
    AND user_id=?
    `,
    [req.params.id, userId],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,
        "DELETE",
        "Other Sales",
        "Other Sales Deleted"
      );

      res.json({
        success: true,
        message: "Deleted Successfully",
      });
    }
  );
};
exports.searchOtherSales = (req, res) => {
  const userId = req.user.id;
  const keyword = req.params.keyword;

  db.query(
    `
    SELECT *
    FROM other_sales
    WHERE user_id=?
    AND (
      invoice_no LIKE ?
      OR name LIKE ?
      OR bill_no LIKE ?
    )
    ORDER BY entry_date DESC
    `,
    [
      userId,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};
exports.filterOtherSales = (req, res) => {
  const userId = req.user.id;
  const { type, value, year, serviceType } = req.query;

  let sql = "";
  let params = [];

  if (type === "month") {
    if (serviceType === "All Services") {
      sql = `
      SELECT *
      FROM other_sales
      WHERE user_id=?
      AND MONTH(entry_date)=?
      AND YEAR(entry_date)=?
      ORDER BY entry_date DESC
      `;

      params = [userId, value, year];
    } else {
      sql = `
      SELECT *
      FROM other_sales
      WHERE user_id=?
      AND MONTH(entry_date)=?
      AND YEAR(entry_date)=?
      AND service_type=?
      ORDER BY entry_date DESC
      `;

      params = [userId, value, year, serviceType];
    }
  } else if (type === "year") {
    if (serviceType === "All Services") {
      sql = `
      SELECT *
      FROM other_sales
      WHERE user_id=?
      AND YEAR(entry_date)=?
      ORDER BY entry_date DESC
      `;

      params = [userId, value];
    } else {
      sql = `
      SELECT *
      FROM other_sales
      WHERE user_id=?
      AND YEAR(entry_date)=?
      AND service_type=?
      ORDER BY entry_date DESC
      `;

      params = [userId, value, serviceType];
    }
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};