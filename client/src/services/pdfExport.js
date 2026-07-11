import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (data) => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Business ERP Report", 14, 20);

    autoTable(doc, {

        head: [[

            "Date",

            "Product",

            "Quantity",

            "Amount",

            "Supplier"

        ]],

        body: data.map(item => [

            item.report_date,

            item.product_name,

            item.quantity,

            item.total_amount,

            item.supplier

        ])

    });

    doc.save("Business_Report.pdf");

}







// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const exportPDF = (

//     data,

//     title = "Business ERP Report"

// ) => {

//     if (!data || data.length === 0) {

//         alert("No Data Available");

//         return;

//     }

//     const doc = new jsPDF({

//         orientation: "landscape",

//         unit: "mm",

//         format: "a4"

//     });

//     // Company Name

//     doc.setFontSize(18);

//     doc.text(

//         "Business ERP System",

//         14,

//         15

//     );

//     // Report Title

//     doc.setFontSize(13);

//     doc.text(

//         title,

//         14,

//         25

//     );

//     // Date

//     doc.setFontSize(10);

//     doc.text(

//         "Generated : " +

//         new Date().toLocaleString(),

//         14,

//         32

//     );

//     // Table

//     autoTable(doc, {

//         startY: 38,

//         head: [

//             [

//                 "Date",

//                 "Product",

//                 "Quantity",

//                 "Amount",

//                 "Supplier"

//             ]

//         ],

//         body: data.map(item => [

//             item.report_date ||

//             item.purchase_date ||

//             "-",

//             item.product_name ||

//             "-",

//             item.quantity ||

//             "-",

//             item.total_amount ||

//             "-",

//             item.supplier ||

//             "-"

//         ]),

//         styles: {

//             fontSize: 9,

//             cellPadding: 3

//         },

//         headStyles: {

//             fillColor: [

//                 25,

//                 118,

//                 210

//             ]

//         }

//     });

//     doc.save(

//         `${title}.pdf`

//     );

// };