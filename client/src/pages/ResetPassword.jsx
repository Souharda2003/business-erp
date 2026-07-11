import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { resetPassword } from "../services/auth";

import "../css/login.css";

function ResetPassword() {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("resetMobile");

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
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

    if (form.password != form.confirmPassword) {
      alert("Password Not Match");

      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(form.password)) {
      alert("Strong Password Required");

      return;
    }

    try {
      const res = await resetPassword(
        mobile,

        form.password,
      );

      alert(res.data.message);

      if (res.data.success) {
        localStorage.removeItem("resetMobile");

        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>

        <input
          type={show ? "text" : "password"}
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type={show ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <label>
          <input type="checkbox" onChange={() => setShow(!show)} />
          Show Password
        </label>

        <button>Update Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
