const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.addGovernmentFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    invoice_no,
    entry_date,
    applicant_name,
    exporter_gstin,
    iec_code,
    fee_description,
    other_description,
    amount,
    cgst_percent,
    cgst_amount,
    sgst_percent,
    sgst_amount,
    igst_percent,
    igst_amount,
    total_amount,
    financial_year,
  } = req.body;

  const sql = `

  INSERT INTO government_fee(

    user_id,
    invoice_no,
    entry_date,
    applicant_name,
    exporter_gstin,
    iec_code,
    fee_description,
    other_description,
    amount,
    cgst_percent,
    cgst_amount,
    sgst_percent,
    sgst_amount,
    igst_percent,
    igst_amount,
    total_amount,
    financial_year

  )

  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

  `;

  db.query(
    sql,

    [
      userId,
      invoice_no,
      entry_date,
      applicant_name,
      exporter_gstin,
      iec_code,
      fee_description,
      other_description,
      Number(amount || 0),
      Number(cgst_percent || 0),
      Number(cgst_amount || 0),
      Number(sgst_percent || 0),
      Number(sgst_amount || 0),
      Number(igst_percent || 0),
      Number(igst_amount || 0),
      Number(total_amount || 0),
      financial_year,
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

        "Government Fee",

        `Government Fee Invoice ${invoice_no} Added`,
      );

      res.json({
        success: true,

        message: "Government Fee Saved Successfully",
      });
    },
  );
};
exports.getGovernmentFee = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM government_fee

    WHERE user_id=?

    ORDER BY entry_date DESC,id DESC

    `,

    [userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getGovernmentFeeById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM government_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "Government Fee Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};

exports.updateGovernmentFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    invoice_no,
    entry_date,
    applicant_name,
    exporter_gstin,
    iec_code,
    fee_description,
    other_description,
    amount,
    cgst_percent,
    cgst_amount,
    sgst_percent,
    sgst_amount,
    igst_percent,
    igst_amount,
    total_amount,
    financial_year,
  } = req.body;

  db.query(
    `

    UPDATE government_fee

    SET

    invoice_no=?,
    entry_date=?,
    applicant_name=?,
    exporter_gstin=?,
    iec_code=?,
    fee_description=?,
    other_description=?,
    amount=?,
    cgst_percent=?,
    cgst_amount=?,
    sgst_percent=?,
    sgst_amount=?,
    igst_percent=?,
    igst_amount=?,
    total_amount=?,
    financial_year=?

    WHERE id=?

    AND user_id=?

    `,

    [
      invoice_no,
      entry_date,
      applicant_name,
      exporter_gstin,
      iec_code,
      fee_description,
      other_description,
      Number(amount || 0),
      Number(cgst_percent || 0),
      Number(cgst_amount || 0),
      Number(sgst_percent || 0),
      Number(sgst_amount || 0),
      Number(igst_percent || 0),
      Number(igst_amount || 0),
      Number(total_amount || 0),
      financial_year,
      req.params.id,
      userId,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "UPDATE",

        "Government Fee",

        `Government Fee Invoice ${invoice_no} Updated`,
      );

      res.json({
        success: true,

        message: "Government Fee Updated Successfully",
      });
    },
  );
};
exports.deleteGovernmentFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `

    DELETE FROM government_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "DELETE",

        "Government Fee",

        "Government Fee Deleted",
      );

      res.json({
        success: true,

        message: "Government Fee Deleted Successfully",
      });
    },
  );
};
exports.searchGovernmentFee = (req, res) => {
  const userId = req.user.id;

  const keyword = req.params.keyword;

  db.query(
    `

    SELECT *

    FROM government_fee

    WHERE user_id=?

    AND (

      invoice_no LIKE ?

      OR applicant_name LIKE ?

      OR exporter_gstin LIKE ?

      OR iec_code LIKE ?

      OR fee_description LIKE ?

      OR other_description LIKE ?

    )

    ORDER BY entry_date DESC,id DESC

    `,

    [
      userId,

      `%${keyword}%`,

      `%${keyword}%`,

      `%${keyword}%`,

      `%${keyword}%`,

      `%${keyword}%`,

      `%${keyword}%`,
    ],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.filterGovernmentFee = (req, res) => {
  const userId = req.user.id;

  const {
    type,

    value,

    year,

    financialYear,
  } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

    SELECT *

    FROM government_fee

    WHERE user_id=?

    AND financial_year=?

    AND MONTH(entry_date)=?

    AND YEAR(entry_date)=?

    ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value), Number(year)];
  } else {
    sql = `

    SELECT *

    FROM government_fee

    WHERE user_id=?

    AND financial_year=?

    AND YEAR(entry_date)=?

    ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value)];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.addGSTFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { entry_date, applicant_name, amount, financial_year } = req.body;

  const sql = `

    INSERT INTO gst_fee(

      user_id,
      entry_date,
      applicant_name,
      amount,
      financial_year

    )

    VALUES(?,?,?,?,?)

  `;

  db.query(
    sql,

    [userId, entry_date, applicant_name, Number(amount || 0), financial_year],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "ADD",

        "GST Fee",

        "GST Fee Added",
      );

      res.json({
        success: true,

        message: "GST Fee Saved Successfully",
      });
    },
  );
};
exports.getGSTFee = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM gst_fee

    WHERE user_id=?

    ORDER BY entry_date DESC,id DESC

    `,

    [userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getGSTFeeById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM gst_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "GST Fee Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
exports.updateGSTFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { entry_date, applicant_name, amount, financial_year } = req.body;

  db.query(
    `

    UPDATE gst_fee

    SET

      entry_date=?,

      applicant_name=?,

      amount=?,

      financial_year=?

    WHERE id=?

    AND user_id=?

    `,

    [
      entry_date,

      applicant_name,

      Number(amount || 0),

      financial_year,

      req.params.id,

      userId,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "UPDATE",

        "GST Fee",

        "GST Fee Updated",
      );

      res.json({
        success: true,

        message: "GST Fee Updated Successfully",
      });
    },
  );
};
exports.deleteGSTFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `

    DELETE FROM gst_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "DELETE",

        "GST Fee",

        "GST Fee Deleted",
      );

      res.json({
        success: true,

        message: "GST Fee Deleted Successfully",
      });
    },
  );
};
exports.searchGSTFee = (req, res) => {
  const userId = req.user.id;

  const keyword = req.params.keyword;

  db.query(
    `

    SELECT *

    FROM gst_fee

    WHERE user_id=?

    AND (

      applicant_name LIKE ?

    )

    ORDER BY entry_date DESC,id DESC

    `,

    [userId, `%${keyword}%`],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.filterGSTFee = (req, res) => {
  const userId = req.user.id;

  const {
    type,

    value,

    year,

    financialYear,
  } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

      SELECT *

      FROM gst_fee

      WHERE user_id=?

      AND financial_year=?

      AND MONTH(entry_date)=?

      AND YEAR(entry_date)=?

      ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value), Number(year)];
  } else {
    sql = `

      SELECT *

      FROM gst_fee

      WHERE user_id=?

      AND financial_year=?

      AND YEAR(entry_date)=?

      ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value)];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.addIncomeTaxFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { entry_date, applicant_name, amount, financial_year } = req.body;

  const sql = `

    INSERT INTO income_tax_fee(

      user_id,

      entry_date,

      applicant_name,

      amount,

      financial_year

    )

    VALUES(?,?,?,?,?)

  `;

  db.query(
    sql,

    [userId, entry_date, applicant_name, Number(amount || 0), financial_year],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "ADD",

        "Income Tax Fee",

        "Income Tax Fee Added",
      );

      res.json({
        success: true,

        message: "Income Tax Fee Saved Successfully",
      });
    },
  );
};
exports.getIncomeTaxFee = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM income_tax_fee

    WHERE user_id=?

    ORDER BY entry_date DESC,id DESC

    `,

    [userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getIncomeTaxFeeById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

    SELECT *

    FROM income_tax_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "Income Tax Fee Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
exports.updateIncomeTaxFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { entry_date, applicant_name, amount, financial_year } = req.body;

  db.query(
    `

    UPDATE income_tax_fee

    SET

      entry_date=?,

      applicant_name=?,

      amount=?,

      financial_year=?

    WHERE id=?

    AND user_id=?

    `,

    [
      entry_date,

      applicant_name,

      Number(amount || 0),

      financial_year,

      req.params.id,

      userId,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "UPDATE",

        "Income Tax Fee",

        "Income Tax Fee Updated",
      );

      res.json({
        success: true,

        message: "Income Tax Fee Updated Successfully",
      });
    },
  );
};
exports.deleteIncomeTaxFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `

    DELETE FROM income_tax_fee

    WHERE id=?

    AND user_id=?

    `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "DELETE",

        "Income Tax Fee",

        "Income Tax Fee Deleted",
      );

      res.json({
        success: true,

        message: "Income Tax Fee Deleted Successfully",
      });
    },
  );
};
exports.filterIncomeTaxFee = (req, res) => {
  const userId = req.user.id;

  const {
    type,

    value,

    year,

    financialYear,
  } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

      SELECT *

      FROM income_tax_fee

      WHERE user_id=?

      AND financial_year=?

      AND MONTH(entry_date)=?

      AND YEAR(entry_date)=?

      ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value), Number(year)];
  } else {
    sql = `

      SELECT *

      FROM income_tax_fee

      WHERE user_id=?

      AND financial_year=?

      AND YEAR(entry_date)=?

      ORDER BY entry_date DESC,id DESC

    `;

    params = [userId, financialYear, Number(value)];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.searchIncomeTaxFee = (req, res) => {
  const userId = req.user.id;

  const keyword = req.params.keyword;

  db.query(
    `
    SELECT *
    FROM income_tax_fee
    WHERE user_id=?
    AND (
      applicant_name LIKE ?
    )
    ORDER BY entry_date DESC,id DESC
    `,
    [
      userId,
      `%${keyword}%`
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};
exports.addTaxAuditFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { date, name, amount, financial_year } = req.body;

  const sql = `

        INSERT INTO tax_audit_fee(

            user_id,

            date,

            name,

            amount,

            financial_year

        )

        VALUES(?,?,?,?,?)

    `;

  db.query(
    sql,

    [userId, date, name, Number(amount || 0), financial_year],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "ADD",

        "Tax Audit Fee",

        "Tax Audit Fee Added",
      );

      res.status(201).json({
        success: true,

        message: "Tax Audit Fee Added Successfully",
      });
    },
  );
};
exports.getTaxAuditFee = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

        SELECT *

        FROM tax_audit_fee

        WHERE user_id=?

        ORDER BY date DESC,id DESC

        `,

    [userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.status(200).json(result);
    },
  );
};
exports.getTaxAuditFeeById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

        SELECT *

        FROM tax_audit_fee

        WHERE id=?

        AND user_id=?

        `,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "Tax Audit Fee Not Found",
        });
      }

      res.status(200).json(result[0]);
    },
  );
};
exports.updateTaxAuditFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const { date, name, amount, financial_year } = req.body;

  const sql = `

        UPDATE tax_audit_fee

        SET

            date=?,

            name=?,

            amount=?,

            financial_year=?

        WHERE id=?

        AND user_id=?

    `;

  db.query(
    sql,

    [date, name, Number(amount || 0), financial_year, req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "UPDATE",

        "Tax Audit Fee",

        "Tax Audit Fee Updated",
      );

      res.status(200).json({
        success: true,

        message: "Tax Audit Fee Updated Successfully",
      });
    },
  );
};
exports.deleteTaxAuditFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `

        DELETE FROM tax_audit_fee

        WHERE id=?

        AND user_id=?

        `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "DELETE",

        "Tax Audit Fee",

        "Tax Audit Fee Deleted",
      );

      res.status(200).json({
        success: true,

        message: "Tax Audit Fee Deleted Successfully",
      });
    },
  );
};
exports.filterTaxAuditFee = (req, res) => {
  const userId = req.user.id;

  const { type, value, year, financialYear } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

            SELECT *

            FROM tax_audit_fee

            WHERE user_id=?

            AND financial_year=?

            AND MONTH(date)=?

            AND YEAR(date)=?

            ORDER BY date DESC,id DESC

        `;

    params = [userId, financialYear, Number(value), Number(year)];
  } else {
    sql = `

            SELECT *

            FROM tax_audit_fee

            WHERE user_id=?

            AND financial_year=?

            AND YEAR(date)=?

            ORDER BY date DESC,id DESC

        `;

    params = [userId, financialYear, Number(value)];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.searchTaxAuditFee = (req, res) => {
  const userId = req.user.id;

  const keyword = req.params.keyword;

  db.query(
    `

        SELECT *

        FROM tax_audit_fee

        WHERE user_id=?

        AND (

            name LIKE ?

        )

        ORDER BY date DESC,id DESC

        `,

    [userId, `%${keyword}%`],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.status(200).json(result);
    },
  );
};
exports.addTDSFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    name_of_party,
    invoice_date,
    invoice_no,
    code,
    sec,
    sec_p,
    tds_percentage,
    gross_amount,
    tds_amount,
    net_amount,
    tds_payable,
    financial_year,
  } = req.body;

  const sql = `

    INSERT INTO tds_fee(

        user_id,

        name_of_party,

        invoice_date,

        invoice_no,

        code,

        sec,

        sec_p,

        tds_percentage,

        gross_amount,

        tds_amount,

        net_amount,

        tds_payable,

        financial_year

    )

    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)

    `;

  db.query(
    sql,

    [
      userId,

      name_of_party,

      invoice_date,

      invoice_no,

      code,

      sec,

      sec_p,

      Number(tds_percentage || 0),

      Number(gross_amount || 0),

      Number(tds_amount || 0),

      Number(net_amount || 0),

      Number(tds_payable || 0),

      financial_year,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "ADD",

        "TDS Fee",

        `TDS Fee Invoice ${invoice_no} Added`,
      );

      res.json({
        success: true,

        message: "TDS Fee Saved Successfully",
      });
    },
  );
};
exports.getTDSFee = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

        SELECT *

        FROM tds_fee

        WHERE user_id=?

        ORDER BY invoice_date DESC,id DESC

        `,

    [userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.getTDSFeeById = (req, res) => {
  const userId = req.user.id;

  db.query(
    `

        SELECT *

        FROM tds_fee

        WHERE id=?

        AND user_id=?

        `,

    [req.params.id, userId],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "TDS Fee Record Not Found",
        });
      }

      res.json(result[0]);
    },
  );
};
exports.updateTDSFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const {
    name_of_party,
    invoice_date,
    invoice_no,
    code,
    sec,
    sec_p,
    tds_percentage,
    gross_amount,
    tds_amount,
    net_amount,
    tds_payable,
    financial_year,
  } = req.body;

  db.query(
    `

        UPDATE tds_fee

        SET

            name_of_party=?,

            invoice_date=?,

            invoice_no=?,

            code=?,

            sec=?,

            sec_p=?,

            tds_percentage=?,

            gross_amount=?,

            tds_amount=?,

            net_amount=?,

            tds_payable=?,

            financial_year=?

        WHERE id=?

        AND user_id=?

        `,

    [
      name_of_party,

      invoice_date,

      invoice_no,

      code,

      sec,

      sec_p,

      Number(tds_percentage || 0),

      Number(gross_amount || 0),

      Number(tds_amount || 0),

      Number(net_amount || 0),

      Number(tds_payable || 0),

      financial_year,

      req.params.id,

      userId,
    ],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "UPDATE",

        "TDS Fee",

        `TDS Fee Invoice ${invoice_no} Updated`,
      );

      res.json({
        success: true,

        message: "TDS Fee Updated Successfully",
      });
    },
  );
};
exports.deleteTDSFee = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  db.query(
    `

        DELETE FROM tds_fee

        WHERE id=?

        AND user_id=?

        `,

    [req.params.id, userId],

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      saveActivity(
        userId,
        userName,

        "DELETE",

        "TDS Fee",

        "TDS Fee Deleted",
      );

      res.json({
        success: true,

        message: "TDS Fee Deleted Successfully",
      });
    },
  );
};
exports.filterTDSFee = (req, res) => {
  const userId = req.user.id;

  const { type, value, year, financialYear } = req.query;

  let sql = "";

  let params = [];

  if (type === "month") {
    sql = `

        SELECT *

        FROM tds_fee

        WHERE user_id=?

        AND financial_year=?

        AND MONTH(invoice_date)=?

        AND YEAR(invoice_date)=?

        ORDER BY invoice_date DESC,id DESC

        `;

    params = [userId, financialYear, Number(value), Number(year)];
  } else {
    sql = `

        SELECT *

        FROM tds_fee

        WHERE user_id=?

        AND financial_year=?

        AND YEAR(invoice_date)=?

        ORDER BY invoice_date DESC,id DESC

        `;

    params = [userId, financialYear, Number(value)];
  }

  db.query(
    sql,

    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
exports.searchTDSFee = (req, res) => {
  const userId = req.user.id;

  const keyword = req.params.keyword;

  db.query(
    `

        SELECT *

        FROM tds_fee

        WHERE user_id=?

        AND (

            name_of_party LIKE ?

            OR invoice_no LIKE ?

            OR code LIKE ?

            OR sec LIKE ?

        )

        ORDER BY invoice_date DESC,id DESC

        `,

    [userId, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};
