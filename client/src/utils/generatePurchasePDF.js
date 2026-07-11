import html2pdf from "html2pdf.js";

export const generatePurchasePDF = (element, invoiceNo) => {
  const option = {
    margin: 5,

    filename: `Purchase_Invoice_${invoiceNo}.pdf`,

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

  html2pdf()
    .set(option)

    .from(element)

    .save();
};
