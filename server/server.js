require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Business ERP API Running");
});
const PORT = 5000;

const { startAutoBackup } = require("./cron/autoBackup");

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);

  startAutoBackup();
});
const loginRoutes = require("./routes/loginRoutes");
app.use("/api/login", loginRoutes);
const registerRoutes = require("./routes/registerRoutes");
app.use("/api/register", registerRoutes);
const purchaseRoutes = require("./routes/purchaseRoutes");
app.use("/api/purchase", purchaseRoutes);
const salesRoutes = require("./routes/salesRoutes");
app.use("/api/sales", salesRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/report", reportRoutes);
const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes);
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));
const gstRoutes = require("./routes/gstRoutes");
app.use("/api/gst", gstRoutes);
const profitRoutes = require("./routes/profileRoutes");
app.use("/api/profit", profitRoutes);
const lcRoutes = require("./routes/lcRoutes");
app.use("/api/lc", lcRoutes);
const drawbackRoutes = require("./routes/drawbackRoutes");
app.use("/api/drawback", drawbackRoutes);
const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);
const otherSalesRoutes = require("./routes/otherSalesRoutes");
app.use("/api/other-sales", otherSalesRoutes);
const accountingRoutes = require("./routes/accountingRoutes");
app.use("/api/accounting", accountingRoutes);
const rodtepRoutes = require("./routes/rodtepRoutes");
app.use("/api/rodtep", rodtepRoutes);
const importerBillingRoutes = require("./routes/importerBillingRoutes");
app.use("/api/importer-billing", importerBillingRoutes);
const activityRoutes = require("./routes/activityRoutes");
app.use("/api/activity", activityRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const companyRoutes = require("./routes/companyRoutes");
app.use("/api/company", companyRoutes);
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);
const backupRoutes = require("./routes/backupRoutes");
app.use("/api/backup", backupRoutes);
const statementRoutes = require("./routes/statementRoutes");
app.use("/api/statement", statementRoutes);







console.log("LC ROUTES LOADED");
console.log("LC API REGISTERED");
console.log("DRAWBACK ROUTES LOADED");
app.use((req, res) => {
  console.log("NOT FOUND =", req.method, req.url);

  res.status(404).send("Route Not Found");
});
