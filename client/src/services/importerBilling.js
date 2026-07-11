import api from "./api";

// Save
export const saveImporterBilling = async (data) => {
  return await api.post("/importer-billing", data);
};

// Get All
export const getImporterBilling = async () => {
  return await api.get("/importer-billing");
};

// Get By Id
export const getImporterBillingById = async (id) => {
  return await api.get(`/importer-billing/${id}`);
};

// Update
export const updateImporterBilling = async (id, data) => {
  return await api.put(`/importer-billing/${id}`, data);
};

// Delete
export const deleteImporterBilling = async (id) => {
  return await api.delete(`/importer-billing/${id}`);
};

// Filter
export const filterImporterBilling = async (
  searchType,
  searchValue,
  currentYear
) => {
  return await api.get("/importer-billing/filter", {
    params: {
      type: searchType,
      value: searchValue,
      year: currentYear,
    },
  });
};

// Search LC
export const searchImporterBillingByLC = async (lcNo) => {
  return await api.get("/importer-billing/search", {
    params: {
      lc_no: lcNo,
    },
  });
};

// Search Importer
export const searchImporterBillingByName = async (importerName) => {
  return await api.get("/importer-billing/search-name", {
    params: {
      importer_name: importerName,
    },
  });
};