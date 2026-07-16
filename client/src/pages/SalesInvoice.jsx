import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { getSalesById } from "../services/sales";
import { getCompany } from "../services/company";

import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";
import BackButton from "../components/BackButton";
import { amountInWords } from "../utils/amountInWords";
import "../css/invoice.css";
function SalesInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [sales, setSales] = useState({});

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
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const salesRes = await getSalesById(id);

      const companyRes = await getCompany();

      setSales(salesRes.data);

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

        filename: `Sales_Invoice_${sales.invoice_no}.pdf`,

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

  const total = Number(sales.total_amount || 0);

  const received = Number(sales.payment_received || 0);

  const due = Number(sales.due_amount || 0);

  return (
    <div className="invoice-page">
<div className="invoice-page-header">
        <BackButton />

        <h1 style={{ margin: 0 }}> Sales Invoice</h1>
      </div>
      <div className="invoice-action">
       
      </div>

      <div className="invoice" ref={invoiceRef}>
        <div className="invoice-top">
          <div>
            <h2>SALES INVOICE</h2>
          </div>
        </div>

        <div className="company-details">
   <h2>{company.company_name || ""}</h2>

<p>{company.address || ""}</p>

<p>
{company.city || ""}, {company.state || ""} - {company.pincode || ""}
</p>

<p>Phone : {company.phone || ""}</p>

<p>Email : {company.email || ""}</p>

<p>GST : {company.gst_number || ""}</p>

<p>PAN : {company.pan_number || ""}</p></div>

        <table className="invoice-info">
          <tbody>
            <tr>
              <td>Invoice No</td>

              <td>{sales.invoice_no}</td>
            </tr>

            <tr>
              <td>Sales Date</td>

              <td>
                {sales.sales_date
                  ? new Date(sales.sales_date).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>

            <tr>
              <td>Customer</td>

              <td>{sales.customer_name}</td>
            </tr>

            <tr>
              <td>Bank</td>

              <td>{sales.bank_name}</td>
            </tr>
          </tbody>
        </table>

        <table className="product-table">
          <thead>
            <tr>
              <th>Sl</th>

              <th>Product</th>

              <th>Quantity</th>

              <th>Unit</th>

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>

              <td>{sales.product_name}</td>

              <td>{sales.quantity}</td>

              <td>{sales.unit}</td>

              <td>
                ₹
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="gst-summary">
          <tbody>
            <tr>
              <td>Total Amount</td>

              <td>
                ₹
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td>Payment Received</td>

              <td>
                ₹
                {received.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td>Due Amount</td>

              <td>
                ₹
                {due.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

     <div className="amount-word">
<b>Amount In Words</b>
<br />
{amountInWords(total)}
</div>

        <div className="footer-area">
          <div>
            <b>Declaration</b>

            <p>
              We declare that this invoice shows the actual sale value of the
              goods described herein.
            </p>
          </div>

          <div className="signature">Authorised Signatory</div>
        </div>

        <div className="invoice-footer">
          <div>Computer Generated Sales Invoice</div>

          <div>Generated :{new Date().toLocaleString()}</div>
        </div>

        <div className="invoice-copy">ORIGINAL FOR CUSTOMER</div>
      </div>
                  <div className="invoice-button-area">
  <button
    className="pdfButton"
    onClick={downloadPDF}
  >
    Download PDF
  </button>
</div>
    </div>
  );
}

export default SalesInvoice;
