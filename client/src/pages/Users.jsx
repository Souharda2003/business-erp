import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/settings.css";

function Users() {
  const users = [
    {
      id: 1,
      name: "Admin",
      email: "admin@erp.com",
      role: "Super Admin",
      status: "Active",
    },

    {
      id: 2,
      name: "Manager",
      email: "manager@erp.com",
      role: "Manager",
      status: "Active",
    },

    {
      id: 3,
      name: "Staff",
      email: "staff@erp.com",
      role: "Staff",
      status: "Inactive",
    },
  ];

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="settings-page">
          <div className="settings-header">
            <h1>User Management</h1>

            <button className="save-btn">+ Add User</button>
          </div>

          <div className="settings-card">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.role}</td>

                    <td>{user.status}</td>

                    <td>
                      <button>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
