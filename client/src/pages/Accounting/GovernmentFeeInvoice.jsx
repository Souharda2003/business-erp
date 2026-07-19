import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";

import { getGovernmentFeeById } from "../../services/accounting";

import { getCompany} from "../../services/company";

import "../../css/governmentFeeInvoice.css";

function GovernmentFeeInvoice() {
  const { id } = useParams();

  const pdfRef = useRef();

  const [loading, setLoading] = useState(true);

  const [invoice, setInvoice] = useState({
    invoice_no: "",

    entry_date: "",

    applicant_name: "",

    exporter_gstin: "",

    iec_code: "",

    fee_description: "",

    other_description: "",

    amount: 0,

    cgst_percent: 0,

    cgst_amount: 0,

    sgst_percent: 0,

    sgst_amount: 0,

    igst_percent: 0,

    igst_amount: 0,

    total_amount: 0,

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
      const res = await getGovernmentFeeById(id);

      setInvoice(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCompany = async () => {
    try {
      const res = await getCompanyProfile();

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

      filename: `Government_Fee_Invoice_${invoice.invoice_no}.pdf`,

      image: {
        type: "jpeg",

        quality: 1,
      },

     html2canvas: {
    scale: 3,
    useCORS: true,
    letterRendering: true,
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
        <h2>Loading Government Fee Invoice...</h2>
      </div>
    );
  }
  return (
    <div className="invoice-page">
  <div className="invoice-page-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
Government Fee Invoice
</h1>

<p className="page-subtitle">
View & Download Government Fee Invoice
</p>

</div>
 </div>
      <div className="government-invoice" ref={pdfRef}>
        <div className="invoice-top-header">
          <div className="office-left">
            <h2>EXPORT INSPECTION COUNCIL</h2>

            <p>
              <b>Issuing Office</b>
              <br />
              EXPORT INSPECTION AGENCY - KOLKATA
            </p>

            <p>
              <b>GSTIN</b>
              <br />
              19AAEGO056M1ZE
            </p>

            <p>
              <b>Address</b>
              <br />
              World Trade Centre
              <br />
              14/1B Ezra Street
              <br />
              Kolkata
              <br />
              West Bengal - 700001
              <br />
              Phone : 033-22355004
            </p>
          </div>

          <div className="office-right">
            <h4>Original Copy</h4>

            <br />

            <p>
              <b>Total</b>
              &nbsp;&nbsp;  ₹{" "}

    {Number(invoice.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 
            </p>

            <p>
              <b>Invoice Date</b>
              &nbsp;&nbsp;
              {invoice.entry_date
                ? new Date(invoice.entry_date).toLocaleDateString("en-GB")
                : ""}
            </p>

            <p>
              <b>Invoice No.</b>
              &nbsp;&nbsp;
              {invoice.invoice_no}
            </p>

            <p>
              <b>Reference No.</b>
              &nbsp;&nbsp;
              {invoice.invoice_no}
            </p>
          </div>
        </div>

        <hr />

        <h2
          style={{
            textAlign: "center",

            color: "#2563eb",

            margin: "15px 0",
          }}
        >
          Tax Invoice cum Receipt
        </h2>

        <div className="bill-section">
          <div className="bill-left">
            <h3>Applicant Name (Bill To)</h3>

            <p>
              <b>Applicant Name : {company.company_name || invoice.applicant_name}</b>
            </p>


            <p>{company.gstin || invoice.exporter_gstin}</p>
          </div>

          <div className="bill-right">
            <h3>Service</h3>

            <p>
              {invoice.fee_description === "Other"
                ? invoice.other_description
                : invoice.fee_description}
            </p>

            <p>
              <b>IEC :
              {company.iec_code || invoice.iec_code}</b>
            </p>

          </div>
        </div>

        <hr />

        <table className="government-table">
          <thead>
            <tr>
              <th rowSpan="2">S.No.</th>

              <th rowSpan="2">Fee Description</th>

              <th rowSpan="2">Amount</th>

              <th colSpan="2">CGST</th>

              <th colSpan="2">SGST</th>

              <th colSpan="2">IGST</th>

              <th rowSpan="2">Total</th>
            </tr>

            <tr>
              <th>Rate</th>

              <th>Amount</th>

              <th>Rate</th>

              <th>Amount</th>

              <th>Rate</th>

              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>

              <td>
                {invoice.fee_description === "Other"
                  ? invoice.other_description
                  : invoice.fee_description}
              </td>

              <td> ₹{" "}

    {Number(invoice.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.cgst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.cgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.sgst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.sgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.igst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.igst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td> ₹{" "}

    {Number(invoice.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>
            </tr>

            <tr
              style={{
                fontWeight: "bold",

                background: "#f5f5f5",
              }}
            >
              <td colSpan="2">Total</td>

              <td>₹{" "}

    {Number(invoice.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.cgst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.cgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.sgst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.sgst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td>{Number(invoice.igst_percent || 0).toFixed(2)}%</td>

              <td>₹{" "}

    {Number(invoice.igst_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>

              <td> ₹{" "}

    {Number(invoice.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>
            </tr>
          </tbody>
        </table>
        <br />

        <div className="invoice-summary">
          <div className="summary-left">
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>
                    <b>Total Invoice Value (in figure)</b>
                  </td>

                  <td> ₹{" "}

    {Number(invoice.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} </td>
                </tr>

                <tr>
                  <td>
                    <b>Amount (in words)</b>
                  </td>

                  <td>{amountInWords(Number(invoice.total_amount || 0).toFixed(2))}</td>
                </tr>

                <tr>
                  <td>
                    <b>Reverse Charge (Y/N)</b>
                  </td>

                  <td>N</td>
                </tr>

                <tr>
                  <td>
                    <b>Scheme</b>
                  </td>

                  <td>South Asian Free Trade Area (SAFTA)</td>
                </tr>

                <tr>
                  <td>
                    <b>Place Of Supply</b>
                  </td>

                  <td>WEST BENGAL</td>
                </tr>

                <tr>
                  <td>
                    <b>Financial Year</b>
                  </td>

                  <td>{invoice.financial_year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <br />

        <h3
          style={{
            marginBottom: "10px",
            color: "#2563eb",
          }}
        >
          Online Payment Details
        </h3>

        <table className="payment-table">
          <thead>
            <tr>
              <th>Invoice No</th>

              <th>Total Amount (INR)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{invoice.invoice_no}</td>

              <td>    ₹{" "}

    {Number(invoice.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} 

</td>
            </tr>

            <tr>
              <td>
                <b>Date</b>

                <br />

                {invoice.entry_date
                  ? new Date(invoice.entry_date).toLocaleString("en-GB")
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <div className="invoice-note">
          <p>
            <b>Note :</b>
            All payments are to be done online. Payment status should be SUCCESS
            for successful submission.
          </p>
        </div>

        <br />

        <div className="invoice-footer">
          <p>
            This is a system generated Tax Invoice cum Receipt and does not
            require signature.
          </p>
        </div>

        <br />

        <div className="signature-wrapper">
                    <div>
                      _______________________
                      <br />
                      Prepared By
                    </div>

                    <div>
                      _______________________
                      <br />
                      Authorized Signatory
                    </div>
                  </div>
      </div>
       <div className="invoice-button-area">
<button className="pdfButton" onClick={downloadPDF}>
Download PDF
</button>
</div>
    </div>
  );
}

export default GovernmentFeeInvoice;
