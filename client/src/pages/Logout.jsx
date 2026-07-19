import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/logout.css";

function Logout() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(true);

  const handleYes = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("financialYear");

    navigate("/login", {
      replace: true,
    });
  };

  const handleNo = () => {
    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <>
      {showModal && (
        <div className="logout-overlay">
          <div className="logout-card">
            <div className="logout-icon">🔒</div>

            <h2 className="logout-title">
    Logout
</h2>

            <p>Are you sure you want to logout from Business ERP?</p>

            <div className="logout-buttons">
              <button className="cancel-btn" onClick={handleNo}>
                No
              </button>

              <button className="logout-btn" onClick={handleYes}>
                Yes Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Logout;
