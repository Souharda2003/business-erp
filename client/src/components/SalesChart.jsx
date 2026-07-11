import "../css/analytics.css";

function SalesChart() {

    const salesData = [

        { month: "Jan", amount: "₹80,000" },

        { month: "Feb", amount: "₹95,000" },

        { month: "Mar", amount: "₹1,20,000" },

        { month: "Apr", amount: "₹1,60,000" },

        { month: "May", amount: "₹2,10,000" }

    ];

    return (

        <div className="analytics-container">

            <h2 className="analytics-title">

                Monthly Sales

            </h2>

            <div className="analytics-grid">

                {

                    salesData.map((item, index) => (

                        <div

                            key={index}

                            className="analytics-card"

                        >

                            <h3>

                                {item.month}

                            </h3>

                            <h2>

                                {item.amount}

                            </h2>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default SalesChart;