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
    <div className="app">
  <div className="main-content reports-full">
     <Navbar
  financialYear={financialYear}
  setFinancialYear={setFinancialYear}
/>

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

            <h1 style={{ margin: 0 }}>TDS Fee History</h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
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
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
            <select
              value={financialYear}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setCustomFinancialYear(true);

                  setFinancialYear("");
                } else {
                  setCustomFinancialYear(false);

                  setFinancialYear(e.target.value);
                }
              }}
            >
              <option value="2024-2025">2024-2025</option>

              <option value="2025-2026">2025-2026</option>

              <option value="2026-2027">2026-2027</option>

              <option value="2027-2028">2027-2028</option>

              <option value="2028-2029">2028-2029</option>

              <option value="custom">Custom</option>
            </select>
          </div>
          {customFinancialYear && (
            <input
              type="text"
              placeholder="2029-2030"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
            />
          )}
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            TDS Fee Report
          </h2>

          <p>
            <b>Search By :</b> {searchType === "month" ? "Month" : "Year"}
          </p>

          <br />
          <p>
            <b>Financial Year :</b>

            {financialYear}
          </p>

          <br />
          <p>
            <b>Value :</b>{" "}
            {searchType === "month"
              ? monthNames[Number(searchValue)]
              : searchValue}
          </p>

          <br />

          <table className="table">
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

                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
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

                    <td>₹{Number(item.gross_amount || 0).toFixed(2)}</td>

                    <td>₹{Number(item.tds_amount || 0).toFixed(2)}</td>

                    <td>₹{Number(item.net_amount || 0).toFixed(2)}</td>

                    <td>₹{Number(item.tds_payable || 0).toFixed(2)}</td>

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
              Total TDS Payable
            </h2>

            <h1
              style={{
                color: "#16a34a",
                fontSize: "40px",
              }}
            >
              ₹{Number(totalAmount).toFixed(2)}
            </h1>
          </div>
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              marginTop: "30px",
              borderRadius: "10px",
            }}
          >
            <h2
              style={{
                color: "#2563eb",
                marginBottom: "20px",
              }}
            >
              TDS Fee Summary
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
                No TDS Fee Summary Found
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
                      TDS Fee Entry
                    </h3>
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
                      <b>Gross Amount : </b> ₹
                      {Number(item.gross_amount || 0).toFixed(2)}
                    </p>

                    <p>
                      <b>TDS Amount : </b> ₹
                      {Number(item.tds_amount || 0).toFixed(2)}
                    </p>

                    <p>
                      <b>Net Amount : </b> ₹
                      {Number(item.net_amount || 0).toFixed(2)}
                    </p>

                    <p>
                      <b>TDS Payable : </b> ₹
                      {Number(item.tds_payable || 0).toFixed(2)}
                    </p>

                    <hr />

                    <h2
                      style={{
                        color: "#16a34a",
                      }}
                    >
                      Total TDS Payable : ₹
                      {Number(item.tds_payable || 0).toFixed(2)}
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
                    Grand Total TDS Payable : ₹ {Number(totalAmount).toFixed(2)}
                  </h2>
                  <h3
                    style={{
                      color: "#9333ea",
                    }}
                  >
                    Financial Year :{financialYear}
                  </h3>
                  <h3
                    style={{
                      color: "#dc2626",
                    }}
                  >
                    Total Records : {list.length}
                  </h3>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TDSFeeHistory;
