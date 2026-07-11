import { useState, useEffect } from "react";
import "../css/settings.css";
const getFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  if (month >= 4) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};
function Settings() {
  const [settings, setSettings] = useState({
    company_name: "Business ERP",
    gst_number: "",
    financial_year: "auto",
    currency: "INR",
    theme: "Light",
  });
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,

      financialYear: getFinancialYear(),
    }));
  }, []);
  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Settings Saved Successfully");
  };
  return (
    <div className="page">
      <h1 className="page-title">Application Settings</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" name="company" placeholder="Enter Company Name" />
        </div>
        <div className="form-group">
          <label>GST Number</label>
          <input type="text" name="gst" placeholder="Enter GST Number" />
        </div>
        <div className="form-group">
          <label>Financial Year</label>
          <select
            name="financialYear"
            value={settings.financialYear}
            onChange={handleChange}
          >
            <option value="auto">Auto (Current Financial Year)</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2025-2026">2025 - 2026</option>
            <option value="2026-2027">2026 - 2027</option>
            <option value="2027-2028">2027 - 2028</option>
            <option value="custom">Custom Financial Year</option>
          </select>
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select>
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div className="form-group">
          <label>Theme</label>
          <select>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}
export default Settings;
