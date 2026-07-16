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
  <div className="page drawback-page">

    <div className="drawback-header">

      <BackButton />

      <div className="drawback-heading">

        <h1 className="page-title">
          Drawback History
        </h1>

        <p className="page-subtitle">
          View & Manage Drawback Records
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

              } else if (type === "year") {

                setSearchValue(currentYear);

              } else {

                setSearchValue("");

              }

            }}
          >

            <option value="month">
              Monthly
            </option>

            <option value="year">
              Yearly
            </option>

          </select>

        </div>

        {searchType === "month" && (

          <div className="form-group">

            <label>Month</label>

            <select
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
            >

              <option value="1">
                January
              </option>

              <option value="2">
                February
              </option>

              <option value="3">
                March
              </option>

              <option value="4">
                April
              </option>

              <option value="5">
                May
              </option>

              <option value="6">
                June
              </option>

              <option value="7">
                July
              </option>

              <option value="8">
                August
              </option>

              <option value="9">
                September
              </option>

              <option value="10">
                October
              </option>

              <option value="11">
                November
              </option>

              <option value="12">
                December
              </option>

            </select>

          </div>

        )}

        {searchType === "year" && (

          <div className="form-group">

            <label>Year</label>

            {customYear ? (

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

                  if (
                    e.target.value === "custom"
                  ) {

                    setCustomYear(true);

                    setSearchValue("");

                  } else {

                    setSearchValue(
                      e.target.value
                    );

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

        )}

        <div className="form-group search-btn-group">

          <button
            className="primary-btn"
            type="button"
            onClick={handleSearch}
          >

            Search Drawback

          </button>

        </div>

      </div>

    </div>
    <div className="history-report-title">

      <h2>
        Drawback Report
      </h2>

      <p>
        Search Type :
        <b>
          {" "}
          {searchType === "month"
            ? "Monthly"
            : searchType === "year"
            ? "Yearly"
            : "Shipping Bill"}
        </b>
      </p>

      <p>
        Value :
        {" "}
        {searchType === "month"
          ? monthNames[Number(searchValue)]
          : searchValue}
      </p>

    </div>
    <div className="form-container history-table-card">

      <div className="history-table-header">

        <h2>
          Drawback Records
        </h2>

        <span>
          Total Records : {list.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

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
                  className="history-empty"
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
                      ? new Date(
                          item.shipping_bill_date
                        ).toLocaleDateString("en-GB")
                      : ""}
                  </td>

                  <td>{item.invoice_no}</td>

                  <td>{item.product_name}</td>

                  <td>{item.quantity}</td>

                  <td>{item.unit}</td>

                  <td className="amount-cell">
                    $
                    {Number(item.dollar_rate || 0).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>
                    {Number(item.drawback_rate || 0).toFixed(2)}%
                  </td>

                  <td className="amount-cell">
                    ₹
                    {Number(item.drawback_amount || 0).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>{item.customs_location}</td>

                  <td>
                    {item.export_date
                      ? new Date(
                          item.export_date
                        ).toLocaleDateString("en-GB")
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

                    <div className="history-action-buttons">

                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/drawback-invoice/${item.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item.id)}
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
    <div className="purchase-form-card drawback-total-card">

      <h2>
        Total Drawback Amount
      </h2>

      <h1>
        ₹
        {Number(totalDrawback).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h1>

    </div>
    <div className="purchase-form-card drawback-summary-card">

      <h2 className="summary-title">
        Drawback Summary
      </h2>

      {list.length === 0 ? (

        <div className="summary-empty">
          No Drawback Summary Found
        </div>

      ) : (

        <>

          {list.map((item) => (

            <div
              className="summary-entry-card"
              key={item.id}
            >

              <h3>
                Shipping Bill : {item.shipping_bill}
              </h3>

              <div className="summary-grid">

                <p>
                  <b>Shipping Bill Date :</b>{" "}
                  {item.shipping_bill_date
                    ? new Date(
                        item.shipping_bill_date
                      ).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Invoice :</b>{" "}
                  {item.invoice_no}
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
                  <b>Dollar Rate :</b>{" "}
                  $
                  {Number(
                    item.dollar_rate || 0
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>

                <p>
                  <b>Drawback Rate :</b>{" "}
                  {Number(
                    item.drawback_rate || 0
                  ).toFixed(2)}
                  %
                </p>

                <p>
                  <b>Customs :</b>{" "}
                  {item.customs_location}
                </p>

                <p>
                  <b>Export Date :</b>{" "}
                  {item.export_date
                    ? new Date(
                        item.export_date
                      ).toLocaleDateString("en-GB")
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

              </div>

              <div className="summary-grand-total">

                Drawback Amount :

                ₹

                {Number(
                  item.drawback_amount || 0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}

              </div>

            </div>

          ))}

          <div className="summary-overall-card">

            <h2>
              Overall Summary
            </h2>

            <h3>
              Total Records : {list.length}
            </h3>

            <h3>
              Total Drawback : ₹
              {Number(totalDrawback).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </h3>

            <h3>
              Success :{" "}
              {
                list.filter(
                  (x) =>
                    x.status === "Success"
                ).length
              }
            </h3>

            <h3>
              Pending :{" "}
              {
                list.filter(
                  (x) =>
                    x.status === "Pending"
                ).length
              }
            </h3>

          </div>

        </>

      )}

    </div>

  </div>

);

}

export default DrawbackHistory;