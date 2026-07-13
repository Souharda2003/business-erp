import { useState, useEffect , useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMobileAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginUser } from "../services/auth";
import "../css/login.css";

function Login() {
  const cardRef = useRef(null);
const rightRef = useRef(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(form.mobile)) {
      alert("Enter Valid Mobile Number");
      return;
    }

    try {
      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await loginUser({
        ...form,
        timezone,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        localStorage.setItem(
          "role",
          res.data.user.role
        );

        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
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

    card.style.transform =
    `perspective(1400px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)`;

    if(right){

        right.style.transform =
        `translate(${rotateY}px,${-rotateX}px)`;

    }

};

const handleMouseLeave = () => {

    if(cardRef.current){

        cardRef.current.style.transform =
        "perspective(1400px) rotateX(0deg) rotateY(0deg)";

    }

    if(rightRef.current){

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
onSubmit={handleLogin}
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
            Business
            <br />
            ERP
          </h1>

          <p className="welcome">
            Welcome Back
          </p>
          <div className="input-box">
            <FaMobileAlt className="input-icon" />

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
          <div className="options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>

          <p className="register">
            Don't have an account?

            <Link to="/register">
              Register
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

export default Login;