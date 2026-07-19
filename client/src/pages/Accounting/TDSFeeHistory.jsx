import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

import { deleteTDSFee, filterTDSFee } from "../../services/accounting";

import "../../css/accounting.css";

function TDSFeeHistory() {
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
      const res = await filterTDSFee(
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
    navigate(`/tds-fee/invoice/${id}`);
  };
  const handleSearch = async () => {
    await loadData();

    setSearched(true);
  };

  const handleEdit = (id) => {
    navigate(`/tds-fee/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete TDS Fee Record ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTDSFee(id);

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
    (sum, item) => sum + Number(item.tds_payable || 0),

    0,
  );

  return (
  <div className="page lc-page">

    <div className="lc-header">
      <BackButton />

      <div>
        <h1 className="page-title">
         TDS Fee History
        </h1>

        <p className="page-subtitle">
          View & Manage TDS Fee Records
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
            Search TDS Fee
          </button>

        </div></div>
          </div>
              <div className="history-report-title">

      <h2>
            TDS Fee Report
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
                <th>Name Of Party</th>

                <th>Invoice Date</th>

                <th>Invoice No</th>

                <th>Code</th>

                <th>Gross Amount</th>

                <th>TDS Amount</th>

                <th>Net Amount</th>

                <th>TDS Payable</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                     className="history-empty"
                  >
                    No TDS Fee Record Found
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name_of_party}</td>

                    <td>
                      {item.invoice_date
                        ? new Date(item.invoice_date).toLocaleDateString(
                            "en-GB",
                          )
                        : ""}
                    </td>

                    <td>{item.invoice_no}</td>

                    <td>{item.code}</td>

                    <td>    ₹{" "}
    {Number(item.gross_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</td>

                  <td>    ₹{" "}
    {Number(item.tds_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</td><td>    ₹{" "}
    {Number(item.net_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</td><td>    ₹{" "}
    {Number(item.tds_payable).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
</td>
                    <td className="action-column">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/tds-fee/invoice/${item.id}`)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/tds-fee/edit/${item.id}`)}
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
              Total TDS Payable
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
              TDS Fee Summary
            </h2>

            <hr />

            {list.length === 0 ? (
              
             <div className="summary-empty">
                No TDS Fee Summary Found
              </div>
            ) : (
              <>
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="summary-entry-card"
                  >
                    <h3>
                      TDS Fee Entry
                    </h3>
                    <div className="summary-grid">

                    <p>
                      <b>Financial Year :</b>

                      {item.financial_year}
                    </p>
                    <p>
                      <b>Name Of Party : </b> {item.name_of_party}
                    </p>

                    <p>
                      <b>Invoice Date : </b>{" "}
                      {item.invoice_date
                        ? new Date(item.invoice_date).toLocaleDateString(
                          "en-GB",
                          )
                        : ""}
                    </p>

                    <p>
                      <b>Invoice No : </b> {item.invoice_no}
                    </p>

                    <p>
                      <b>Code : </b> {item.code}
                    </p>

                    <p>
                      <b>SEC : </b> {item.sec}
                    </p>

                    <p>
                      <b>SEC(P) : </b> {item.sec_p}
                    </p>

                    <p>
                      <b>TDS Percentage : </b> {item.tds_percentage}%
                    </p>

                    <p>
                      <b>Gross Amount : </b>  ₹{" "}
    {Number(item.gross_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </p>

                    <p>
                      <b>TDS Amount : </b>  ₹{" "}
    {Number(item.tds_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </p>

                    <p>
                      <b>Net Amount : </b>  ₹{" "}
    {Number(item.net_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </p>

                    <p>
                      <b>TDS Payable : </b>  ₹{" "}
    {Number(item.tds_payable).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </p>

                    </div>
                    <hr />
<div className="summary-grand-total">
                      Total TDS Payable : ₹{" "}

    {Number(item.tds_payable).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                    </div>
                  </div>
                ))}

               <div className="summary-overall-card">
                  <h2>
                    Grand Total TDS Payable :     ₹{" "}

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

export default TDSFeeHistory;
