import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getRODTEP,
  searchRODTEP,
  deleteRODTEP,
  filterRODTEP,
} from "../services/rodtep";

import "../css/rodtep.css";

function RODTEPHistory() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);

  const [search, setSearch] = useState("");

  const [searchType, setSearchType] = useState("month");

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadRODTEP = async () => {
    try {
      const res = await getRODTEP();

      setList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = async () => {
    try {
      const res = await filterRODTEP(
        searchType,

        searchValue,

        currentYear,
      );

      setList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [searchType, searchValue]);

  const handleTypeChange = (e) => {
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
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value === "") {
      loadRODTEP();

      return;
    }

    const res = await searchRODTEP(value);

    setList(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete RODTEP Record?")) {
      return;
    }

    await deleteRODTEP(id);

    alert("Deleted Successfully");

    loadRODTEP();
  };
  const handleView = (id) => {
    navigate(`/rodtep-invoice/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/rodtep/edit/${id}`);
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

        <h1 style={{ margin: 0 }}>RODTEP History</h1>
      </div>

      <br />

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
        RODTEP Report
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
            <th>Bill No</th>

            <th>Date Of Issue</th>

            <th>Licence No</th>

            <th>Total Credit</th>

            <th>HSN</th>

            <th>Rate %</th>

            <th>GST %</th>

            <th>TCS %</th>

            <th>Round Off</th>

            <th>Financial Year</th>

            <th>Amount</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td
                colSpan="12"
                style={{
                  textAlign: "center",

                  padding: "25px",

                  fontSize: "20px",

                  fontWeight: "bold",

                  color: "red",
                }}
              >
                No RODTEP Record Found
              </td>
            </tr>
          ) : (
            list.map((item) => (
              <tr key={item.id}>
                <td>{item.bill_no}</td>

                <td>
                  {item.date_of_issue
                    ? new Date(item.date_of_issue).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>{item.licence_no}</td>

                <td>{Number(item.total_credit || 0).toFixed(2)}</td>

                <td>{item.hsn}</td>

                <td>{Number(item.rate || 0).toFixed(2)}%</td>

                <td>{Number(item.add_gst_rate || 0).toFixed(2)}%</td>

                <td>{Number(item.tcs_rate || 0).toFixed(2)}%</td>

                <td>{Number(item.round_off || 0).toFixed(2)}</td>

                <td>{item.financial_year}</td>

                <td
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  ₹{Number(item.amount || 0).toFixed(2)}
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/rodtep-invoice/${item.id}`)}
                      >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>navigate(`/rodtep/edit/${item.id}`)}
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
          Total RODTEP Amount{" "}
        </h2>

        <h1
          style={{
            color: "#16a34a",
            fontSize: "40px",
          }}
        >
          {Number(totalAmount).toLocaleString("en-IN", {
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
          RODTEP Summary
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
            No RODTEP Summary Found
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
                  RODTEP Entry
                </h3>
                <p>
                  <b>Bill No :</b> {item.bill_no}
                </p>

                <p>
                  <b>Date Of Issue :</b>{" "}
                  {item.date_of_issue
                    ? new Date(item.date_of_issue).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Licence No :</b> {item.licence_no}
                </p>

                <p>
                  <b>Financial Year :</b> {item.financial_year}
                </p>

                <p>
                  <b>Total Credit :</b>{" "}
                  {Number(item.total_credit || 0).toFixed(2)}
                </p>

                <p>
                  <b>HSN :</b> {item.hsn}
                </p>

                <p>
                  <b>Rate :</b> {Number(item.rate || 0).toFixed(2)} %
                </p>

                <p>
                  <b>GST Rate :</b> {Number(item.add_gst_rate || 0).toFixed(2)}{" "}
                  %
                </p>

                <p>
                  <b>TCS Rate :</b> {Number(item.tcs_rate || 0).toFixed(2)} %
                </p>

                <p>
                  <b>Round Off :</b> {Number(item.round_off || 0).toFixed(2)}
                </p>

                <hr />

                <h2
                  style={{
                    color: "#16a34a",
                  }}
                >
                  Final Amount : ₹{Number(item.amount || 0).toFixed(2)}
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
                Total RODTEP Amount : {Number(totalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h2>

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

export default RODTEPHistory;
