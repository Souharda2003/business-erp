import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (
    data,
    fileName = "Business_ERP_Report"
) => {

    if (!data || data.length === 0) {

        alert("No Data Available");

        return;

    }

    // Convert JSON to Sheet

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create Workbook

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Report"

    );

    // Generate Excel Buffer

    const excelBuffer = XLSX.write(

        workbook,

        {

            bookType: "xlsx",

            type: "array"

        }

    );

    // Create Blob

    const fileData = new Blob(

        [

            excelBuffer

        ],

        {

            type:

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        }

    );

    // Download

    saveAs(

        fileData,

        `${fileName}.xlsx`

    );

};