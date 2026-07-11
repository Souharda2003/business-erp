import { generateExcel } from "../utils/excelGenerator";

function StatementExcel({
  title,

  previewData,
}) {
  const exportExcel = () => {
    if (previewData.length === 0) {
      alert("Preview Statement First");

      return;
    }

    generateExcel(
      title,

      previewData,
    );
  };

  return (
    <button className="excel-btn" onClick={exportExcel}>
      Export Excel
    </button>
  );
}

export default StatementExcel;
