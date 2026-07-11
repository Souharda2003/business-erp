import { useState, useEffect } from "react";

import BackButton from "../components/BackButton";

import AnalyticsChart from "../components/AnalyticsChart";

import { filterGST } from "../services/gst";

import { getGSTReportAnalytics } from "../services/analytics";

import "../css/reports.css";

function GSTReportView() {
  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [searchType, setSearchType] = useState("month");

  const [searchValue, setSearchValue] = useState(currentMonth);

  const [customYear, setCustomYear] = useState(false);

  const [gst, setGST] = useState([]);

  const [chartData, setChartData] = useState([]);

  const loadData = async () => {
    try {
      const res = await filterGST(
        searchType,

        searchValue,

        currentYear,
      );

      setGST(Array.isArray(res.data) ? res.data : []);

      const chart = await getGSTReportAnalytics(
        searchType,

        searchValue,

        currentYear,
      );

      setChartData(Array.isArray(chart.data) ? chart.data : []);
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

  const totalGST = gst.reduce(
    (sum, item) => sum + Number(item.gst_amount || 0),

    0,
  );

  const totalTaxable = gst.reduce(
    (sum, item) => sum + Number(item.taxable_amount || 0),

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

        <h1>GST Report</h1>
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
        GST Report
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
            <th>Invoice No</th>

            <th>Date</th>

            <th>Customer</th>

            <th>Taxable Amount</th>

            <th>GST Amount</th>

            <th>Total Amount</th>
          </tr>
        </thead>

        <tbody>
          {gst.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",

                  padding: "20px",

                  fontWeight: "bold",

                  color: "red",
                }}
              >
                No GST Record Found
              </td>
            </tr>
          ) : (
            gst.map((item) => (
              <tr key={item.id}>
                <td>{item.invoice_no}</td>

                <td>
                  {item.invoice_date
                    ? new Date(item.invoice_date).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>{item.customer_name}</td>

                <td>₹{Number(item.taxable_amount || 0).toFixed(2)}</td>

                <td>₹{Number(item.gst_amount || 0).toFixed(2)}</td>

                <td>₹{Number(item.total_amount || 0).toFixed(2)}</td>
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

          boxShadow: "0 2px 10px rgba(0,0,0,.10)",

          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#2563eb",
          }}
        >
          Total GST Collection
        </h2>

        <h1
          style={{
            fontSize: "40px",

            color: "#16a34a",
          }}
        >
          ₹{Number(totalGST).toFixed(2)}
        </h1>
      </div>

      <br />
      <div
        style={{
          background: "#f8fafc",

          padding: "20px",

          borderRadius: "12px",
        }}
      >
        <h2
          style={{
            color: "#2563eb",

            marginBottom: "20px",
          }}
        >
          GST Summary
        </h2>

        <hr />

        {gst.length === 0 ? (
          <p
            style={{
              textAlign: "center",

              color: "red",

              fontWeight: "bold",
            }}
          >
            No GST Summary Found
          </p>
        ) : (
          <>
            {gst.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",

                  padding: "20px",

                  marginTop: "20px",

                  borderRadius: "10px",

                  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                }}
              >
                <h3
                  style={{
                    color: "#16a34a",
                  }}
                >
                  GST Entry
                </h3>

                <p>
                  <b>Invoice No :</b>

                  {item.invoice_no}
                </p>

                <p>
                  <b>Invoice Date :</b>

                  {item.invoice_date
                    ? new Date(item.invoice_date).toLocaleDateString("en-GB")
                    : ""}
                </p>

                <p>
                  <b>Customer Name :</b>

                  {item.customer_name}
                </p>

                <p>
                  <b>Taxable Amount :</b>₹
                  {Number(item.taxable_amount || 0).toFixed(2)}
                </p>

                <p>
                  <b>GST Amount :</b>₹{Number(item.gst_amount || 0).toFixed(2)}
                </p>

                <hr />

                <h2
                  style={{
                    color: "#16a34a",
                  }}
                >
                  Invoice Total : ₹{Number(item.total_amount || 0).toFixed(2)}
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
                Total GST : ₹{Number(totalGST).toFixed(2)}
              </h2>

              <h3
                style={{
                  color: "#2563eb",
                }}
              >
                Total Taxable : ₹{Number(totalTaxable).toFixed(2)}
              </h3>
            </div>
          </>
        )}
      </div>

      <br />
      <h2
        style={{
          textAlign: "center",

          marginBottom: "20px",

          color: "#2563eb",
        }}
      >
        Monthly GST Analytics
      </h2>

      <AnalyticsChart data={chartData} />
    </div>
  );
}

export default GSTReportView;
