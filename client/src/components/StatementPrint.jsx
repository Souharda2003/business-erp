import { printStatement } from "../utils/printGenerator";

function StatementPrint() {
  return (
    <button
      className="print-btn"
      onClick={() => printStatement("statement-preview")}
    >
      Print
    </button>
  );
}

export default StatementPrint;
