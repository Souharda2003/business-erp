import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/admin.css";

function Admin() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page">
          <h1 className="page-title">Admin Dashboard</h1>

          <div className="card-container">
            <div className="dashboard-card">
              <h3>Total Users</h3>
              <h2>25</h2>
            </div>
            <div className="dashboard-card">
              <h3>Managers</h3>
              <h2>5</h2>
            </div>
            <div className="dashboard-card">
              <h3>Customers</h3>
              <h2>150</h2>
            </div>
            <div className="dashboard-card">
              <h3>Staff</h3>
              <h2>18</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
