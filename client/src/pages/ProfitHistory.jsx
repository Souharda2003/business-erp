import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import { getProfitSummary } from "../services/accounting";

import "../css/accounting.css";

function ProfitHistory() {
  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();
const [financialYear, setFinancialYear] = useState("");

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const [summary, setSummary] = useState({
    sales: 0,

    drawback: 0,

    rodtep: 0,

    gst: 0,

    otherSales: 0,

    purchase: 0,
  });

  const loadData = async () => {
    try {
      const res = await getProfitSummary(
        searchType,

        searchValue,

        currentYear,
      );

      console.log("PROFIT API =", res.data);

      setSummary({
        sales: Number(res.data.sales || 0),

        drawback: Number(res.data.drawback || 0),

        rodtep: Number(res.data.rodtep || 0),

        gst: Number(res.data.gst || 0),

        otherSales: Number(res.data.otherSales || 0),

        purchase: Number(res.data.purchase || 0),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchType,searchValue]);

  const handleSearch = async () => {
    await loadData();
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

  const totalIncome =
    Number(summary.sales || 0) +
    Number(summary.drawback || 0) +
    Number(summary.rodtep || 0) +
    Number(summary.gst || 0) +
    Number(summary.otherSales || 0);

  const totalExpense = Number(summary.purchase || 0);

  const netProfit = totalIncome - totalExpense;

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

            <h1 style={{ margin: 0 }}>Profit History</h1>
          </div>

          <br />

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
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
                placeholder="Enter Year"
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

            <button
              onClick={handleSearch}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Search
            </button>
          </div>

          <br />

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Income / Expense</th>

                  <th>Amount (₹)</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Total Sales</td>

                  <td>₹ {Number(summary.sales || 0).toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Total Drawback</td>

                  <td>₹ {Number(summary.drawback || 0).toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Total RODTEP</td>

                  <td>₹ {Number(summary.rodtep || 0).toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Total GST</td>

                  <td>₹ {Number(summary.gst|| 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Other Sales</td>

                  <td>₹ {Number(summary.otherSales || 0).toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Total Purchase</td>

                  <td>₹ {Number(summary.purchase || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div
  style={{
    background: totalIncome >= 0 ? "#dcfce7" : "#fee2e2",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  }}
>
              <h3>Total Income</h3>

             <h2
  style={{
    color: totalIncome >= 0 ? "#15803d" : "#dc2626",
  }}
>
                ₹ {Number(totalIncome || 0).toFixed(2)}
              </h2>
            </div>

            <div
  style={{
    background: totalExpense >= 0 ? "#dcfce7" : "#fee2e2",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  }}
>
  <h3>Total Purchase</h3>

  <h2
    style={{
      color: totalExpense >= 0 ? "#15803d" : "#dc2626",
    }}
  >
    ₹ {Number(totalExpense || 0).toFixed(2)}
  </h2>
</div>

            <div
  style={{
    background: netProfit >= 0 ? "#dcfce7" : "#fee2e2",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  }}
>
  <h3>Net Profit</h3>

  <h2
    style={{
      color: netProfit >= 0 ? "#15803d" : "#dc2626",
    }}
  >
    ₹ {Number(netProfit || 0).toFixed(2)}
  </h2>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitHistory;
