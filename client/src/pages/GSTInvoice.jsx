import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../components/BackButton";
import { getGSTInvoiceById } from "../services/gst";

import "../css/gstInvoice.css";

function GSTInvoice() {
  const { id } = useParams();

  const pdfRef = useRef();

  const [gst, setGST] = useState({
    invoice_no: "",

    supplier: "",

    taxable_amount: "",

    cgst_amount: "",

    sgst_amount: "",

    gst_percentage: "",

    gst_amount: "",

    invoice_date: "",
  });
  useEffect(() => {
    loadGST();
  }, [id]);

  const loadGST = async () => {
    try {
      const res = await getGSTInvoiceById(id);

      setGST({
        invoice_no: res.data.invoice_no,

        taxable_amount: res.data.taxable_amount,

        gst_percentage:
          Number(res.data.cgst_percent || 0) +
          Number(res.data.sgst_percent || 0),

        gst_amount: res.data.total_gst,

        invoice_date: res.data.purchase_date,

        supplier: res.data.supplier,

        cgst_amount: res.data.cgst_amount,

        sgst_amount: res.data.sgst_amount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount =
    Number(gst.taxable_amount || 0) + Number(gst.gst_amount || 0);

  const downloadPDF = () => {
    const option = {
      margin: 5,

      filename: `GST_Invoice_${gst.invoice_no}.pdf`,

      image: {
        type: "jpeg",

        quality: 1,
      },

      html2canvas: {
        scale: 1.5,

        scrollY: 0,

        scrollX: 0,

        useCORS: true,
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

  if (!gst.invoice_no) {
    return (
      <div className="page">
        <h2>Loading GST Invoice...</h2>
      </div>
    );
  }

  return (
    <div className="page">
 <div className="invoice-page-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
GST Invoice
</h1>

<p className="page-subtitle">
View & Download GST Invoice
</p>
</div></div>
      <div className="gst-invoice" ref={pdfRef}>
        <div className="gst-header">
          <h1>UTSAV INTERNATIONAL</h1>

          <h2>GST INVOICE</h2>

          <hr />
        </div>

        <div className="gst-top">
          <div>
            <p>
              <b>Invoice No :</b> {gst.invoice_no}
            </p>

            <p>
              <b>Invoice Date :</b>{" "}
              {gst.invoice_date
                ? new Date(gst.invoice_date).toLocaleDateString("en-GB")
                : ""}
            </p>
          </div>

          <div>
            <p>
              <b>GST Percentage :</b> {gst.gst_percentage} %
            </p>

            <p>
              <b>Status :</b>
              GST Calculated
            </p>
          </div>
        </div>

        <br />
        <table className="gst-details-table">
          <tbody>
            <tr>
              <td>
                <b>Invoice No</b>
              </td>

              <td>{gst.invoice_no}</td>
            </tr>

            <tr>
              <td>
                <b>Invoice Date</b>
              </td>

              <td>
                {gst.invoice_date
                  ? new Date(gst.invoice_date).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>

            <tr>
              <td>
                <b>Taxable Amount</b>
              </td>

              <td
                style={{
                  fontWeight: "bold",
                }}
              >
                ₹
                {Number(gst.taxable_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td>Supplier</td>

              <td>{gst.supplier}</td>
            </tr>
            <tr>
              <td>
                <b>GST Amount</b>
              </td>

              <td
                style={{
                  color: "#2563eb",
                  fontWeight: "bold",
                }}
              >
                ₹
                {Number(gst.gst_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td>CGST</td>

              <td>₹{Number(gst.cgst_amount || 0).toFixed(2)}</td>
            </tr>

            <tr>
              <td>SGST</td>

              <td>₹{Number(gst.sgst_amount || 0).toFixed(2)}</td>
            </tr>

            <tr>
              <td>
                <b>GST Percentage</b>
              </td>

              <td>{Number(gst.gst_percentage || 0).toFixed(2)}%</td>
            </tr>

            <tr
              style={{
                background: "#ecfdf5",
              }}
            >
              <td>
                <b>Total Invoice Amount</b>
              </td>

              <td
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  fontSize: "22px",
                }}
              >
                ₹
                {Number(totalAmount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <br />
        <br />
        <div className="pdf-bottom">
          <div className="gst-summary-card">
            <h2>GST Summary</h2>

            <hr />

            <div className="summary-row">
              <span>Taxable Amount</span>

              <span>₹{Number(gst.taxable_amount || 0).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>GST %</span>

              <span>{Number(gst.gst_percentage || 0).toFixed(2)}%</span>
            </div>

            <div className="summary-row">
              <span>GST Amount</span>

              <span>₹{Number(gst.gst_amount || 0).toFixed(2)}</span>
            </div>

            <hr />

            <div
              className="summary-row"
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#16a34a",
              }}
            >
              <span>Total Amount</span>

              <span>₹{Number(totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
          <br />
          <div className="gst-total-box">
            <div>
              <h3>Total Invoice Amount</h3>
            </div>

            <div>
              <h1
                style={{
                  color: "#16a34a",
                }}
              >
                ₹
                {Number(totalAmount).toLocaleString(
                  "en-IN",

                  {
                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2,
                  },
                )}
              </h1>
            </div>
          </div>
          <div className="amount-word-box">
 <b>Amount In Words :</b>
<br/>
            <p>
              {amountInWords(Number(totalAmount || 0).toFixed(2))}
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

export default GSTInvoice;
