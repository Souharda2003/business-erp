const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendSMS = require("../utils/sendSMS");
const saveActivity = require("../utils/saveActivity");

/*
==========================================
SEND OTP
==========================================
*/

exports.sendOTP = (req, res) => {

    const { mobile } = req.body;

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const expireTime = new Date(
        Date.now() + 5 * 60 * 1000
    );

    db.query(

        "SELECT * FROM users WHERE mobile=?",

        [mobile],

        (err, userResult) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Database Error"

                });

            }

            if (userResult.length == 0) {

                return res.json({

                    success: false,

                    message: "Mobile Number Not Registered"

                });

            }

            db.query(

                "DELETE FROM otp_verification WHERE mobile=?",

                [mobile],

                () => {

                    db.query(

                        `
                        INSERT INTO otp_verification
                        (
                            mobile,
                            otp,
                            purpose,
                            expire_time,
                            verified,
                            attempts
                        )
                        VALUES
                        (
                            ?,
                            ?,
                            'FORGOT_PASSWORD',
                            ?,
                            0,
                            0
                        )
                        `,

                        [

                            mobile,

                            otp,

                            expireTime

                        ],

                        async () => {

                            await sendSMS(

                                mobile,

                                otp

                            );

                            saveActivity(

                                userResult[0].name,

                                "OTP SEND",

                                "Authentication",

                                "Forgot Password OTP Sent",

                                userResult[0].id

                            );

                            return res.json({

                                success: true,

                                message: "OTP Sent Successfully"

                            });

                        }

                    );

                }

            );

        }

    );

};

/*
==========================================
VERIFY OTP
==========================================
*/

exports.verifyOTP = (req, res) => {

    const { mobile, otp } = req.body;

    db.query(

        `
        SELECT *
        FROM otp_verification
        WHERE mobile=?
        ORDER BY id DESC
        LIMIT 1
        `,

        [

            mobile

        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Database Error"

                });

            }

            if (result.length == 0) {

                return res.json({

                    success: false,

                    message: "OTP Not Found"

                });

            }

            const otpData = result[0];

            if (otpData.attempts >= 5) {

                return res.json({

                    success: false,

                    message: "Maximum OTP Attempt Reached"

                });

            }

            if (

                otpData.expire_time < new Date()

            ) {

                return res.json({

                    success: false,

                    message: "OTP Expired"

                });

            }

            if (otpData.otp != otp) {

                db.query(

                    `
                    UPDATE otp_verification

                    SET attempts=attempts+1

                    WHERE id=?
                    `,

                    [

                        otpData.id

                    ]

                );

                return res.json({

                    success: false,

                    message: "Invalid OTP"

                });

            }

            db.query(

                `
                UPDATE otp_verification

                SET verified=1

                WHERE id=?
                `,

                [

                    otpData.id

                ],

                () => {

                    return res.json({

                        success: true,

                        message: "OTP Verified Successfully"

                    });

                }

            );

        }

    );

};

/*
==========================================
RESET PASSWORD
==========================================
*/

exports.resetPassword = (req, res) => {

    const {

        mobile,

        password

    } = req.body;

    db.query(

        `
        SELECT *
        FROM otp_verification
        WHERE

        mobile=?

        AND verified=1

        ORDER BY id DESC

        LIMIT 1
        `,

        [

            mobile

        ],

        async (err, otpResult) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Database Error"

                });

            }

            if (otpResult.length == 0) {

                return res.json({

                    success: false,

                    message: "OTP Verification Required"

                });

            }

            const hash = await bcrypt.hash(

                password,

                10

            );

            db.query(

                `
                UPDATE users

                SET

                password=?,

                password_changed_at=NOW()

                WHERE mobile=?
                `,

                [

                    hash,

                    mobile

                ],

                (err) => {

                    if (err) {

                        return res.status(500).json({

                            success: false,

                            message: "Password Update Failed"

                        });

                    }

                    db.query(

                        "SELECT * FROM users WHERE mobile=?",

                        [

                            mobile

                        ],

                        (err, userResult) => {

                            if (

                                userResult.length > 0

                            ) {

                                db.query(

                                    `
                                    INSERT INTO password_history
                                    (
                                        user_id,
                                        password
                                    )
                                    VALUES
                                    (
                                        ?,
                                        ?
                                    )
                                    `,

                                    [

                                        userResult[0].id,

                                        hash

                                    ]

                                );

                                saveActivity(

                                    userResult[0].name,

                                    "PASSWORD RESET",

                                    "Authentication",

                                    "Password Reset Using OTP",

                                    userResult[0].id

                                );

                            }

                        }

                    );

                    db.query(

                        `
                        DELETE FROM otp_verification
                        WHERE mobile=?
                        `,

                        [

                            mobile

                        ]

                    );

                    return res.json({

                        success: true,

                        message: "Password Updated Successfully"

                    });

                }

            );

        }

    );

};

/*
==========================================
RESEND OTP
==========================================
*/

exports.resendOTP = (req, res) => {

    const {

        mobile

    } = req.body;

    db.query(

        `
        DELETE FROM otp_verification

        WHERE mobile=?
        `,

        [

            mobile

        ],

        () => {

            req.body.mobile = mobile;

            exports.sendOTP(

                req,

                res

            );

        }

    );

};