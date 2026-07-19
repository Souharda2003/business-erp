import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";

import { getDrawbackById } from "../services/drawback";
import { getCompany } from "../services/company";
import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";
import BackButton from "../components/BackButton";
import "../css/drawbackinvoice.css";

function DrawbackInvoice() {
  const { id } = useParams();
  const invoiceRef = useRef();

  const [drawback, setDrawback] = useState({});

  const [company, setCompany] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const drawbackRes = await getDrawbackById(id);

      const companyRes = await getCompany();

      setDrawback(drawbackRes.data);

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

        filename: `Drawback_${drawback.invoice_no}.pdf`,

        html2canvas: { scale: 2 },

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
<div className="rodtep-heading">

<h1 className="page-title">
Drawback Invoice
</h1>

<p className="page-subtitle">
View & Download Drawback Invoice
</p>

</div>
</div>
      <div className="invoice-action">

      </div>
      <div className="invoice" ref={invoiceRef}>

        <div className="custom-header">

          <div className="header-center">
            <h1>INDIAN CUSTOMS EDI SYSTEM</h1>

            <h3>CENTRAL BOARD OF INDIRECT TAXES AND CUSTOMS</h3>

            <h4>DEPARTMENT OF REVENUE</h4>

            <p>GOVERNMENT OF INDIA</p>
          </div>

          <div className="header-right">
            <table>
              <tbody>
                <tr>
                  <td>Port Code</td>

                  <td>{drawback.customs_location}</td>
                </tr>

                <tr>
                  <td>SB No</td>

                  <td>{drawback.shipping_bill}</td>
                </tr>

                <tr>
                  <td>SB Date</td>

                  <td>
                    {drawback.shipping_bill_date
                      ? new Date(
                          drawback.shipping_bill_date,
                        ).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                </tr>

                <tr>
                  <td>GST</td>

                  <td>{company.gst_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="station-name">
          LAND CUSTOMS STATION -{drawback.customs_location}
        </div>

        <div className="invoice-title"> EXPORT DRAWBACK INVOICE DETAILS</div>
      <div className="party-section">
          <div className="party-box">
            <h3>EXPORTER'S NAME & ADDRESS</h3>

          <div>
            <b>{company.company_name}</b>

            <p>{company.address}</p>

            <p>
              {company.city}, {company.state} - {company.pincode}
            </p>

            <p>Phone : {company.phone}</p>

            <p>Email : {company.email}</p>
          </div>

          <div>

            <p>PAN : {company.pan_number}</p>
          </div>

          </div>

          <div className="party-box">
            <h3>BUYER DETAILS</h3>

            <p>Invoice :{drawback.invoice_no}</p>

            <p>Product :{drawback.product_name}</p>

            <p>Customs :{drawback.customs_location}</p>
          </div>
        </div>
        <table className="item-table">
          <thead>
            <tr>
              <th>Sl</th>

              <th>HS Code</th>

              <th>Description</th>

              <th>Quantity</th>

              <th>UQC</th>

              <th>Dollar Rate</th>

              <th>Drawback %</th>

              <th>Drawback Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>

              <td>21061000</td>

              <td>{drawback.product_name}</td>

              <td>{drawback.quantity}</td>

              <td>{drawback.unit}</td>

              <td>${Number(drawback.dollar_rate || 0).toFixed(2)}</td>

              <td>{Number(drawback.drawback_rate || 0).toFixed(2)}%</td>

              <td>
                ₹
                {Number(drawback.drawback_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="value-table">
          <tbody>
            <tr>
              <td>
                <b>Invoice No</b>
              </td>

              <td>{drawback.invoice_no}</td>

              <td>
                <b>Shipping Bill</b>
              </td>

              <td>{drawback.shipping_bill}</td>
            </tr>

            <tr>
              <td>
                <b>Export Date</b>
              </td>

              <td>
                {drawback.export_date
                  ? new Date(drawback.export_date).toLocaleDateString("en-GB")
                  : ""}
              </td>

              <td>
                <b>Customs</b>
              </td>

              <td>{drawback.customs_location}</td>
            </tr>

            <tr>
              <td>
                <b>Dollar Rate</b>
              </td>

              <td>${Number(drawback.dollar_rate || 0).toFixed(2)}</td>

              <td>
                <b>Drawback Rate</b>
              </td>

              <td>{Number(drawback.drawback_rate || 0).toFixed(2)}%</td>
            </tr>

            <tr>
              <td>
                <b>Drawback Amount</b>
              </td>

              <td colSpan="3">
                ₹
                {Number(drawback.drawback_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="watermark">EXPORT COPY</div>

        <div className="declaration-section">
          <div className="declaration-left">
            <h3>Declaration</h3>

            <p>
              We hereby declare that the particulars given above are true and
              correct and the goods covered under this Shipping Bill have been
              exported from India in accordance with the Customs Act and Foreign
              Trade Policy.
            </p>
          </div>

          <div className="declaration-right">

            <div className="signature-box">
              <p>Authorised Signatory</p>
            </div>
          </div>
        </div>
        <div className="document-footer">
          <h3>Generated : {new Date().toLocaleString("en-GB")}</h3>

          
        </div>
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

export default DrawbackInvoice;
