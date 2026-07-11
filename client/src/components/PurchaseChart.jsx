import "../css/analytics.css";

function PurchaseChart() {

    const data = [

        { month: "Jan", amount: "₹50000" },

        { month: "Feb", amount: "₹75000" },

        { month: "Mar", amount: "₹90000" },

        { month: "Apr", amount: "₹120000" },

        { month: "May", amount: "₹150000" }

    ];

    return (

        <div className="analytics-container">

            <h2 className="analytics-title">

                Purchase Summary

            </h2>

            <div className="analytics-grid">

                {

                    data.map((item, index) => (

                        <div

                            key={index}

                            className="analytics-card"

                        >

                            <h3>{item.month}</h3>

                            <h2>{item.amount}</h2>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default PurchaseChart;