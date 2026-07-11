import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

import {
  filterImporterBilling,
  deleteImporterBilling,
} from "../../services/importerBilling";

import "../../css/importerBilling.css";

function ImporterBillingHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [list, setList] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadData = async () => {
    try {
      const res = await filterImporterBilling(
        searchType,
        searchValue,
        currentYear,
      );

      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchType, searchValue]);

  const handleSearch = () => {
    loadData();
  };
  const handleView = (id) => {
    navigate(`/importer-billing-invoice/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/importer-billing/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete Importer Billing ?");

    if (!confirmDelete) return;

    try {
      await deleteImporterBilling(id);

      alert("Importer Billing Deleted Successfully");

      loadData();
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

  const totalGrand = list.reduce(
    (sum, item) => sum + Number(item.grand_total || 0),
    0,
  );

  const totalItem = list.reduce(
    (sum, item) => sum + Number(item.item_total || 0),
    0,
  );

  const totalExtraCharge = list.reduce(
    (sum, item) => sum + Number(item.extra_charge || 0),
    0,
  );

  const totalLCPayment = list.reduce(
    (sum, item) => sum + Number(item.lc_payment || 0),
    0,
  );

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

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

            <h1 style={{ margin: 0 }}>Importer Billing History</h1>
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
            Importer Billing Report
          </h2>

          <br />

          <p>
            <b>Search By :</b>

            {searchType === "month" ? " Month" : " Year"}
          </p>

          <br />

          <p>
            <b>Value :</b>

            {searchType === "month"
              ? monthNames[Number(searchValue)]
              : searchValue}
          </p>

          <br />

          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>

                <th>LC No</th>

                <th>Importer</th>

                <th>Grand Total</th>

                <th>Date</th>

                <th>Action</th>
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
                    No Importer Billing Record Found
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoice_no}</td>

                    <td>{item.lc_no}</td>

                    <td>{item.importer_name}</td>

                    <td>₹{Number(item.grand_total || 0).toFixed(2)}</td>

                    <td>
                      {item.entry_date
                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                        : ""}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleView(item.id)}
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
              Total Grand Amount
            </h2>

            <h1
              style={{
                color: "#16a34a",
                fontSize: "40px",
              }}
            >
              ₹{Number(totalGrand).toFixed(2)}
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
              Importer Billing Summary
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
                No Importer Billing Summary Found
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
                      Importer Billing Entry
                    </h3>

                    <p>
                      <b>Invoice No :</b> {item.invoice_no}
                    </p>

                    <p>
                      <b>LC No :</b> {item.lc_no}
                    </p>

                    <p>
                      <b>Importer Name :</b> {item.importer_name}
                    </p>

                    <p>
                      <b>Entry Date :</b>{" "}
                      {item.entry_date
                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                        : ""}
                    </p>

                    <p>
                      <b>LC Payment :</b> ₹
                      {Number(item.lc_payment || 0).toFixed(2)}
                    </p>

                    <p>
                      <b>Item Total :</b> ₹
                      {Number(item.item_total || 0).toFixed(2)}
                    </p>

                    <p>
                      <b>Extra Charge :</b> ₹
                      {Number(item.extra_charge || 0).toFixed(2)}
                    </p>

                    <hr />

                    <h3
                      style={{
                        color: "#2563eb",
                        marginBottom: "15px",
                      }}
                    >
                      Item Details
                    </h3>

                    <table className="table">
                      <thead>
                        <tr>
                          <th>Qty</th>

                          <th>Unit</th>

                          <th>Bag</th>

                          <th>Rate</th>

                          <th>Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {item.items && item.items.length > 0 ? (
                          item.items.map((product, index) => (
                            <tr key={index}>
                              <td>{product.quantity}</td>

                              <td>{product.unit}</td>

                              <td>{product.bag}</td>

                              <td>₹{Number(product.price|| 0).toFixed(2)}</td>

                              <td>₹{Number(product.amount || 0).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: "center",
                                color: "red",
                              }}
                            >
                              No Item Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <hr />

                    <h2
                      style={{
                        color: "#16a34a",
                      }}
                    >
                      Grand Total : ₹{Number(item.grand_total || 0).toFixed(2)}
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
                    Total LC Payment : ₹{Number(totalLCPayment).toFixed(2)}
                  </h2>

                  <h3
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    Total Item Amount : ₹{Number(totalItem).toFixed(2)}
                  </h3>

                  <h3
                    style={{
                      color: "#ea580c",
                    }}
                  >
                    Total Extra Charge : ₹{Number(totalExtraCharge).toFixed(2)}
                  </h3>

                  <h2
                    style={{
                      color: "#dc2626",
                      marginTop: "15px",
                    }}
                  >
                    Total Grand Amount : ₹{Number(totalGrand).toFixed(2)}
                  </h2>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImporterBillingHistory;
