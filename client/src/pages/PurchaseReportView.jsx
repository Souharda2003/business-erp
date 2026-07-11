import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import { getPurchaseReportAnalytics } from "../services/analytics";
import AnalyticsChart from "../components/AnalyticsChart";

import { filterPurchase } from "../services/purchase";

import "../css/reports.css";

function PurchaseReportView() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [purchase, setPurchase] = useState([]);

  const [chartData, setChartData] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadPurchase = async () => {
    try {
      const res = await filterPurchase(
        searchType,

        searchValue,

        currentYear,
      );

      const data = Array.isArray(res.data) ? res.data : [];

      setPurchase(data);

      const chartRes = await getPurchaseReportAnalytics(
        searchType,

        searchValue,

        currentYear,
      );

      setChartData(Array.isArray(chartRes.data) ? chartRes.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPurchase();
  }, [searchType, searchValue]);

  const handleSearch = () => {
    loadPurchase();
  };

  const monthNames = {
    1: "January",

    2: "February",

    3: "March",

    4: "April",

    5: "May",

    6: "June",

    7: "July",

    8: "August",

    9: "September",

    10: "October",

    11: "November",

    12: "December",
  };

  const totalPurchase = purchase.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),

    0,
  );

  const totalTaxable = purchase.reduce(
    (sum, item) => sum + Number(item.taxable_amount || 0),

    0,
  );

  const totalGST = purchase.reduce(
    (sum, item) => sum + Number(item.total_gst || 0),

    0,
  );

  const totalRoundOff = purchase.reduce(
    (sum, item) => sum + Number(item.round_off || 0),

    0,
  );

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="reports-page">
          <div className="reports-header">
            <div>
              <BackButton />

              <h1>Purchase Report</h1>

              <h3>Premium ERP Dashboard</h3>
            </div>

            <div className="year-box">
              <span>Financial Year</span>

              <h2>
                {currentYear}-{currentYear + 1}
              </h2>
            </div>
          </div>

          <div className="last-update">
            Last Updated :{new Date().toLocaleString()}
          </div>

          <div className="report-filter">
            <select
              value={searchType}
              onChange={(e) => {
                const type = e.target.value;

                setSearchType(type);

                setCustomYear(false);

                if (type === "month") {
                  setSearchValue(currentMonth);
                } else {
                  setSearchValue(currentYear);
                }
              }}
            >
              <option value="month">Month</option>

              <option value="year">Year</option>
            </select>

            {searchType === "month" ? (
              <select
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              >
                <option value="1">January</option>

                <option value="2">February</option>

                <option value="3">March</option>

                <option value="4">April</option>

                <option value="5">May</option>

                <option value="6">June</option>

                <option value="7">July</option>

                <option value="8">August</option>

                <option value="9">September</option>

                <option value="10">October</option>

                <option value="11">November</option>

                <option value="12">December</option>
              </select>
            ) : customYear ? (
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            ) : (
              <select
                value={searchValue}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setCustomYear(true);

                    setSearchValue("");
                  } else {
                    setSearchValue(e.target.value);
                  }
                }}
              >
                <option value="2024">2024</option>

                <option value="2025">2025</option>

                <option value="2026">2026</option>

                <option value="2027">2027</option>

                <option value="2028">2028</option>

                <option value="custom">Custom</option>
              </select>
            )}

            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          <AnalyticsChart data={chartData} />
          <br />

          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Invoice No</th>

                  <th>Date</th>

                  <th>Supplier</th>

                  <th>Product</th>

                  <th>Quantity</th>

                  <th>Unit</th>

                  <th>Taxable Amount</th>

                  <th>Total GST</th>

                  <th>Grand Total</th>
                </tr>
              </thead>

              <tbody>
                {purchase.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: "center",

                        color: "#ef4444",

                        padding: "30px",

                        fontWeight: "bold",

                        fontSize: "18px",
                      }}
                    >
                      No Purchase Record Found
                    </td>
                  </tr>
                ) : (
                  purchase.map((item) => (
                    <tr key={item.id}>
                      <td>{item.invoice_no}</td>

                      <td>
                        {item.purchase_date
                          ? new Date(item.purchase_date).toLocaleDateString(
                              "en-GB",
                            )
                          : ""}
                      </td>

                      <td>{item.supplier}</td>

                      <td>{item.product_name}</td>

                      <td>{item.quantity}</td>

                      <td>{item.unit}</td>

                      <td>₹{Number(item.taxable_amount || 0).toFixed(2)}</td>

                      <td>₹{Number(item.total_gst || 0).toFixed(2)}</td>

                      <td>₹{Number(item.total_amount || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <br />

          <div className="summaryBox">
            <div
              style={{
                display: "grid",

                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",

                gap: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "#d4af37",
                  }}
                >
                  Total Purchase
                </h3>

                <h2
                  style={{
                    color: "#22c55e",
                  }}
                >
                  ₹{Number(totalPurchase).toLocaleString()}
                </h2>
              </div>

              <div>
                <h3
                  style={{
                    color: "#d4af37",
                  }}
                >
                  Total Taxable
                </h3>

                <h2
                  style={{
                    color: "#3b82f6",
                  }}
                >
                  ₹{Number(totalTaxable).toLocaleString()}
                </h2>
              </div>

              <div>
                <h3
                  style={{
                    color: "#d4af37",
                  }}
                >
                  Total GST
                </h3>

                <h2
                  style={{
                    color: "#f59e0b",
                  }}
                >
                  ₹{Number(totalGST).toLocaleString()}
                </h2>
              </div>

              <div>
                <h3
                  style={{
                    color: "#d4af37",
                  }}
                >
                  Total Round Off
                </h3>

                <h2
                  style={{
                    color: "#ef4444",
                  }}
                >
                  ₹{Number(totalRoundOff).toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          <br />

          <div className="summaryBox">
            <h2
              style={{
                color: "#d4af37",

                marginBottom: "20px",
              }}
            >
              Purchase Summary
            </h2>
            {purchase.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#ef4444",
                  fontSize: "22px",
                  fontWeight: "bold",
                  padding: "40px",
                }}
              >
                No Purchase Summary Found
              </div>
            ) : (
              purchase.map((item) => (
                <div key={item.id} className="report-summary-card">
                  <div className="report-summary-header">
                    <h2>Purchase Invoice</h2>

                    <span>{item.invoice_no}</span>
                  </div>

                  <div className="report-summary-grid">
                    <div>
                      <label>Purchase Date</label>

                      <h4>
                        {item.purchase_date
                          ? new Date(item.purchase_date).toLocaleDateString(
                              "en-GB",
                            )
                          : ""}
                      </h4>
                    </div>

                    <div>
                      <label>Supplier</label>

                      <h4>{item.supplier}</h4>
                    </div>

                    <div>
                      <label>Product</label>

                      <h4>{item.product_name}</h4>
                    </div>

                    <div>
                      <label>Quantity</label>

                      <h4>
                        {item.quantity} {item.unit}
                      </h4>
                    </div>

                    <div>
                      <label>Unit Price</label>

                      <h4>₹{Number(item.unit_price || 0).toFixed(2)}</h4>
                    </div>

                    <div>
                      <label>Taxable Amount</label>

                      <h4>₹{Number(item.taxable_amount || 0).toFixed(2)}</h4>
                    </div>

                    <div>
                      <label>CGST</label>

                      <h4>{item.cgst_percent} %</h4>
                    </div>

                    <div>
                      <label>CGST Amount</label>

                      <h4>₹{Number(item.cgst_amount || 0).toFixed(2)}</h4>
                    </div>

                    <div>
                      <label>SGST</label>

                      <h4>{item.sgst_percent} %</h4>
                    </div>

                    <div>
                      <label>SGST Amount</label>

                      <h4>₹{Number(item.sgst_amount || 0).toFixed(2)}</h4>
                    </div>

                    <div>
                      <label>Total GST</label>

                      <h4
                        style={{
                          color: "#f59e0b",
                        }}
                      >
                        ₹{Number(item.total_gst || 0).toFixed(2)}
                      </h4>
                    </div>

                    <div>
                      <label>Round Off</label>

                      <h4>₹{Number(item.round_off || 0).toFixed(2)}</h4>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "25px",
                      borderTop: "1px solid rgba(212,175,55,.25)",
                      paddingTop: "20px",
                      textAlign: "right",
                    }}
                  >
                    <h2
                      style={{
                        color: "#22c55e",
                        fontSize: "34px",
                      }}
                    >
                      Grand Total : ₹
                      {Number(item.total_amount || 0).toLocaleString()}
                    </h2>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseReportView;
