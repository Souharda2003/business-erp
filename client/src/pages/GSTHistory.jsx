import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { filterGST, deleteGST } from "../services/gst";
import BackButton from "../components/BackButton";

import "../css/gst.css";

function GSTHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [gst, setGst] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [gstList, setgstList] = useState([]);

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadGST = async () => {
    try {
      const res = await filterGST(
        searchType,

        searchValue,

        currentYear,
      );

      setGst(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadGST();
  }, [searchType, searchValue]);

  const handleSearch = () => {
    loadGST();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete GST Record ?")) {
      return;
    }

    try {
      await deleteGST(id);

      alert("Deleted Successfully");

      loadGST();
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = (id) => {
    navigate(`/gst/edit/${id}`);
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

  const totalTaxable = gst.reduce(
    (sum, item) => sum + Number(item.taxable_amount || 0),

    0,
  );

  const totalCGST = gst.reduce(
    (sum, item) => sum + Number(item.cgst_amount || 0),

    0,
  );

  const totalSGST = gst.reduce(
    (sum, item) => sum + Number(item.sgst_amount || 0),

    0,
  );

  const totalGST = gst.reduce(
    (sum, item) => sum + Number(item.total_gst || 0),

    0,
  );
  const totalInvoice = totalTaxable + totalGST;
  return (
  <div className="page GST-page">

    <div className="GST-header">
      <BackButton />

      <div>
        <h1 className="page-title">
          GST History
        </h1>

        <p className="page-subtitle">
          View & Manage GST Records
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

      <div className="form-group search-btn-group">

          <button
            type="button"
            className="primary-btn"
            onClick={handleSearch}
          >
            Search LC
          </button>

        </div>
        </div>
      </div>
      </div>
          <div className="history-report-title">

      <h2>
        GST Report
      </h2>
      <p>
        <b>Search By :</b>

        {searchType === "month" ? " Month" : " Year"}
      </p>

      <p>
        <b>Value :</b>

        {searchType === "month" ? monthNames[Number(searchValue)] : searchValue}
      </p>
          </div>
             <div className="form-container history-table-card">

      <div className="history-table-header">

        <h2>GST Records</h2>

        <span>
          Total Records : {gstList.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">
        <thead>
          <tr>
            <th>Invoice No</th>

            <th>Invoice Date</th>

            <th>Supplier</th>

            <th>Taxable Amount</th>

            <th>CGST</th>

            <th>SGST</th>

            <th>Total GST</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {gst.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="history-empty">
                No GST Record Found
              </td>
            </tr>
          ) : (
            gst.map((item, index) => (
              <tr key={item.id || index}>
                <td>{item.invoice_no}</td>
                <td>
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString("en-GB")
                    : ""}
                </td>
                <td>{item.supplier}</td>
                <td>₹{" "}
    {Number(item.taxable_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
                <td>₹{" "}
    {Number(item.cgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
                <td>₹{" "}
    {Number(item.sgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
                <td
                  className="amount-cell">
                 ₹{" "}
    {Number(item.total_gst).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </td>
                <td className="action-column">
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/gst-invoice/${item.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/gst/edit/${item.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
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
          Total GST Amount
        </h2>
        <h1
          style={{
            color: "#16a34a",
            fontSize: "40px",
          }}
        >
          ₹{" "}
    {Number(totalGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
        </h1>
      </div>
    <div className="lc-summary-card">

      <h2 className="summary-title">
          GST Summary
        </h2>
        <hr />
        {gst.length === 0 ? (
   <div className="summary-empty">
          No GST Summary Found
        </div>

        ) : (
          <>
            {gst.map((item, index) => (
            <div
              className="summary-entry-card"
              key={item.id}
            >

                <h3>
                  GST Entry
                </h3>
                 <div className="summary-grid">

                <p>
                  <b>Invoice No :</b> {item.invoice_no}
                </p>
                <p>
                  <b>Invoice Date :</b>{" "}
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString("en-GB")
                    : ""}
                </p>
                <p>
                  <b>Supplier :</b> {item.supplier}
                </p>
                <p>
                  <b>Taxable Amount :</b> ₹{" "}
    {Number(item.taxable_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </p>
                <p>
                  <b>CGST Amount :</b> ₹{" "}
    {Number(item.cgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </p>
                <p>
                  <b>SGST Amount :</b>₹{" "}
    {Number(item.sgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </p>
                <p>
                  <b>Total GST :</b> ₹{" "}
    {Number(item.total_gst).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </p>
            </div>
            <hr/>
                <div className="summary-grand-total">
                  GST Payable : ₹{" "}
    {Number(item.total_gst).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </div>
              </div>
            ))}

          <div className="summary-overall-card">

            
              <h2>
                Total GST : ₹{" "}
    {Number(totalGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>
              <h3>
                Total Taxable Amount : ₹{" "}
    {Number(totalTaxable).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h3>
              <h3>
                Total CGST : ₹{" "}
    {Number(totalCGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h3>
              <h3>
                Total SGST : ₹{" "}
    {Number(totalSGST).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h3>
              <h3>
                Total Invoice Value : ₹{" "}
    {Number(totalInvoice).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h3>

              <h3>Total Records :{gst.length}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default GSTHistory;
