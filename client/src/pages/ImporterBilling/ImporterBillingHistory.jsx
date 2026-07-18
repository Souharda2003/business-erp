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
  <div className="page importer-history-page">
      <div className="page-content">

        <div className="importer-history-header">

          <BackButton />

          <div className="history-heading">

            <h1 className="page-title">
              Importer Billing History
            </h1>

            <p className="page-subtitle">
              View, search and manage all importer billing records.
            </p>

          </div>

        </div>

        <div className="purchase-form-card  history-filter-card">

          <div className="history-filter-grid">

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

                <option value="month">
                  Month
                </option>

                <option value="year">
                  Year
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>

                {searchType === "month"
                  ? "Select Month"
                  : "Select Year"}

              </label>

              {searchType === "month" ? (

                <select
                  value={searchValue}
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
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
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
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
                    Custom Year
                  </option>

                </select>

              )}

            </div>

          </div>

          <div className="history-button-row">

            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div>
                <div className="purchase-form-card history-report-card">

          <h2 className="history-report-title">
            Importer Billing Report
          </h2>

          <div className="history-info-grid">

            <div className="history-info-box">

              <span className="info-label">
                Search By
              </span>

              <span className="info-value">

                {searchType === "month"
                  ? "Month"
                  : "Year"}

              </span>

            </div>

            <div className="history-info-box">

              <span className="info-label">
                Value
              </span>

              <span className="info-value">

                {searchType === "month"
                  ? monthNames[Number(searchValue)]
                  : searchValue}

              </span>

            </div>

            <div className="history-info-box">

              <span className="info-label">
                Total Records
              </span>

              <span className="info-value">
                {list.length}
              </span>

            </div>

          </div>

        </div>

        <div className="purchase-form-card  history-table-card">

          <div className="history-table-wrapper">

            <table className="history-table">

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
                      className="empty-row"
                    >
                      No Importer Billing Record Found
                    </td>

                  </tr>

                ) : (

                  list.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {item.invoice_no}
                      </td>

                      <td>
                        {item.lc_no}
                      </td>

                      <td>
                        {item.importer_name}
                      </td>

                      <td className="amount-cell">

                        ₹
                        {Number(
                          item.grand_total || 0
                        ).toFixed(2)}

                      </td>

                      <td>

                        {item.entry_date
                          ? new Date(
                              item.entry_date
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : ""}

                      </td>

                      <td>

                        <div className="action-buttons">

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
                <div className=" purchase-form-card history-total-card">

          <h2 className="total-title">
            Total Grand Amount
          </h2>

          <h1 className="total-amount">
            ₹{Number(totalGrand).toFixed(2)}
          </h1>

        </div>

        <div className="purchase-form-card history-summary-card">

          <h2 className="summary-main-title">
            Importer Billing Summary
          </h2>

          {list.length === 0 ? (

            <div className="empty-summary">

              No Importer Billing Summary Found

            </div>

          ) : (

            list.map((item) => (

              <div
                key={item.id}
                className="summary-entry-card"
              >

                <div className="summary-entry-header">

                  <h3>
                    Importer Billing Entry
                  </h3>

                  <span className="summary-badge">

                    Invoice :
                    {item.invoice_no}

                  </span>

                </div>

                <div className="summary-grid">

                  <div className="summary-item">

                    <label>
                      Invoice No
                    </label>

                    <p>
                      {item.invoice_no}
                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      LC No
                    </label>

                    <p>
                      {item.lc_no}
                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      Importer Name
                    </label>

                    <p>
                      {item.importer_name}
                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      Entry Date
                    </label>

                    <p>

                      {item.entry_date
                        ? new Date(
                            item.entry_date
                          ).toLocaleDateString(
                            "en-GB"
                          )
                        : ""}

                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      LC Payment
                    </label>

                    <p>

                      ₹
                      {Number(
                        item.lc_payment || 0
                      ).toFixed(2)}

                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      Item Total
                    </label>

                    <p>

                      ₹
                      {Number(
                        item.item_total || 0
                      ).toFixed(2)}

                    </p>

                  </div>

                  <div className="summary-item">

                    <label>
                      Extra Charge
                    </label>

                    <p>

                      ₹
                      {Number(
                        item.extra_charge || 0
                      ).toFixed(2)}

                    </p>

                  </div>

                  <div className="summary-item grand-box">

                    <label>
                      Grand Total
                    </label>

                    <p>

                      ₹
                      {Number(
                        item.grand_total || 0
                      ).toFixed(2)}

                    </p>

                  </div>

                </div>

                <hr className="summary-divider" />

                <h3 className="item-details-title">
                  Item Details
                </h3>

                <div className="table-wrapper">

                  <table className="history-table">

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
                      {item.items &&
                      item.items.length > 0 ? (

                        item.items.map(
                          (product, index) => (

                            <tr key={index}>

                              <td>
                                {product.quantity}
                              </td>

                              <td>
                                {product.unit}
                              </td>

                              <td>
                                {product.bag}
                              </td>

                              <td>

                                ₹
                                {Number(
                                  product.price || 0
                                ).toFixed(2)}

                              </td>

                              <td>

                                ₹
                                {Number(
                                  product.amount || 0
                                ).toFixed(2)}

                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan="5"
                            className="empty-row"
                          >
                            No Item Found
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

                <div className="summary-grand-total">

                  Grand Total

                  <span>

                    ₹
                    {Number(
                      item.grand_total || 0
                    ).toFixed(2)}

                  </span>

                </div>

              </div>

            ))

          )}

        </div>

        <div className="purchase-form-card  overall-summary-card">

          <h2 className="overall-summary-title">
            Overall Business Summary
          </h2>

          <div className="overall-summary-grid">

            <div className="overall-card">

              <span className="overall-label">
                Total LC Payment
              </span>

              <h3>

                ₹
                {Number(
                  totalLCPayment
                ).toFixed(2)}

              </h3>

            </div>

            <div className="overall-card">

              <span className="overall-label">
                Total Item Amount
              </span>

              <h3>

                ₹
                {Number(
                  totalItem
                ).toFixed(2)}

              </h3>

            </div>

            <div className="overall-card">

              <span className="overall-label">
                Total Extra Charge
              </span>

              <h3>

                ₹
                {Number(
                  totalExtraCharge
                ).toFixed(2)}

              </h3>

            </div>

            <div className="overall-card overall-highlight">

              <span className="overall-label">
                Total Grand Amount
              </span>

              <h2>

                ₹
                {Number(
                  totalGrand
                ).toFixed(2)}

              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>

);
}
export default ImporterBillingHistory;