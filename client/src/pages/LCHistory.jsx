import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { filterLC, deleteLC } from "../services/lc";

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
    navigate(`/lc-invoice/${id}`);
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
  <div className="page lc-page">

    <div className="lc-header">
      <BackButton />

      <div>
        <h1 className="page-title">
          LC History
        </h1>

        <p className="page-subtitle">
          View & Manage Letter Of Credit Records
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

              if (type === "month") {
                setSearchValue(currentMonth);
              }

              if (type === "year") {
                setSearchValue(currentYear);
              }

              if (type === "custom") {
                setSearchValue("");
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
        {searchType === "month" && (
          <div className="form-group">
            <label>Month</label>
            <select
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
            >
              {Object.entries(monthNames).map(
                ([value, name]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {name}
                  </option>

                )
              )}

            </select>

          </div>

        )}

        {searchType === "year" && (

          <div className="form-group">

            <label>Year</label>

            <input
              type="number"
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
            />

          </div>

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
    <div className="history-report-title">

      <h2>LC Report</h2>
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

        <h2>LC Records</h2>

        <span>
          Total Records : {lcList.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

          <thead>

            <tr>

              <th>LC No</th>

              <th>Customer</th>

              <th>Bank</th>

              <th>Invoice</th>

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
                  colSpan="9"
                  className="history-empty"
                >
                  No LC Records Found
                </td>

              </tr>

            ) : (

              lcList.map((item) => (

                <tr key={item.id}>

                  <td>{item.lc_number}</td>

                  <td>{item.customer_name}</td>

                  <td>{item.bank_name}</td>

                  <td>{item.invoice_no}</td>

                  <td className="amount-cell">

                    $

                    {Number(
                      item.dollar_amount || 0
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}

                  </td>

                  <td>

                    {item.issue_date
                      ? new Date(
                          item.issue_date
                        ).toLocaleDateString("en-GB")
                      : ""}

                  </td>

                  <td>

                    {item.expiry_date
                      ? new Date(
                          item.expiry_date
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
                          handleView(item.id)
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(item.id)
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

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

    <div className="lc-total-card">

      <h2>Total LC Amount</h2>

      <h1>

        $

        {totalLCAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}

      </h1>

    </div>
    <div className="lc-summary-card">

      <h2 className="summary-title">
        LC Summary
      </h2>
<hr/>
      {lcList.length === 0 ? (

        <div className="summary-empty">
          No LC Summary Found
        </div>

      ) : (

        <>

          {lcList.map((item) => (

            <div
              className="summary-entry-card"
              key={item.id}
            >

              <h3>
                LC Number : {item.lc_number}
              </h3>

              <div className="summary-grid">

                <p>
                  <b>Customer :</b>{" "}
                  {item.customer_name}
                </p>

                <p>
                  <b>Bank :</b>{" "}
                  {item.bank_name}
                </p>

                <p>
                  <b>Invoice :</b>{" "}
                  {item.invoice_no}
                </p>

                <p>
                  <b>Customs :</b>{" "}
                  {item.customs_location}
                </p>

                <p>
                  <b>Issue Date :</b>{" "}

                  {item.issue_date
                    ? new Date(
                        item.issue_date
                      ).toLocaleDateString("en-GB")
                    : ""}

                </p>

                <p>
                  <b>Expiry Date :</b>{" "}

                  {item.expiry_date
                    ? new Date(
                        item.expiry_date
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

                <p>

                  <b>Amount :</b>{" "}

                  $

                  {Number(
                    item.dollar_amount || 0
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}

                </p>

              </div>

              <div className="summary-grand-total">

                LC Amount : $

                {Number(
                  item.dollar_amount || 0
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}

              </div>

            </div>

          ))}

          <div className="summary-overall-card">

            <h2>
              Overall Summary
            </h2>

            <h3>
              Total LC : {lcList.length}
            </h3>

            <h3>

              Total Amount : $

              {totalLCAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}

            </h3>

            <h3>

              Success :{" "}

              {
                lcList.filter(
                  (x) => x.status === "Success"
                ).length
              }

            </h3>

            <h3>

              Pending :{" "}

              {
                lcList.filter(
                  (x) => x.status === "Pending"
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

export default LCHistory;

