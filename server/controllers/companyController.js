const db = require("../config/db");
const saveActivity = require("../utils/saveActivity");
exports.saveCompany = (req, res) => {
    const userId=req.user.id;
    const username = req.user.name;
  const {
    company_name,

    owner_name,

    gst_number,

    pan_number,

    phone,

    email,

    address,

    city,

    state,
    pincode,
    bank_name,
  bank_account_no,
  ifsc_code
  } = req.body;

  const sql = `
  INSERT INTO company_profile
  (
  user_id,
    company_name,
    owner_name,
    gst_number,
    pan_number,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    bank_name,
  bank_account_no,
  ifsc_code
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,

    [
      userId,
      company_name,

      owner_name,

      gst_number,

      pan_number,

      phone,

      email,

      address,

      city,

      state,
      pincode,
      bank_name,
  bank_account_no,
  ifsc_code
    ],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        username,
        "SAVE",

        "Company Profile",

        "Company Profile Created",
      );
      res.json({
        success: true,

        message: "Company Profile Saved Successfully",
      });
    },
  );
};
exports.getCompany = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM company_profile WHERE user_id=? ORDER BY id DESC LIMIT 1";

  db.query(sql,[userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json(null);
    }

    res.json(result[0]);
  });
};
exports.updateCompany = (req, res) => {
    const userId=req.user.id;
    const username = req.user.name;
  const { id } = req.params;

  const {
    company_name,

    owner_name,

    gst_number,

    pan_number,

    phone,

    email,

    address,

    city,

    state,
    pincode,
    bank_name,
  bank_account_no,
  ifsc_code
  } = req.body;

  const sql = `

UPDATE company_profile
SET
company_name=?,
owner_name=?,
gst_number=?,
pan_number=?,
phone=?,
email=?,
address=?,
city=?,
state=?,
pincode=?,
bank_name=?,
  bank_account_no=?,
  ifsc_code=?
WHERE id=? AND user_id=?

`;

  db.query(
    sql,[
company_name,
owner_name,
gst_number,
pan_number,
phone,
email,
address,
city,
state,
pincode,
bank_name,
  bank_account_no,
  ifsc_code,
id,
userId
],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        username,

        "UPDATE",

        "Company Profile",

        "Company Profile Updated",
      );
      res.json({
        success: true,

        message: "Company Profile Updated Successfully",
      });
    },
  );
};
exports.deleteCompany = (req, res) => {
    const userId=req.user.id;
    const username = req.user.name;
  const { id } = req.params;

  db.query(
    "DELETE FROM company_profile WHERE id=? AND user_id=?",

    [id,userId],

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      saveActivity(
        userId,
        username,

        "DELETE",

        "Company Profile",

        "Company Profile Deleted",
      );
      res.json({
        success: true,

        message: "Company Profile Deleted Successfully",
      });
    },
  );
};
