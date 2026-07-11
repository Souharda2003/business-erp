import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { filterPurchase, deletePurchase } from "../services/purchase";

import BackButton from "../components/BackButton";

import "../css/purchase.css";

function PurchaseHistory() {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [purchase, setPurchase] = useState([]);

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const loadPurchase = async () => {
    try {
      const res = await filterPurchase(
        searchType,

        searchValue,

        currentYear,
      );

      setPurchase(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);

      alert("Unable To Load Purchase");
    }
  };
  useEffect(() => {
    loadPurchase();
  }, [searchType, searchValue]);
  const handleSearch = () => {
    loadPurchase();
  };

  const handleEdit = (id) => {
    navigate(`/purchase/edit/${id}`);
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Purchase ?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePurchase(id);

      loadPurchase();

      alert("Purchase Deleted Successfully");
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

  const totalPurchase = purchase.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),

    0,
  );

  const totalTaxable = purchase.reduce(
    (sum, item) => sum + Number(item.taxable_amount || 0),

    0,
  );

  const totalCGST = purchase.reduce(
    (sum, item) => sum + Number(item.cgst_amount || 0),

    0,
  );

  const totalSGST = purchase.reduce(
    (sum, item) => sum + Number(item.sgst_amount || 0),

    0,
  );

  const totalGST = purchase.reduce(
    (sum, item) => sum + Number(item.total_gst || 0),

    0,
  );

  const totalRoundOff = purchase.reduce(
    (sum, item) => sum + Number(item.round_off || 0),

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

        <h1 style={{ margin: 0 }}>Purchase History</h1>
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
        Purchase Report
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
            <th>Invoice</th>

            <th>Date</th>

            <th>Supplier</th>

            <th>Product</th>

            <th>Quantity</th>

            <th>Unit</th>

            <th>Grand Total</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {purchase.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                No Purchase Record Found
              </td>
            </tr>
          ) : (
            purchase.map((item) => (
              <tr key={item.id}>
                <td>{item.invoice_no}</td>

                <td>
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>{item.supplier}</td>

                <td>{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>{item.unit}</td>

                <td>
                  ₹{" "}
                  {Number(item.total_amount || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2,
                  })}
                </td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/purchase-invoice/${item.id}`)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/purchase/edit/${item.id}`)}
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
          Total Purchase Amount
        </h2>

        <h1
          style={{
            color: "#16a34a",
            fontSize: "40px",
          }}
        >
          ₹{" "}
          {Number(totalPurchase).toLocaleString("en-IN", {
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
          Purchase Summary
        </h2>
        <hr />
        {purchase.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            No Purchase Summary Found
          </p>
        ) : (
          <>
            {purchase.map((item) => (
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
                  Purchase Entry
                </h3>

                <p>
                  <b>Invoice No :</b> {item.invoice_no}
                </p>

                <p>
                  <b>Date :</b>{" "}
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Supplier Name :</b> {item.supplier}
                </p>

                <p>
                  <b>Product Name :</b> {item.product_name}
                </p>

                <p>
                  <b>Quantity :</b> {item.quantity} {item.unit}
                </p>

                <p>
                  <b>Unit Price :</b> ₹{Number(item.unit_price || 0).toFixed(2)}
                </p>

                <p>
                  <b>Taxable Amount :</b> ₹
                  {Number(item.taxable_amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>CGST :</b> {item.cgst_percent} %
                </p>

                <p>
                  <b>CGST Amount :</b> ₹
                  {Number(item.cgst_amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>SGST :</b> {item.sgst_percent} %
                </p>

                <p>
                  <b>SGST Amount :</b> ₹
                  {Number(item.sgst_amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>Total GST :</b> ₹{Number(item.total_gst || 0).toFixed(2)}
                </p>

                <p>
                  <b>Round Off :</b> ₹{Number(item.round_off || 0).toFixed(2)}
                </p>

                <hr />

                <h2
                  style={{
                    color: "#16a34a",
                  }}
                >
                  Grand Total : ₹{Number(item.total_amount || 0).toFixed(2)}
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
                Total Purchase : ₹{" "}
                {Number(totalPurchase).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </h2>

              <h3
                style={{
                  color: "#2563eb",
                }}
              >
                Total Taxable : ₹{Number(totalTaxable).toFixed(2)}
              </h3>

              <h3
                style={{
                  color: "#ea580c",
                }}
              >
                Total GST : ₹{Number(totalGST).toFixed(2)}
              </h3>

              <h3
                style={{
                  color: "#dc2626",
                }}
              >
                Total Round Off : ₹{Number(totalRoundOff).toFixed(2)}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistory;
