import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateExcel = (
  title,

  previewData,
) => {
  if (previewData.length === 0) {
    alert("No Data Found");

    return;
  }
const exportData =

previewData.map(

(item)=>{

const temp={...item};

delete temp.id;

return temp;

}

);

const worksheet =

XLSX.utils.json_to_sheet(exportData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,

    worksheet,

    "Statement",
  );

  const excelBuffer = XLSX.write(
    workbook,

    {
      bookType: "xlsx",

      type: "array",
    },
  );

  const file = new Blob(
    [excelBuffer],

    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );

  saveAs(
    file,

    title + ".xlsx",
  );
};
