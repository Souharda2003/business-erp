const db = require("../config/db");

const ProfileModel = {
  getProfile(userId, callback) {
    const sql = `

        SELECT

        u.id,

        u.name,

        u.mobile,

        u.email,

        c.company_name,

        c.owner_name,

        c.phone,

        c.gst_number,

        c.address,

        c.city,

        c.state,

        c.pincode

        FROM users u

        LEFT JOIN company_profile c

        ON u.id=c.user_id

        WHERE u.id=?

        `;

    db.query(sql, [userId], callback);
  },

  updateUser(userId, data, callback) {
    const sql = `

        UPDATE users

        SET

        name=?,

        mobile=?,

        email=?

        WHERE id=?

        `;

    db.query(
      sql,

      [data.name, data.mobile, data.email, userId],

      callback,
    );
  },

  updateCompany(userId, data, callback) {
    const sql = `

        UPDATE company_profile

        SET

        owner_name=?,

        company_name=?,

        phone=?,

        gst_number=?,

        address=?,

        city=?,

        state=?,

        pincode=?

        WHERE user_id=?

        `;

    db.query(
      sql,

      [
        data.owner_name,

        data.company_name,

        data.phone,

        data.gst_number,

        data.address,

        data.city,

        data.state,

        data.pincode,

        userId,
      ],

      callback,
    );
  },
};

module.exports = ProfileModel;
