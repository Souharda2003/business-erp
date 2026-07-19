import { useState, useEffect } from "react";
import { filterPayment, deletePayment } from "../services/payment";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../css/payment.css";

function PaymentHistory() {
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [payments, setPayments] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadPayments = async () => {
    try {
      const res = await filterPayment(searchType, searchValue, currentYear);

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [searchType, searchValue, currentYear]);
  const handleSearch = () => {
    loadPayments();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Payment ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePayment(id);

      alert("Payment Deleted Successfully");

      loadPayments();
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

  const totalPayment = payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),

    0,
  );

  return (
<div className="page payment-history-page">     <div className="page-content">

        <div className="importer-history-header">

          <BackButton />

          <div className="history-heading">

            <h1 className="page-title">
              Payment History
            </h1>

            <p className="page-subtitle">
              View, search and manage all Payment records.
            </p>

          </div>

        </div>

        <div className="purchase-form-card  history-filter-card">

          <div className="history-filter-grid">

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
                    Custom Year
                  </option>

                </select>

              )}

            </div>

          </div>

          <div className="history-button-row">

            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div></div>
<h2 className="report-title">
        Payment Report
      </h2>

      <p className="report-info">
        <b>Search By :</b>

        {searchType === "month" ? " Month" : " Year"}
      </p>
     <p className="report-info">
        <b>Value :</b>

        {searchType === "month" ? monthNames[Number(searchValue)] : searchValue}
      </p>
        <div className="purchase-form-card  history-table-card">

          <div className="history-table-wrapper">

            <table className="history-table">
        <thead>
          <tr>
            <th>Invoice No</th>

            <th>Invoice Date</th>

            <th>Payment Date</th>

            <th>Customer</th>

            <th>Payment Type</th>

            <th>Amount</th>
            <th>Status</th>
            <th>Remarks</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                No Payment Record Found
              </td>
            </tr>
          ) : (
            payments.map((item) => (
              <tr key={item.id}>
                <td>{item.invoice_no}</td>

                <td>
                  {item.invoice_date
                    ? new Date(item.invoice_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>
                  {item.payment_date
                    ? new Date(item.payment_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>{item.customer_name}</td>

                <td>{item.payment_type}</td>

                <td>₹{" "}
    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>

                <td>
                  <span
className={`status-badge ${

(item.status || "SUCCESS")==="SUCCESS"

?"success"

:item.status==="PENDING"

?"pending"

:"advance"

}`}
>
                    {item.status || "SUCCESS"}
                  </span>
                </td>

                <td>{item.remarks}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/payment-invoice/${item.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/payment/edit/${item.id}`)}
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
</div></div>
                <div className=" purchase-form-card history-total-card">

          <h2 className="total-title">
          Total Payment Amount
        </h2>

          <h1 className="total-amount">
          ₹{" "}
    {Number(totalPayment).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
        </h1>
      </div>

      <br />
        <div className="purchase-form-card history-summary-card">

          <h2 className="summary-main-title">
          Payment Summary
        </h2>

        <hr />

        {payments.length === 0 ? (

            <div className="empty-summary">
            No Payment Summary Found
          </div>
        ) : (
          <>
            {payments.map((item) => (
<div className="summary-entry">
      <h3 className="summary-entry-title">
                  Payment Entry
                </h3>

                <p>
                  <b>Invoice No :</b> {item.invoice_no}
                </p>

                <p>
                  <b>Invoice Date :</b>{" "}
                  {item.invoice_date
                    ? new Date(item.invoice_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Payment Date :</b>{" "}
                  {item.payment_date
                    ? new Date(item.payment_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Customer Name :</b> {item.customer_name}
                </p>

                <p>
                  <b>Payment Type :</b> {item.payment_type}
                </p>

                <p>
                  <b>Amount :</b> ₹{" "}
    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </p>

                <p>
                  <b>Remarks :</b> {item.remarks}
                </p>

                <hr />

<h2 className="summary-payment">
                  Payment Amount : ₹{" "}
    {Number(item.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
                </h2>
              </div>
            ))}
<div className="summary-footer">
              <h2 className="summary-total">
                Total Payment : ₹{" "}
    {Number(totalPayment).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
              </h2>

<h3 className="summary-record">
                Total Records : {payments.length}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
