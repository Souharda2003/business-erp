
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import SummaryCard from "../components/SummaryCard";
import AnalyticsChart from "../components/AnalyticsChart";
import ReportCard from "../components/ReportCard";
import AnalyticsLineChart from "../components/AnalyticsLineChart";
import BackButton from "../components/BackButton";

import PurchaseSalesBarChart from "../components/PurchaseSalesBarChart";

import IncomePieChart from "../components/IncomePieChart";
import { getBusinessAnalytics } from "../services/analytics";

import "../css/reports.css";

function Reports() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const [financialYear] = useState(`${currentYear}-${currentYear + 1}`);

  const [summary, setSummary] = useState({
    totalIncome: 0,

    totalPurchase: 0,

    accountingCharge: 0,

    netProfit: 0,
  });
  const [lineData, setLineData] = useState([]);

  const [barData, setBarData] = useState([]);

  const [pieData, setPieData] = useState([]);

  const loadAnalytics = async () => {
    try {
      const res = await getBusinessAnalytics();

      setSummary({
        totalIncome: Number(res.data.summary.totalIncome || 0),

        totalPurchase: Number(res.data.summary.totalPurchase || 0),

        accountingCharge: Number(res.data.summary.accountingCharge || 0),

        netProfit: Number(res.data.summary.netProfit || 0),
      });

      setLineData(res.data.lineChart);

      setBarData(res.data.purchaseSalesChart);

      setPieData(res.data.incomeDistribution);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="reports-page">
          <div className="reports-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <BackButton />
              <div>
                <h1>BUSINESS ANALYTICS</h1>

                <h2>Premium ERP Dashboard</h2>
              </div>
            </div>
            <div className="year-box">
              <span>Financial Year</span>

              <h2>{financialYear}</h2>
            </div>
          </div>

          <div className="last-update">
           <h2>
            Last Updated : {new Date().toLocaleString()}
            </h2> 
          </div>

          <div className="summary-container">
            <SummaryCard
              title="Total Income"
              value={summary.totalIncome}
              color="#16a34a"
              icon="💰"
            />

            <SummaryCard
              title="Total Purchase"
              value={summary.totalPurchase}
              color="#dc2626"
              icon="🛒"
            />

            <SummaryCard
              title="Accounting Charge"
              value={summary.accountingCharge}
              color="#d97706"
              icon="📑"
            />

            <SummaryCard
              title="Profit"
              value={summary.netProfit}
              color={summary.netProfit >= 0 ? "#2563eb" : "#dc2626"}
              icon="📈"
            />
          </div>

          <AnalyticsLineChart data={lineData} />

          <br />

          <div className="chart-row">
            <PurchaseSalesBarChart data={barData} />

            <IncomePieChart data={pieData} />
          </div>

          <div className="report-section">
            <div className="report-title">Available Reports</div>

            <div className="report-grid">
              <ReportCard
                title="Purchase Report"
                description="Purchase History, GST, Taxable Amount & Grand Total"
                onView={() => navigate("/purchase-history")}
                onPrint={() => window.open("/purchase-history", "_blank")}
              />

              <ReportCard
                title="Sales Report"
                description="Sales Invoice, Customer & Grand Total Report"
                onView={() => navigate("/sales-history")}
                onPrint={() => window.open("/sales-history", "_blank")}
              />

              <ReportCard
                title="LC Report"
                description="LC Details, Payment & Import Information"
                onView={() => navigate("/lc-history")}
                onPrint={() => window.open("/lc-history", "_blank")}
              />

              <ReportCard
                title="Payment Report"
                description="Payment Received & Outstanding Summary"
                onView={() => navigate("/payment-history")}
                onPrint={() => window.open("/payment-history", "_blank")}
              />

              <ReportCard
                title="GST Report"
                description="GST Invoice & GST Collection Summary"
                onView={() => navigate("/gst-history")}
                onPrint={() => window.open("/gst-history", "_blank")}
              />

              <ReportCard
                title="Drawback Report"
                description="Drawback Claim & Shipping Bill Report"
                onView={() => navigate("/drawback-history")}
                onPrint={() => window.open("/drawback-history", "_blank")}
              />

              <ReportCard
                title="Other Sales Report"
                description="Other Sales Income & Customer Details"
                onView={() => navigate("/other-sales-history")}
                onPrint={() => window.open("/other-sales-history", "_blank")}
              />

              <ReportCard
                title="Accounting Report"
                description="Government Fee, GST Fee, Income Tax, TDS & Audit"
                onView={() => navigate("/accounting")}
                onPrint={() => window.open("/accounting-report", "_blank")}
              />

              <ReportCard
                title="Profit & Loss Report"
                description="Business Profit Analysis with Income & Expense"
                onView={() => navigate("/profit-history")}
                onPrint={() => window.open("/profit-history", "_blank")}
              />

              <ReportCard
                title="Importer Billing Report"
                description="Importer Billing, LC Payment & Grand Total"
                onView={() => navigate("/importer-billing-history")}
                onPrint={() =>
                  window.open("/importer-billing-history", "_blank")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
