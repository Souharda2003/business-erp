import { Link, Navigate } from "react-router-dom";
import "../css/home.css";

function Home() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-page">

      <div className="background-lines"></div>

      <div className="card-glow"></div>

      <div className="glass-shine"></div>

      <div className="home-content">
        <div className="home-left">

          <h1>
            Business <span>ERP</span>
            <br />
            System
          </h1>

          <p className="home-subtitle">
            Purchase |
            Sales |
            LC |
            GST |
            Reports
          </p>

          <p className="home-description">
            A complete ERP solution to manage your business
            operations, inventory, finance, GST and reporting
            from one place.
          </p>

          <div className="home-buttons">

            <Link to="/login">
              <button className="home-btn">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="home-btn register-btn">
                Register
              </button>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;