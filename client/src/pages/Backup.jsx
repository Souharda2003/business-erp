import { useState, useEffect } from "react";

import BackButton from "../components/BackButton";

import {
  FaDatabase,
  FaDownload,
  FaUpload,
  FaHistory,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../services/api";

import "../css/backup.css";

function Backup() {
  const [loading, setLoading] = useState(false);
const [financialYear, setFinancialYear] = useState("");
const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [backupHistory, setBackupHistory] = useState([]);

  const [lastBackup, setLastBackup] = useState(null);

  const [backupStatus, setBackupStatus] = useState("No Backup");

  const [selectedFile, setSelectedFile] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [autoBackupTime] = useState("11:00 PM Daily");

  const [refreshKey, setRefreshKey] = useState(0);

  const companyName = localStorage.getItem("company_name") || "Business ERP";

  useEffect(() => {
    loadBackupHistory();

    loadLatestBackup();

    loadBackupStatus();
  }, [refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [financialYear]);

  const loadBackupHistory = async () => {
    try {
      const res = await api.get("/backup/history");

      if (res.data.success) {
        setBackupHistory(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadLatestBackup = async () => {
    try {
      const res = await api.get("/backup/latest");

      if (res.data.success && res.data.backupExists) {
        setLastBackup(res.data.data);
      } else {
        setLastBackup(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadBackupStatus = async () => {
    try {
      const res = await api.get("/backup/status");

      if (res.data.success && res.data.backupExists) {
        setBackupStatus("Backup Available");
      } else {
        setBackupStatus("No Backup");
      }
    } catch (error) {
      setBackupStatus("Server Error");
    }
  };
  const handleManualBackup = async () => {
    try {
      setLoading(true);

      setSuccessMessage("");

      setErrorMessage("");

      const res = await api.post(
        "/backup/create",

        {
          user_name: localStorage.getItem("user_name") || "Admin",
        },
      );

      if (res.data.success) {
        setSuccessMessage("Backup Created Successfully");

        loadBackupHistory();

        loadLatestBackup();

        loadBackupStatus();
      }
    }catch (error) {

    console.log("Backup Error :", error);

    console.log("Response :", error.response);

    console.log("Data :", error.response?.data);

    setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Backup Failed"
    );
}finally {
      setLoading(false);
    }
  };
  const handleDownload = async (fileName) => {
    try {
      window.open(
        `${import.meta.env.VITE_API_URL}/backup/download/${fileName}`,

        "_blank",
      );
    } catch (error) {
      console.log(error);

      setErrorMessage("Download Failed");
    }
  };
  const handleDelete = async (fileName) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this backup ?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const res = await api.delete(
        `/backup/delete/${fileName}`,

        {
          data: {
            user_name: localStorage.getItem("user_name") || "Admin",
          },
        },
      );

      if (res.data.success) {
        setSuccessMessage("Backup Deleted Successfully");

        loadBackupHistory();

        loadLatestBackup();

        loadBackupStatus();
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(error.response?.data?.message || "Delete Failed");
    } finally {
      setLoading(false);
    }
  };
  const handleRestore = async (fileName) => {
    const confirmRestore = window.confirm(
      "Restore this backup ? Current database will be overwritten.",
    );

    if (!confirmRestore) {
      return;
    }

    try {
      setRestoreLoading(true);

      const res = await api.post(
        `/backup/restore/${fileName}`,

        {
          user_name: localStorage.getItem("user_name") || "Admin",
        },
      );

      if (res.data.success) {
        setSuccessMessage("Backup Restored Successfully");

        loadBackupHistory();

        loadLatestBackup();

        loadBackupStatus();
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(error.response?.data?.message || "Restore Failed");
    } finally {
      setRestoreLoading(false);
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
  };
  useEffect(() => {
    if (!successMessage && !errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");

      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);
  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleString(
      "en-IN",

      {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      },
    );
  };

  const formatSize = (size) => {
    if (!size) {
      return "0 MB";
    }

    return size;
  };
  return (
        <div className="page">
          <BackButton />

          <div className="backup-header">
            <div>
              <h1 className="page-title">
                <FaDatabase />
                &nbsp; Backup & Restore
              </h1>

              <p className="backup-subtitle">
                Create, Download, Restore and Manage ERP Backups
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="backup-success">
              <FaCheckCircle />
              &nbsp;
              {successMessage}
            </div>
          )}

          {errorMessage && <div className="backup-error">{errorMessage}</div>}

          <div className="backup-card-container">
            <div className="backup-card">
              <h3>Current Status</h3>

              <h2>{backupStatus}</h2>

              <p>System Backup Status</p>
            </div>

            <div className="backup-card">
              <h3>Auto Backup</h3>

              <h2>{autoBackupTime}</h2>

              <p>Daily Scheduled Backup</p>
            </div>

            <div className="backup-card">
              <h3>Last Backup</h3>

              <h2>
                {lastBackup ? formatDate(lastBackup.created_at) : "No Backup"}
              </h2>

              <p>Latest Available Backup</p>
            </div>

            <div className="backup-card">
              <h3>Total Backups</h3>

              <h2>{backupHistory.length}</h2>

              <p>Available Backup Files</p>
            </div>
          </div>

          <div className="backup-action-section">
            <button
              className="backup-btn"
              onClick={handleManualBackup}
              disabled={loading}
            >
              <FaDatabase />
              &nbsp;
              {loading ? "Creating Backup..." : "Create Backup"}
            </button>

            <input type="file" accept=".zip" onChange={handleFileChange} />

            {selectedFile && (
              <div className="selected-backup-file">
                Selected :{selectedFile.name}
              </div>
            )}
          </div>
          <div className="backup-history-container">
            <div className="backup-history-header">
              <h2>
                <FaHistory />
                &nbsp; Backup History
              </h2>
            </div>

            {backupHistory.length === 0 ? (
              <div className="backup-empty">No Backup Available</div>
            ) : (
              <table className="backup-table">
                <thead>
                  <tr>
                    <th>Backup Name</th>

                    <th>Date</th>

                    <th>Time</th>

                    <th>Size</th>

                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {backupHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.backup_name}</td>

                      <td>{item.backup_date}</td>

                      <td>{item.backup_time}</td>

                      <td>{formatSize(item.backup_size)}</td>

                      <td>
                        <span className="backup-status-success">
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <div className="backup-action-buttons">
                          <button
                            className="download-btn"
                            onClick={() => handleDownload(item.backup_name)}
                          >
                            <FaDownload />
                          </button>

                          <button
                            className="restore-btn"
                            disabled={restoreLoading}
                            onClick={() => handleRestore(item.backup_name)}
                          >
                            <FaUpload />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item.backup_name)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {restoreLoading && (
            <div className="backup-loader">
              <div className="backup-spinner"></div>

              <h3>Restoring Backup...</h3>

              <p>Please wait...</p>
            </div>
          )}

          {loading && (
            <div className="backup-loader">
              <div className="backup-spinner"></div>

              <h3>Creating Backup...</h3>

              <p>Please wait...</p>
            </div>
          )}
          <div className="backup-info-section">
            <div className="backup-info-card">
              <h3>Backup Information</h3>

              <ul>
                <li>
                  ✅ Auto Backup runs every day at
                  <strong> 11:00 PM</strong>
                </li>

                <li>✅ Manual Backup can be created anytime</li>

                <li>✅ Restore will recover all ERP data</li>

                <li>✅ Activity Log is automatically updated</li>

                <li>✅ Backup files are stored securely</li>
              </ul>
            </div>

            <div className="backup-info-card">
              <h3>Restore Warning</h3>

              <p>Restoring a backup will overwrite the current database.</p>

              <p>
                Make sure you have created a latest backup before restoring an
                old backup.
              </p>
            </div>

            <div className="backup-info-card">
              <h3>Backup Statistics</h3>

              <div className="backup-stat-row">
                <span>Total Backups</span>

                <strong>{backupHistory.length}</strong>
              </div>

              <div className="backup-stat-row">
                <span>Status</span>

                <strong>{backupStatus}</strong>
              </div>

              <div className="backup-stat-row">
                <span>Schedule</span>

                <strong>{autoBackupTime}</strong>
              </div>

              <div className="backup-stat-row">
                <span>Company</span>

                <strong>{companyName}</strong>
              </div>
            </div>
          </div>

          <div className="backup-footer">
            <p>Business ERP Backup & Restore Module</p>

            <p>Database • Activity Log • Auto Backup • Manual Backup</p>
          </div>
        </div>
  );
}
export default Backup;
