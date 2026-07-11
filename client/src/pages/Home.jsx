import { Link, Navigate } from "react-router-dom";

import "../css/home.css";

function Home() {
  const token = localStorage.getItem("token");

  // Login থাকলে Home না দেখিয়ে Dashboard এ পাঠাবে

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-container">
      <h1>Business ERP System</h1>

      <p>Purchase | Sales | LC | GST | Reports</p>

      <div className="home-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
