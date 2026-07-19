import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { getAccountingSummary } from "../../services/dashboard";
import "../../css/accounting.css";
function Accounting() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    government_fee: 0,
    gst_fee: 0,
    income_tax_fee: 0,
    tax_audit_fee: 0,
    tds_fee: 0,
  });
const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;

};

const [financialYear, setFinancialYear] = useState(
  getCurrentFinancialYear()
);
  const loadSummary = async () => {

    try {

      const res = await getAccountingSummary(financialYear);

      setSummary(res.data.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadSummary();

  }, [financialYear]);

  const totalAccountingCharge =

    Number(summary.government_fee || 0)

    +

    Number(summary.gst_fee || 0)

    +

    Number(summary.income_tax_fee || 0)

    +

    Number(summary.tax_audit_fee || 0)

    +

    Number(summary.tds_fee || 0);

  return (
 <div className="page accounting-page">

    <div className="rodtep-header">

      <BackButton />

      <div className="rodtep-heading">

        <h1 className="page-title">
          Accounting Charges
        </h1>

        <p className="page-subtitle">
          View & Manage Accounting Credit Records
        </p>

      </div>

    </div>

          <div className="card-container">

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/government-fee-history")
              }
              style={{ cursor: "pointer" }}
            >

              <h3>Government Fee</h3>

              <h2>

    ₹{" "}

    {Number(summary.government_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

              <p>View History</p>

            </div>

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/gst-fee-history")
              }
              style={{ cursor: "pointer" }}
            >

              <h3>GST Fee</h3>

              <h2>
    ₹{" "}

    {Number(summary.gst_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

              <p>View History</p>

            </div>

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/income-tax-fee-history")
              }
              style={{ cursor: "pointer" }}
            >

              <h3>Income Tax Fee</h3>

              <h2>

    ₹{" "}

    {Number(summary.income_tax_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

              <p>View History</p>

            </div>
                        <div
              className="dashboard-card"
              onClick={() =>
                navigate("/tax-audit-fee-history")
              }
              style={{ cursor: "pointer" }}
            >

              <h3>Tax Audit Fee</h3>

              <h2>
    ₹{" "}

    {Number(summary.tax_audit_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

              <p>View History</p>

            </div>

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/tds-fee-history")
              }
              style={{ cursor: "pointer" }}
            >

              <h3>TDS Fee</h3>

              <h2>

    ₹{" "}

    {Number(summary.tds_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

              <p>View History</p>

            </div>

          </div>

   <div className="lc-total-card ">
            <h2>

              Total Accounting Charges

            </h2>

            <h1>

    ₹{" "}

    {Number(totalAccountingCharge).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
            </h1>

          </div>
    <div className="lc-summary-card">

            <h3 className="summary-title">Accounting Summary</h3>

            <hr />
 <div className="summary-grid">

            <p>

              Government Fee :

              <b>

    ₹{" "}

    {Number(summary.government_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </b>

            </p>

            <p>

              GST Fee :

              <b>

    ₹{" "}

    {Number(summary.gst_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </b>

            </p>

            <p>

              Income Tax Fee :

              <b>
    ₹{" "}

    {Number(summary.income_tax_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </b>

            </p>

            <p>

              Tax Audit Fee :

              <b>
    ₹{" "}

    {Number(summary.tax_audit_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </b>

            </p>

            <p>

              TDS Fee :

              <b>
    ₹{" "}

    {Number(summary.tds_fee).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </b>

            </p>
              </div>
              <hr/>
<div className="summary-grand-total">

              Total :    ₹{" "}

    {Number(totalAccountingCharge).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </div>
          </div>
        </div>

  );

}

export default Accounting;