import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import AnalyticsChart from "../components/AnalyticsChart";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { getDashboard, getPurchaseTrend } from "../services/dashboard";

import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const companyName = localStorage.getItem("company_name") || "Business ERP";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const getCurrentFinancialYear = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() + 1;

    return month >= 4
      ? `${year}-${year + 1}`
      : `${year - 1}-${year}`;

};

const [financialYear, setFinancialYear] = useState(
    getCurrentFinancialYear()
);

  const [dashboardData, setDashboardData] = useState({
    purchase: 0,

    purchase_amount: 0,

    purchase_quantity: 0,

    purchase_unit: "",

    sales: 0,

    lc: 0,

    payment: 0,

    gst: 0,

    drawback: 0,

    rodtep: 0,

    other_sales: 0,

    accounting_charge: 0,

    profit: 0,

    pending_amount: 0,

    excess_amount: 0,

    payment_status: "",

    financialYear: financialYear,
  });
  const [chartData, setChartData] = useState([]);
  const loadDashboard = async () => {
    try {
      const res = await getDashboard(financialYear);

      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.log("Dashboard Error =", err);
    }
  };
  const loadPurchaseTrend = async () => {
    try {
      const res = await getPurchaseTrend(financialYear);

      setChartData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    loadDashboard();
    loadPurchaseTrend();
  }, [financialYear]);

  const pieData = [
    {
      name: "Purchase",

      value: Number(dashboardData.purchase_amount || 0),
    },

    {
      name: "Sales",

      value: Number(dashboardData.sales || 0),
    },

    {
      name: "Profit",

      value: Number(dashboardData.profit || 0),
    },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#ea580c"];

  return (
    <div className="app">
      <Sidebar
  sidebarOpen={sidebarOpen}
  toggleSidebar={toggleSidebar}
/>
      <div className={sidebarOpen ? "main-content" : "main-content full-width"}>
      <Navbar
    toggleSidebar={toggleSidebar}
    financialYear={financialYear}
    setFinancialYear={setFinancialYear}
/>

        <div className="page">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">{companyName} Dashboard</h1>

              <h2 className="dashboard-subtitle">Premium Business Analytics</h2>
            </div>
          </div>
          <div className="card-container">
            <div
              className="dashboard-card"
              onClick={() => navigate("/purchase-history")}
            >
              <h3>Total Purchase</h3>

              <h2>
                {dashboardData.purchase_quantity} {dashboardData.purchase_unit}
              </h2>

              <p>
                ₹ {Number(dashboardData.purchase_amount || 0).toLocaleString()}
              </p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/sales-history")}
            >
              <h3>Total Sales</h3>

              <h2>₹{Number(dashboardData.sales || 0).toLocaleString()}</h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/lc-history")}
            >
              <h3>Total LC</h3>

              <h2>${Number(dashboardData.lc || 0).toLocaleString()}</h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/payment-history")}
            >
              <h3>Total Payment</h3>

              <h2>₹{Number(dashboardData.payment || 0).toLocaleString()}</h2>

              <div
                style={{
                  color:
                    dashboardData.payment_status === "All Payment Clear"
                      ? "#16a34a"
                      : dashboardData.payment_status === "Payment Excess"
                        ? "#dc2626"
                        : "#ea580c",
                }}
              >
                {dashboardData.payment_status === "Pending + Excess" ? (
                  <>
                    <div>
                      🟠 Pending ₹{" "}
                      {Number(dashboardData.pending_amount).toFixed(2)}
                    </div>
                    <div>
                      🔴 Exceed ₹{" "}
                      {Number(dashboardData.excess_amount).toFixed(2)}
                    </div>
                  </>
                ) : dashboardData.payment_status === "Payment Excess" ? (
                  `🔴 Exceed Payment ₹ ${Number(
                    dashboardData.excess_amount || 0,
                  ).toFixed(2)}`
                ) : dashboardData.payment_status === "Payment Pending" ? (
                  `🟠 Pending Payment ₹ ${Number(
                    dashboardData.pending_amount || 0,
                  ).toFixed(2)}`
                ) : (
                  "🟢 All Payment Clear"
                )}
              </div>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/drawback-history")}
            >
              <h3>Total Drawback</h3>

              <h2>₹{Number(dashboardData.drawback || 0).toLocaleString()}</h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/rodtep-history")}
            >
              <h3>Total RODTEP</h3>

              <h2>₹{Number(dashboardData.rodtep || 0).toLocaleString()}</h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/gst-history")}
            >
              <h3>Total GST</h3>

              <h2>₹{Number(dashboardData.gst || 0).toLocaleString()}</h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/other-sales-history")}
            >
              <h3>Other Sales</h3>

              <h2>
                ₹{Number(dashboardData.other_sales || 0).toLocaleString()}
              </h2>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/accounting")}
            >
              <h3>Accounting Charges</h3>

              <h2>
                ₹{Number(dashboardData.accounting_charge || 0).toLocaleString()}
              </h2>
            </div>

            <div
              className="dashboard-card profit-card"
              onClick={() => navigate("/profit-history")}
            >
              <h3>Net Profit</h3>

              <h2>₹{Number(dashboardData.profit || 0).toLocaleString()}</h2>
            </div>
          </div>

          <br />
          <div className="analytics-section">
            <div className="analytics-header">
              <div>
                <h2>Business Analytics</h2>

                <p>Financial Overview</p>
              </div>
            </div>

            <div className="analytics-grid">
              <div
                className="analytics-preview-card"
                onClick={() => navigate("/reports")}
              >
                <h3>Purchase Trend</h3>

                <div
                  style={{
                    width: "100%",
                    height: "260px",
                  }}
                >
                  <AnalyticsChart data={chartData} />
                </div>
              </div>

              <div
                className="analytics-preview-card"
                onClick={() => navigate("/reports")}
              >
                <h3>Income Distribution</h3>

                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={95}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="dashboard-bottom">
            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Purchase vs Sales</h3>

              <p>Compare yearly purchase and sales performance.</p>

              <div className="bottom-value">
                ₹{Number(dashboardData.purchase_amount || 0).toLocaleString()}
                {"  |  "}₹{Number(dashboardData.sales || 0).toLocaleString()}
              </div>
            </div>

            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Profit Growth</h3>

              <p>Check yearly business profit trend.</p>

              <div className="bottom-value">
                ₹{Number(dashboardData.profit || 0).toLocaleString()}
              </div>
            </div>

            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Monthly Performance</h3>

              <p>Purchase, Sales & Payment analytics.</p>

              <div className="bottom-value">FY {financialYear}</div>
            </div>

            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Quick Reports</h3>

              <p>Open complete Business Reports.</p>

              <button className="quick-report-btn">Open Reports →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
