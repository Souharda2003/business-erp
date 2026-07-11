import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseById } from "../services/purchase";
import { getCompany } from "../services/company";
import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";
import BackButton from "../components/BackButton";
import { amountInWords } from "../utils/amountInWords";
import "../css/purchaseinvoice.css";
import "../css/invoice.css";
function PurchaseInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [purchase, setPurchase] = useState({});


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

  // const loadData = async () => {
  //   try {
  //     const purchaseRes = await getPurchaseById(id);

  //     const companyRes = await getCompany();

  //     setPurchase(purchaseRes.data);

  //     setCompany(companyRes.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const handlePrint = useReactToPrint({
  //   content: () => invoiceRef.current,
  // });
const loadData = async () => {
  try {
    const purchaseRes = await getPurchaseById(id);
    const companyRes = await getCompany();

    console.log("purchase =", purchaseRes.data);
    console.log("company =", companyRes.data);

    setPurchase(purchaseRes.data);

    if (companyRes.data) {
      setCompany(companyRes.data);
    }
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

        filename: `Purchase_Invoice_${purchase.invoice_no}.pdf`,

        html2canvas: { scale: 2 },

        jsPDF: {
          unit: "mm",

          format: "a4",

          orientation: "portrait",
        },
      })

      .save();
  };
  const taxableAmount = Number(purchase.taxable_amount || 0);

  const cgst = Number(purchase.cgst_amount || 0);

  const sgst = Number(purchase.sgst_amount || 0);

  const totalGST = Number(purchase.total_gst || 0);

  const roundOff = Number(purchase.round_off || 0);

  const grandTotal = Number(purchase.total_amount || 0);
  return (
    <div className="invoice-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <BackButton />

        <h1 style={{ margin: 0 }}> PURCHASE Invoice</h1>
      </div>
      <div className="invoice-action">

      </div>

      <div className="invoice" ref={invoiceRef}>
        <div className="invoice-top">
          <div>
            <h2>PURCHASE INVOICE</h2>
          </div>
        </div>

        <div className="company-details">
          <h2>{company.company_name ||""}</h2>

          <p>{company.address||""}</p>

          <p>
            {company.city||""},{company.state||""}-{company.pincode||""}
          </p>

          <p>Phone :{company.phone||""}</p>

          <p>Email :{company.email||""}</p>

          <p>GST :{company.gst_number||""}</p>

          <p>PAN :{company.pan_number||""}</p>
        </div>

        <table className="invoice-info">
          <tbody>
            <tr>
              <td>Invoice No</td>

              <td>{purchase.invoice_no}</td>
            </tr>

            <tr>
              <td>Purchase Date</td>

              <td>
                {purchase.purchase_date
                  ? new Date(purchase.purchase_date).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>

            <tr>
              <td>Supplier</td>

              <td>{purchase.supplier}</td>
            </tr>
          </tbody>
        </table>

        <table className="product-table">
          <thead>
            <tr>
              <th>Sl</th>

              <th>Description</th>

              <th>Qty</th>

              <th>Unit</th>

              <th>Rate</th>

              <th>Taxable</th>

              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>

              <td>{purchase.product_name}</td>

              <td>{purchase.quantity}</td>

              <td>{purchase.unit}</td>

              <td>₹{Number(purchase.unit_price || 0).toFixed(2)}</td>

              <td>₹{taxableAmount.toFixed(2)}</td>

              <td>₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <table className="gst-summary">
          <tbody>
            <tr>
              <td>Taxable Amount</td>

              <td>₹{taxableAmount.toFixed(2)}</td>
            </tr>

            <tr>
              <td>CGST</td>

              <td>₹{cgst.toFixed(2)}</td>
            </tr>

            <tr>
              <td>SGST</td>

              <td>₹{sgst.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Total GST</td>

              <td>₹{totalGST.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Round Off</td>

              <td>₹{roundOff.toFixed(2)}</td>
            </tr>

            <tr>
              <th>Grand Total</th>

              <th>₹{grandTotal.toFixed(2)}</th>
            </tr>
          </tbody>
        </table>

        <div className="amount-word">
          <b>Amount In Words</b>

          <br />

          {amountInWords(grandTotal)}
        </div>

        <div className="footer-area">
          <div>
            <b>Declaration</b>

            <p>
              We declare that this invoice shows the actual price of goods
              described herein.
            </p>
          </div>

          <div className="signature">Authorised Signatory</div>
        </div>

        <div className="invoice-footer">
          <div>Computer Generated Purchase Invoice</div>

          <div>Generated :{new Date().toLocaleString()}</div>
        </div>
      </div>
        <button className="pdfButton" onClick={downloadPDF}>
          Download PDF
        </button>
    </div>
  );
}

export default PurchaseInvoice;
