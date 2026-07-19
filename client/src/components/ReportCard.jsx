

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





