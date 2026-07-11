import "../css/analytics.css";

function SummaryCard({

    title,

    value,

    color,

    icon

}) {

    return (

        <div className="summaryBox">

            <div className="summaryTop">

                <div>

                    <p className="summaryTitle">

                        {title}

                    </p>

                    <h2
                        className="summaryValue"
                        style={{
                            color: color
                        }}
                    >

                        ₹ {Number(value || 0).toLocaleString()}

                    </h2>

                </div>

                <div className="summaryIcon">

                    {icon}

                </div>

            </div>

        </div>

    );

}

export default SummaryCard;