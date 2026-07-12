const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("Brevo SMTP Connected Successfully");
    }
});
const sendEmailOTP = async (email, otp) => {
console.log("EMAIL USER :", process.env.EMAIL_USER);
console.log("TO EMAIL :", email);
console.log("OTP :", otp);
    try {
        await transporter.sendMail({
            from: `"Business ERP" <${process.env.EMAIL_FROM}>`,

            to: email,

            subject: "Business ERP - Password Reset OTP",

            html: `
            <div style="
                max-width:600px;
                margin:auto;
                font-family:Arial,sans-serif;
                background:#ffffff;
                border-radius:10px;
                overflow:hidden;
                border:1px solid #ddd;
            ">

                <div style="
                    background:#111827;
                    color:#FFD700;
                    padding:20px;
                    text-align:center;
                    font-size:28px;
                    font-weight:bold;
                ">
                    Business ERP
                </div>

                <div style="padding:30px;">

                    <h2>Password Reset OTP</h2>

                    <p>Hello,</p>

                    <p>
                        We received a request to reset your Business ERP account password.
                    </p>

                    <p>Your OTP is:</p>

                    <div style="
                        font-size:42px;
                        font-weight:bold;
                        color:#111827;
                        letter-spacing:8px;
                        text-align:center;
                        background:#FFF8DC;
                        padding:20px;
                        border-radius:10px;
                    ">
                        ${otp}
                    </div>

                    <p style="margin-top:25px;">
                        This OTP will expire in
                        <b>5 Minutes</b>.
                    </p>

                    <p>
                        If you didn't request this password reset,
                        simply ignore this email.
                    </p>

                    <hr>

                    <p style="color:gray;">
                        © Business ERP
                    </p>

                </div>

            </div>
            `,
        });

        console.log("OTP Email Sent");

        return true;

    } catch (err) {
    console.error("EMAIL SEND FAILED");
    console.error(err);

    if (err.response) {
        console.error(err.response);
    }

    return false;
}
};

module.exports = sendEmailOTP;