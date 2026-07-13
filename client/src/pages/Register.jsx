import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../css/login.css";

function Register() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const rightRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    if (form.name.trim().length < 3) {
      alert("Enter Valid Full Name");
      return;
    }

    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(form.name.trim())) {
      alert("Name should contain only letters");
      return;
    }
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(form.mobile)) {
      alert("Enter Valid Mobile Number");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Enter Valid Email");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(form.password)) {
      alert("Password must contain uppercase, lowercase and number.");

      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile,
        password: form.password,
      };

      const res = await registerUser(payload);

      if (res.data.success) {
        alert("Registration Successful");
        navigate("/login");
        return;
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Cannot connect to server");
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

    card.style.transform = `perspective(1400px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)`;

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
        className="login-card register-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onSubmit={handleSubmit}
      >
        <div className="login-left">
          <button
            type="button"
            className="glass-back-btn"
            onClick={() => navigate("/login")}
          >
            <FaArrowLeft />
            Back
          </button>

          <h1>Create Account</h1>

          <p className="welcome">Register your Business ERP account</p>

          <div className="input-box">
            <FaUser className="input-icon" />

            <input
              type="text"
              spellCheck={false}
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-box">
            <FaPhone className="input-icon" />

            <input
              type="tel"
              maxLength={10}
              inputMode="numeric"
              name="mobile"
              placeholder="Mobile Number"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              spellCheck={false}
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              spellCheck={false}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={showConfirm ? "text" : "password"}
              required
              minLength={6}
              name="confirmPassword"
              spellCheck={false}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="register">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="login-right" ref={rightRef}>
          <img src="/erp-3d.png" alt="Business ERP" />
          <div className="light one"></div>
          <div className="light two"></div>
          <div className="light three"></div>
        </div>
      </form>
    </div>
  );
}

export default Register;
