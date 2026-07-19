import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import { filterOtherSales, deleteOtherSales } from "../services/otherSales";

import "../css/othersales.css";

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
      <div className="page other-sales-history-page">

        <div className="other-sales-history-header">

          <BackButton />

          <div className="other-sales-history-heading">

            <h1 className="page-title">

              Other Sales History

            </h1>

            <p className="page-subtitle">

              View & Manage Other Sales Reports

            </p>

          </div>

        </div>

        <div className="history-filter-card">

          <div className="history-filter-row">

            <div className="form-group">

              <label>Service Type</label>

              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="All Services">All Services</option>

                <option value="Transport Charge">
                  Transport Charge
                </option>

                <option value="Clearing Charge">
                  Clearing Charge
                </option>

                <option value="Document Charge">
                  Document Charge
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>Search By</label>

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
                  ? "Month"
                  : "Year"}

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

                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>

                  <option value="custom">

                    Custom

                  </option>

                </select>

              )}

            </div>

            <div className="history-search-btn">

              <button
                className="search-btn"
                onClick={handleSearch}
              >

                Search

              </button>

            </div>

          </div>

        </div>

          <div className="history-report-title">

            <h2>

              Other Sales Report

            </h2>

            <div className="history-report-info">

              <p>

                <strong>Service Type :</strong>{" "}
                {serviceType}

              </p>

              <p>

                <strong>Search By :</strong>{" "}

                {searchType === "month"
                  ? "Month"
                  : "Year"}

              </p>

              <p>

                <strong>Value :</strong>{" "}

                {searchType === "month"
                  ? monthNames[Number(searchValue)]
                  : searchValue}

              </p>

            </div>

          </div>
          <div className="history-table-card">

      <div className="card-glow"></div>

      <div className="history-table-header">

        <h2>
          Other Sales Records
        </h2>

        <span>
          Total Records : {list.length}
        </span>

      </div>

      <div className="history-table-wrapper">

    <table className="history-table">

      <thead>

        <tr>

          <th>Service Type</th>

          <th>Invoice No</th>

          <th>Name</th>

          <th>Total Amount</th>

          <th>Date</th>

          <th >

            Action

          </th>

        </tr>

      </thead>

      <tbody>

        {list.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              className="empty-table-message"
            >

              No Other Sales Record Found

            </td>

          </tr>

        ) : (

          list.map((item) => (

            <tr key={item.id}>

              <td>

                {item.service_type}

              </td>

              <td>

                {item.invoice_no || "-"}

              </td>

              <td>

                {item.name}

              </td>

              <td>

                ₹{Number(item.total_amount || 0).toFixed(2)}

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
                      navigate(
                        `/other-sales-invoice/${item.id}`
                      )
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
<div className="purchase-total-card">
<div className="card-glow"></div>
  <h2>

    Total Other Sales Amount

  </h2>

  <h1>

    ₹{Number(totalAmount).toFixed(2)}

  </h1>

</div>

<div className="purchase-summary-card">
<div className="card-glow"></div>
<h2 className="summary-title">
    Other Sales Summary

  </h2>

  <hr />

  {list.length === 0 ? (

    <p className="summary-title">

      No Other Sales Summary Found

    </p>

  ) : (

    <>

      {list.map((item) => (

        <div
          key={item.id}
          className="summary-entry-card"
        >

          <h3>

            {item.service_type}

          </h3>
 <div className="summary-grid">

          <p>

            <strong>Invoice No :</strong>{" "}

            {item.invoice_no || "-"}

          </p>

          <p>

            <strong>Date :</strong>{" "}

            {item.entry_date
              ? new Date(
                  item.entry_date
                ).toLocaleDateString(
                  "en-GB"
                )
              : ""}

          </p>

          <p>

            <strong>Name :</strong>{" "}

            {item.name}

          </p>

          {item.service_type ===
            "Transport Charge" && (

            <>

              <p>

                <strong>

                  Vehicle Number :

                </strong>{" "}

                {item.vehicle_number}

              </p>

              <p>

                <strong>

                  Challan No :

                </strong>{" "}

                {item.challan_no}

              </p>

              <p>

                <strong>

                  From :

                </strong>{" "}

                {item.from_location}

              </p>

              <p>

                <strong>

                  To :

                </strong>{" "}

                {item.to_location}

              </p>

              <p>

                <strong>

                  Amount :

                </strong>{" "}

                ₹{Number(item.amount || 0).toFixed(2)}

              </p>

              <h2>

                Total Amount : ₹

                {Number(
                  item.total_amount || 0
                ).toFixed(2)}

              </h2>

            </>

          )}

          {item.service_type ===
            "Clearing Charge" && (
              
              <>
                          <p>

                <strong>Amount :</strong>{" "}

                ₹{Number(item.amount || 0).toFixed(2)}

              </p>

              <p>

                <strong>CGST :</strong>{" "}

                {Number(item.cgst_percent || 0).toFixed(2)}%

              </p>

              <p>

                <strong>CGST Amount :</strong>{" "}

                ₹{(
                  (Number(item.amount || 0) *
                    Number(item.cgst_percent || 0)) /
                  100
                ).toFixed(2)}

              </p>

              <p>

                <strong>SGST :</strong>{" "}

                {Number(item.sgst_percent || 0).toFixed(2)}%

              </p>

              <p>

                <strong>SGST Amount :</strong>{" "}

                ₹{(
                  (Number(item.amount || 0) *
                    Number(item.sgst_percent || 0)) /
                  100
                ).toFixed(2)}

              </p>

              <p>

                <strong>Total GST :</strong>{" "}

                ₹{Number(item.total_gst || 0).toFixed(2)}

              </p>
              <h2>

                Total Amount : ₹

                {Number(item.total_amount || 0).toFixed(2)}

              </h2>

            </>

)}

          {item.service_type ===
            "Document Charge" && (
              
              <>

              <p>

                <strong>Bill No :</strong>{" "}

                {item.bill_no}

              </p>

              <p>

                <strong>Amount :</strong>{" "}

                ₹{Number(item.amount || 0).toFixed(2)}

              </p>

              <p>

                <strong>TDS :</strong>{" "}

                ₹{Number(item.tds || 0).toFixed(2)}

              </p>

            </>
            )}
</div>

              <div className="summary-grand-total">

                Total Amount : ₹

                {Number(item.total_amount || 0).toFixed(2)}


                </div>


        </div>

      ))}


          <div className="summary-overall-card">

        <h2>

          Total Other Sales Amount : ₹

          {Number(totalAmount).toFixed(2)}

        </h2>

        <h3>

          Total Records : {list.length}

        </h3>

      </div>

    </>

)}

</div>

</div>



);

}

export default OtherSalesHistory;