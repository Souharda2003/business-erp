import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import BackButton from "../../components/BackButton";

import { getImporterBillingById } from "../../services/importerBilling";

import "../../css/importerBillingInvoice.css";

import letterHead from "../../assets/importer-letterhead.jpeg";

function ImporterBillingInvoice() {
  const { id } = useParams();

  const invoiceRef = useRef();

  const [billing, setBilling] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const res = await getImporterBillingById(id);

      setBilling(res.data);
    } catch (err) {
      console.log(err);
    }
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

    return convert(Math.round(num)) + " Only";
  };

  const downloadPDF = () => {
    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 0,
        filename: "Importer-Billing-" + billing.invoice_no + ".pdf",
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

  if (!billing) {
    return <h2>Loading...</h2>;
  }

  const items = billing.items || [];

  const pageSize = 18;

  const pages = [];

  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }

  if (pages.length === 0) {
    pages.push([]);
  }

  return (
    <div className="page">
      <BackButton />

      <br />

      <div ref={invoiceRef}>
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="invoice-sheet">
            <img
              src={letterHead}
              alt="Letter Head"
              className="invoice-letterhead"
            />

            <div className="invoice-overlay">
  

                <div className="invoice-right">
                  <p>
                    Date:
                     {billing.entry_date
                      ? new Date(billing.entry_date).toLocaleDateString("en-GB")
                      : ""}
                  </p>
                  </div>


              <table className="invoice-info">
                <tbody>
                  <tr>
                    <td>
                      <b>Invoice No</b>
                    </td>

                    <td>{billing.invoice_no}</td>

                    <td>
                      <b>LC No</b>
                    </td>

                    <td>{billing.lc_no}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>LC Payment</b>
                    </td>

                    <td>
                      ₹
                      {Number(billing.lc_payment || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="invoice-item-table">
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "60px",
                      }}
                    >
                      Sl
                    </th>

                    <th>Quantity</th>

                    <th>Unit</th>

                    <th>Bag</th>

                    <th>Rate</th>

                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.length > 0 ? (
                    pageItems.map((item, index) => (
                      <tr key={index}>
                        <td>{pageIndex * pageSize + index + 1}</td>

                        <td>{Number(item.quantity || 0).toFixed(2)}</td>

                        <td>{item.unit}</td>

                        <td>{Number(item.bag || 0).toFixed(2)}</td>

                        <td>
                          ₹
                          {Number(item.price || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td>
                          ₹
                          {Number(item.amount || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          color: "red",
                          height: "40px",
                        }}
                      >
                        No Item Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pageIndex !== pages.length - 1 && (
                <div className="page-break"></div>
              )}
              {pageIndex === pages.length - 1 && (
                <>
                  <div className="invoice-total-section">
                    <table className="invoice-total-table">
                      <tbody>
                        <tr>
                          <td>
                            <b>Total Item Amount</b>
                          </td>

                          <td>
                            ₹
                            {Number(billing.item_total || 0).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>LC Payment</b>
                          </td>

                          <td>
                            ₹
                            {Number(billing.lc_payment || 0).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>Extra Charge</b>
                          </td>

                          <td>
                            ₹
                            {Number(billing.extra_charge || 0).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>

                        <tr className="grand-total-row">
                          <td>
                            <b>Grand Total</b>
                          </td>

                          <td>
                            ₹
                            {Number(billing.grand_total || 0).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="amount-word-box">
                    <b>Amount In Words :</b>

                    <br />

                    {amountInWords(Number(billing.grand_total || 0))}
                  </div>

                  <div className="terms-box">
                    <h4>Terms & Conditions</h4>

                    <ul>
                      <li>This is a Computer Generated Invoice.</li>

                      <li>Subject to Habra Jurisdiction.</li>

                      <li>Please verify quantity and amount before payment.</li>
                    </ul>
                  </div>

                  <div className="signature-wrapper">
                    <div>
                      _______________________
                      <br />
                      Prepared By
                    </div>

                    <div>
                      _______________________
                      <br />
                      Checked By
                    </div>

                    <div>
                      _______________________
                      <br />
                      Authorized Signatory
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "25px",
          marginBottom: "40px",
        }}
      >
        <button className="download-pdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ImporterBillingInvoice;
