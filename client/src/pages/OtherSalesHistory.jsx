import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import { filterOtherSales, deleteOtherSales } from "../services/otherSales";

import "../css/lchistory.css";

function OtherSalesHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
const [financialYear, setFinancialYear] = useState("");

  const [list, setList] = useState([]);

  const [serviceType, setServiceType] = useState("All Services");

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

 const loadData = async () => {
  try {
    const res = await filterOtherSales(
      searchType,
      searchValue,
      currentYear,
      serviceType
    );

    setList(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.log(err);
    setList([]);
  }
};
  useEffect(() => {
    loadData();
  }, [searchType, searchValue, serviceType]);

  const handleSearch = () => {
    loadData();
  };

  const handleEdit = (id) => {
    navigate(`/other-sales/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Other Sales Record?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteOtherSales(id);

      alert("Record Deleted Successfully");

      loadData();
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
    (sum, item) => sum + Number(item.total_amount || 0),
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

            <h1 style={{ margin: 0 }}>Other Sales History</h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="All Services">All Services</option>

              <option value="Transport Charge">Transport Charge</option>

              <option value="Clearing Charge">Clearing Charge</option>

              <option value="Document Charge">Document Charge</option>
            </select>

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

          <div id="pdfContent">
            <h2
              style={{
                textAlign: "center",
              }}
            >
              Other Sales Report
            </h2>

            <br />

            <p>
              <b>Service Type :</b> {serviceType}
            </p>

            <br />

            <p>
              <b>Search By :</b> {searchType === "month" ? "Month" : "Year"}
            </p>

            <br />

            <p>
              <b>Value :</b>{" "}
              {searchType === "month"
                ? monthNames[Number(searchValue)]
                : searchValue}
            </p>

            <br />
<div className="other-sales-history">

    <table className="other-sales-table">

              <thead>
                <tr>
                  <th>Service Type</th>

                  <th>Invoice No</th>

                  <th>Name</th>

                  <th>Total Amount</th>

                  <th>Date</th>

                  <th className="action-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      No Other Sales Record Found
                    </td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr key={item.id}>
                      <td>{item.service_type}</td>

                      <td>{item.invoice_no || "-"}</td>

                      <td>{item.name}</td>

                      <td>₹{Number(item.total_amount || 0).toFixed(2)}</td>

                      <td>
                        {item.entry_date
                          ? new Date(item.entry_date).toLocaleDateString(
                              "en-GB",
                            )
                          : ""}
                      </td>
                      <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/other-sales-invoice/${item.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/other-sales/edit/${item.id}`)}
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
                Total Other Sales Amount
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
                Other Sales Summary
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
                  No Other Sales Summary Found
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
                        {item.service_type}
                      </h3>

                      <p>
                        <b>Invoice No :</b> {item.invoice_no || "-"}
                      </p>

                      <p>
                        <b>Date :</b>{" "}
                        {item.entry_date
                          ? new Date(item.entry_date).toLocaleDateString(
                              "en-GB",
                            )
                          : ""}
                      </p>

                      <p>
                        <b>Name :</b> {item.name}
                      </p>

                      {item.service_type === "Transport Charge" && (
                        <>
                          <p>
                            <b>Vehicle Number :</b> {item.vehicle_number}
                          </p>

                          <p>
                            <b>Challan No :</b> {item.challan_no}
                          </p>

                          <p>
                            <b>From :</b> {item.from_location}
                          </p>

                          <p>
                            <b>To :</b> {item.to_location}
                          </p>

                          <p>
                            <b>Amount :</b> ₹
                            {Number(item.amount || 0).toFixed(2)}
                          </p>

                          <hr />

                          <h2
                            style={{
                              color: "#16a34a",
                            }}
                          >
                            Total Amount : ₹
                            {Number(item.total_amount || 0).toFixed(2)}
                          </h2>
                        </>
                      )}

                      {item.service_type === "Clearing Charge" && (
                        <>
                          <p>
                            <b>Amount :</b> ₹
                            {Number(item.amount || 0).toFixed(2)}
                          </p>

                          <p>
                            <b>CGST :</b>{" "}
                            {Number(item.cgst_percent || 0).toFixed(2)}%
                          </p>

                          <p>
                            <b>CGST Amount :</b> ₹
                            {(
                              (Number(item.amount || 0) *
                                Number(item.cgst_percent || 0)) /
                              100
                            ).toFixed(2)}
                          </p>

                          <p>
                            <b>SGST :</b>{" "}
                            {Number(item.sgst_percent || 0).toFixed(2)}%
                          </p>

                          <p>
                            <b>SGST Amount :</b> ₹
                            {(
                              (Number(item.amount || 0) *
                                Number(item.sgst_percent || 0)) /
                              100
                            ).toFixed(2)}
                          </p>

                          <p>
                            <b>Total GST :</b> ₹
                            {Number(item.total_gst || 0).toFixed(2)}
                          </p>

                          <hr />

                          <h2
                            style={{
                              color: "#16a34a",
                            }}
                          >
                            Total Amount : ₹
                            {Number(item.total_amount || 0).toFixed(2)}
                          </h2>
                        </>
                      )}

                      {item.service_type === "Document Charge" && (
                        <>
                          <p>
                            <b>Bill No :</b> {item.bill_no}
                          </p>

                          <p>
                            <b>Amount :</b> ₹
                            {Number(item.amount || 0).toFixed(2)}
                          </p>

                          <p>
                            <b>TDS :</b> ₹{Number(item.tds || 0).toFixed(2)}
                          </p>

                          <hr />

                          <h2
                            style={{
                              color: "#16a34a",
                            }}
                          >
                            Total Amount : ₹
                            {Number(item.total_amount || 0).toFixed(2)}
                          </h2>
                        </>
                      )}
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
                      Total Other Sales Amount : ₹
                      {Number(totalAmount).toFixed(2)}
                    </h2>

                    <h3
                      style={{
                        color: "#2563eb",
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
    </div>
    </div>
  );
}

export default OtherSalesHistory;
