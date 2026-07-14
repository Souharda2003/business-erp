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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getCurrentFinancialYear = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() + 1;

    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };

  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear());
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

    financialYear,
  });

  const [chartData, setChartData] = useState([]);
  const loadDashboard = async () => {
    try {
      const res = await getDashboard(financialYear);

      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.log(err);
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

  const COLORS = ["#2563EB", "#16A34A", "#D4AF37"];
  return (
    <div className="dashboard">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={sidebarOpen ? "main-content" : "main-content full-width"}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          financialYear={financialYear}
          setFinancialYear={setFinancialYear}
        />

        <div className="dashboard-wrapper">
          <div className="dashboard-title">
            <h1>{companyName}</h1>

            <p>Premium Business Analytics Dashboard</p>
          </div>

          <section className="page-section">
            <div className="card-container">
              <div
                className="dashboard-card purchase-card"
                onClick={() => navigate("/purchase-history")}
              >
                <h3>Total Purchase</h3>

                <h2>
                  {dashboardData.purchase_quantity}{" "}
                  {dashboardData.purchase_unit}
                </h2>

                <p>
                  ₹{" "}
                  {Number(dashboardData.purchase_amount || 0).toLocaleString()}
                </p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card sales-card"
                onClick={() => navigate("/sales-history")}
              >
                <h3>Total Sales</h3>

                <h2>₹{Number(dashboardData.sales || 0).toLocaleString()}</h2>

                <p>Business Sales Overview</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card lc-card"
                onClick={() => navigate("/lc-history")}
              >
                <h3>Total LC</h3>

                <h2>${Number(dashboardData.lc || 0).toLocaleString()}</h2>

                <p>Letter of Credit</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card payment-card"
                onClick={() => navigate("/payment-history")}
              >
                <h3>Total Payment</h3>

                <h2>₹{Number(dashboardData.payment || 0).toLocaleString()}</h2>

                <small
                  style={{
                    color:
                      dashboardData.payment_status === "All Payment Clear"
                        ? "#22C55E"
                        : dashboardData.payment_status === "Payment Excess"
                          ? "#EF4444"
                          : "#F59E0B",
                  }}
                >
                  {dashboardData.payment_status}
                </small>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card drawback-card"
                onClick={() => navigate("/drawback-history")}
              >
                <h3>Total Drawback</h3>

                <h2>₹{Number(dashboardData.drawback || 0).toLocaleString()}</h2>

                <p>Export Incentive</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card rodtep-card"
                onClick={() => navigate("/rodtep-history")}
              >
                <h3>Total RODTEP</h3>

                <h2>₹{Number(dashboardData.rodtep || 0).toLocaleString()}</h2>

                <p>Duty Remission</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card gst-card"
                onClick={() => navigate("/gst-history")}
              >
                <h3>Total GST</h3>

                <h2>₹{Number(dashboardData.gst || 0).toLocaleString()}</h2>

                <p>GST Collection</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card othersales-card"
                onClick={() => navigate("/other-sales-history")}
              >
                <h3>Other Sales</h3>

                <h2>
                  ₹{Number(dashboardData.other_sales || 0).toLocaleString()}
                </h2>

                <p>Additional Revenue</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card accounting-card"
                onClick={() => navigate("/accounting")}
              >
                <h3>Accounting Charges</h3>

                <h2>
                  ₹
                  {Number(
                    dashboardData.accounting_charge || 0,
                  ).toLocaleString()}
                </h2>

                <p>Total Expenses</p>
                <div className="card-glow"></div>
              </div>
              <div
                className="dashboard-card profit-card"
                onClick={() => navigate("/profit-history")}
              >
                <h3>Net Profit</h3>

                <h2>₹{Number(dashboardData.profit || 0).toLocaleString()}</h2>

                <p>Business Performance</p>
                <div className="card-glow"></div>
              </div>
            </div>
          </section>
          <section className="analytics-section">
            <div className="analytics-header">
              <div>
                <h2>Business Analytics</h2>

                <p>Financial Overview & Business Insights</p>
              </div>
            </div>

            <div className="analytics-grid">
              <div
                className="analytics-preview-card"
                onClick={() => navigate("/reports")}
              >
                <h3>Purchase Trend</h3>

                <div className="chart-container">
                  <AnalyticsChart data={chartData} />
                </div>
              </div>
              <div
                className="analytics-preview-card"
                onClick={() => navigate("/reports")}
              >
                <h3>Income Distribution</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
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
          </section>
          <section className="dashboard-bottom">
            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Purchase vs Sales</h3>

              <p>Compare yearly purchase and sales performance.</p>

              <div className="bottom-value">
                ₹{Number(dashboardData.purchase_amount || 0).toLocaleString()}
                {" | "}₹{Number(dashboardData.sales || 0).toLocaleString()}
              </div>
            </div>
            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Profit Growth</h3>

              <p>Business yearly profit analysis.</p>

              <div className="bottom-value">
                ₹{Number(dashboardData.profit || 0).toLocaleString()}
              </div>
            </div>
            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Monthly Performance</h3>

              <p>Purchase, Sales & Payment Overview</p>

              <div className="bottom-value">FY {financialYear}</div>
            </div>
            <div
              className="dashboard-bottom-card"
              onClick={() => navigate("/reports")}
            >
              <h3>Quick Reports</h3>

              <p>Open complete business reports.</p>

              <button className="quick-report-btn">Open Reports →</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
