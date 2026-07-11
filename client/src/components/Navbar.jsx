import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/navbar.css";

function Navbar({

    toggleSidebar,

    financialYear,

    setFinancialYear

}) {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("Business ERP");
  const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};


  const [customYear, setCustomYear] = useState(false);
useEffect(() => {
  const company =
    localStorage.getItem("company_name") || "Business ERP";

  setCompanyName(company);

  if (!financialYear && typeof setFinancialYear === "function") {
    setFinancialYear(getCurrentFinancialYear());
  }
}, []);
const changeFinancialYear = (e) => {
  if (e.target.value === "custom") {
    setCustomYear(true);
    return;
  }

  setCustomYear(false);
  setFinancialYear(e.target.value);
};
const handleCustomYear = () => {
  const fy = financialYear.trim();
const years = fy.split("-");

if (
  years.length !== 2 ||
  Number(years[1]) !== Number(years[0]) + 1
) {
  alert("Example: 2025-2026");
  return;
}
  if (!/^\d{4}-\d{4}$/.test(fy)) {
    alert("Financial Year Format: 2028-2029");
    return;
  }

  setFinancialYear(fy);
  setCustomYear(false);
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
  value={customYear ? "custom" : financialYear}
  onChange={changeFinancialYear}
  className="financial-select"
>
<option value={financialYear}>
     {financialYear}
</option>

<option value="custom">
    Custom Financial Year
</option>
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
