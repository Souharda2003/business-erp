import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { getRODTEPById } from "../services/rodtep";
import { getCompany } from "../services/company";
import html2pdf from "html2pdf.js";

import { useReactToPrint } from "react-to-print";
import BackButton from "../components/BackButton";
import { amountInWords } from "../utils/amountInWords";

import "../css/rodtepinvoice.css";
import "../css/invoice.css";
function RODTEPInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [rodtep, setRodtep] = useState({});

  const [company, setCompany] = useState({});

useEffect(() => {
  if (id) {
    loadData();
  }
}, [id]);
  const loadData = async () => {
    try {
      const rodtepRes = await getRODTEPById(id);

      const companyRes = await getCompany();

      setRodtep(rodtepRes.data);

      setCompany(companyRes.data);
    } catch (err) {
      console.log(err);

      alert("Unable To Load Invoice");
    }
  };
const baseAmount =
  (Number(rodtep.total_credit || 0) *
    Number(rodtep.rate || 0)) /
  100;

const gstAmount =
  (baseAmount *
    Number(rodtep.add_gst_rate || 0)) /
  100;

const tcsAmount =
  (baseAmount *
    Number(rodtep.tcs_rate || 0)) /
  100;
  const totalAmount = Number(rodtep.amount || 0);
const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handlePrint = useReactToPrint({
  content: () => invoiceRef.current,
});
const downloadPDF = () => {

  const element = invoiceRef.current;

  const opt = {

    margin: 5,

    filename: `RODTEP-${rodtep.bill_no}.pdf`,

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

  };

  html2pdf().set(opt).from(element).save();

};
  return (
    <div className="rodtep-page">
<div className="rodtep-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
RODTEP Invoice
</h1>

<p className="page-subtitle">
View & Download RODTEP Invoice
</p>

</div></div>
      <div className="rodtep-invoice" ref={invoiceRef}>

        <div className="invoice-header">

          <div className="invoice-title">BILL OF SUPPLY</div>

          <div className="invoice-copy">Original / Duplicate</div>
        </div>
        <div className="bill-row">
          <div>
            <b>Bill No :</b> {rodtep.bill_no}
          </div>

          <div>
            <b>Date :</b>{" "}
            {rodtep.date_of_issue
              ? new Date(rodtep.date_of_issue).toLocaleDateString("en-GB")
              : ""}
          </div>
        </div>
        <div className="party-section">
          <div className="party-left">
            <h3>TO,</h3>

            <p>
              <b>{company.company_name}</b>
            </p>

            <p>{company.address}</p>

            <p>
              {company.city}, {company.state} - {company.pincode}
            </p>

            <p>
              <b>PAN NO :</b> {company.pan_number}
            </p>

            <p>
              <b>GST NO :</b> {company.gst_number}
            </p>
          </div>
  <br/>  <br/>
          <div className="party-right">
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Licence No</b>
                  </td>

                  <td>{rodtep.licence_no}</td>
                </tr>

                <tr>
                  <td>
                    <b>Financial Year</b>
                  </td>

                  <td>{rodtep.financial_year}</td>
                </tr>

                <tr>
                  <td>
                    <b>HSN</b>
                  </td>

                  <td>{rodtep.hsn}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <table className="rodtep-table">
          <thead>
            <tr>
              <th>SL NO.</th>

              <th>Licence / Authorisation No.</th>

              <th>Date Of Issue</th>

              <th>Total Credit / CIF Value</th>

              <th>HSN</th>

              <th>Rate</th>

              <th>Amount (Rs.)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>

              <td>{rodtep.licence_no}</td>

              <td>
                {rodtep.date_of_issue
                  ? new Date(rodtep.date_of_issue).toLocaleDateString("en-GB")
                  : ""}
              </td>

              <td>
                {Number(rodtep.total_credit || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td>{rodtep.hsn}</td>

              <td>{Number(rodtep.rate || 0).toFixed(2)}%</td>

              <td>
                ₹
                {Number(rodtep.amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
          <br/>  <br/>
        <table className="rodtep-total-table">
          <tbody>
            <tr>
              <td>
                <b>TOTAL CREDIT</b>
              </td>

              <td>
                {Number(rodtep.total_credit || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td></td>

              <td></td>

              <td>
                <b>TOTAL</b>
              </td>

              <td>
                ₹
                {Number(rodtep.amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>

            <tr>
              <td colSpan="2"></td>

              <td>
                <b>ADD GST</b>
              </td>

              <td>{Number(rodtep.add_gst_rate || 0).toFixed(2)}%</td>

              <td></td>

              <td>
                {Number(
                  (Number(rodtep.total_credit || 0) *
                    Number(rodtep.add_gst_rate || 0)) /
                    100,
                ).toFixed(2)}
              </td>
            </tr>

            <tr>
              <td colSpan="2"></td>

              <td>
                <b>TCS</b>
              </td>

              <td>{Number(rodtep.tcs_rate || 0).toFixed(2)}%</td>

              <td></td>

              <td>
                {Number(
                  (Number(rodtep.total_credit || 0) *
                    Number(rodtep.tcs_rate || 0)) /
                    100,
                ).toFixed(2)}
              </td>
            </tr>

            <tr>
              <td colSpan="2"></td>

              <td>
                <b>ROUND OFF</b>
              </td>

              <td></td>

              <td></td>

              <td>{Number(rodtep.round_off || 0).toFixed(2)}</td>
            </tr>

            <tr className="grand-total">
              <td colSpan="4"></td>

              <td>
                <b>TOTAL</b>
              </td>

              <td>
               ₹{formatAmount(rodtep.amount)}
              </td>
            </tr>
          </tbody>
        </table>
  <br/>  <br/>
        <div className="amount-word-box">
          <b>We have Debited your account with Rupees :</b> 
          {amountInWords(totalAmount)} Only
        </div>
        <br/>  <br/>
        <div className="description-box">
          Being the amount of consideration due towards arranging
transfer of RODTEP Licence / Authorisation in favour of
the purchaser as per prevailing Foreign Trade Policy and
applicable Government guidelines.
        </div>
  <br/>  <br/>  <br/>  <br/>
        <div className="rodtep-footer">
          <div className="footer-left">
            <table className="footer-table">
              <tbody>
                <tr>
                  <td>
                    <b>NAME</b>
                  </td>

                  <td>:</td>

                  <td>{company.company_name}</td>
                </tr>

                <tr>
                  <td>
                    <b>GSTIN</b>
                  </td>

                  <td>:</td>

                  <td>{company.gst_number}</td>
                </tr>

                <tr>
                  <td>
                    <b>BANK</b>
                  </td>

                  <td>:</td>

                  <td>{company.bank_name}</td>
                </tr>

                <tr>
                  <td>
                    <b>A/C NO</b>
                  </td>

                  <td>:</td>

                  <td>{company.bank_account_no}</td>
                </tr>

                <tr>
                  <td>
                    <b>IFSC</b>
                  </td>

                  <td>:</td>

                  <td>{company.ifsc_code}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer-right">
            <div className="eoe">E. & O. E.</div>
            <div className="signature-space">
              <p>For</p>

              <h3>{company.company_name}</h3>

              <br />

              <br />

              <br />

              <p>Authorised Signatory</p>
            </div>
          </div>
        </div>
        <div className="declaration-box">
          <p>
            <b>Declaration :</b>
          </p>

          <p>
            We hereby certify that the above particulars are true and correct
            and the amount mentioned herein represents the actual value of
            Licence / Authorisation transfer arranged by us under the prevailing
            Foreign Trade Policy.
          </p>
        </div>
       <div className="invoice-note">
              <div>Computer Generated RODTEP Invoice</div>

              <div>Generated : {new Date().toLocaleString()}</div>
            </div>

            <div className="footer">
              <div>Receiver Signature</div>

              <div>Authorised Signatory</div>
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

export default RODTEPInvoice;
