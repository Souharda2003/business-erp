import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { getLCById } from "../services/lc";
import { getCompany } from "../services/company";

import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";

import BackButton from "../components/BackButton";
import "../css/lcinvoice.css";


function LCInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [lc, setLC] = useState({});

  const [company, setCompany] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const lcRes = await getLCById(id);

      const companyRes = await getCompany();

      setLC(lcRes.data);

      setCompany(companyRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const downloadPDF = () => {
    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 5,

        filename: `LC_Invoice${lc.lc_number}.pdf`,

        html2canvas: {
          scale: 2,
        },

        jsPDF: {
          unit: "mm",

          format: "a4",

          orientation: "portrait",
        },
      })

      .save();
  };

  return (
    <div className="invoice-page">
  <div className="invoice-page-header">
        <BackButton />
        <h1 style={{ margin: 0 }}> LC Invoice</h1>
      </div>
      <div className="invoice-action">

      </div>

      <div className="invoice" ref={invoiceRef}>
        <div className="invoice-top">
          <div>
            <h2>LETTER OF CREDIT</h2>

            <h4>Original Copy</h4>
          </div>
        </div>

        <div className="company-details">
          <h2>{company.company_name}</h2>

          <p>{company.address}</p>

          <p>
            {company.city}, {company.state} - {company.pincode}
          </p>

          <p>Phone : {company.phone}</p>

          <p>Email : {company.email}</p>

          <p>GST : {company.gst_number}</p>

          <p>PAN : {company.pan_number}</p>
        </div>

        <table className="invoice-info">
          <tbody>
            <tr>
              <td>LC Number</td>

              <td>{lc.lc_number}</td>
            </tr>

            <tr>
              <td>Invoice No</td>

              <td>{lc.invoice_no}</td>
            </tr>

            <tr>
              <td>Issue Date</td>

              <td>
                {lc.issue_date
                  ? new Date(lc.issue_date).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>

            <tr>
              <td>Expiry Date</td>

              <td>
                {lc.expiry_date
                  ? new Date(lc.expiry_date).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>

            <tr>
              <td>Status</td>

              <td>{lc.status}</td>
            </tr>
          </tbody>
        </table>

        <table className="product-table">
          <thead>
            <tr>
              <th>LC No</th>

              <th>Invoice</th>

              <th>Customer</th>

              <th>Bank</th>

              <th>Customs</th>

              <th>Amount ($)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{lc.lc_number}</td>

              <td>{lc.invoice_no}</td>

              <td>{lc.customer_name}</td>

              <td>{lc.bank_name}</td>

              <td>{lc.customs_location}</td>

              <td>
                $
                {Number(lc.dollar_amount || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="gst-summary">
          <tbody>
            <tr>
              <td>LC Amount</td>

              <td>
                $
                {Number(lc.dollar_amount || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td>Status</td>

              <td>{lc.status}</td>
            </tr>
          </tbody>
        </table>

        <div className="amount-word">
          <b>LC Details</b>
          <br />
          Letter Of Credit issued by {lc.bank_name} for {lc.customer_name}.
        </div>

        <div className="footer-area">
          <div>
            <b>Declaration</b>

            <p>
              We hereby declare that the above Letter of Credit details are true
              and generated from Trade ERP System.
            </p>
          </div>

          <div className="signature">Authorised Signatory</div>
        </div>

        <div className="invoice-footer">
          <div>Computer Generated LC Document</div>

          <div>Generated : {new Date().toLocaleString()}</div>
        </div>

        <div className="invoice-copy">ORIGINAL COPY</div>

        <div className="footer">
          <div>Receiver Signature</div>

          <div>Authorised Signatory</div>
        </div>
      </div>
            <div className="invoice-button-area">
<button className="pdfButton">
Download PDF
</button>
</div>
    </div>
  );
}

export default LCInvoice;
