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

        <h1 style={{ margin: 0 }}>Payment History</h1>
      </div>

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

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <br />

      <h2
        style={{
          textAlign: "center",
        }}
      >
        Payment Report
      </h2>

      <br />

      <p>
        <b>Search By :</b>

        {searchType === "month" ? " Month" : " Year"}
      </p>

      <br />

      <p>
        <b>Value :</b>

        {searchType === "month" ? monthNames[Number(searchValue)] : searchValue}
      </p>

      <br />
      <table className="table">
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

                <td>₹{Number(item.amount || 0).toFixed(2)}</td>

                <td>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      background:
                        (item.status || "SUCCESS") === "SUCCESS"
                          ? "#dcfce7"
                          : item.status === "PENDING"
                            ? "#fef3c7"
                            : "#dbeafe",
                      color:
                        (item.status || "SUCCESS") === "SUCCESS"
                          ? "#15803d"
                          : item.status === "PENDING"
                            ? "#b45309"
                            : "#1d4ed8",
                    }}
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
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/payment-ledger?customer=${item.customer_name}`,
                        )
                      }
                    >
                      Ledger
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

      <br />

      <div
        style={{
          background: "#ffffff",

          padding: "25px",

          borderRadius: "12px",

          boxShadow: "0 2px 10px rgba(0,0,0,0.10)",

          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#2563eb",
          }}
        >
          Total Payment Amount
        </h2>

        <h1
          style={{
            color: "#16a34a",

            fontSize: "40px",
          }}
        >
          ₹{Number(totalPayment).toFixed(2)}
        </h1>
      </div>

      <br />
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "30px",
        }}
      >
        <h2
          style={{
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          Payment Summary
        </h2>

        <hr />

        {payments.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            No Payment Summary Found
          </p>
        ) : (
          <>
            {payments.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  marginTop: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h3
                  style={{
                    color: "#16a34a",
                    marginBottom: "15px",
                  }}
                >
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
                  <b>Amount :</b> ₹{Number(item.amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>Remarks :</b> {item.remarks}
                </p>

                <hr />

                <h2
                  style={{
                    color: "#16a34a",
                  }}
                >
                  Payment Amount : ₹{Number(item.amount || 0).toFixed(2)}
                </h2>
              </div>
            ))}

            <div
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
                Total Payment : ₹{Number(totalPayment).toFixed(2)}
              </h2>

              <h3
                style={{
                  color: "#2563eb",
                }}
              >
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
