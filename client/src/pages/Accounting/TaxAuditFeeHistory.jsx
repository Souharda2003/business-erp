import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

import {
  deleteTaxAuditFee,
  filterTaxAuditFee,
} from "../../services/accounting";

import "../../css/accounting.css";

function TaxAuditFeeHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();
  const today = new Date();

  const year = today.getFullYear();

  const month = today.getMonth() + 1;

  const currentFinancialYear =
    month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  const [financialYear, setFinancialYear] = useState(currentFinancialYear);

  const [customFinancialYear, setCustomFinancialYear] = useState(false);
  const [list, setList] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const [searched, setSearched] = useState(false);

  const loadData = async () => {
    try {
      const res = await filterTaxAuditFee(
        searchType,

        searchValue,

        currentYear,

        financialYear,
      );

      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadData();
  }, [searchType, searchValue, financialYear]);
  const handleView = (id) => {
    navigate(`/tax-audit-fee/invoice/${id}`);
  };
  const handleSearch = async () => {
    await loadData();

    setSearched(true);
  };

  const handleEdit = (id) => {
    navigate(`/tax-audit-fee/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete Tax Audit Fee Record ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTaxAuditFee(id);

      alert("Deleted Successfully");

      await loadData();

      setSearched(true);
    } catch (err) {
      console.log(err);
    }
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

  const totalAmount = list.reduce(
    (sum, item) => sum + Number(item.amount || 0),

    0,
  );

  return (
  <div className="page lc-page">

    <div className="lc-header">
      <BackButton />

      <div>
        <h1 className="page-title">
          Tax Audit Fee History
        </h1>

        <p className="page-subtitle">
          View & Manage Tax Audit Fee Records
        </p>
      </div>
    </div>
<div className="form-container history-filter-card">

      <div className="history-filter-row">

        <div className="form-group">

          <label>Search Type</label>
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
                placeholder="Enter Year"
                min="2000"
                max="2100"
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
          </div>
            <div className="form-group search-btn-group">

          <button
            type="button"
            className="primary-btn"
            onClick={handleSearch}
          >
            Search Tax Audit Fee
          </button>

        </div></div>
          </div>

     <div className="history-report-title">

      <h2>
            Tax Audit Fee Report
          </h2>

          <p>
            <b>Search By :</b> {searchType === "month" ? "Month" : "Year"}
          </p>
          <p>
            <b>Value :</b>{" "}
            {searchType === "month"
              ? monthNames[Number(searchValue)]
              : searchValue}
          </p>
</div>
          <div className="form-container history-table-card">

      <div className="history-table-header">

        <h2>GST Fee Records</h2>

        <span>
          Total Records : {list.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

            <thead>
              <tr>
                <th>Date</th>

                <th>Name</th>

                <th>Amount</th>

                <th>Financial Year</th>

                <th >Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="history-empty"
                  >
                    No Tax Audit Fee Record Found
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-GB")
                        : ""}
                    </td>

                    <td>{item.name}</td>

                    <td>₹{" "}

    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>
    <td>{item.financial_year}</td>

                    <td className="action-column">
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/tax-audit-fee/invoice/${item.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/tax-audit-fee/edit/${item.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
</div></div>
    <div className="lc-total-card">

            <h2>
              Total Tax Audit Fee Amount
            </h2>
  <h1>
              ₹{" "}
    {Number(totalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 
            </h1>
          </div>
<div  className ="lc-summary-card">
            <h2 className ="summary-title">
              Tax Audit Fee Summary
            </h2>

            <hr />

            {list.length === 0 ? (
             <div className="summary-empty">
                No Tax Audit Fee Summary Found
              </div>
            ) : (
              <>
                {list.map((item) => (
                  <div
              className="summary-entry-card"
              key={item.id}
            >

              <h3>
                      Tax Audit Fee Entry
                    </h3>
<div className="summary-grid">

                    <p>
                      <b>Date :</b>{" "}
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-GB")
                        : ""}
                    </p>
                    <p>
                      <b>Name :</b> {item.name}
                    </p>

                    <p>
                      <b>Amount :</b>     ₹{" "}

    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 
                    </p>
                    <p>
                      <b>Financial Year :</b> {item.financial_year}
                    </p>
    </div>
                    <hr />

                  <div className="summary-grand-total">
                      Total Amount :     ₹{" "}

    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </div>
                  </div>
                ))}
<div className="summary-overall-card">
                  <h2>
                    Grand Total :     ₹{" "}

    {Number(totalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 
                  </h2>
                  <h3>
                    Financial Year :{financialYear}
                  </h3>
                  <h3>
                    Total Records : {list.length}
                  </h3>
                </div>
              </>
            )}
          </div>
        </div>
  );
}

export default TaxAuditFeeHistory;
