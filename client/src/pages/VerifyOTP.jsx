import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { verifyOTP, resendOTP } from "../services/auth";

import "../css/login.css";

function VerifyOTP() {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("resetMobile");

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyOTP(
        mobile,

        otp,
      );

      alert(res.data.message);

      if (res.data.success) {
        navigate("/reset-password");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResend = async () => {
    await resendOTP(mobile);

    alert("OTP Resent");

    setTimer(60);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleVerify}>
        <h1>OTP Verification</h1>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button>Verify OTP</button>

        {timer == 0 ? (
          <button type="button" onClick={handleResend}>
            Resend OTP
          </button>
        ) : (
          <p>Resend in {timer}s</p>
        )}
      </form>
    </div>
  );
}

export default VerifyOTP;
