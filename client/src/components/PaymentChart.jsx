import "../css/analytics.css";

function PaymentChart() {

    return (

        <div className="analytics-container">

            <h2>

                Payment Overview

            </h2>

            <div className="analytics-grid">

                <div className="analytics-card">

                    <h3>

                        Cash

                    </h3>

                    <h2>

                        ₹150000

                    </h2>

                </div>

                <div className="analytics-card">

                    <h3>

                        Bank

                    </h3>

                    <h2>

                        ₹220000

                    </h2>

                </div>

                <div className="analytics-card">

                    <h3>

                        UPI

                    </h3>

                    <h2>

                        ₹50000

                    </h2>

                </div>

            </div>

        </div>

    );

}

export default PaymentChart;