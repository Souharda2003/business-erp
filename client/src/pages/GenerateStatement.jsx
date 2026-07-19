import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStatement } from "../services/statement";
import { generateProfessionalPDF } from "../utils/pdfGenerator";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatementExcel from "../components/StatementExcel";
import StatementPrint from "../components/StatementPrint";
import StatementPDF from "../components/StatementPDF";
import "../css/statement.css";
import BackButton from "../components/BackButton";
function GenerateStatement() {
  const [module, setModule] = useState("Purchase");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("yearly");
  const [customFY, setCustomFY] = useState(false);

  const [customStartYear, setCustomStartYear] = useState("");

  const [customEndYear, setCustomEndYear] = useState("");
  const [financialYear, setFinancialYear] = useState("");

  const [month, setMonth] = useState("");

  const [year, setYear] = useState(new Date().getFullYear());

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [previewData, setPreviewData] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};


  const filteredData = previewData.filter((row) => {
    if (!search) {
      return true;
    }

    return Object.values(row)

      .join(" ")

      .toLowerCase()

      .includes(search.toLowerCase());
  });
  const handleApplyFinancialYear = () => {
    if (!customStartYear || !customEndYear) {
      alert("Please Enter Start Year & End Year");

      return;
    }

    const fy = `${customStartYear}-${customEndYear}`;

    setFinancialYear(fy);

    localStorage.setItem("financialYear", fy);

    setCustomFY(false);
  };
  const navigate = useNavigate();
  const moduleList = [
    "Purchase",

    "Sales",

    "Payment",

    "LC",

    "GST",

    "Drawback",

    "RODTEP",

    "Other Sales",

    "Importer Billing",
    "Accounting Charges",
  ];

  const monthList = [
    {
      value: 1,
      name: "January",
    },

    {
      value: 2,
      name: "February",
    },

    {
      value: 3,
      name: "March",
    },

    {
      value: 4,
      name: "April",
    },

    {
      value: 5,
      name: "May",
    },

    {
      value: 6,
      name: "June",
    },

    {
      value: 7,
      name: "July",
    },

    {
      value: 8,
      name: "August",
    },

    {
      value: 9,
      name: "September",
    },

    {
      value: 10,
      name: "October",
    },

    {
      value: 11,
      name: "November",
    },

    {
      value: 12,
      name: "December",
    },
  ];
