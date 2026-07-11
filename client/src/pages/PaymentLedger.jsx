import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import html2pdf from "html2pdf.js";

import BackButton from "../components/BackButton";

import { getPaymentLedger } from "../services/payment";

import "../css/paymentLedger.css";

function PaymentLedger() {
  const pdfRef = useRef();

  const [searchParams] = useSearchParams();

  const customerFromUrl = searchParams.get("customer") || "";

  const currentYear = new Date().getFullYear();

  const defaultFinancialYear = `${currentYear}-${currentYear + 1}`;

  const [customerName, setCustomerName] = useState(customerFromUrl);

  const [financialYear, setFinancialYear] = useState(defaultFinancialYear);
const [customYear, setCustomYear] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ledgerData, setLedgerData] = useState({
    customer_name: "",

    financial_year: "",

    from_date: "",

    to_date: "",

    opening_balance: 0,

    total_credit: 0,

    total_debit: 0,

    closing_balance: 0,

    total_records: 0,

    ledger: [],
  });

  useEffect(() => {
    if (customerFromUrl) {
      loadLedger();
    }
  }, [customerName,financialYear]);

  const loadLedger = async () => {
    try {
      setLoading(true);

      const res = await getPaymentLedger(
        customerName,

        financialYear,
      );

      setLedgerData(res.data);
    } catch (err) {
      console.log(err);

      alert("Ledger Load Failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const option = {
      margin: 5,

      filename: `Payment_Ledger_${customerName}.pdf`,

      image: {
        type: "jpeg",

        quality: 1,
      },

      html2canvas: {
        scale: 2,
      },

      jsPDF: {
        unit: "mm",

        format: "a4",

        orientation: "portrait",
      },
    };

    html2pdf()
      .set(option)

      .from(pdfRef.current)

      .save();
  };

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

        <h1 style={{ margin: 0 }}>Payment Ledger</h1>
      </div>

      <div className="ledger-filter">
        <div className="form-group">
          <label>Customer Name</label>

          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name"
          />
        </div>

        <div className="form-group">
          <label>Financial Year</label>

          {customYear ? (
  <input
    type="text"
    placeholder="Example : 2030-2031"
    value={financialYear}
    onChange={(e) => setFinancialYear(e.target.value)}
  />
) : (
  <select
    value={financialYear}
    onChange={(e) => {
      if (e.target.value === "custom") {
        setCustomYear(true);
        setFinancialYear("");
      } else {
        setFinancialYear(e.target.value);
      }
    }}
  >
    <option value="2024-2025">2024-2025</option>

    <option value="2025-2026">2025-2026</option>

    <option value="2026-2027">2026-2027</option>

    <option value="2027-2028">2027-2028</option>

    <option value="2028-2029">2028-2029</option>

    <option value="custom">Select  Financial Year</option>
  </select>
)}
        </div>
        <div className="button-group">
          <button className="search-btn" onClick={loadLedger}>
            Generate Ledger
          </button>

          <button className="download-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      <br />

      <div className="ledger-pdf" ref={pdfRef}>
        <h2 className="company-name">UTSAV INTERNATIONAL</h2>

        <h3 className="ledger-title">PAYMENT LEDGER</h3>

        <hr />

        <div className="ledger-header">
          <div>
            <b>Customer :</b>

            {ledgerData.customer_name}
          </div>

          <div>
            <b>Financial Year :</b>

            {ledgerData.financial_year}
          </div>
        </div>

        <div className="ledger-header">
          <div>
            <b>From :</b>

            {ledgerData.from_date}
          </div>

          <div>
            <b>To :</b>

            {ledgerData.to_date}
          </div>
        </div>

        <br />
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>

              <th>Particulars</th>

              <th>Voucher Type</th>

              <th>Voucher No</th>

              <th>Debit</th>

              <th>Credit</th>

              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            <tr
              style={{
                background: "#f8fafc",
                fontWeight: "bold",
              }}
            >
              <td colSpan="6">Opening Balance</td>

              <td>
                ₹
                {Number(ledgerData.opening_balance || 0).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </td>
            </tr>

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Loading Ledger...
                </td>
              </tr>
            ) : ledgerData.ledger && ledgerData.ledger.length > 0 ? (
              ledgerData.ledger.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.entry_date
                      ? new Date(item.entry_date).toLocaleDateString("en-GB")
                      : ""}
                  </td>

                  <td>
                    {Number(item.credit) > 0 ? "Purchase A/C" : "Bank Payment"}
                  </td>

                  <td>{item.voucher_type}</td>

                  <td>{item.voucher_no || item.invoice_no}</td>

                  <td
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {Number(item.debit || 0) === 0
                      ? "-"
                      : `₹${Number(item.debit).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {Number(item.credit || 0) === 0
                      ? "-"
                      : `₹${Number(item.credit).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ₹
                    {Number(item.balance || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "red",
                    padding: "25px",
                    fontWeight: "bold",
                  }}
                >
                  No Ledger Record Found
                </td>
              </tr>
            )}
            <tr
              style={{
                background: "#ecfdf5",
                fontWeight: "bold",
              }}
            >
              <td colSpan="4">Total Debit</td>

              <td
                style={{
                  textAlign: "right",
                }}
              >
                ₹
                {Number(ledgerData.total_debit || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td></td>

              <td></td>
            </tr>

            <tr
              style={{
                background: "#eff6ff",
                fontWeight: "bold",
              }}
            >
              <td colSpan="4">Total Credit</td>

              <td></td>

              <td
                style={{
                  textAlign: "right",
                }}
              >
                ₹
                {Number(ledgerData.total_credit || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td></td>
            </tr>

            <tr
              style={{
                background: "#fefce8",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <td colSpan="6">Closing Balance</td>

              <td
                style={{
                  textAlign: "right",
                  color: "#15803d",
                }}
              >
                ₹
                {Number(ledgerData.closing_balance || 0).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <div>
            <h3>Total Records : {ledgerData.total_records}</h3>
          </div>

          <div>
            <h3
              style={{
                color: "#2563eb",
              }}
            >
              Financial Year : {ledgerData.financial_year}
            </h3>
          </div>
        </div>

        <br />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "80px",
          }}
        >
          <div>
            ______________________
            <br />
            Prepared By
          </div>

          <div>
            ______________________
            <br />
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentLedger;
