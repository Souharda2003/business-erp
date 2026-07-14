import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

import {
  FaBars,
  FaChartPie,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaFileImport,
  FaMoneyCheckAlt,
  FaUniversity,
  FaCog,
  FaUserCircle,
  FaChevronRight,
  FaIndustry,
} from "react-icons/fa";

import "../css/sidebar.css";

function Sidebar({ sidebarOpen, toggleSidebar }) {
  const [tradeOpen, setTradeOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [lcOpen, setLcOpen] = useState(false);
  const [drawbackOpen, setDrawbackOpen] = useState(false);
  const [rodtepOpen, setRodtepOpen] = useState(false);
  const [otherSalesOpen, setOtherSalesOpen] = useState(false);

  const [importerOpen, setImporterOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [gstOpen, setGstOpen] = useState(false);

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
    <aside
      className={sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-close"}
    >
      <div className="sidebar-logo" onClick={toggleSidebar}>
        <div className="logo-left">
          <FaIndustry className="logo-icon" />
        </div>

        <div className="logo-text">
          <h2>Business ERP</h2>

          <span>Premium Edition</span>
        </div>
      </div>
      <div className="sidebar-menu-wrapper">
        <div className="sidebar-menu">
          <NavLink to="/dashboard">
            <FaChartPie className="menu-icon" />

            <span>Dashboard</span>
          </NavLink>
          <div
            className="sidebar-parent"
            onClick={() => setTradeOpen(!tradeOpen)}
          >
            <div className="menu-left">
              <FaShoppingCart />

              <span>Trade Management</span>
            </div>

            <FaChevronRight className={tradeOpen ? "arrow rotate" : "arrow"} />
          </div>

          {tradeOpen && (
            <>
              <div className="menu-group">
                <div
                  className="menu-title"
                  onClick={() => setPurchaseOpen(!purchaseOpen)}
                >
                  Purchase
                  <FaChevronRight
                    className={purchaseOpen ? "arrow rotate" : "arrow"}
                  />
                </div>

                {purchaseOpen && (
                  <div className="submenu">
                    <NavLink to="/purchase">Entry</NavLink>

                    <NavLink to="/purchase-history">History</NavLink>
                  </div>
                )}
              </div>
              <div className="menu-group">
                <div
                  className="menu-title"
                  onClick={() => setSalesOpen(!salesOpen)}
                >
                  Sales
                  <FaChevronRight
                    className={salesOpen ? "arrow rotate" : "arrow"}
                  />
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
                  <FaChevronRight
                    className={lcOpen ? "arrow rotate" : "arrow"}
                  />
                </div>

                {lcOpen && (
                  <div className="submenu">
                    <NavLink to="/lc">Entry</NavLink>

                    <NavLink to="/lc-history">History</NavLink>
                  </div>
                )}
              </div>
              <div className="menu-group">
                <div
                  className="menu-title"
                  onClick={() => setDrawbackOpen(!drawbackOpen)}
                >
                  Drawback
                  <FaChevronRight
                    className={drawbackOpen ? "arrow rotate" : "arrow"}
                  />
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
                  <FaChevronRight
                    className={rodtepOpen ? "arrow rotate" : "arrow"}
                  />
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
                  <FaChevronRight
                    className={otherSalesOpen ? "arrow rotate" : "arrow"}
                  />
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
            <div className="menu-left">
              <FaFileImport />

              <span>Importer Billing</span>
            </div>

            <FaChevronRight
              className={importerOpen ? "arrow rotate" : "arrow"}
            />
          </div>

          {importerOpen && (
            <div className="sidebar-child">
              <div className="sidebar-subchild">
                <NavLink to="/importer-billing">Entry</NavLink>

                <NavLink to="/importer-billing-history">History</NavLink>
              </div>
            </div>
          )}
          <div
            className="sidebar-parent"
            onClick={() => setFinanceOpen(!financeOpen)}
          >
            <div className="menu-left">
              <FaMoneyCheckAlt />

              <span>Finance</span>
            </div>

            <FaChevronRight
              className={financeOpen ? "arrow rotate" : "arrow"}
            />
          </div>

          {financeOpen && (
            <div className="sidebar-child">
              <div
                className="sidebar-submenu"
                onClick={() => setPaymentOpen(!paymentOpen)}
              >
                Payment
                <FaChevronRight
                  className={paymentOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {paymentOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/payment">Entry</NavLink>

                  <NavLink to="/payment-history">History</NavLink>
                </div>
              )}
              <div
                className="sidebar-submenu"
                onClick={() => setGstOpen(!gstOpen)}
              >
                GST
                <FaChevronRight
                  className={gstOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {gstOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/gst">Entry</NavLink>

                  <NavLink to="/gst-history">History</NavLink>
                </div>
              )}
            </div>
          )}
          <div
            className="sidebar-parent"
            onClick={() => setAccountingOpen(!accountingOpen)}
          >
            <div className="menu-left">
              <FaUniversity />

              <span>Accounting Charges</span>
            </div>

            <FaChevronRight
              className={accountingOpen ? "arrow rotate" : "arrow"}
            />
          </div>

          {accountingOpen && (
            <div className="sidebar-child">
              <div
                className="sidebar-submenu"
                onClick={() => setGovernmentOpen(!governmentOpen)}
              >
                Government Fee
                <FaChevronRight
                  className={governmentOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {governmentOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/government-fee">Entry</NavLink>

                  <NavLink to="/government-fee-history">History</NavLink>
                </div>
              )}
              <div
                className="sidebar-submenu"
                onClick={() => setAccountingGSTOpen(!accountingGSTOpen)}
              >
                GST Fee
                <FaChevronRight
                  className={accountingGSTOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {accountingGSTOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/gst-fee">Entry</NavLink>

                  <NavLink to="/gst-fee-history">History</NavLink>
                </div>
              )}
              <div
                className="sidebar-submenu"
                onClick={() => setIncomeTaxOpen(!incomeTaxOpen)}
              >
                Income Tax Fee
                <FaChevronRight
                  className={incomeTaxOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {incomeTaxOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/income-tax-fee">Entry</NavLink>

                  <NavLink to="/income-tax-fee-history">History</NavLink>
                </div>
              )}
              <div
                className="sidebar-submenu"
                onClick={() => setTaxAuditOpen(!taxAuditOpen)}
              >
                Tax Audit Fee
                <FaChevronRight
                  className={taxAuditOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {taxAuditOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/tax-audit-fee">Entry</NavLink>

                  <NavLink to="/tax-audit-fee-history">History</NavLink>
                </div>
              )}
              <div
                className="sidebar-submenu"
                onClick={() => setTDSOpen(!tdsOpen)}
              >
                TDS Fee
                <FaChevronRight
                  className={tdsOpen ? "arrow rotate" : "arrow"}
                />
              </div>

              {tdsOpen && (
                <div className="sidebar-subchild">
                  <NavLink to="/tds-fee">Entry</NavLink>

                  <NavLink to="/tds-fee-history">History</NavLink>
                </div>
              )}
            </div>
          )}
          <NavLink to="/reports">
            <FaFileInvoiceDollar className="menu-icon" />

            <span>Reports</span>
          </NavLink>
          <NavLink to="/generate-statement">
            <FaFileInvoiceDollar className="menu-icon" />

            <span>Generate Statement</span>
          </NavLink>
          <div
            className="sidebar-parent"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <div className="menu-left">
              <FaCog />

              <span>Administration</span>
            </div>

            <FaChevronRight className={adminOpen ? "arrow rotate" : "arrow"} />
          </div>

          {adminOpen && (
            <div className="sidebar-child">
              <div className="sidebar-subchild">
                <NavLink to="/activity-log">Activity Log</NavLink>
              </div>
            </div>
          )}
          <div
            className="sidebar-parent"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <div className="menu-left">
              <FaCog />

              <span>Settings</span>
            </div>

            <FaChevronRight
              className={settingsOpen ? "arrow rotate" : "arrow"}
            />
          </div>

          {settingsOpen && (
            <div className="sidebar-child">
              <div className="sidebar-subchild">
                <NavLink to="/company-profile">Company Profile</NavLink>

                <NavLink to="/backup">Backup</NavLink>
              </div>
            </div>
          )}
          <div
            className="sidebar-parent"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="menu-left">
              <FaUserCircle />

              <span>My Account</span>
            </div>

            <FaChevronRight
              className={profileOpen ? "arrow rotate" : "arrow"}
            />
          </div>

          {profileOpen && (
            <div className="sidebar-child">
              <div className="sidebar-subchild">
                <NavLink to="/profile">My Profile</NavLink>

                <NavLink to="/change-password">Change Password</NavLink>

                <NavLink to="/logout">Logout</NavLink>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <FaUserCircle />
          </div>

          <div className="user-info">
            <h4>{localStorage.getItem("name") || "Administrator"}</h4>

            <p>{localStorage.getItem("role") || "Business ERP User"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
