const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
    },
});

const sendEmailOTP = async (email, otp) => {
    console.log("================================");
console.log("EMAIL USER :", process.env.EMAIL_USER);
console.log("TO EMAIL :", email);
console.log("OTP :", otp);
console.log("================================");
    try {
        await transporter.sendMail({
            from: `"Business ERP" <${process.env.EMAIL_USER}>`,

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