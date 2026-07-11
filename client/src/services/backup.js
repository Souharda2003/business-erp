import api from "./api";

// ======================================
// Create Manual Backup
// ======================================

export const createBackup = async (user_name) => {
  return await api.post(
    "/backup/create",

    {
      user_name,
    },
  );
};

// ======================================
// Get Backup History
// ======================================

export const getBackupHistory = async () => {
  return await api.get("/backup/history");
};

// ======================================
// Get Latest Backup
// ======================================

export const getLatestBackup = async () => {
  return await api.get("/backup/latest");
};

// ======================================
// Get Backup Status
// ======================================

export const getBackupStatus = async () => {
  return await api.get("/backup/status");
};

// ======================================
// Download Backup
// ======================================

export const downloadBackup = async (fileName) => {
  return await api.get(
    `/backup/download/${fileName}`,

    {
      responseType: "blob",
    },
  );
};

// ======================================
// Restore Backup
// ======================================

export const restoreBackup = async (
  fileName,

  user_name,
) => {
  return await api.post(
    `/backup/restore/${fileName}`,

    {
      user_name,
    },
  );
};

// ======================================
// Delete Backup
// ======================================

export const deleteBackup = async (
  fileName,

  user_name,
) => {
  return await api.delete(
    `/backup/delete/${fileName}`,

    {
      data: {
        user_name,
      },
    },
  );
};

// ======================================
// Backup Health
// ======================================

export const getBackupHealth = async () => {
  return await api.get("/backup/health");
};

// ======================================
// Upload Backup File
// ======================================

export const uploadBackup = async (file) => {
  const formData = new FormData();

  formData.append(
    "backup",

    file,
  );

  return await api.post(
    "/backup/upload",

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// ======================================
// Auto Backup Info
// ======================================

export const getAutoBackupInfo = async () => {
  return await api.get("/backup/auto-info");
};

// ======================================
// Storage Details
// ======================================

export const getBackupStorage = async () => {
  return await api.get("/backup/storage");
};
