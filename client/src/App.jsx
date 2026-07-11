import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Purchase from "./pages/Purchase";
import Sales from "./pages/Sales";
import LC from "./pages/LC";
import Payment from "./pages/Payment";
import GST from "./pages/GST";
import Drawback from "./pages/Drawback";
import Reports from "./pages/Reports";
import GenerateStatement from "./pages/GenerateStatement";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import PurchaseHistory from "./pages/PurchaseHistory";
import PurchaseInvoice from "./pages/PurchaseInvoice";
import SalesHistory from "./pages/SalesHistory";
import SalesInvoice from "./pages/SalesInvoice";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentInvoice from "./pages/PaymentInvoice";
import PaymentLedger from "./pages/PaymentLedger";
import GSTHistory from "./pages/GSTHistory";
import GSTInvoice from "./pages/GSTInvoice";
import ProfitHistory from "./pages/ProfitHistory";
import LCHistory from "./pages/LCHistory";
import LCInvoice from "./pages/LCInvoice";
import DrawbackHistory from "./pages/DrawbackHistory";
import DrawbackInvoice from "./pages/DrawbackInvoice";
import OtherSales from "./pages/OtherSales";
import OtherSalesHistory from "./pages/OtherSalesHistory";
import OtherSalesInvoice from "./pages/OtherSalesInvoice";
import GovernmentFee from "./pages/Accounting/GovernmentFee";
import GovernmentFeeHistory from "./pages/Accounting/GovernmentFeeHistory";
import GovernmentFeeInvoice from "./pages/Accounting/GovernmentFeeInvoice";
import GSTFee from "./pages/Accounting/GSTFee";
import GSTFeeHistory from "./pages/Accounting/GSTFeeHistory";
import GSTFeeInvoice from "./pages/Accounting/GSTFeeInvoice";
import IncomeTaxFee from "./pages/Accounting/IncomeTaxFee";
import IncomeTaxFeeHistory from "./pages/Accounting/IncomeTaxFeeHistory";
import IncomeTaxFeeInvoice from "./pages/Accounting/IncomeTaxFeeInvoice";
import TaxAuditFee from "./pages/Accounting/TaxAuditFee";
import TaxAuditFeeHistory from "./pages/Accounting/TaxAuditFeeHistory";
import TaxAuditFeeInvoice from "./pages/Accounting/TaxAuditFeeInvoice";
import TDSFee from "./pages/Accounting/TDSFee";
import TDSFeeHistory from "./pages/Accounting/TDSFeeHistory";
import TDSFeeInvoice from "./pages/Accounting/TDSFeeInvoice";
import RODTEP from "./pages/RODTEP";
import RODTEPHistory from "./pages/RODTEPHistory";
import RODTEPInvoice from "./pages/RODTEPInvoice";
import ImporterBilling from "./pages/ImporterBilling/ImporterBilling";
import ImporterBillingHistory from "./pages/ImporterBilling/ImporterBillingHistory";
import ImporterBillingInvoice from "./pages/ImporterBilling/ImporterBillingInvoice";
import Accounting from "./pages/Accounting/Accounting";
import CompanyProfile from "./pages/CompanyProfile";
import ActivityLog from "./pages/ActivityLog";
import Backup from "./pages/Backup";
import ChangePassword from "./pages/ChangePassword";
import Logout from "./pages/Logout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase"
        element={
          <ProtectedRoute>
            <Purchase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase-history"
        element={
          <ProtectedRoute>
            <PurchaseHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase/edit/:id"
        element={
          <ProtectedRoute>
            <Purchase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase-invoice/:id"
        element={
          <ProtectedRoute>
            <PurchaseInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-invoice/:id"
        element={
          <ProtectedRoute>
            <SalesInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lc-invoice/:id"
        element={
          <ProtectedRoute>
            <LCInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drawback-invoice/:id"
        element={
          <ProtectedRoute>
            <DrawbackInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-history"
        element={
          <ProtectedRoute>
            <SalesHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales/edit/:id"
        element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lc"
        element={
          <ProtectedRoute>
            <LC />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lc-history"
        element={
          <ProtectedRoute>
            <LCHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lc/edit/:id"
        element={
          <ProtectedRoute>
            <LC />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rodtep"
        element={
          <ProtectedRoute>
            <RODTEP />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rodtep-history"
        element={
          <ProtectedRoute>
            <RODTEPHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rodtep/edit/:id"
        element={
          <ProtectedRoute>
            <RODTEP />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rodtep-invoice/:id"
        element={
          <ProtectedRoute>
            <RODTEPInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/other-sales"
        element={
          <ProtectedRoute>
            <OtherSales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/other-sales-history"
        element={
          <ProtectedRoute>
            <OtherSalesHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/other-sales/edit/:id"
        element={
          <ProtectedRoute>
            <OtherSales />
          </ProtectedRoute>
        }
      />

      <Route
        path="/other-sales-invoice/:id"
        element={
          <ProtectedRoute>
            <OtherSalesInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-history"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/edit/:id"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-invoice/:id"
        element={
          <ProtectedRoute>
            <PaymentInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-ledger"
        element={
          <ProtectedRoute>
            <PaymentLedger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst"
        element={
          <ProtectedRoute>
            <GST />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst-history"
        element={
          <ProtectedRoute>
            <GSTHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst/edit/:id"
        element={
          <ProtectedRoute>
            <GST />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst-invoice/:id"
        element={
          <ProtectedRoute>
            <GSTInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profit-history"
        element={
          <ProtectedRoute>
            <ProfitHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drawback"
        element={
          <ProtectedRoute>
            <Drawback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drawback-history"
        element={
          <ProtectedRoute>
            <DrawbackHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drawback/edit/:id"
        element={
          <ProtectedRoute>
            <Drawback />
          </ProtectedRoute>
        }
      />

      <Route
        path="/importer-billing"
        element={
          <ProtectedRoute>
            <ImporterBilling />
          </ProtectedRoute>
        }
      />

      <Route
        path="/importer-billing-history"
        element={
          <ProtectedRoute>
            <ImporterBillingHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/importer-billing/edit/:id"
        element={
          <ProtectedRoute>
            <ImporterBilling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/importer-billing-invoice/:id"
        element={
          <ProtectedRoute>
            <ImporterBillingInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government-fee"
        element={
          <ProtectedRoute>
            <GovernmentFee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/government-fee-history"
        element={
          <ProtectedRoute>
            <GovernmentFeeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/government-fee/edit/:id"
        element={
          <ProtectedRoute>
            <GovernmentFee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government-fee/invoice/:id"
        element={
          <ProtectedRoute>
            <GovernmentFeeInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounting"
        element={
          <ProtectedRoute>
            <Accounting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst-fee"
        element={
          <ProtectedRoute>
            <GSTFee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gst-fee-history"
        element={
          <ProtectedRoute>
            <GSTFeeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gst-fee/edit/:id"
        element={
          <ProtectedRoute>
            <GSTFee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gst-fee/invoice/:id"
        element={
          <ProtectedRoute>
            <GSTFeeInvoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tax-audit-fee"
        element={
          <ProtectedRoute>
            <TaxAuditFee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tax-audit-fee-history"
        element={
          <ProtectedRoute>
            <TaxAuditFeeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tax-audit-fee/edit/:id"
        element={
          <ProtectedRoute>
            <TaxAuditFee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax-audit-fee/invoice/:id"
        element={
          <ProtectedRoute>
            <TaxAuditFeeInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income-tax-fee"
        element={
          <ProtectedRoute>
            <IncomeTaxFee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/income-tax-fee-history"
        element={
          <ProtectedRoute>
            <IncomeTaxFeeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/income-tax-fee/edit/:id"
        element={
          <ProtectedRoute>
            <IncomeTaxFee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income-tax-fee/invoice/:id"
        element={
          <ProtectedRoute>
            <IncomeTaxFeeInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tds-fee"
        element={
          <ProtectedRoute>
            <TDSFee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tds-fee-history"
        element={
          <ProtectedRoute>
            <TDSFeeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tds-fee/edit/:id"
        element={
          <ProtectedRoute>
            <TDSFee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tds-fee/invoice/:id"
        element={
          <ProtectedRoute>
            <TDSFeeInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-statement"
        element={
          <ProtectedRoute>
            <GenerateStatement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={["Admin"]}>
            <Admin />
          </RoleRoute>
        }
      />
      <Route
        path="/users"
        element={
          <RoleRoute allowedRoles={["Admin", "Super Admin"]}>
            <Users />
          </RoleRoute>
        }
      />
      <Route
        path="/activity-log"
        element={
          <ProtectedRoute>
            <ActivityLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-profile"
        element={
          <ProtectedRoute>
            <CompanyProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/backup"
        element={
          <ProtectedRoute>
            <Backup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
