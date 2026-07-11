import "../css/analytics.css";

function ProfitChart() {

    return (

        <div className="analytics-container">

            <h2>

                Profit Analysis

            </h2>

            <div className="analytics-grid">

                <div className="analytics-card">

                    <h3>

                        Purchase

                    </h3>

                    <h2>

                        ₹250000

                    </h2>

                </div>

                <div className="analytics-card">

                    <h3>

                        Sales

                    </h3>

                    <h2>

                        ₹520000

                    </h2>

                </div>

                <div className="analytics-card">

                    <h3>

                        Net Profit

                    </h3>

                    <h2>

                        ₹270000

                    </h2>

                </div>

            </div>

        </div>

    );

}

export default ProfitChart;