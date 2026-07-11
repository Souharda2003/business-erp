import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";

import { getIncomeTaxFeeById } from "../../services/accounting";

import { getCompany} from "../../services/company";

import "../../css/incomeTaxFeeInvoice.css";

function IncomeTaxFeeInvoice() {
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
      const res = await getIncomeTaxFeeById(id);

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
    const options = {
      margin: 5,

      filename: `IncomeTaxFeeInvoice_${invoice.id}.pdf`,

      image: {
        type: "jpeg",

        quality: 1,
      },

      html2canvas:{

scale:1.5,

useCORS:true,

letterRendering:true,

scrollX:0,

scrollY:0,

windowWidth:1200,

},

jsPDF:{

unit:"mm",

format:"a4",

orientation:"portrait",

compress:true,

},

pagebreak:{

mode:["css","legacy"],

avoid:[
".invoice-card",
".summary-box",
".words-box",
".payment-box",
".declaration-box",
".signature-section"
]

},
    };

    html2pdf()
      .set(options)

      .from(pdfRef.current)

      .save();
  };

  // -------- Amount In Words --------

  const numberToWords = (num) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    });

    return `${formatter.format(Number(num || 0))} Rupees Only`;
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
  if (loading) {
    return (
      <div className="page">
        <h2>Loading Income Tax Fee Invoice...</h2>
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

        <h1 style={{ margin: 0 }}>Income Tax Fee Invoice</h1>

      </div>

      <div className="income-tax-invoice" ref={pdfRef}>
        <div className="invoice-header">
          <div className="company-left">
            <h1>{company.company_name}</h1>

            <h3>INCOME TAX FEE INVOICE</h3>

            <p>
              <b>GSTIN :</b> {company.gstin}
            </p>

            <p>
              <b>IEC :</b> {company.iec_code}
            </p>

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

          <div className="invoice-right">
            <div className="original-copy">Original Copy</div>

            <br />

            <p>
              <b>Invoice No :</b>
              ITFEE-{invoice.id}
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

              <span className="paid">PAID</span>
            </p>
          </div>
        </div>

        <hr />

        <div className="invoice-grid">
          <div className="invoice-card">
            <h3>Applicant Details</h3>

            <hr />

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

          <div className="invoice-card">
            <h3>Invoice Summary</h3>

            <hr />

            <p>
              <b>Invoice :</b>
              ITFEE-{invoice.id}
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
              Income Tax Fee
            </p>
          </div>
        </div>
<div className="payment-box">
          <h2>Payment Details</h2>

          <table className="payment-table">
            <tbody>
              <tr>
                <th>Payment For</th>

                <td>Income Tax Fee</td>
              </tr>

              <tr>
                <th>Applicant</th>

                <td>{invoice.applicant_name}</td>
              </tr>

              <tr>
                <th>Financial Year</th>

                <td>{invoice.financial_year}</td>
              </tr>

              <tr>
                <th>Total Amount</th>

                <td>
                  ₹
                  {Number(invoice.amount || 0).toLocaleString(
                    "en-IN",

                    {
                      minimumFractionDigits: 2,

                      maximumFractionDigits: 2,
                    },
                  )}
                </td>
              </tr>

              <tr>
                <th>Status</th>

                <td className="paid-status">PAID</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="summary-card">
          <h2>Amount Summary</h2>

          <hr />

          <div className="summary-row">
            <span>Income Tax Fee Amount</span>

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

<div className="total-box">
          <h2>Total Income Tax Fee</h2>

          <h1>
            ₹
            {Number(invoice.amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>

        <div className="words-box">
          <h3>Amount In Words</h3>

          <hr />

          <p>{amountInWords(Number(invoice.amount || 0).toFixed(2))}</p>
        </div>

        <div className="declaration-box">
          <h3>Declaration</h3>
          <p>
            The above amount has been received towards Income Tax related
            professional services.
          </p>
        </div>

        <div className="signature-section">
          <div className="signature-card">
            <div className="signature-line"></div>

            <p>Prepared By</p>
          </div>
          <div className="signature-card">
            <div className="signature-line"></div>

            <p>Authorized Signatory</p>
          </div>
        </div>
          <strong>***** Computer Generated Document *****</strong>

      </div>
        <button
          className="download-btn"
          onClick={downloadPDF}
          style={{
            marginLeft: "auto",
          }}
        >
          Download PDF
        </button>
    </div>
  );
}

export default IncomeTaxFeeInvoice;
