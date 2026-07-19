import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";

import { getTaxAuditFeeById } from "../../services/accounting";
import { getCompany } from "../../services/company";

import "../../css/taxAuditFeeInvoice.css";

function TaxAuditFeeInvoice() {

  const { id } = useParams();

  const pdfRef = useRef();

  const [company, setCompany] = useState({});

  const [fee, setFee] = useState({

    date: "",

    name: "",

    amount: "",

    financial_year: ""

  });

  useEffect(() => {

    loadData();

  }, [id]);

  const loadData = async () => {

    try {

      const companyRes = await getCompany();

      setCompany(companyRes.data);

      const feeRes = await getTaxAuditFeeById(id);

      setFee({

        date: feeRes.data.date || "",

        name: feeRes.data.name || "",

        amount: feeRes.data.amount || "",

        financial_year: feeRes.data.financial_year || ""

      });

    } catch (err) {

      console.log(err);

    }

  };

  const numberToWords = (num) => {

    const formatter = new Intl.NumberFormat("en-IN", {

      style: "currency",

      currency: "INR"

    });

    return formatter.format(Number(num || 0));

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

    return convert(Math.round(num)) + " Rupees" + " Only";
  };
  const downloadPDF = () => {

    const opt = {

      margin: 5,

      filename: `TaxAuditFee_${fee.name}.pdf`,

      image: {

        type: "jpeg",

        quality: 1

      },

      html2canvas: {

        scale: 2,

        useCORS: true

      },

      jsPDF: {

        unit: "mm",

        format: "a4",

        orientation: "portrait"

      }

    };

    html2pdf()

      .set(opt)

      .from(pdfRef.current)

      .save();

  };

  return (
   <div className="invoice-page">
  <div className="invoice-page-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
Tax Audit Fee Invoice
</h1>

<p className="page-subtitle">
View & Download Tax Audit Fee Invoice
</p>

</div>
 </div>
      <div

        className="taxaudit-invoice"

        ref={pdfRef}

      >

        <div className="invoice-header">

          <h1>

            {company.company_name}

          </h1>

          <h2>

            TAX AUDIT FEE RECEIPT

          </h2>

          <hr />

        </div>

        <div className="company-section">

          <div>

            <h3>Company Details</h3>

            <p>

              <b>Address :</b>

              {company.address}

            </p>
            <p>

              <b>Email :</b>

              {company.email}

            </p>

            <p>

              <b>Phone :</b>

              {company.phone}

            </p>

          </div>

          <div>

            <h3>Receipt Details</h3>

            <p>

              <b>Date :</b>

              {fee.date

                ? new Date(fee.date).toLocaleDateString("en-GB")

                : ""}

            </p>

            <p>

              <b>Financial Year :</b>

              {fee.financial_year}

            </p>

          </div>

        </div>

        <br />

         <div className="payment-box">

          <h2>Payment Details</h2>

          <hr />

          <table className="payment-table">

            <tbody>

              <tr>

                <td>

                  <b>Client Name</b>

                </td>

                <td>{fee.name}</td>

              </tr>

              <tr>

                <td>

                  <b>Service</b>

                </td>

                <td>Tax Audit Fee</td>

              </tr>

              <tr>

                <td>

                  <b>Date</b>

                </td>

                <td>

                  {fee.date

                    ? new Date(

                        fee.date

                      ).toLocaleDateString("en-GB")

                    : ""}

                </td>

              </tr>

              <tr>

                <td>

                  <b>Financial Year</b>

                </td>

                <td>

                  {fee.financial_year}

                </td>

              </tr>

              <tr>

                <td>

                  <b>Amount Paid</b>

                </td>

                <td>

                  ₹

                  {Number(

                    fee.amount || 0

                  ).toFixed(2)}

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
            <span>Tax Audit Fee Amount</span>

            <span> ₹
            {Number(fee.amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</span>
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

            <span> ₹
            {Number(fee.amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</span>
          </div>
        </div>
<br/><br/>
<div className="total-box">
          <h2>Total Tax Audit Fee</h2>

          <h1>
            ₹
            {Number(fee.amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>

        <div className="words-box">
          <h3>Amount In Words</h3>

          <hr />

          <p>{amountInWords(Number(fee.amount || 0).toFixed(2))}</p>
        </div>
        <br />
        <div className="declaration-box">

          <h2>Declaration</h2>

          <hr />

          <p>

            This receipt certifies that the Tax Audit Fee has

            been received for the above-mentioned financial

            year and is generated electronically by the system.

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
        <br />

        <div className="invoice-footer">
          <p>

            Computer Generated Tax Audit Fee Invoice

          </p>

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

export default TaxAuditFeeInvoice;