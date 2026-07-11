import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

import { useReactToPrint } from "react-to-print";
import BackButton from "../components/BackButton";
import { getCompany } from "../services/company";
import { getOtherSalesById } from "../services/otherSales";

import "../css/othersalesinvoice.css";

function OtherSalesInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [data, setData] = useState(null);
  const [company, setCompany] = useState({
    company_name: "",

    company_address: "",

    phone: "",

    email: "",

    gst_no: "",

    pan_no: "",

    bank_name: "",

    account_number: "",

    ifsc_code: "",
  });
  useEffect(() => {
    loadInvoice();
    loadCompany();
  }, [id]);
  const loadInvoice = async () => {
    try {
      const res = await getOtherSalesById(id);

      setData(res.data || {});
    } catch (err) {
      console.log(err);

      alert("Unable To Load Invoice");
    }
  };
  const loadCompany = async () => {
    try {
      const res = await getCompany();

      setCompany(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  const downloadPDF = () => {
    const element = invoiceRef.current;

    const options = {
      margin: 5,

      filename: `${data.service_type}-${data.invoice_no}.pdf`,

      image: {
        type: "jpeg",
        quality: 1,
      },

      html2canvas: {
        scale: 3,

        useCORS: true,

        scrollY: 0,

        letterRendering: true,
      },

      jsPDF: {
        unit: "mm",

        format: "a4",

        orientation: "portrait",
      },

      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    html2pdf().set(options).from(element).save();
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

  if (!data) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

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

        <h1 style={{ margin: 0 }}>Other Sales Invoice</h1>
      </div>

      <div className="invoice-container" ref={invoiceRef}>
        {data.service_type === "Document Charge" && (
          <div className="document-invoice">
            <div className="doc-header">
              <div className="doc-date">
                Date :
                {data.entry_date
                  ? new Date(data.entry_date).toLocaleDateString("en-GB")
                  : ""}
              </div>
              <h3>DOCUMENT CHARGE INVOICE</h3>
              <h2>BILL</h2>

              <h3>BILL NO :{data.bill_no || data.invoice_no}</h3>
            </div>

            <br />

            <div className="doc-to">
              <b>To,</b>

              <br />

              <br />

              <h3>{data.name}</h3>

              <p>{company.company_address}</p>

              <p>Phone : {company.phone}</p>

              <p>Email : {company.email}</p>
            </div>

            <br />

            <div className="doc-description">
              <p>
                Being the amount of Document Filing / DGFT / Other Charges as
                details follows :
              </p>
            </div>

            <br />

            <table className="doc-table">
              <tbody>
                <tr>
                  <td>1. Document Filing Charges</td>

                  <td className="right">
                    ₹
                    {Number(data.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>

                <tr>
                  <td>2. Bill No </td>

                  <td>{data.bill_no}</td>
                </tr>
              </tbody>
            </table>

            <br />

            <table className="total-table">
              <tbody>
                <tr>
                  <td>Sub Total</td>

                  <td className="right">
                    ₹
                    {Number(data.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>

                <tr>
                  <td>TDS</td>

                  <td className="right">
                    ₹
                    {Number(data.tds || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>

                <tr className="grand-total">
                  <td>TOTAL AMOUNT</td>

                  <td className="right">
                    ₹
                    {Number(data.total_amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            <br />

            <div className="amount-word">
              <b>Rupees :</b>

              {amountInWords(Number(data.total_amount || 0))}
            </div>

            <br />

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
        )}
        {data.service_type === "Clearing Charge" && (
          <div className="gst-invoice">
            <div className="gst-header">
              <div className="company-left">
                <h3>CLEARING CHARGE INVOICE</h3>
                <h2>{company.company_name}</h2>

                <p>{company.company_address}</p>

                <p>Phone : {company.phone}</p>

                <p>Email : {company.email}</p>
              </div>

              <div className="company-right">
                <table className="gst-info-table">
                  <tbody>
                    <tr>
                      <td>
                        <b>Invoice No</b>
                      </td>

                      <td>{data.invoice_no}</td>
                    </tr>

                    <tr>
                      <td>
                        <b>Date</b>
                      </td>

                      <td>
                        {data.entry_date
                          ? new Date(data.entry_date).toLocaleDateString(
                              "en-GB",
                            )
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="divider"></div>

            <div className="customer-section">
              <p>
                <b>Clearing Agent :</b> {data.name}
              </p>

              <p>
                <b>Invoice No :</b> {data.invoice_no}
              </p>

              <p>
                <b>Date :</b>

                {new Date(data.entry_date).toLocaleDateString("en-GB")}
              </p>
            </div>

            <table className="gst-table">
              <thead>
                <tr>
                  <th>Sl</th>

                  <th>Description</th>

                  <th>HSN/SAC</th>

                  <th>GST %</th>

                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>

                  <td>Clearing & Forwarding Charge</td>

                  <td>996713</td>

                  <td>
                    {Number(data.cgst_percent || 0) +
                      Number(data.sgst_percent || 0)}
                    %
                  </td>

                  <td>
                    ₹
                    {Number(data.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4">CGST</td>

                  <td>
                    ₹
                    {(
                      (Number(data.amount || 0) *
                        Number(data.cgst_percent || 0)) /
                      100
                    ).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4">SGST</td>

                  <td>
                    ₹
                    {(
                      (Number(data.amount || 0) *
                        Number(data.sgst_percent || 0)) /
                      100
                    ).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Total GST
                  </td>

                  <td>
                    ₹
                    {Number(data.total_gst || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Grand Total
                  </td>

                  <td>
                    ₹
                    {Number(data.total_amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>



            <div className="amount-word">
              <b>Amount In Words :</b>

              <br />

              {amountInWords(Number(data.total_amount || 0))}
            </div>

            <div className="bank-details">
              <h3>Company Bank Details</h3>
              <p>Bank :{company.bank_name}</p>

              <p>Account No :{company.bank_account_no}</p>

              <p>IFSC :{company.ifsc_code}</p>
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
        )}
        {data.service_type === "Transport Charge" && (
          <div className="transport-invoice">
            <div className="transport-header">
              <div>
                <h3>TRANSPORT CHARGE INVOICE</h3>
                <h2>{company.company_name}</h2>

                <p>{company.company_address}</p>

                <p>Phone : {company.phone}</p>
                <p>
                  Invoice No :<b> {data.invoice_no}</b>
                </p>
              </div>

              <div>
                <p>
                  Date :
                  {data.entry_date
                    ? new Date(data.entry_date).toLocaleDateString("en-GB")
                    : ""}
                </p>
              </div>
            </div>

            <hr />

            <div className="transport-body">
              <table className="transport-table">
                <tbody>
                  <tr>
                    <td>
                      <b>Customer Name</b>
                    </td>

                    <td>{data.name}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Vehicle Number</b>
                    </td>

                    <td>{data.vehicle_number}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Challan Number</b>
                    </td>

                    <td>{data.challan_no}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>From Location</b>
                    </td>

                    <td>{data.from_location}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>To Location</b>
                    </td>

                    <td>{data.to_location}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Transport Charge</b>
                    </td>

                    <td>
                      ₹
                      {Number(data.amount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br />

            <div className="transport-total">
              <h2>
                Grand Total : ₹
                {Number(data.total_amount || data.amount || 0).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </h2>
            </div>

            <br />

            <div className="amount-word">
              <b>Amount In Words :</b>

              {amountInWords(Number(data.total_amount || data.amount || 0))}
            </div>

            <br />
            <div className="invoice-footer">
              <div>Computer Generated Other Sales Document</div>

              <div>Generated : {new Date().toLocaleString()}</div>
            </div>

            <div className="invoice-copy">ORIGINAL COPY</div>

            <div className="footer">
              <div>Receiver Signature</div>

              <div>Authorised Signatory</div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <button className="download-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default OtherSalesInvoice;
