const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.saveImporterBilling = (req, res) => {
  const userId = req.user.id;
const userName = req.user.name;
  console.log(req.body);

  const {
    invoice_no,

    lc_no,

    entry_date,

    importer_name,

    lc_payment,

    item_total,

    extra_charge,

    grand_total,

    items,
  } = req.body;

  if (!lc_no || !importer_name) {
    return res.status(400).json({
      message: "LC No and Importer Name Required",
    });
  }

  const sql = `

    INSERT INTO importer_billing

    (
  user_id,
      invoice_no,

      lc_no,

      entry_date,

      importer_name,

      lc_payment,

      item_total,

      extra_charge,

      grand_total

    )

    VALUES (?,?,?,?,?,?,?,?,?)

  `;

  db.query(
    sql,

    [
      userId,
      invoice_no,

      lc_no,

      entry_date,

      importer_name,

      Number(lc_payment || 0),

      Number(item_total || 0),

      Number(extra_charge || 0),

      Number(grand_total || 0),
    ],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      const billingId = result.insertId;

      if (!items || items.length === 0) {
        return res.json({
          message: "Importer Billing Saved Successfully",
        });
      }

      const values = items.map((item) => [
        billingId,

        Number(item.quantity || 0),

        item.unit,

        Number(item.bag || 0),

        Number(item.price || 0),

        Number(item.amount || 0),
      ]);
      const itemSql = `

        INSERT INTO importer_billing_items
(
billing_id,
quantity,
unit,
bag,
price,
amount
)
VALUES ?

      `;

      db.query(
        itemSql,

        [values],

        (itemErr) => {
          if (itemErr) {
            console.log(itemErr);

            return res.status(500).json({
              error: itemErr.sqlMessage,

              code: itemErr.code,
            });
          }
          saveActivity(
userId,
userName,

"ADD",
"Importer Billing",

"Importer Billing Added"

);
          res.json({
            message: "Importer Billing Saved Successfully",
          });
        },
      );
    },
  );
};

exports.getImporterBilling = (req, res) => {
 const userId = req.user.id;
 db.query(
    `
SELECT *
FROM importer_billing
WHERE user_id=?
ORDER BY id DESC

    `,
[req.user.id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};

exports.getImporterBillingById = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  db.query(
    `
      SELECT *
      FROM importer_billing
      WHERE id=?
AND user_id=?
    `,

    [id,req.user.id],

    (err, billingResult) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      if (billingResult.length === 0) {
        return res.status(404).json({
          message: "Record Not Found",
        });
      }

      db.query(
        `
          SELECT *
          FROM importer_billing_items
          WHERE billing_id=? 
          ORDER BY id ASC
        `,

        [id],

        (itemErr, itemResult) => {
          if (itemErr) {
            console.log(itemErr);

            return res.status(500).json({
              error: itemErr.sqlMessage,

              code: itemErr.code,
            });
          }

          res.json({
            ...billingResult[0],

            items: itemResult,
          });
        },
      );
    },
  );
};

exports.updateImporterBilling = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
const userName = req.user.name;

  const {
    invoice_no,

    lc_no,

    entry_date,

    importer_name,

    lc_payment,

    item_total,

    extra_charge,

    grand_total,

    items,
  } = req.body;

  const sql = `

    UPDATE importer_billing

    SET

      invoice_no=?,

      lc_no=?,

      entry_date=?,

      importer_name=?,

      lc_payment=?,

      item_total=?,

      extra_charge=?,

      grand_total=?
WHERE id=?
AND user_id=?

  `;

  db.query(
    sql,

    [
      
      invoice_no,

      lc_no,

      entry_date,

      importer_name,

      Number(lc_payment || 0),

      Number(item_total || 0),

      Number(extra_charge || 0),

      Number(grand_total || 0),

      id,
      userId
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      db.query(
        "DELETE FROM importer_billing_items WHERE billing_id=?",

        [id],

        (deleteErr) => {
          if (deleteErr) {
            console.log(deleteErr);

            return res.status(500).json({
              error: deleteErr.sqlMessage,

              code: deleteErr.code,
            });
          }

          if (!items || items.length === 0) {
            return res.json({
              message: "Importer Billing Updated Successfully",
            });
          }

          const values = items.map((item) => [
            id,

            Number(item.quantity || 0),

            item.unit,

            Number(item.bag || 0),

            Number(item.price || 0),

            Number(item.amount || 0),
          ]);

          db.query(
            `
              INSERT INTO importer_billing_items
(
billing_id,
quantity,
unit,
bag,
price,
amount
)
              VALUES ?
            `,

            [values],

            (itemErr) => {
              if (itemErr) {
                console.log(itemErr);

                return res.status(500).json({
                  error: itemErr.sqlMessage,

                  code: itemErr.code,
                });
              }
            saveActivity(
userId,
userName,

"UPDATE",

"Importer Billing",

"Importer Billing Updated"

);
              res.json({
                message: "Importer Billing Updated Successfully",
              });
            },
          );
        },
      );
    },
  );
};
exports.deleteImporterBilling = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
const userName = req.user.name;
  db.query(
    "DELETE FROM importer_billing_items WHERE billing_id=? ",

    [id],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        "DELETE FROM importer_billing WHERE id=? AND user_id=?",

        [id,userId],

        (deleteErr, result) => {
          if (deleteErr) {
            return res.status(500).json(deleteErr);
          }
         saveActivity(
userId,
userName,

"DELETE",

"Importer Billing",

"Importer Billing Deleted"

);
          res.json({
            message: "Importer Billing Deleted Successfully",
          });
        },
      );
    },
  );
};
exports.filterImporterBilling = (req, res) => {
  const userId = req.user.id;
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

      FROM importer_billing

      WHERE user_id=?
AND MONTH(entry_date)=?
AND YEAR(entry_date)=?

      ORDER BY id DESC

    `;

    params = [userId,Number(value), Number(year)];
  } else {
    sql = `

      SELECT *

      FROM importer_billing

      WHERE user_id=?
AND YEAR(entry_date)=?

      ORDER BY id DESC

    `;

    params = [userId,Number(value)];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: err.sqlMessage,
      });
    }

    if (result.length === 0) {
      return res.json([]);
    }

    let completed = 0;

    const finalData = [];

    result.forEach((billing, index) => {
      db.query(
        `
            SELECT *
            FROM importer_billing_items
            WHERE billing_id=? 
            ORDER BY id ASC
            `,

        [billing.id],

        (itemErr, itemResult) => {
          if (itemErr) {
            console.log(itemErr);

            return res.status(500).json(itemErr);
          }

          finalData[index] = {
            ...billing,

            items: itemResult,
          };

          completed++;

          if (completed === result.length) {
            res.json(finalData);
          }
        },
      );
    });
  });
};

exports.searchImporterBillingByLC = (req, res) => {
  const userId = req.user.id;
const { lc_no } = req.query;

  db.query(
    `

      SELECT *

      FROM importer_billing

      WHERE user_id=?
AND lc_no LIKE ?

      ORDER BY id DESC

    `,

    [userId,`%${lc_no}%`],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      res.json(result);
    },
  );
};
exports.searchImporterBillingByName = (req, res) => {
  const userId = req.user.id;
const { importer_name } = req.query;

  db.query(
    `

      SELECT *

      FROM importer_billing

      WHERE user_id=?
AND importer_name LIKE ?

      ORDER BY id DESC

    `,

    [userId,`%${importer_name}%`],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.sqlMessage,

          code: err.code,
        });
      }

      res.json(result);
    },
  );
};
