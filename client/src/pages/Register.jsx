import { useState } from "react";

import { registerUser } from "../services/auth";

import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",

    email: "",

    mobile: "",

    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const handleBack = () => {
      navigate("/login");
    };
    e.preventDefault();

    try {
      const res = await registerUser(form);

      if (res.data.success) {
        alert("Registration Successful");

        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Cannot connect to server");
    }
  };
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <button
            type="button"
            className="icon-back-btn"
            onClick={() => navigate("/login")}
          >
            Back
          </button>

          <h1>Register</h1>
        </div>

        <input name="name" placeholder="Full Name" onChange={handleChange} />

        <input name="email" placeholder="Email" onChange={handleChange} />

        <input name="mobile" placeholder="Mobile" onChange={handleChange} />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
