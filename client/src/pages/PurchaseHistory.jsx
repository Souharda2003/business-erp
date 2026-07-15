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
    <div className="page purchase-page">
      <div className="purchase-header">
        <BackButton />

        <div className="purchase-heading">
          <h1 className="page-title">Purchase History</h1>

          <p className="page-subtitle">View & Manage Purchase Records</p>
        </div>
      </div>
      <div className="purchase-form-card history-filter-card">
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
                } else {
                  setSearchValue(currentYear);
                }
              }}
            >
              <option value="month">Month</option>

              <option value="year">Year</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              {searchType === "month" ? "Select Month" : "Select Year"}
            </label>

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
          </div>

          <div className="form-group search-btn-group">
            <label>&nbsp;</label>

            <button
              type="button"
              className="primary-btn"
              onClick={handleSearch}
            >
              Search Purchase
            </button>
          </div>
        </div>
      </div>

      <div className="history-report-title">
        <h2>Purchase Report</h2>

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
      <div className="purchase-form-card history-table-card">
        <div className="history-table-header">
          <h2>Purchase Records</h2>

          <span>Total Records : {purchase.length}</span>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
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
                  <td colSpan="8" className="history-empty">
                    No Purchase Record Found
                  </td>
                </tr>
              ) : (
                purchase.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoice_no}</td>

                    <td>
                      {item.purchase_date
                        ? new Date(item.purchase_date).toLocaleDateString(
                            "en-GB",
                          )
                        : ""}
                    </td>

                    <td>{item.supplier}</td>

                    <td>{item.product_name}</td>

                    <td>{item.quantity}</td>

                    <td>{item.unit}</td>

                    <td className="amount-cell">
                      ₹{" "}
                      {Number(item.total_amount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td>
                      <div className="history-action-buttons">
                        <button
                          className="view-btn"
                          onClick={() =>
                            navigate(`/purchase-invoice/${item.id}`)
                          }
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="purchase-form-card purchase-total-card">
        <h2>Total Purchase Amount</h2>

        <h1>
          ₹{" "}
          {Number(totalPurchase).toLocaleString("en-IN", {
            minimumFractionDigits: 2,

            maximumFractionDigits: 2,
          })}
        </h1>
      </div>
      <div className="purchase-form-card purchase-summary-card">
        <h2 className="summary-title">Purchase Summary</h2>

        <hr />

        {purchase.length === 0 ? (
          <div className="summary-empty">No Purchase Summary Found</div>
        ) : (
          <>
            {purchase.map((item) => (
              <div key={item.id} className="summary-entry-card">
                <h3>Purchase Entry</h3>

                <div className="summary-grid">
                  <p>
                    <b>Invoice :</b>

                    {item.invoice_no}
                  </p>

                  <p>
                    <b>Date :</b>

                    {item.purchase_date
                      ? new Date(item.purchase_date).toLocaleDateString("en-GB")
                      : ""}
                  </p>

                  <p>
                    <b>Supplier :</b>

                    {item.supplier}
                  </p>

                  <p>
                    <b>Product :</b>

                    {item.product_name}
                  </p>

                  <p>
                    <b>Quantity :</b>
                    {item.quantity} {item.unit}
                  </p>

                  <p>
                    <b>Unit Price :</b>₹
                    {Number(item.unit_price || 0).toFixed(2)}
                  </p>

                  <p>
                    <b>Taxable :</b>₹
                    {Number(item.taxable_amount || 0).toFixed(2)}
                  </p>

                  <p>
                    <b>CGST :</b>
                    {item.cgst_percent} %
                  </p>

                  <p>
                    <b>CGST Amount :</b>₹
                    {Number(item.cgst_amount || 0).toFixed(2)}
                  </p>

                  <p>
                    <b>SGST :</b>
                    {item.sgst_percent} %
                  </p>

                  <p>
                    <b>SGST Amount :</b>₹
                    {Number(item.sgst_amount || 0).toFixed(2)}
                  </p>

                  <p>
                    <b>Total GST :</b>₹{Number(item.total_gst || 0).toFixed(2)}
                  </p>

                  <p>
                    <b>Round Off :</b>₹{Number(item.round_off || 0).toFixed(2)}
                  </p>
                </div>

                <hr />

                <div className="summary-grand-total">
                  Grand Total : ₹{Number(item.total_amount || 0).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="summary-overall-card">
              <h2>
                Total Purchase : ₹{" "}
                {Number(totalPurchase).toLocaleString(
                  "en-IN",

                  {
                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2,
                  },
                )}
              </h2>

              <h3>Total Taxable : ₹{Number(totalTaxable).toFixed(2)}</h3>

              <h3>Total GST : ₹{Number(totalGST).toFixed(2)}</h3>

              <h3>Total Round Off : ₹{Number(totalRoundOff).toFixed(2)}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistory;
