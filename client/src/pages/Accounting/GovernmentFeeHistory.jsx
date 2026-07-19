import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

import {
  filterGovernmentFee,
  deleteGovernmentFee,
} from "../../services/accounting";

import "../../css/accounting.css";

function GovernmentFeeHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();
  const today = new Date();

  const year = today.getFullYear();

  const month = today.getMonth() + 1;

  const currentFinancialYear =
    month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  const [financialYear, setFinancialYear] = useState(currentFinancialYear);
  const [list, setList] = useState([]);
  const [customFinancialYear, setCustomFinancialYear] = useState(false);
  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const [searched, setSearched] = useState(false);

  const loadData = async () => {
    try {
      const res = await filterGovernmentFee(
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
  const handleSearch = async () => {
    await loadData();

    setSearched(true);
  };

  const handleEdit = (id) => {
    navigate(`/government-fee/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete Government Fee Record?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteGovernmentFee(id);

      alert("Deleted Successfully");

      await loadData();

      setList((prev) => [...prev]);

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
    (sum, item) => sum + Number(item.total_amount || 0),

    0,
  );
  const totalPayment = list.reduce(
    (sum, item) => sum + Number(item.amount || 0),

    0,
  );
  const totalCGST = list.reduce(
    (sum, item) => sum + Number(item.cgst_amount || 0),

    0,
  );

  const totalSGST = list.reduce(
    (sum, item) => sum + Number(item.sgst_amount || 0),

    0,
  );

  const totalIGST = list.reduce(
    (sum, item) => sum + Number(item.igst_amount || 0),

    0,
  );

  return (
  <div className="page lc-page">

    <div className="lc-header">
      <BackButton />

      <div>
        <h1 className="page-title">
          Export Inspection Council History
        </h1>

        <p className="page-subtitle">
          View & Manage Export Inspection Council Records
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
            Search Government Fee
          </button>

        </div>
            </div></div>

    <div className="history-report-title">

      <h2>
            Export Inspection Council Report
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

        <h2>Government Fee Records</h2>

        <span>
          Total Records : {list.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

            <thead>
              <tr>
                <th>Invoice No</th>

                <th>Applicant</th>

                <th>GSTIN</th>

                <th>IEC Code</th>

                <th>Fee Type</th>

                <th>Total Amount</th>
                <th>Date</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                  className="history-empty"
                  >
                    No Government Fee Record Found
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoice_no}</td>

                    <td>{item.applicant_name}</td>

                    <td>{item.exporter_gstin}</td>

                    <td>{item.iec_code}</td>

                    <td>
                      {item.fee_description === "Other"
                        ? item.other_description
                        : item.fee_description}
                    </td>

                    <td>                ₹{" "}

    {Number(item.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 
</td>
                    <td>
                      {item.entry_date
                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                        : ""}
                    </td>

                    <td className="action-column">
                      <td className="action-column">
                        <button
                          className="view-btn"
                          onClick={() =>
                            navigate(`/government-fee/invoice/${item.id}`)
                          }
                        >
                          View
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/government-fee/edit/${item.id}`)}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

      </div>

    </div>
    <div className="lc-total-card">

            <h2>
              Total Government Fee Amount
            </h2>

            <h1 >₹{" "}{Number(totalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h1>
          </div>
          <div  className ="lc-summary-card">
            <h2 className ="summary-title">
              Government Fee Summary
            </h2>

            <hr />

            {list.length === 0 ? (
              <div className="summary-empty">
                No Government Fee Summary Found
              </div>
            ) : (
              <>
                {list.map((item) => (

            <div
              className="summary-entry-card"
              key={item.id}
            >

              <h3>
                      Government Fee Entry
                    </h3>
                    <div className="summary-grid">
                      
                    <p>
                      <b>Invoice : </b> {item.invoice_no}
                    </p>
                    <p>
                      <b>Date : </b>{" "}
                      {item.entry_date
                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                        : ""}
                    </p>

                    <p>
                      <b>Applicant Name : </b> {item.applicant_name}
                    </p>
                    <p>
                      <b>Financial Year :</b>

                      {item.financial_year}
                    </p>
                    <p>
                      <b>Exporter GSTIN : </b> {item.exporter_gstin}
                    </p>

                    <p>
                      <b>IEC Code : </b> {item.iec_code}
                    </p>

                    <p>
                      <b>Fee Description : </b>{" "}
                      {item.fee_description === "Other"
                        ? item.other_description
                        : item.fee_description}
                    </p>

                    <p>
                      <b>Amount : </b>                 ₹{" "}

    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 

                    </p>

                    <p>
                      <b>CGST : </b>{Number(item.cgst_percent || 0).toFixed(2)} %
                    </p>

                    <p>
                      <b>CGST Amount : </b> ₹{" "}

    {Number(item.cgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </p>

                    <p>
                      <b>SGST : </b>{Number(item.sgst_percent || 0).toFixed(2)} %
                      </p>
                    
                    <p>
                      <b>SGST Amount : </b> ₹{" "}

    {Number(item.sgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </p>

                    <p>
                      <b>IGST : </b> {Number(item.igst_percent || 0).toFixed(2)}%
                    </p>

                    <p>
                      <b>IGST Amount : </b>₹{" "}

    {Number(item.igst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </p></div>
                    <hr />
<div className="summary-grand-total">
                      Total Amount : ₹{" "}

    {Number(item.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </div>
                  </div>
                ))}

                  <div className="summary-overall-card">
                  <h2>
                    Grand Total :     ₹{" "}

    {Number(totalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </h2>
                  <h3>
                    Total Payment Amount :     ₹{" "}

    {Number(totalPayment).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h3>
                  <h3>
                    Total CGST :     ₹{" "}

    {Number(totalCGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h3>

                  <h3>
                    Total SGST :     ₹{" "}

    {Number(totalSGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h3>

                  <h3>
                    Total IGST :    ₹{" "}

    {Number(totalIGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h3>
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

export default GovernmentFeeHistory;
