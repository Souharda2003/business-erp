import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile: "",

    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", {
        replace: true,
      });
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
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("Timezone:", timezone);

    const res = await loginUser({
      ...form,
      timezone,
    });

    console.log(res.data);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem("role", res.data.user.role);

      navigate("/dashboard");
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log(err);

    alert(err.response?.data?.message || "Login Failed");
  }
};
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-header">
          <button type="button" className="back-btn" onClick={handleBack}>
            Back
          </button>

          <h1>Business ERP Login</h1>
        </div>

        <input
          type="text"
          name="mobile"
          value={form.mobile}
          placeholder="Mobile Number"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>
        <div
          style={{
            marginTop: "15px",

            textAlign: "center",
          }}
        >
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <p>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
