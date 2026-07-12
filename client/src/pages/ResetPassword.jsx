import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";

import { resetPassword } from "../services/auth";
import "../css/login.css";

function ResetPassword() {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const rightRef = useRef(null);

  const mobile = localStorage.getItem("resetMobile");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!mobile) {
      navigate("/forgot-password");
    }
  }, [mobile, navigate]);

  const handleBack = () => {
    navigate("/verify-otp");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(form.password)) {
      alert(
        "Password must contain Uppercase, Lowercase, Number & Special Character."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(
        mobile,
        form.password
      );

      alert(res.data.message);

      if (res.data.success) {
        localStorage.removeItem("resetMobile");

        navigate("/login");
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Password Reset Failed"
      );
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
      rightRef.current.style.transform = "translate(0,0)";
    }
  };
    return (
    <div className="login-page">
      <div className="background-lines"></div>

      <form
        ref={cardRef}
        className="login-card"
        onSubmit={handleSubmit}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
            Reset
            <br />
            Password
          </h1>

          <p className="welcome">
            Create a strong password for your
            <br />
            Business ERP account.
          </p>

          {/* Password */}

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {/* Confirm Password */}

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          <button
            className="login-btn"
            type="submit"
          >
            {loading ? (
              "Updating..."
            ) : (
              <>
                Update Password
                &nbsp;
                <FaCheckCircle />
              </>
            )}
          </button>

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

export default ResetPassword;