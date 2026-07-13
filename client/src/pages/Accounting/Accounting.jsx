import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

import { getAccountingSummary } from "../../services/dashboard";

import "../../css/dashboard.css";

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

    <div className="app">
  <div className="main-content reports-full">
     <Navbar
  financialYear={financialYear}
  setFinancialYear={setFinancialYear}
/>


        <div className="page">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >

            <BackButton />

            <h1 style={{ margin: 0 }}>

              Accounting Charges

            </h1>

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

                ₹{Number(summary.government_fee||0).toFixed(2)}

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

                ₹{Number(summary.gst_fee||0).toFixed(2)}

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

                ₹{Number(summary.income_tax_fee||0).toFixed(2)}

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

                ₹{Number(summary.tax_audit_fee||0).toFixed(2)}

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

                ₹{Number(summary.tds_fee||0).toFixed(2)}

              </h2>

              <p>View History</p>

            </div>

          </div>

          <br />

          <div
            style={{

              background: "#ffffff",

              padding: "25px",

              borderRadius: "12px",

              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",

              textAlign: "center",

            }}
          >

            <h2
              style={{
                color: "#2563eb",
                marginBottom: "15px",
              }}
            >

              Total Accounting Charges

            </h2>

            <h1
              style={{
                color: "#16a34a",
                fontSize: "40px",
              }}
            >

              ₹{Number(totalAccountingCharge).toFixed(2)}

            </h1>

          </div>

          <br />

          <div
            style={{

              background: "#f8fafc",

              padding: "20px",

              borderRadius: "10px",

            }}
          >

            <h3>Accounting Summary</h3>

            <hr />

            <p>

              Government Fee :

              <b>

                ₹{Number(summary.government_fee||0).toFixed(2)}

              </b>

            </p>

            <p>

              GST Fee :

              <b>

                ₹{Number(summary.gst_fee||0).toFixed(2)}

              </b>

            </p>

            <p>

              Income Tax Fee :

              <b>

                ₹{Number(summary.income_tax_fee||0).toFixed(2)}

              </b>

            </p>

            <p>

              Tax Audit Fee :

              <b>

                ₹{Number(summary.tax_audit_fee||0).toFixed(2)}

              </b>

            </p>

            <p>

              TDS Fee :

              <b>

                ₹{Number(summary.tds_fee||0).toFixed(2)}

              </b>

            </p>

            <hr />

            <h2
              style={{
                color: "#16a34a",
              }}
            >

              Total :

              ₹{Number(totalAccountingCharge).toFixed(2)}

            </h2>

          </div>
          {/* <div
                  style={{
                    background: "#ecfdf5",
                    padding: "20px",
                    borderRadius: "12px",
                    marginTop: "25px",
                  }}
                >
                  <h2
                    style={{
                      color: "#16a34a",
                    }}
                  >
                     Total Charges : ₹{Number(totalAccountingCharge).toFixed(2)}
                  </h2>
          <h3
                    style={{
                      color: "#dc2626",
                    }}
                  >
                    Total Records : {list.length}
                  </h3>
                </div> */}

        </div>

      </div>

    </div>

  );

}

export default Accounting;