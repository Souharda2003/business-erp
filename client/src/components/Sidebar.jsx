import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "../css/sidebar.css";

function Sidebar({ sidebarOpen }) {
  const [tradeOpen, setTradeOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [lcOpen, setLcOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [drawbackOpen, setDrawbackOpen] = useState(false);
  const [rodtepOpen, setRodtepOpen] = useState(false);
  const [importerOpen, setImporterOpen] = useState(false);
  const [gstOpen, setGstOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [otherSalesOpen, setOtherSalesOpen] = useState(false);
  const [accountingOpen, setAccountingOpen] = useState(false);
  const [governmentOpen, setGovernmentOpen] = useState(false);
  const [accountingGSTOpen, setAccountingGSTOpen] = useState(false);
  const [incomeTaxOpen, setIncomeTaxOpen] = useState(false);
  const [taxAuditOpen, setTaxAuditOpen] = useState(false);
  const [tdsOpen, setTDSOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar sidebar-close"}>
      <div className="sidebar-logo">ERP</div>
      <div className="sidebar-menu">
        <NavLink to="/dashboard">Dashboard</NavLink>

        <div
          className="sidebar-parent"
          onClick={() => setTradeOpen(!tradeOpen)}
        >
          <span>Trade Management</span>

          <span className={tradeOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {tradeOpen && (
          <>
            <div className="menu-group">
              <div
                className="menu-title"
                onClick={() => setPurchaseOpen(!purchaseOpen)}
              >
                Purchase
              </div>
              {purchaseOpen && (
                <div className="submenu">
                  <NavLink to="/purchase">Entry</NavLink>

                  <NavLink to="/purchase-history">History</NavLink>
                </div>
              )}
            </div>

            {/* Sales */}

            <div className="menu-group">
              <div
                className="menu-title"
                onClick={() => setSalesOpen(!salesOpen)}
              >
                Sales
              </div>

              {salesOpen && (
                <div className="submenu">
                  <NavLink to="/sales">Entry</NavLink>

                  <NavLink to="/sales-history">History</NavLink>
                </div>
              )}
            </div>
            <div className="menu-group">
              <div className="menu-title" onClick={() => setLcOpen(!lcOpen)}>
                LC
              </div>

              {lcOpen && (
                <div className="submenu">
                  <NavLink to="/lc">Entry</NavLink>

                  <NavLink to="/lc-history">History</NavLink>
                </div>
              )}
            </div>

            {/* Drawback */}

            <div className="menu-group">
              <div
                className="menu-title"
                onClick={() => setDrawbackOpen(!drawbackOpen)}
              >
                Drawback
              </div>

              {drawbackOpen && (
                <div className="submenu">
                  <NavLink to="/drawback">Entry</NavLink>

                  <NavLink to="/drawback-history">History</NavLink>
                </div>
              )}
            </div>
            <div className="menu-group">
              <div
                className="menu-title"
                onClick={() => setRodtepOpen(!rodtepOpen)}
              >
                RODTEP
              </div>

              {rodtepOpen && (
                <div className="submenu">
                  <NavLink to="/rodtep">Entry</NavLink>

                  <NavLink to="/rodtep-history">History</NavLink>
                </div>
              )}
            </div>
            <div className="menu-group">
              <div
                className="menu-title"
                onClick={() => setOtherSalesOpen(!otherSalesOpen)}
              >
                Other Sales
              </div>

              {otherSalesOpen && (
                <div className="submenu">
                  <NavLink to="/other-sales">Entry</NavLink>

                  <NavLink to="/other-sales-history">History</NavLink>
                </div>
              )}
            </div>
          </>
        )}
        <div
          className="sidebar-parent"
          onClick={() => setImporterOpen(!importerOpen)}
        >
          <span>Importer Billing</span>

          <span className={importerOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {importerOpen && (
          <div className="sidebar-child">
            <div className="sidebar-subchild">
              <Link to="/importer-billing">Entry</Link>

              <Link to="/importer-billing-history">History</Link>
            </div>
          </div>
        )}
        <div
          className="sidebar-parent"
          onClick={() => setFinanceOpen(!financeOpen)}
        >
          <span>Finance</span>

          <span className={financeOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {financeOpen && (
          <div className="sidebar-child">
            <div
              className="sidebar-submenu"
              onClick={() => setPaymentOpen(!paymentOpen)}
            >
              Payment
            </div>

            {paymentOpen && (
              <div className="sidebar-subchild">
                <Link to="/payment">Entry</Link>

                <Link to="/payment-history">History</Link>
              </div>
            )}
            <div
              className="sidebar-submenu"
              onClick={() => setGstOpen(!gstOpen)}
            >
              GST
            </div>

            {gstOpen && (
              <div className="sidebar-subchild">
                <Link to="/gst">Entry</Link>

                <Link to="/gst-history">History</Link>
              </div>
            )}
          </div>
        )}
        <div
          className="sidebar-parent"
          onClick={() => setAccountingOpen(!accountingOpen)}
        >
          <span>Accounting Charges</span>

          <span className={accountingOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>
        {accountingOpen && (
          <div className="sidebar-child">
            <div
              className="sidebar-submenu"
              onClick={() => setGovernmentOpen(!governmentOpen)}
            >
              Government Fee
            </div>

            {governmentOpen && (
              <div className="sidebar-subchild">
                <Link to="/government-fee">Entry</Link>

                <Link to="/government-fee-history">History</Link>
              </div>
            )}
            <div
              className="sidebar-submenu"
              onClick={() => setAccountingGSTOpen(!accountingGSTOpen)}
            >
              GST Fee
            </div>
            {accountingGSTOpen && (
              <div className="sidebar-subchild">
                <Link to="/gst-fee">Entry</Link>

                <Link to="/gst-fee-history">History</Link>
              </div>
            )}
            <div
              className="sidebar-submenu"
              onClick={() => setIncomeTaxOpen(!incomeTaxOpen)}
            >
              Income Tax Fee
            </div>
            {incomeTaxOpen && (
              <div className="sidebar-subchild">
                <Link to="/income-tax-fee">Entry</Link>

                <Link to="/income-tax-fee-history">History</Link>
              </div>
            )}

            <div
              className="sidebar-submenu"
              onClick={() => setTaxAuditOpen(!taxAuditOpen)}
            >
              Tax Audit Fee
            </div>
            {taxAuditOpen && (
              <div className="sidebar-subchild">
                <Link to="/tax-audit-fee">Entry</Link>

                <Link to="/tax-audit-fee-history">History</Link>
              </div>
            )}

            <div
              className="sidebar-submenu"
              onClick={() => setTDSOpen(!tdsOpen)}
            >
              TDS Fee
            </div>

            {tdsOpen && (
              <div className="sidebar-subchild">
                <Link to="/tds-fee">Entry</Link>

                <Link to="/tds-fee-history">History</Link>
              </div>
            )}
          </div>
        )}

        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/generate-statement">Generate Statement</NavLink>
        <div
          className="sidebar-parent"
          onClick={() => setAdminOpen(!adminOpen)}
        >
          <span>Administration</span>

          <span className={adminOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {adminOpen && (
          <div className="sidebar-child">
            <div className="sidebar-subchild">
              <Link to="/activity-log">Activity Log</Link>
            </div>
          </div>
        )}
        <div
          className="sidebar-parent"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <span>Settings</span>

          <span className={settingsOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {settingsOpen && (
          <div className="sidebar-child">
            <div className="sidebar-subchild">
              <Link to="/company-profile">Company Profile</Link>
              <Link to="/backup">Backup</Link>
            </div>
          </div>
        )}
        <div
          className="sidebar-parent"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <span>My Account</span>

          <span className={profileOpen ? "arrow rotate" : "arrow"}>▶</span>
        </div>

        {profileOpen && (
          <div className="sidebar-child">
            <div className="sidebar-subchild">
              <Link to="/profile">My Profile</Link>

              <Link to="/change-password">Change Password</Link>

              <Link to="/logout">Logout</Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
