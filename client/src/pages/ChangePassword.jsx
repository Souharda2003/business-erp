import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/auth";
import BackButton from "../components/BackButton";
import "../css/settings.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [financialYear, setFinancialYear] = useState("");
const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [password, setPassword] = useState({
    newPassword: "",

    confirmPassword: "",
  });
  const handleSubmit = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("Password Not Match");

      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(password.newPassword)) {
      alert(
        "Password must contain Uppercase Lowercase Number Special Character",
      );

      return;
    }

    try {
      setLoading(true);

      const res = await changePassword(password.newPassword);

      if (res.data.success) {
        setSuccessModal(true);

        setTimeout(() => {
          localStorage.clear();

          window.location.href = "/login";
        }, 3000);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate("/dashboard");
  };
  const handleChange = (e) => {
    setPassword({
      ...password,

      [e.target.name]: e.target.value,
    });
  };

  const getStrength = () => {
    let score = 0;

    if (password.newPassword.length >= 8) score++;

    if (/[A-Z]/.test(password.newPassword)) score++;

    if (/[a-z]/.test(password.newPassword)) score++;

    if (/\d/.test(password.newPassword)) score++;

    if (/[@$!%*?&]/.test(password.newPassword)) score++;

    return score;
  };

  const strength = getStrength();

  return (

        <div className="settings-page">
<BackButton/>
          <div className="settings-title">
            <h1> Change Password</h1>

            <p>
              Keep your Business ERP account secure by using a strong password.
            </p>
          </div>

          <div className="settings-card">
            <div className="input-group">
              <label>New Password</label>

              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handleChange}
                  placeholder="Enter New Password"
                />

                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="strength-area">
              <div className={`strength-bar strength-${strength}`}></div>

              <p>
                {strength <= 2
                  ? "Weak Password"
                  : strength <= 4
                    ? "Medium Password"
                    : "Strong Password"}
              </p>
            </div>

            <div className="rules">
              <p className={password.newPassword.length >= 8 ? "ok" : ""}>
                ✓ Minimum 8 Characters
              </p>

              <p className={/[A-Z]/.test(password.newPassword) ? "ok" : ""}>
                ✓ One Uppercase Letter
              </p>

              <p className={/[a-z]/.test(password.newPassword) ? "ok" : ""}>
                ✓ One Lowercase Letter
              </p>

              <p className={/\d/.test(password.newPassword) ? "ok" : ""}>
                ✓ One Number
              </p>

              <p className={/[@$!%*?&]/.test(password.newPassword) ? "ok" : ""}>
                ✓ One Special Character
              </p>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <div className="password-box">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />

                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {password.confirmPassword.length > 0 &&
              (password.newPassword === password.confirmPassword ? (
                <p className="match success">✓ Password Matched</p>
              ) : (
                <p className="match error">✗ Password Not Matched</p>
              ))}

            <div className="button-area">
              <button
                className={`update-btn ${loading ? "loading" : ""}`}
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    &nbsp; Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
  );
  {
    successModal && (
      <div className="success-modal">
        <div className="success-card">
          <h1>✅</h1>

          <h2>Password Updated Successfully</h2>

          <p>
            Your account password has been updated. For security reasons you
            will be redirected to Login.
          </p>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
