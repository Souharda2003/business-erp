import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLC, filterLC, deleteLC } from "../services/lc";

import BackButton from "../components/BackButton";

import "../css/lc.css";

function LCHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [lcList, setLcList] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadLC = async () => {
    try {
      const res = await filterLC(searchType, searchValue, currentYear);

      setLcList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);

      alert("Unable To Load LC");
    }
  };

  useEffect(() => {
    loadLC();
  }, [searchType, searchValue]);

  const handleSearch = () => {
    loadLC();
  };

  const handleEdit = (id) => {
    navigate(`/lc/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/lc-view/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this LC Record ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteLC(id);

      loadLC();

      alert("LC Deleted Successfully");
    } catch (err) {
      console.log(err);

      alert("Delete Failed");
    }
  };
const totalLCAmount = lcList.reduce(
  (total, item) => total + Number(item.dollar_amount || 0),
  0
);
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

        <h1 className="page-title" style={{ margin: 0 }}>
          LC History
        </h1>
      </div>

      <div className="history-button-row">
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

      <table className="table">
        <thead>
          <tr>
            <th>LC No</th>

            <th>Invoice</th>

            <th>Bank</th>

            <th>Customer</th>

            <th>Customs</th>

            <th>Amount ($)</th>

            <th>Issue Date</th>

            <th>Expiry Date</th>

            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {lcList.length === 0 ? (
            <tr>
              <td
                colSpan="10"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                No LC Record Found
              </td>
            </tr>
          ) : (
            lcList.map((item) => (
              <tr key={item.id}>
                <td>{item.lc_number}</td>

                <td>{item.invoice_no}</td>

                <td>{item.bank_name}</td>

                <td>{item.customer_name}</td>

                <td>{item.customs_location}</td>

                <td>${Number(item.dollar_amount || 0).toFixed(2)}</td>

                <td>
                  {item.issue_date
                    ? new Date(item.issue_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>
                  {item.expiry_date
                    ? new Date(item.expiry_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>
                  <span
                    className={
                      item.status === "Success"
                        ? "status-success"
                        : "status-pending"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/lc-invoice/${item.id}`)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/lc/edit/${item.id}`)}
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
          Total LC Amount
        </h2>

        <h1
  style={{
    color: "#16a34a",
    fontSize: "40px",
  }}
>
  $
  {totalLCAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
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
          LC Summary
        </h2>

        <hr />

        {lcList.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            No LC Summary Found
          </p>
        ) : (
          <>
            {lcList.map((item) => (
              <div key={item.id} style={{
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
                >LC Entry</h3>

                <p>
                  <b>LC Number :</b> {item.lc_number}
                </p>

                <p>
                  <b>Invoice No :</b> {item.invoice_no}
                </p>

                <p>
                  <b>Bank :</b> {item.bank_name}
                </p>

                <p>
                  <b>Customer :</b> {item.customer_name}
                </p>

                <p>
                  <b>Customs :</b> {item.customs_location}
                </p>

                <p>
                  <b>Amount ($) :</b>{" "}
                  {Number(item.dollar_amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>Issue Date :</b>{" "}
                  {item.issue_date
                    ? new Date(item.issue_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Expiry Date :</b>{" "}
                  {item.expiry_date
                    ? new Date(item.expiry_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Status :</b>{" "}
                  <span
                    className={
                      item.status === "Success"
                        ? "status-success"
                        : "status-pending"
                    }
                  >
                    {item.status}
                  </span>
                </p>

                <hr />

                <h2
                  style={{
                    color: "#16a34a",
                  }}
                >
                  LC Amount : ${Number(item.dollar_amount || 0).toFixed(2)}
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
    marginTop: "10px",
  }}
>
  Total LC Amount : $
  {totalLCAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
</h2>
              <h3
                style={{
                  color: "#2563eb",
                }}
              >
                Total LC : {lcList.length}
              </h3>

              <h3
                style={{
                  color: "#16a34a",
                }}
              >
                Success :{" "}
                {lcList.filter((item) => item.status === "Success").length}
              </h3>

              <h3
                style={{
                  color: "#dc2626",
                }}
              >
                Pending :{" "}
                {lcList.filter((item) => item.status === "Pending").length}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LCHistory;
