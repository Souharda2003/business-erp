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
  <div className="page rodtep-page">

    <div className="rodtep-header">

      <BackButton />

      <div className="rodtep-heading">

        <h1 className="page-title">
          RODTEP History
        </h1>

        <p className="page-subtitle">
          View & Manage RODTEP Credit Records
        </p>

      </div>

    </div>

    <div className="history-filter-card rodtep-card">
    <div className="history-filter-inner">

      <div className="history-filter-row">

        <div className="form-group">

          <label>Search Type</label>

          <select
            value={searchType}
            onChange={handleTypeChange}
            >
            <option value="month">
              Month
            </option>

            <option value="year">
              Year
            </option>

          </select>

        </div>

        {searchType === "month" ? (
          
          <div className="form-group">

            <label>Month</label>

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

          </div>

        ) : customYear ? (

          <div className="form-group">

            <label>Year</label>

            <input
              type="number"
              placeholder="Enter Year"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

          </div>

) : (
  
  <div className="form-group">

            <label>Year</label>

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

          </div>

)}
</div>  

        <div className="search-btn-group">

          <button
            className="primary-btn"
            onClick={handleFilter}
          >
            Search RODTEP
          </button>

        </div>

      </div>

    </div>

    <div className="history-report-title">

      <h2>
        RODTEP Report
      </h2>

      <p>

        Search Type :

        <b>

          {searchType === "month"
            ? " Monthly"
            : " Yearly"}

        </b>

      </p>

      <p>

        {searchType === "month"
          ? `Month : ${monthNames[Number(searchValue)]}`
          : `Year : ${searchValue}`}

      </p>

    </div>
        <div className="history-table-card rodtep-card">

      <div className="card-glow"></div>

      <div className="history-table-header">

        <h2>
          RODTEP Records
        </h2>

        <span>
          Total Records : {list.length}
        </span>

      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

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
                  className="history-empty"
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

                  <td>
                    {Number(item.total_credit || 0).toFixed(2)}
                  </td>

                  <td>{item.hsn}</td>

                  <td>
                    {Number(item.rate || 0).toFixed(2)}%
                  </td>

                  <td>
                    {Number(item.add_gst_rate || 0).toFixed(2)}%
                  </td>

                  <td>
                    {Number(item.tcs_rate || 0).toFixed(2)}%
                  </td>

                  <td>
                    {Number(item.round_off || 0).toFixed(2)}
                  </td>

                  <td>
                    {item.financial_year}
                  </td>

                  <td className="amount-cell">

                    ₹
                    {Number(item.amount || 0).toFixed(2)}

                  </td>

                  <td>

                    <div className="history-action-buttons">

                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/rodtep-invoice/${item.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/rodtep/edit/${item.id}`)
                        }
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
    <div className="purchase-total-card rodtep-card">

      <div className="card-glow"></div>

      <h2>
        Total RODTEP Amount
      </h2>

      <h1>

        ₹

        {Number(totalAmount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}

      </h1>

    </div>

    <div className="purchase-summary-card rodtep-card">

      <div className="card-glow"></div>

      <h2 className="summary-title">
        RODTEP Summary
      </h2>

      {list.length === 0 ? (

        <div className="summary-empty">
          No RODTEP Summary Found
        </div>

      ) : (

        <>

          {list.map((item) => (

            <div
              className="summary-entry-card"
              key={item.id}
            >

              <h3>
                RODTEP Entry
              </h3>

              <div className="summary-grid">

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
                  <b>Rate :</b>{" "}
                  {Number(item.rate || 0).toFixed(2)}%
                </p>

                <p>
                  <b>GST Rate :</b>{" "}
                  {Number(item.add_gst_rate || 0).toFixed(2)}%
                </p>

                <p>
                  <b>TCS Rate :</b>{" "}
                  {Number(item.tcs_rate || 0).toFixed(2)}%
                </p>

                <p>
                  <b>Round Off :</b>{" "}
                  {Number(item.round_off || 0).toFixed(2)}
                </p>

              </div>

              <div className="summary-grand-total">

                Final Amount :

                ₹

                {Number(item.amount || 0).toLocaleString("en-IN", {
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

              Total Amount :

              ₹

              {Number(totalAmount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}

            </h3>

          </div>

        </>

      )}

    </div>

  </div>

);

}

export default RODTEPHistory;
