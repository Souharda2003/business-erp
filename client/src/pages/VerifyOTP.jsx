import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaKey,
  FaCheckCircle,
  FaRedo,
} from "react-icons/fa";
import { verifyOTP, resendOTP } from "../services/auth";
import "../css/login.css";

function VerifyOTP() {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const rightRef = useRef(null);

  const mobile = localStorage.getItem("resetMobile");

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(60);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobile) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mobile, navigate]);

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please Enter 6 Digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOTP(mobile, otp);

      alert(res.data.message);

      if (res.data.success) {
        navigate("/reset-password");
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(mobile);

      alert("OTP Sent Successfully");

      setTimer(60);
    } catch (err) {
      console.log(err);

      alert("Unable To Send OTP");
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
      right.style.transform = `
        translate(${rotateY}px, ${-rotateX}px)
      `;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    }

    if (rightRef.current) {
      rightRef.current.style.transform =
        "translate(0,0)";
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
        onSubmit={handleVerify}
      >
        {/* LEFT */}

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
            OTP
            <br />
            Verification
          </h1>

          <p className="welcome">
            Enter the 6 digit OTP sent to
            <br />
            <strong>{mobile}</strong>
          </p>

          <div className="input-box">
            <FaKey className="input-icon" />

            <input
              type="text"
              placeholder="Enter 6 Digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
          </div>

          <button
            className="login-btn"
            type="submit"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify OTP
                &nbsp;
                <FaCheckCircle />
              </>
            )}
          </button>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {timer > 0 ? (
              <p
                style={{
                  color: "#d8d8d8",
                  fontSize: "16px",
                }}
              >
                Resend OTP in
                <span
                  style={{
                    color: "#ffd84a",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="login-btn"
                style={{
                  marginTop: "10px",
                }}
              >
                Resend OTP
                &nbsp;
                <FaRedo />
              </button>
            )}
          </div>

          <p className="register">
            <Link to="/login">
              Back To Login
            </Link>
          </p>
        </div>

        {/* RIGHT */}

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

export default VerifyOTP;