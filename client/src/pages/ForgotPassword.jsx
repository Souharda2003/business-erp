import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaMobileAlt, FaPaperPlane } from "react-icons/fa";
import { sendOTP } from "../services/auth";

import "../css/login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const rightRef = useRef(null);

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate("/login");
  };

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
        localStorage.setItem("resetMobile", mobile);

        navigate("/verify-otp");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1100) return;

    const card = cardRef.current;
    const right = rightRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 60;
    const rotateX = (centerY - y) / 60;

    card.style.transform = `
      perspective(1400px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;

    if (right) {
      right.style.transform = `translate(${rotateY}px,${-rotateX}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    }

    if (rightRef.current) {
      rightRef.current.style.transform = "translate(0,0)";
    }
  };

  return (
    <div className="login-page">
      <div className="background-lines"></div>

      <form
        ref={cardRef}
        className="login-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onSubmit={handleSubmit}
      >
        <div className="login-left">

          <button
            type="button"
            className="glass-back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <h1>
            Forgot
            <br />
            Password
          </h1>

          <p className="welcome">
            Enter your registered mobile number to receive OTP.
          </p>

          <div className="input-box">
            <FaMobileAlt className="input-icon" />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <button
            className="login-btn"
            type="submit"
          >
            {loading ? (
              "Sending OTP..."
            ) : (
              <>
                Send OTP
                &nbsp;
                <FaPaperPlane />
              </>
            )}
          </button>

          <p className="register">
            <Link to="/login">
              Back To Login
            </Link>
          </p>

        </div>

        <div
          className="login-right"
          ref={rightRef}
        >
          <img
            src="/erp-3d.png"
            alt="Business ERP"
          />

          <div className="light one"></div>
          <div className="light two"></div>
          <div className="light three"></div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;