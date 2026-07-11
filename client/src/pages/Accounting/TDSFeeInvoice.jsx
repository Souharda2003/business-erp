import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";
import { getTDSFeeById } from "../../services/accounting";
import { getCompany } from "../../services/company";

import "../../css/TDSFeeInvoice.css";

function TDSFeeInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

 
  const [company, setCompany] = useState({
  company_name: "",
  owner_name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  gst_number: "",
  pan_number: "",
  });

  const [data, setData] = useState({});

  useEffect(() => {
    loadInvoice();

    loadCompany();
  }, []);

  const loadInvoice = async () => {
    try {
      const res = await getTDSFeeById(id);

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCompany = async () => {
    try {
      const res = await getCompany();

      setCompany(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convert = (n) => {
      if (n < 20) return ones[n];

      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

      if (n < 1000)
        return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);

      if (n < 100000)
        return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);

      if (n < 10000000)
        return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);

      return (
        convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000)
      );
    };

    return convert(Math.floor(Number(num))) + " Only";
  };

  const downloadPDF = () => {
    const element = invoiceRef.current;

    html2pdf()
      .set({
        margin: 8,

        filename: `TDSFeeInvoice-${data.invoice_no}.pdf`,

        image: {
          type: "jpeg",

          quality: 1,
        },

        html2canvas: {
          scale: 2,

          useCORS: true,
        },

        jsPDF: {
          unit: "mm",

          format: "a4",

          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  return (
    <div className="invoice-page">
      <div className="invoice-top">
        <BackButton />

      </div>

      <div className="tds-invoice" ref={invoiceRef}>
        <div className="invoice-header">
          <h1>{company.company_name}</h1>

          <p>Address: {company.address}</p>
          <p>TDS Fee Receipt</p>
        </div>

        <div className="invoice-title">
          <h2>TDS FEE INVOICE</h2>
        </div>

        <div className="invoice-info">
          <div>
            <p>
              <strong>Name Of Party :</strong>

              {data.name_of_party}
            </p>

            <p>
              <strong>Invoice No :</strong>

              {data.invoice_no}
            </p>

            <p>
              <strong>Invoice Date :</strong>

              {data.invoice_date
                ? new Date(data.invoice_date).toLocaleDateString("en-GB")
                : ""}
            </p>
          </div>

          <div>
            <p>
              <strong>Financial Year :</strong>

              {data.financial_year}
            </p>

            <p>
              <strong>Code :</strong>

              {data.code}
            </p>

            <p>
              <strong>Section :</strong>

              {data.sec}
            </p>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>

              <th>Section</th>

              <th>Section(P)</th>

              <th>TDS %</th>

              <th>Gross Amount</th>

              <th>TDS Amount</th>

              <th>Net Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>TDS Fee</td>

              <td>{data.sec}</td>

              <td>{data.sec_p}</td>

              <td>{Number(data.tds_percentage || 0).toFixed(2)}%</td>

              <td>
                ₹
                {Number(data.gross_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>

              <td>
                ₹
                {Number(data.tds_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>

              <td>
                ₹
                {Number(data.net_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

<div className="summary-card">
          <h2>Amount Summary</h2>

          <hr />

          <div className="summary-row">
            <span>Gross Amount</span>

            <span>₹{Number(data.gross_amount || 0).toFixed(2)}</span>
          </div>

          <div
            className="summary-row"
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              color: "#16a34a",
            }}
          >
            <span>TDS Payable</span>

            <span>₹{Number(data.tds_payable || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="tds-payable-box">
          <div>
            <h2>TDS Payable</h2>
          </div>

          <div>
            <h1>
              ₹
              {Number(data.tds_payable || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>
        </div>
        <div className="amount-word-box">
          <h3>Amount In Words</h3>

          <p>Rupees {numberToWords(Number(data.tds_payable || 0))}</p>
        </div>


        <div className="signature-section">
          <div className="signature-box">
            <div className="signature-line"></div>

            <p>Prepared By</p>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>

            <p>Authorized Signatory</p>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Computer Generated Document</p>
        </div>
      </div>
              <button className="download-btn" onClick={downloadPDF}>
                Download PDF
              </button>
    </div>
  );
}

export default TDSFeeInvoice;
