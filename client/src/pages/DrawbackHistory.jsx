import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";

import {
  getDrawback,
  searchDrawback,
  deleteDrawback,
  filterDrawback,
} from "../services/drawback";

import "../css/lchistory.css";

function DrawbackHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [list, setList] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadDrawback = async () => {
    try {
      const res = await filterDrawback(searchType, searchValue, currentYear);

      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDrawback();
  }, [searchType, searchValue]);

  const handleSearch = () => {
    loadDrawback();
  };

  const handleEdit = (id) => {
    navigate(`/drawback/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Drawback ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDrawback(id);

      loadDrawback();
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

  const totalDrawback = list.reduce(
    (sum, item) => sum + Number(item.drawback_amount || 0),

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

        <h1 style={{ margin: 0 }}>Drawback History</h1>
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
            } else if (type === "year") {
              setSearchValue(currentYear);
            } else {
              setSearchValue("");
            }
          }}
        >
          <option value="month">Month</option>

          <option value="year">Year</option>

          <option value="shipping">Shipping Bill</option>
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
        ) : searchType === "year" ? (
          customYear ? (
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
          )
        ) : (
          <input
            type="text"
            placeholder="Enter Shipping Bill"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
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
        Drawback Report
      </h2>

      <br />

      <p>
        <b>Search By :</b>

        {searchType === "month"
          ? " Month"
          : searchType === "year"
            ? " Year"
            : " Shipping Bill"}
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
            <th>Shipping Bill</th>

            <th>SB Date</th>

            <th>Invoice</th>

            <th>Product</th>

            <th>Quantity</th>

            <th>Unit</th>

            <th>Dollar Rate</th>

            <th>Rate %</th>

            <th>Drawback</th>

            <th>Customs</th>

            <th>Export Date</th>

            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td
                colSpan="13"
                style={{
                  textAlign: "center",

                  padding: "20px",

                  color: "red",

                  fontWeight: "bold",
                }}
              >
                No Drawback Record Found
              </td>
            </tr>
          ) : (
            list.map((item) => (
              <tr key={item.id}>
                <td>{item.shipping_bill}</td>

                <td>
                  {item.shipping_bill_date
                    ? new Date(item.shipping_bill_date).toLocaleDateString(
                        "en-GB",
                      )
                    : ""}
                </td>

                <td>{item.invoice_no}</td>

                <td>{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>{item.unit}</td>

                <td>${Number(item.dollar_rate || 0).toFixed(2)}</td>

                <td>{Number(item.drawback_rate || 0).toFixed(2)}%</td>

                <td>₹{Number(item.drawback_amount || 0).toFixed(2)}</td>

                <td>{item.customs_location}</td>

                <td>
                  {item.export_date
                    ? new Date(item.export_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>
                  <span
                    style={{
                      color: item.status === "Success" ? "#16a34a" : "#ea580c",

                      fontWeight: "bold",
                    }}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/drawback-invoice/${item.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/drawback/edit/${item.id}`)}
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
          Total Drawback Amount
        </h2>

        <h1
          style={{
            color: "#16a34a",

            fontSize: "40px",
          }}
        >
          ₹
    {Number(totalDrawback).toLocaleString("en-IN", {
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
          Drawback Summary
        </h2>

        <hr />

        {list.length === 0 ? (
          <p
            style={{
              textAlign: "center",

              color: "red",

              fontWeight: "bold",
            }}
          >
            No Drawback Summary Found
          </p>
        ) : (
          <>
            {list.map((item) => (
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
                  Drawback Entry
                </h3>

                <p>
                  <b>Shipping Bill :</b> {item.shipping_bill}
                </p>

                <p>
                  <b>Shipping Bill Date :</b>{" "}
                  {item.shipping_bill_date
                    ? new Date(item.shipping_bill_date).toLocaleDateString(
                        "en-GB",
                      )
                    : ""}
                </p>

                <p>
                  <b>Invoice No :</b> {item.invoice_no}
                </p>

                <p>
                  <b>Product Name :</b> {item.product_name}
                </p>

                <p>
                  <b>Quantity :</b> {item.quantity} {item.unit}
                </p>

                <p>
                  <b>Dollar Rate :</b> $
                  {Number(item.dollar_rate || 0).toFixed(2)}
                </p>

                <p>
                  <b>Drawback Rate :</b>{" "}
                  {Number(item.drawback_rate || 0).toFixed(2)} %
                </p>

                <p>
                  <b>Customs Location :</b> {item.customs_location}
                </p>

                <p>
                  <b>Export Date :</b>{" "}
                  {item.export_date
                    ? new Date(item.export_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Status :</b>{" "}
                  <span
                    style={{
                      color: item.status === "Success" ? "status-success"
                  : "status-pending"
                    }}
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
                  Drawback Amount : ₹
            {Number(item.drawback_amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</h2>
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
                Total Drawback : ₹{Number(totalDrawback).toFixed(2)}
              </h2>

              <h3
                style={{
                  color: "#2563eb",
                  marginBottom: "10px",
                }}
              >
                Total Records : {list.length}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DrawbackHistory;
