import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import html2pdf from "html2pdf.js";

import BackButton from "../components/BackButton";
import { getPaymentById } from "../services/payment";
import { getCompany } from "../services/company";
import "../css/paymentInvoice.css";

function PaymentInvoice() {
  const { id } = useParams();

  const pdfRef = useRef();

  const [payment, setPayment] = useState(null);
const [company, setCompany] = useState({
    company_name: "",

    company_address: "",

    phone: "",

    email: "",

    gst_no: "",

    pan_no: "",

    account_name: "",

    bank_name: "",

    account_number: "",

    ifsc_code: "",

    branch_name: "",
  });
  useEffect(() => {
    loadPayment();
    loadCompanyProfile();
  }, [id]);

  const loadPayment = async () => {
    try {
      const res = await getPaymentById(id);

      setPayment(res.data);
    } catch (err) {
      console.log(err);

      alert("Unable To Load Payment Invoice");
    }
  };
const loadCompanyProfile = async () => {
  try {
    const res = await getCompany();

    setCompany(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const amountInWords = (num) => {
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
      if (n < 20) {
        return ones[n];
      }

      if (n < 100) {
        return tens[Math.floor(n / 10)] + " " + ones[n % 10];
      }

      if (n < 1000) {
        return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
      }

      if (n < 100000) {
        return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
      }

      if (n < 10000000) {
        return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
      }

      return (
        convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000)
      );
    };

    return convert(Math.round(Number(num))) + " Only";
  };

  const downloadPDF = () => {
    const option = {
      margin: 5,

      filename: `Payment_Receipt_${payment.invoice_no}.pdf`,

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

  if (!payment) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="page">
 <div className="invoice-page-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
Payment Invoice
</h1>

<p className="page-subtitle">
View & Download Payment Invoice
</p>
</div></div>
      <div className="payment-invoice" ref={pdfRef}>
        <div className="invoice-header">
          <h1>UTSAV INTERNATIONAL</h1>

          <h2>PAYMENT RECEIPT</h2>

          <hr />
        </div>

        <div className="invoice-top">
          <div>
            <p>
              <b>Invoice No :</b> {payment.invoice_no}
            </p>

            <p>
              <b>Invoice Date :</b>{" "}
              {payment.invoice_date
                ? new Date(payment.invoice_date).toLocaleDateString("en-GB")
                : ""}
            </p>
          </div>

          <div>
            <p>
              <b>Payment Date :</b>{" "}
              {payment.payment_date
                ? new Date(payment.payment_date).toLocaleDateString("en-GB")
                : ""}
            </p>

            <p>
              <b>Customer :</b> {payment.customer_name}
            </p>
          </div>
        </div>

        <br />
        <table className="payment-details-table">
          <tbody>
            <tr>
              <td>
                <b>Customer Name</b>
              </td>

              <td>{payment.customer_name || "-"}</td>
            </tr>

            <tr>
              <td>
                <b>Payment Type</b>
              </td>

              <td>{payment.payment_type || "-"}</td>
            </tr>

            <tr>
              <td>
                <b>Bank Name</b>
              </td>

              <td>{company.bank_name || "-"}</td>
            </tr>
            <tr>
              <td>
                <b>Currency</b>
              </td>

              <td>{payment.currency || "INR"}</td>
            </tr>

            <tr>
              <td>
                <b>Amount</b>
              </td>

              <td
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                ₹
                {Number(payment.amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td>
                <b>Remarks</b>
              </td>

              <td>{payment.remarks || "-"}</td>
            </tr>
          </tbody>
        </table>

        <br />
        <div className="payment-total-box">
          <div>
            <h3>Total Received Amount</h3>
          </div>

          <div>
            <h1
              style={{
                color: "#16a34a",
              }}
            >
              ₹
              {Number(payment.amount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>
        </div>
        <br/>
        <div className="amount-word-box">
          <h3>Amount In Words</h3>

          <hr />

          <p>{amountInWords(Number(payment.amount || 0))}</p>
        </div>

        <br />

        <div className="payment-status-card">
          <h2>Payment Status</h2>

          <hr />

          <h3
            style={{
              color: "#16a34a",
            }}
          >
            PAYMENT RECEIVED SUCCESSFULLY
          </h3>

          <p>
            This receipt confirms that the payment has been received against the
            above Invoice.
          </p>
        </div>

        <br />

        <div className="payment-summary">
          <div className="summary-card">
            <h3>Invoice No</h3>

            <p>{payment.invoice_no}</p>
          </div>

          <div className="summary-card">
            <h3>Payment Type</h3>

            <p>{payment.payment_type}</p>
          </div>

          <div className="summary-card">
            <h3>Amount</h3>

            <p
              style={{
                color: "#16a34a",
                fontWeight: "bold",
              }}
            >
              ₹
              {Number(payment.amount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <br />
        <div className="payment-terms">
          <h3>Terms & Conditions</h3>

          <hr />

          <ul>
            <li>
              This receipt confirms that the payment has been received
              successfully.
            </li>

            <li>Please keep this receipt for future reference.</li>

            <li>Subject to Habra Jurisdiction.</li>

            <li>Computer Generated Receipt. Signature is not mandatory.</li>
          </ul>
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

export default PaymentInvoice;
