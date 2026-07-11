import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AnalyticsChart from "./AnalyticsChart";
import Notification from "./Notification";

import "../css/dashboard.css";

function Dashboard() {

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <h1 className="dashboard-title">

                    Business ERP Dashboard

                </h1>

                <div className="card-container">

                    <div className="dashboard-card">

                        <h3>Purchase</h3>

                        <h2>₹250000</h2>

                    </div>

                    <div className="dashboard-card">

                        <h3>Sales</h3>

                        <h2>₹520000</h2>

                    </div>


                    <div className="dashboard-card">

                        <h3>GST</h3>

                        <h2>₹65000</h2>

                    </div>

                </div>

                <AnalyticsChart />

                <Notification />

            </div>

        </div>

    );

}

export default Dashboard;