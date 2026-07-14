import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { FaBars, FaExpand, FaUserCircle, FaChevronDown } from "react-icons/fa";

import "../css/navbar.css";

function Navbar({ toggleSidebar, financialYear, setFinancialYear }) {
  const companyName = localStorage.getItem("company_name") || "Business ERP";
  const profileRef = useRef(null);
  const userName = localStorage.getItem("name") || "Administrator";

  const role = localStorage.getItem("role") || "Business ERP User";
  const [profileOpen, setProfileOpen] = useState(false);
  const getCurrentFinancialYear = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() + 1;

    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };
  const [customYearMode, setCustomYearMode] = useState(false);
  const [customYear, setCustomYear] = useState(getCurrentFinancialYear());

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="premium-navbar">
      <div className="navbar-left">
        <div className="navbar-company" onClick={toggleSidebar}>
          <h2>{companyName}</h2>

          <span>Premium Business Analytics</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="financial-year-box">
          {!customYearMode ? (
            <select
              className="financial-select"
              value={financialYear}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setCustomYearMode(true);

                  setCustomYear("");

                  return;
                }

                const fy = e.target.value;

                setFinancialYear(fy);

                setCustomYear(fy);

                setCustomYearMode(false);
              }}
            >
              <option value={financialYear}>FY {financialYear}</option>

              {financialYear !== getCurrentFinancialYear() && (
                <option value={getCurrentFinancialYear()}>
                  FY {getCurrentFinancialYear()}
                </option>
              )}

              <option value="custom">Custom Financial Year</option>
            </select>
          ) : (
            <input
              type="text"
              className="financial-select"
              placeholder="2024-2025"
              value={customYear}
              autoFocus
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace(/[^0-9-]/g, "");

                setCustomYear(value);

                const regex = /^\d{4}-\d{4}$/;

                if (regex.test(value)) {
                  const years = value.split("-");

                  if (Number(years[1]) === Number(years[0]) + 1) {
                    setFinancialYear(value);

                    setCustomYearMode(false);
                  }
                }
              }}
            />
          )}
        </div>
        <button className="nav-icon-btn" onClick={handleFullscreen}>
          <FaExpand />
        </button>
        <div
          ref={profileRef}
          className="profile-wrapper"
          onClick={(e) => {
            e.stopPropagation();

            setProfileOpen((prev) => !prev);
          }}
        >
          <div className="profile-card">
            <div className="profile-avatar">
              <FaUserCircle />
            </div>

            <div className="profile-info">
              <h4>{userName}</h4>

              <p>{role}</p>
            </div>

            <FaChevronDown
              className={profileOpen ? "profile-arrow rotate" : "profile-arrow"}
            />
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <Link to="/profile">My Profile</Link>

              <Link to="/change-password">Change Password</Link>

              <Link to="/company-profile">Company Profile</Link>

              <hr />

              <Link to="/logout" className="logout-link">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
