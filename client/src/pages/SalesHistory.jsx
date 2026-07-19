import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";

import {
  getSales,
  deleteSales,
  filterSales,
  getSalesSummary,
} from "../services/sales";

import "../css/sales.css";
function SalesHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();
  const [sales, setSales] = useState([]);

  const [summary, setSummary] = useState({});

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);
  const loadSales = async () => {
    try {
      const res = await filterSales(
        searchType,

        searchValue,

        currentYear,
      );

      setSales(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);

      alert("Unable To Load Sales");
    }
  };
  const loadSummary = async () => {
    try {
      const res = await getSalesSummary();

      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadSales();

    loadSummary();
  }, [searchType, searchValue]);
  const handleSearch = () => {
    loadSales();
  };
  const handleEdit = (id) => {
    navigate(`/sales/edit/${id}`);
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Sales Record ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSales(id);

      loadSales();

      loadSummary();

      alert("Sales Deleted Successfully");
    } catch (err) {
      console.log(err);

      alert("Delete Failed");
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

  const totalSales = sales.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),

    0,
  );

  const totalReceived = sales.reduce(
    (sum, item) => sum + Number(item.payment_received || 0),

    0,
  );

  const totalPending = sales.reduce(
    (sum, item) => sum + Number(item.due_amount || 0),

    0,
  );

  const totalQuantity = sales.reduce(
    (sum, item) => sum + Number(item.quantity || 0),

    0,
  );
return (
  <div className="page sales-page">
    <div className="sales-header">

      <BackButton />

      <div className="sales-heading">
        <h1 className="page-title">
          Sales History
        </h1>

        <p className="page-subtitle">
          View & Manage Sales Records
        </p>
      </div>

    </div>
    <div className="purchase-form-card history-filter-card">

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
          </div>
          <div className="form-group">
            <label>
              {searchType === "month" ? "Select Month" : "Select Year"}
            </label>
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
          </div>
          <div className="form-group search-btn-group">
            <label>&nbsp;</label>
            <button
              type="button"
              className="primary-btn"
              onClick={handleSearch}
            >
              Search Sales
            </button>
          </div>
      </div>

    </div>
     <div className="history-report-title">
        <h2>Sales Report</h2>
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
<div className="purchase-form-card history-table-card">

  <div className="history-table-header">

    <h2>Sales Records</h2>

    <span>
      Total Records : {sales.length}
    </span>

  </div>

  <div className="history-table-wrapper">

    <table className="history-table">

      <thead>

        <tr>

          <th>SL</th>

          <th>Date</th>

          <th>Invoice</th>

          <th>Customer</th>

          <th>Product</th>

          <th>Quantity</th>

          <th>Amount</th>

          <th>Received</th>

          <th>Pending</th>

          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {sales.length > 0 ? (

          sales.map((item, index) => {

            const pending =
              Number(item.total_amount || 0) -
              Number(item.payment_received || 0);

            return (

              <tr key={item.id}>

                <td>{index + 1}</td>

                <td>
                  {new Date(item.sales_date)
                    .toLocaleDateString("en-GB")}
                </td>

                <td>{item.invoice_no}</td>

                <td>{item.customer_name}</td>

                <td>{item.product_name}</td>

                <td>

                  {item.quantity} {item.unit}

                </td>

                <td className="amount-cell">

            ₹{" "}

    {Number(item.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </td>

                <td style={{ color: "#6fffb5", fontWeight: 700 }}>
    ₹{" "}

    {Number(item.payment_received).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </td>

                <td style={{ color: "#ff7675", fontWeight: 700 }}>
    ₹{" "}

    {Number(pending).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </td>

                <td>

                  <div className="history-action-buttons">
<button
                          className="view-btn"
                          onClick={() =>
                            navigate(`/sales-invoice/${item.id}`)
                          }
                        >
                          View
                        </button>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/sales/edit/${item.id}`)
                      }
                    >

                      Edit

                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >

                      Delete

                    </button>

                  </div>

                </td>

              </tr>

            );

          })

        ) : (

          <tr>

            <td
              colSpan="10"
              className="history-empty"
            >

              No Sales Record Found

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>
<div className="purchase-form-card purchase-total-card">

  <h2>Total Sales Amount</h2>

  <h1>

    ₹{" "}

    {Number(totalSales).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}

  </h1>

</div>
<div className="purchase-form-card purchase-summary-card">

  <h2 className="summary-title">
    Sales Summary
  </h2>

  <hr />

  {sales.length === 0 ? (

    <div className="summary-empty">

      No Sales Summary Found

    </div>

  ) : (

    <>

      {sales.map((item) => {

        const pending =
          Number(item.total_amount || 0) -
          Number(item.payment_received || 0);

        return (

          <div
            key={item.id}
            className="summary-entry-card"
          >

            <h3>Sales Entry</h3>

            <div className="summary-grid">

              <p>

                <b>Invoice :</b>{" "}

                {item.invoice_no}

              </p>

              <p>

                <b>Date :</b>{" "}

                {item.sales_date
                  ? new Date(
                      item.sales_date
                    ).toLocaleDateString("en-GB")
                  : ""}

              </p>

              <p>

                <b>Customer :</b>{" "}

                {item.customer_name}

              </p>

              <p>

                <b>Product :</b>{" "}

                {item.product_name}

              </p>

              <p>

                <b>Quantity :</b>{" "}

                {item.quantity} {item.unit}

              </p>

              <p>

                <b>Bank :</b>{" "}

                {item.bank_name || "-"}

              </p>

              <p>

                <b>Total Amount :</b>    ₹{" "}

    {Number(item.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </p>

              <p>

                <b>Received :</b>    ₹{" "}

    {Number(item.payment_received).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </p>

              <p>

                <b>Pending :</b>    ₹{" "}

    {Number(pending).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </p>

            </div>

            <hr />

            <div className="summary-grand-total">

              Grand Total :  ₹{" "}

    {Number(totalSales).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
            </div>

          </div>

        );

      })}

      <div className="summary-overall-card">

        <h2>

          Total Sales : ₹

          {Number(totalSales).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}

        </h2>

        <h3>

          Total Received : ₹

          {Number(totalReceived).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}

        </h3>

        <h3>

          Total Pending : ₹

          {Number(totalPending).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}

        </h3>

        <h3>

          Total Quantity : {" "}
    {Number(totalQuantity).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 

        </h3>

        <h3>

          Total Invoice : {sales.length}

        </h3>

      </div>

    </>

  )}

</div>

</div>
);
}

export default SalesHistory;
