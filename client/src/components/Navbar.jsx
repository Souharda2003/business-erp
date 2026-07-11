import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/navbar.css";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("Business ERP");
  const [financialYear, setFinancialYear] = useState("");
  const [customYear, setCustomYear] = useState(false);

  useEffect(() => {
    const company = localStorage.getItem("company_name") || "Business ERP";

    setCompanyName(company);

    const savedYear = localStorage.getItem("financialYear");

    if (savedYear) {
      setFinancialYear(savedYear);
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const fy = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

      setFinancialYear(fy);
      localStorage.setItem("financialYear", fy);
    }
  }, []);

  const changeFinancialYear = (e) => {
    if (e.target.value === "custom") {
      setCustomYear(true);
      return;
    }

    localStorage.setItem("financialYear", e.target.value);

    window.location.reload();
  };

  const handleCustomYear = () => {
    if (!financialYear.includes("-")) {
      alert("Financial Year Format : 2026-2027");
      return;
    }

    localStorage.setItem("financialYear", financialYear);

    window.location.reload();
  };

  const logout = () => {
    localStorage.clear();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={toggleSidebar}>
        <h2 className="company-title">{companyName}</h2>
      </div>

      <div className="navbar-right">
        {customYear ? (
          <>
            <input
              type="text"
              placeholder="2028-2029"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
            />

            <button className="apply-btn" onClick={handleCustomYear}>
              Apply
            </button>
          </>
        ) : (
          <select
            value={financialYear}
            onChange={changeFinancialYear}
            className="financial-select"
          >
            <option value="2028-2029">2028-2029</option>
            <option value="2027-2028">2027-2028</option>
            <option value="2026-2027">2026-2027</option>
            <option value="2025-2026">2025-2026</option>
            <option value="custom">Custom</option>
          </select>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
