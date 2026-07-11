import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const getColumnStyle = (columns) => {
  const pageWidth = 277;

  const width = pageWidth / columns.length;

  const styles = {};

  columns.forEach((column, index) => {
    styles[index] = {
      cellWidth: width,

      halign: "center",
    };
  });

  return styles;
};
const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return (
    "₹ " +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    })
  );
};
const calculateGrandTotal = (previewData) => {
  let total = 0;

  previewData.forEach((row) => {
    const key = Object.keys(row).find(
      (item) =>
        item.toLowerCase().includes("amount") ||
        item.toLowerCase().includes("total"),
    );

    if (key) {
      total += Number(row[key]) || 0;
    }
  });

  return total;
};
const amountPriority = [
  "grand_total",

  "total_amount",

  "amount",

  "net_amount",

  "invoice_amount",

  "dollar_amount",

  "payment_received",

  "pending_amount",

  "taxable_amount",

  "gst_amount",

  "drawback_amount",

  "tds_payable",
];
const calculateQuantity = (previewData) => {
  let qty = 0;

  previewData.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key.toLowerCase().includes("quantity")) {
        qty += Number(item[key]) || 0;
      }
    });
  });

  return qty;
};

export const generateProfessionalPDF = (
  company,

  statementTitle,

  financialYear,

  previewData,

  user = "Admin",
) => {
  const columnCount =
    previewData.length > 0 ? Object.keys(previewData[0]).length : 0;

  const landscape = columnCount > 6;

  const doc = new jsPDF({
    orientation: landscape ? "landscape" : "portrait",

    unit: "mm",

    format: "a4",
  });
  const calculateAccountingSummary = (previewData) => {
    const summary = {
      governmentFee: 0,
      gstFee: 0,
      incomeTaxFee: 0,
      taxAuditFee: 0,
      tdsFee: 0,
    };

    previewData.forEach((item) => {
      const amount = Number(item.amount || 0);

      switch (item.category) {
        case "Government Fee":
          summary.governmentFee += amount;
          break;

        case "GST Fee":
          summary.gstFee += amount;
          break;

        case "Income Tax Fee":
          summary.incomeTaxFee += amount;
          break;

        case "Tax Audit Fee":
          summary.taxAuditFee += amount;
          break;

        case "TDS Fee":
          summary.tdsFee += amount;
          break;

        default:
          break;
      }
    });

    return summary;
  };
  const calculateOtherSalesSummary = (previewData) => {
    const summary = {
      documentCharge: 0,

      clearingCharge: 0,

      transportCharge: 0,
    };

    previewData.forEach((item) => {
      const amount = Number(item.total_amount) || Number(item.amount) || 0;

      switch (item.service_type) {
        case "Document Charge":
          summary.documentCharge += amount;

          break;

        case "Clearing Charge":
          summary.clearingCharge += amount;

          break;

        case "Transport Charge":
          summary.transportCharge += amount;

          break;

        default:
          break;
      }
    });

    return summary;
  };
  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  const usableWidth = pageWidth - margin * 2;

  const usableHeight = pageHeight - 20;
  const fontSize = columnCount <= 6 ? 9 : columnCount <= 10 ? 8 : 7;

  const cellPadding = columnCount <= 6 ? 3 : 2;
  const hiddenColumns = ["id", "user_id", "created_at", "updated_at"];

  const columns =
    previewData.length > 0
      ? Object.keys(previewData[0])

          .filter((item) => !hiddenColumns.includes(item))

          .map((item) => item.replaceAll("_", " ").toUpperCase())
      : [];
  const rows = previewData.map((row) =>
    Object.entries(row)

      .filter(([key]) => !hiddenColumns.includes(key))

      .map(([key, value]) => {
        if (typeof value === "number") {
          return value.toLocaleString("en-IN");
        }

        return value ?? "";
      }),
  );
  const grandTotal = calculateGrandTotal(previewData);
  const accountingSummary = statementTitle.includes("Accounting Charges")
    ? calculateAccountingSummary(previewData)
    : null;
  const otherSalesSummary = statementTitle.includes("Other Sales")
    ? calculateOtherSalesSummary(previewData)
    : null;
  const totalQuantity = calculateQuantity(previewData);

  const totalRecords = previewData.length;

  doc.setFillColor(
    37,

    99,

    235,
  );

  doc.rect(
    0,

    0,

    pageWidth,

    24,

    "F",
  );

  doc.setTextColor(
    255,

    255,

    255,
  );

  doc.setFontSize(20);

  doc.setFont(
    "helvetica",

    "bold",
  );

  doc.text(
    "BUSINESS ERP SYSTEM",

    pageWidth / 2,

    15,

    {
      align: "center",
    },
  );
  doc.setTextColor(
    30,

    41,

    59,
  );

  doc.setFontSize(17);

  doc.text(
    statementTitle.toUpperCase(),

    pageWidth / 2,

    34,

    {
      align: "center",
    },
  );
  doc.setFont(
    "helvetica",

    "normal",
  );

  doc.setFontSize(10);

  doc.text(
    `Company : ${company.company_name || "Business ERP"}`,

    15,

    46,
  );

  doc.text(
    `Financial Year : ${financialYear}`,

    15,

    53,
  );

  doc.text(
    `Generated By : ${user}`,

    15,

    60,
  );

  doc.text(
    `Generated Date : ${new Date().toLocaleDateString()}`,

    pageWidth - 70,

    46,
  );

  doc.text(
    `Generated Time : ${new Date().toLocaleTimeString()}`,

    pageWidth - 70,

    53,
  );

  doc.text(
    `Total Records : ${totalRecords}`,

    pageWidth - 70,

    60,
  );

  /*
====================================
Divider
====================================
*/

  doc.setDrawColor(
    180,

    180,

    180,
  );

  doc.line(
    10,

    65,

    pageWidth - 10,

    65,
  );
  doc.setTextColor(
    240,

    240,

    240,
  );

  doc.setFontSize(48);

  doc.setFont(
    "helvetica",

    "bold",
  );

  doc.text(
    "BUSINESS ERP",

    pageWidth / 2,

    150,

    {
      angle: 35,

      align: "center",
    },
  );

  doc.setTextColor(
    0,

    0,

    0,
  );

  autoTable(doc, {
    startY: 72,

    theme: "grid",

    tableWidth: pageWidth - 20,

    head: [columns],

    body: rows,

    styles: {
      fontSize: 6,

      cellPadding: 1,

      overflow: "hidden",

      halign: "center",

      valign: "middle",

      cellWidth: "wrap",
    },

    headStyles: {
      fillColor: [37, 99, 235],

      textColor: 255,

      fontSize: 6,
    },

    columnStyles: getColumnStyle(columns),

    margin: {
      left: 10,

      right: 10,
    },
    didDrawPage: function () {
      doc.setDrawColor(220);

      doc.line(
        10,

        pageHeight - 12,

        pageWidth - 10,

        pageHeight - 12,
      );

      doc.setFontSize(8);

      doc.setTextColor(120);

      doc.text(
        "Business ERP Professional Statement",

        10,

        pageHeight - 6,
      );

      doc.text(
        new Date().toLocaleDateString(),

        pageWidth / 2,

        pageHeight - 6,

        {
          align: "center",
        },
      );

      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,

        pageWidth - 10,

        pageHeight - 6,

        {
          align: "right",
        },
      );
    },
  });
  let finalY = doc.lastAutoTable.finalY + 10;

  if (finalY > 240) {
    doc.addPage();

    finalY = 20;
  }
  doc.setFillColor(239, 246, 255);

  doc.roundedRect(
    10,

    finalY,

    55,

    18,

    2,

    2,

    "F",
  );

  doc.setFontSize(10);

  doc.setTextColor(30, 41, 59);

  doc.text(
    "Total Records",

    15,

    finalY + 7,
  );

  doc.setFont(
    "helvetica",

    "bold",
  );

  doc.setFontSize(14);

  doc.text(
    String(totalRecords),

    15,

    finalY + 14,
  );

  doc.setFillColor(
    220,

    252,

    231,
  );

  doc.roundedRect(
    75,

    finalY,

    70,

    18,

    2,

    2,

    "F",
  );

  doc.setFont(
    "helvetica",

    "normal",
  );

  doc.setFontSize(10);

  doc.setTextColor(
    22,

    101,

    52,
  );

  doc.text(
    "Grand Total",

    80,

    finalY + 7,
  );

  doc.setFont(
    "helvetica",

    "bold",
  );

  doc.setFontSize(14);

  doc.text(
    formatCurrency(grandTotal),

    80,

    finalY + 14,
  );
  doc.setFillColor(
    255,

    247,

    237,
  );
  doc.roundedRect(
    155,

    finalY,

    45,

    18,

    2,

    2,

    "F",
  );

  doc.setFont(
    "helvetica",

    "normal",
  );

  doc.setFontSize(10);

  doc.setTextColor(
    154,

    52,

    18,
  );

  doc.text(
    "Total Qty",

    160,

    finalY + 7,
  );

  doc.setFont(
    "helvetica",

    "bold",
  );

  doc.setFontSize(14);

  doc.text(
    String(totalQuantity),

    160,

    finalY + 14,
  );
  if (otherSalesSummary) {
    let y = finalY + 30;

    doc.setFillColor(240, 248, 255);

    doc.roundedRect(10, y, 120, 42, 2, 2, "F");

    doc.setFont("helvetica", "bold");

    doc.setFontSize(12);

    doc.text("Financial Year Summary", 15, y + 8);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.text(
      `Document Charge : ${formatCurrency(otherSalesSummary.documentCharge)}`,
      15,
      y + 18,
    );

    doc.text(
      `Clearing Charge : ${formatCurrency(otherSalesSummary.clearingCharge)}`,
      15,
      y + 28,
    );

    doc.text(
      `Transport Charge : ${formatCurrency(otherSalesSummary.transportCharge)}`,
      15,
      y + 38,
    );
  }
  if (accountingSummary) {
    let y = finalY + 30;

    doc.setFillColor(240, 248, 255);

    doc.roundedRect(10, y, 120, 50, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Accounting Charges Summary", 15, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Government Fee : ${formatCurrency(accountingSummary.governmentFee)}`,
      15,
      y + 18,
    );

    doc.text(
      `GST Fee : ${formatCurrency(accountingSummary.gstFee)}`,
      15,
      y + 26,
    );

    doc.text(
      `Income Tax Fee : ${formatCurrency(accountingSummary.incomeTaxFee)}`,
      15,
      y + 34,
    );

    doc.text(
      `Tax Audit Fee : ${formatCurrency(accountingSummary.taxAuditFee)}`,
      15,
      y + 42,
    );

    doc.text(
      `TDS Fee : ${formatCurrency(accountingSummary.tdsFee)}`,
      15,
      y + 50,
    );
  }
  const signY = finalY + 35;
  doc.setDrawColor(
    180,
    180,
    180,
  );
  doc.line(
    pageWidth - 70,
    signY,
    pageWidth - 15,
    signY,
  );
  doc.setFont(
    "helvetica",
    "normal",
  );
  doc.setFontSize(10);
  doc.setTextColor(
    60,
    60,
    60,
  );
  doc.text(
    "Authorized Signature",

    pageWidth - 42,

    signY + 6,

    {
      align: "center",
    },
  );

  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(
      220,

      220,

      220,
    );

    doc.line(
      10,

      285,

      pageWidth - 10,

      285,
    );

    doc.setFont(
      "helvetica",

      "normal",
    );

    doc.setFontSize(9);

    doc.setTextColor(
      120,

      120,

      120,
    );

    doc.text(
      "Business ERP Statement",

      10,

      290,
    );

    doc.text(
      new Date().toLocaleDateString(),

      pageWidth / 2,

      290,

      {
        align: "center",
      },
    );

    doc.text(
      `Page ${i} of ${pageCount}`,

      pageWidth - 10,

      290,

      {
        align: "right",
      },
    );
  }
  doc.save(statementTitle + ".pdf");
};
