const axios = require("axios");

const sendSMS = async (mobile, otp) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",

      {
        route: "otp",

        variables_values: otp,

        numbers: mobile,
      },

      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      },
    );

    return true;
  } catch (error) {
    console.log(error.message);

    return false;
  }
};

module.exports = sendSMS;
