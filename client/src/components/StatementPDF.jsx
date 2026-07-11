import { generateProfessionalPDF } from "../utils/pdfGenerator";

function StatementPDF({
  company,

  title,

  financialYear,

  previewData,

  user,
}) {
  const handlePDF = () => {
    const doc = generateProfessionalPDF(
      company,

      title,

      financialYear,

      previewData,

      user?.name || "Admin",
    );

    doc.save(title + ".pdf");
  };

  return (
    <button className="pdf-btn" onClick={handlePDF}>
      Download PDF
    </button>
  );
}

export default StatementPDF;