useEffect(() => {

  const today = new Date();

  const currentYear = today.getFullYear();

  const currentMonth = today.getMonth() + 1;

  const currentFY =

    currentMonth >= 4

      ? `${currentYear}-${currentYear + 1}`

      : `${currentYear - 1}-${currentYear}`;

  setFinancialYear(currentFY);

  localStorage.setItem("financialYear", currentFY);

}, []);
  const loadPreview = async () => {
    try {
      setLoading(true);

      const res = await getStatement(
        module,

        type,

        financialYear,

        month,

        year,

        fromDate,

        toDate,
      );

      if (res.data.success) {
        setPreviewData(res.data.data);

        setTotalRecords(res.data.data.length);
      }
    } catch (err) {
      console.log(err);

      alert("Failed To Load Statement");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setModule("Purchase");

    setType("yearly");

    setMonth("");

    setFromDate("");

    setToDate("");

    setPreviewData([]);

    setTotalRecords(0);
  };
  const downloadPDF = () => {
    if (previewData.length === 0) {
      alert("Preview Statement First");

      return;
    }

    const company = {
      company_name: localStorage.getItem("company_name") || "Business ERP",
    };

    const user = JSON.parse(localStorage.getItem("user"));

    generateProfessionalPDF(
      company,

      module + " Statement",

      financialYear,

      previewData,

      user?.name || "Admin",
    );
  };
  return (
    <div className="lc-page">
<div className="lc-header">
      <BackButton />


              <div>
            <h1 className="page-title">
                Generate Statement</h1>

                <p className="page-subtitle">
                  Generate Professional PDF, & Excel   Ready Business
                  Statement
                </p>
              </div>
            </div>

          <div className="statement-card">
            <div className="statement-grid">
              <div className="form-group">
                <label>Statement Module</label>

                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                >
                  {moduleList.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Statement Type</label>

                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={type === "monthly"}
                      onChange={() => setType("monthly")}
                    />
                    Monthly
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={type === "yearly"}
                      onChange={() => setType("yearly")}
                    />
                    Yearly
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={type === "custom"}
                      onChange={() => setType("custom")}
                    />
                    Custom
                  </label>
                </div>
              </div>
            </div>

            {type === "yearly" && (
              <div className="statement-grid">
                <div className="form-group">
                  <label>Financial Year</label>

                  <select
                    value={financialYear}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setCustomFY(true);

                        return;
                      }

                      setCustomFY(false);

                      setFinancialYear(e.target.value);
                    }}
                  >
                    <option value="2028-2029">2028-2029</option>

                    <option value="2027-2028">2027-2028</option>

                    <option value="2026-2027">2026-2027</option>

                    <option value="2025-2026">2025-2026</option>

                    <option value="2024-2025">2024-2025</option>

                    <option value="custom">Custom Financial Year</option>
                  </select>
                  {customFY && (
                    <div
                      className="statement-grid"
                      style={{ marginTop: "15px" }}
                    >
                      <div className="form-group">
                        <label>Start Year</label>

                        <input
                          type="number"
                          placeholder="2023"
                          value={customStartYear}
                          onChange={(e) => setCustomStartYear(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>End Year</label>

                        <input
                          type="number"
                          placeholder="2024"
                          value={customEndYear}
                          onChange={(e) => setCustomEndYear(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="preview-btn"
                        onClick={handleApplyFinancialYear}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {type === "monthly" && (
              <div className="statement-grid">
                <div className="form-group">
                  <label>Month</label>

                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>

                    {monthList.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Year</label>

                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
            )}

            {type === "custom" && (
              <div className="statement-grid">
                <div className="form-group">
                  <label>From Date</label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>To Date</label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="statement-action">
              <button
                className="preview-btn"
                onClick={loadPreview}
                disabled={loading}
              >
                {loading ? "Loading..." : "Preview Statement"}
              </button>

              <button className="pdf-btn" onClick={downloadPDF}>
                Download PDF
              </button>
              <StatementExcel
                title={module + " Statement"}
                previewData={previewData}
              />

              <button className="reset-btn" onClick={resetForm}>
                Reset
              </button>
            </div>
            <div className="statement-summary">
              <div className="summary-card">
                <h3>Statement</h3>

                <span>{module}</span>
              </div>

              <div className="summary-card">
                <h3>Period</h3>

                <span>{type}</span>
              </div>

              <div className="summary-card">
                <h3>Total Records</h3>

                <span>{filteredData.length}</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search Statement"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {previewData.length === 0 && !loading && (
              <div className="empty-preview">
                <h2>No Statement Loaded</h2>

                <p>Select Module and Period then click Preview Statement.</p>
              </div>
            )}
            {loading && (
              <div className="statement-loading">
                <div className="loader"></div>

                <p>Loading Statement...</p>
              </div>
            )}
            {previewData.length > 0 && (
              <div id="statement-preview" className="statement-preview">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(previewData[0])

                          .filter((item) => item !== "id")

                          .map((item) => (
                            <th key={item}>
                              {item.replaceAll("_", " ").toUpperCase()}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, index) => (
                        <tr key={index}>
                          {Object.entries(row)

                            .filter(([key]) => key !== "id")

                            .map(([key, value], i) => (
                              <td>
                                {typeof value === "number"
                                  ? value.toLocaleString("en-IN")
                                  : value}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={20}
                        style={{
                          fontWeight: "bold",

                          textAlign: "right",

                          background: "#f1f5f9",
                        }}
                      >
                        Total Records :{filteredData.length}
                      </td>
                    </tr>
                  </tfoot>
                </div>
              </div>
            )}
          </div>
        </div>
  );
}
export default GenerateStatement;
