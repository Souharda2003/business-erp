import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import { getProfitSummary } from "../services/accounting";

import "../css/profithistory.css";

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
    financialYear || currentYear,
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
}, [searchType, searchValue]);

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
      <div className="page profit-history-page">
        <div className="profit-content">
          
        <div className="profit-history-header">

          <BackButton />

          <div className="profit-history-heading">

            <h1 className="page-title">
              Profit History
            </h1>

            <p className="page-subtitle">
              View your complete income, purchase and net profit summary.
            </p>

          </div>

        </div>
        <div className="history-filter-card">

          <div className="card-glow"></div>

          <div className="history-filter-row">
            <div className="form-group">

              <label>
                Search Type
              </label>

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

                <option value="month">
                  Month
                </option>

                <option value="year">
                  Year
                </option>

              </select>

            </div>
            <div className="form-group">

              <label>

                {searchType === "month"

                  ? "Select Month"

                  : "Select Year"}

              </label>

              {searchType === "month" ? (

                <select
                  value={searchValue}
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
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
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
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

                  <option value="2024">
                    2024
                  </option>

                  <option value="2025">
                    2025
                  </option>

                  <option value="2026">
                    2026
                  </option>

                  <option value="2027">
                    2027
                  </option>

                  <option value="2028">
                    2028
                  </option>

                  <option value="custom">
                    Custom
                  </option>

                </select>

              )}

            </div>
            <div className="search-btn-group">

              <button
                className="search-btn"
                onClick={handleSearch}
              >

                Search

              </button>

            </div>

          </div>

        </div>
        <div className="history-table-card">

          <div className="card-glow"></div>

          <div className="history-table-header">

            <h2>
              Profit Report
            </h2>

            <span>

              {searchType === "month"

                ? monthNames[searchValue]

                : searchValue}

            </span>

          </div>

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>

                <tr>

                  <th>
                    Income / Expense
                  </th>

                  <th>
                    Amount (₹)
                  </th>

                </tr>

              </thead>

              <tbody>
                                <tr>
                  <td>Total Sales</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.sales).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

                <tr>
                  <td>Total Drawback</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.drawback).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

                <tr>
                  <td>Total RODTEP</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.rodtep).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

                <tr>
                  <td>Total GST</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.gst).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

                <tr>
                  <td>Other Sales</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.otherSales).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

                <tr>
                  <td>Total Purchase</td>
                  <td className="amount-cell">
                    ₹{" "}
    {Number(summary.purchase).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>
        <div className="summary-grid">
          <div className="summary-card income-card">

            <div className="card-glow"></div>

            <h3>
              Total Income
            </h3>

            <h2>
              ₹{" "}
    {Number(totalIncome).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
            </h2>

            <p className="summary-label">
              Sales + Drawback + RODTEP + GST + Other Sales
            </p>

          </div>
          <div className="summary-card purchase-card">

            <div className="card-glow"></div>

            <h3>
              Total Purchase
            </h3>

            <h2>
              ₹{" "}
    {Number(totalExpense).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
            </h2>

            <p className="summary-label">
              Total Purchase Amount
            </p>

          </div>
          <div
            className={`summary-card ${
              netProfit >= 0
                ? "profit-card"
                : "loss-card"
            }`}
          >

            <div className="card-glow"></div>

            <h3>
              Net Profit
            </h3>

            <h2>
              ₹{" "}
    {Number(netProfit).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
            </h2>

            <p className="summary-label">
              Income − Purchase
            </p>

          </div>

        </div>

      </div>
                </div>
);
}
export default ProfitHistory;