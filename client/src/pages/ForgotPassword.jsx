import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP } from "../services/auth";
import "../css/login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      alert("Enter Valid Mobile Number");

      return;
    }

    try {
      setLoading(true);

      const res = await sendOTP(mobile);

      alert(res.data.message);

      if (res.data.success) {
        localStorage.setItem(
          "resetMobile",

          mobile,
        );

        navigate("/verify-otp");
      }
    } catch (err) {
      console.log(err);

      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>

        <p>Enter your registered mobile number</p>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <button>{loading ? "Sending OTP..." : "Send OTP"}</button>

        <br />

        <Link to="/login">Back To Login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
