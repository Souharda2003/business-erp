const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey =
  defaultClient.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmailOTP = async (email, otp) => {
  try {
    console.log("================================");
    console.log("BREVO API");
    console.log("TO :", email);
    console.log("OTP :", otp);
    console.log("FROM :", process.env.EMAIL_FROM);
    console.log("================================");

    const sender = {
      name: "Business ERP",
      email: process.env.EMAIL_FROM,
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const subject =
      "Business ERP - Password Reset OTP";
          const htmlContent = `
    <div style="
        max-width:600px;
        margin:auto;
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        border:1px solid #e5e7eb;
        font-family:Arial,sans-serif;
    ">

        <div style="
            background:#111827;
            color:#FFD700;
            padding:22px;
            text-align:center;
            font-size:28px;
            font-weight:bold;
        ">
            Business ERP
        </div>

        <div style="padding:35px;">

            <h2 style="margin-top:0;">
                Password Reset OTP
            </h2>

            <p>Hello,</p>

            <p>
                We received a request to reset your Business ERP account password.
            </p>

            <p>Your verification code is:</p>

            <div style="
                text-align:center;
                font-size:42px;
                font-weight:bold;
                letter-spacing:8px;
                color:#111827;
                background:#FFF8DC;
                border-radius:10px;
                padding:20px;
                margin:25px 0;
            ">
                ${otp}
            </div>

            <p>
                This OTP will expire in
                <b>5 Minutes</b>.
            </p>

            <p>
                If you didn't request this password reset,
                simply ignore this email.
            </p>

            <hr>

            <p style="color:#666;">
                © 2026 Business ERP
            </p>

        </div>

    </div>
    `;

    const emailData =
      new SibApiV3Sdk.SendSmtpEmail();

    emailData.sender = sender;

    emailData.to = receivers;

    emailData.subject = subject;

    emailData.htmlContent = htmlContent;

    const response =
      await apiInstance.sendTransacEmail(
        emailData
      );

    console.log(
      "BREVO EMAIL SENT SUCCESSFULLY"
    );

    console.log(response);

    return true;

  } catch (err) {

    console.error(
      "BREVO EMAIL FAILED"
    );

    console.error(err);

    return false;

  }
};

module.exports = sendEmailOTP;