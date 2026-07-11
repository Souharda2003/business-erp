import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";

import { getGSTFeeById } from "../../services/accounting";

import { getCompany } from "../../services/company";

import "../../css/gstFeeInvoice.css";

function GSTFeeInvoice() {
  const { id } = useParams();

  const pdfRef = useRef();

  const [loading, setLoading] = useState(true);

  const [invoice, setInvoice] = useState({
    id: "",

    entry_date: "",

    applicant_name: "",

    amount: "",

    financial_year: "",
  });

  const [company, setCompany] = useState({
    company_name: "",

    address: "",

    gstin: "",

    iec_code: "",

    phone: "",

    email: "",

    state: "",

    pin_code: "",
  });

  useEffect(() => {
    loadInvoice();

    loadCompany();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const res = await getGSTFeeById(id);

      setInvoice(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCompany = async () => {
    try {
      const res = await getCompany();

      setCompany(res.data);

      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const option = {
      margin: 5,

      filename: `GST_Fee_Invoice_${invoice.id}.pdf`,

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

      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    html2pdf()
      .set(option)

      .from(pdfRef.current)

      .save();
  };

const amountInWords = (num) => {
    const a = [
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

    const b = [
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
      if (n < 20) return a[n];

      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];

      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred " + convert(n % 100);

      if (n < 100000)
        return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);

      if (n < 10000000)
        return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);

      return (
        convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000)
      );
    };

    return convert(Math.round(num)) + " Rupees"+" Only";
  };
  if (loading) {
    return (
      <div className="page">
        <h2>Loading GST Fee Invoice...</h2>
      </div>
    );
  }
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

        <h1 style={{ margin: 0 }}>GST Fee Invoice</h1>
      </div>

      <div className="gstfee-invoice" ref={pdfRef}>
        <div className="invoice-header">
          <div className="header-left">
            <div className="company-title">
              <h1>{company.company_name}</h1>
            </div>

            <div className="company-info">
              <h2>GST FEE TAX INVOICE</h2>
              <p>
                <b>Address :</b> {company.address}
              </p>

              <p>
                <b>Phone :</b> {company.phone}
              </p>

              <p>
                <b>Email :</b> {company.email}
              </p>
            </div>
          </div>

          <div className="header-right">
            <h3>Original Copy</h3>

            <hr />

            <p>
              <b>Invoice No :</b>
              GSTFEE-{invoice.id}
            </p>

            <p>
              <b>Date :</b>

              {invoice.entry_date
                ? new Date(invoice.entry_date).toLocaleDateString("en-GB")
                : ""}
            </p>

            <p>
              <b>Financial Year :</b>

              {invoice.financial_year}
            </p>

            <p>
              <b>Status :</b>
              PAID
            </p>
          </div>
        </div>

        <hr />

        <div className="bill-section">
          <div className="bill-box">
            <h3>Applicant Details</h3>

            <p>
              <b>Name :</b>

              {invoice.applicant_name}
            </p>

            <p>
              <b>Company :</b>

              {company.company_name}
            </p>

            <p>
              <b>GSTIN :</b>

              {company.gstin}
            </p>

            <p>
              <b>IEC :</b>

              {company.iec_code}
            </p>

            <p>
              <b>State :</b>

              {company.state}
            </p>
          </div>

          <div className="bill-box">
            <h3>Invoice Summary</h3>

            <p>
              <b>Invoice :</b>
              GSTFEE-{invoice.id}
            </p>

            <p>
              <b>Entry Date :</b>

              {invoice.entry_date
                ? new Date(invoice.entry_date).toLocaleDateString("en-GB")
                : ""}
            </p>

            <p>
              <b>Financial Year :</b>

              {invoice.financial_year}
            </p>

            <p>
              <b>Payment Type :</b>
              GST Fee
            </p>
          </div>
        </div>

        <br />

 <div className="payment-details">
          <h2>Payment Details</h2>

          <table className="payment-table">
            <tbody>
              <tr>
                <td>
                  <b>Payment For</b>
                </td>

                <td>GST Fee</td>
              </tr>

              <tr>
                <td>
                  <b>Applicant</b>
                </td>

                <td>{invoice.applicant_name}</td>
              </tr>

              <tr>
                <td>
                  <b>Financial Year</b>
                </td>

                <td>{invoice.financial_year}</td>
              </tr>

              <tr>
                <td>
                  <b>Total Amount</b>
                </td>

                <td>₹{Number(invoice.amount || 0).toFixed(2)}</td>
              </tr>

              <tr>
                <td>
                  <b>Status</b>
                </td>

                <td
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  PAID
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div className="summary-card">
          <h2>Amount Summary</h2>

          <hr />

          <div className="summary-row">
            <span>GST Fee Amount</span>

            <span>₹{Number(invoice.amount || 0).toFixed(2)}</span>
          </div>

          <div
            className="summary-row"
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              color: "#16a34a",
            }}
          >
            <span>Total Payable</span>

            <span>₹{Number(invoice.amount || 0).toFixed(2)}</span>
          </div>
        </div>

        <br />
 <div className="amount-box">
          <h2>Total GST Fee</h2>

          <h1>
            ₹
            {Number(invoice.amount || 0).toLocaleString(
              "en-IN",

              {
                minimumFractionDigits: 2,

                maximumFractionDigits: 2,
              },
            )}
          </h1>
        </div>
        <div className="amount-word-box">
          <h3>Amount In Words</h3>

          <hr />

          <p>{amountInWords(Number(invoice.amount || 0).toFixed(2))} </p>
        </div>

        <br />
        <div className="invoice-note">
          <h3>Declaration</h3>


          <p>
            This is a computer generated GST Fee Invoice. The amount shown above
            has been received towards GST related professional services. No
            physical signature is required.
          </p>
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

        <div className="company-footer">
          <div>
            <h3>{company.name}</h3>
            <p>GST & Export Documentation Consultant</p>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          <p>********** COMPUTER GENERATED GST FEE INVOICE **********</p>
        </div>
      </div>
      <button
        className="download-btn"
        onClick={downloadPDF}
        style={{ marginLeft: "auto" }}
      >
        Download PDF
      </button>
    </div>
  );
}

export default GSTFeeInvoice;
