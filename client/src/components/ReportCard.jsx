// import "../css/reports.css";

// function ReportCard({

//     title,

//     value,

//     color = "#1976d2"

// }) {

//     return (

//         <div

//             style={{

//                 background: "#fff",

//                 padding: "20px",

//                 borderRadius: "10px",

//                 boxShadow: "0 2px 10px rgba(0,0,0,.08)",

//                 borderLeft: `5px solid ${color}`

//             }}

//         >

//             <h3>{title}</h3>

//             <h2

//                 style={{

//                     color: color,

//                     marginTop: "10px"

//                 }}

//             >

//                 {value}

//             </h2>

//         </div>

//     );

// }

// export default ReportCard;



import "../css/analytics.css";

function ReportCard({

    title,

    description,

    onView,

    onPrint

}) {

    return (

        <div className="reportBox">

            <h3>

                {title}

            </h3>

            <p>

                {description}

            </p>

            <div className="reportButtonGroup">

                <button

                    className="viewButton"

                    onClick={onView}

                >

                    View

                </button>

                <button

                    className="printButton"

                    onClick={onPrint}

                >

                    Print

                </button>

            </div>

        </div>

    );

}

export default ReportCard;





