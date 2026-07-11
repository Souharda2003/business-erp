import api from "./api";

export const saveGovernmentFee = async (data) => {
  return await api.post("/accounting/government-fee/add", data);
};

export const getGovernmentFee = async () => {
  return await api.get("/accounting/government-fee/all");
};

export const getGovernmentFeeById = async (id) => {
  return await api.get(`/accounting/government-fee/${id}`);
};

export const updateGovernmentFee = async (id, data) => {
  return await api.put(`/accounting/government-fee/update/${id}`, data);
};

export const deleteGovernmentFee = async (id) => {
  return await api.delete(`/accounting/government-fee/delete/${id}`);
};

export const filterGovernmentFee = async (
  type,

  value,

  year,

  financialYear,
) => {
  return await api.get(
    "/accounting/government-fee/filter",

    {
      params: {
        type,

        value,

        year,

        financialYear,
      },
    },
  );
};
export const searchGovernmentFee = async (keyword) => {
  return await api.get(`/accounting/government-fee/search/${keyword}`);
};

export const saveGSTFee = async (data) => {
  return await api.post("/accounting/gst-fee/add", data);
};

export const getGSTFee = async () => {
  return await api.get("/accounting/gst-fee/all");
};

export const getGSTFeeById = async (id) => {
  return await api.get(`/accounting/gst-fee/${id}`);
};

export const updateGSTFee = async (id, data) => {
  return await api.put(`/accounting/gst-fee/update/${id}`, data);
};

export const deleteGSTFee = async (id) => {
  return await api.delete(`/accounting/gst-fee/delete/${id}`);
};

export const filterGSTFee = async (
  type,

  value,

  year,

  financialYear,
) => {
  return await api.get(
    "/accounting/gst-fee/filter",

    {
      params: {
        type,

        value,

        year,

        financialYear,
      },
    },
  );
};
export const searchGSTFee = async (keyword) => {
  return await api.get(
    `/accounting/gst-fee/search/${keyword}`
  );
};
export const getIncomeTaxFee = async () => {
  return await api.get("/accounting/income-tax-fee/all");
};

export const getIncomeTaxFeeById = async (id) => {
  return await api.get(`/accounting/income-tax-fee/${id}`);
};

export const updateIncomeTaxFee = async (id, data) => {
  return await api.put(`/accounting/income-tax-fee/update/${id}`, data);
};

export const deleteIncomeTaxFee = async (id) => {
  return await api.delete(`/accounting/income-tax-fee/delete/${id}`);
};

export const filterIncomeTaxFee = async (
  type,
  
  value,
  
  year,
  
  financialYear,
) => {
  return await api.get(
    "/accounting/income-tax-fee/filter",
    
    {
      params: {
        type,
        
        value,
        
        year,
        
        financialYear,
      },
    },
  );
};
export const searchIncomeTaxFee = async (keyword) => {

  return await api.get(

    `/accounting/income-tax-fee/search/${keyword}`

  );

};
export const saveIncomeTaxFee = async (data) => {
  return await api.post("/accounting/income-tax-fee/add", data);
};
export const saveTaxAuditFee = async (data) => {
  return await api.post("/accounting/tax-audit-fee/add", data);
};

export const getTaxAuditFee = async () => {
  return await api.get("/accounting/tax-audit-fee/all");
};

export const getTaxAuditFeeById = async (id) => {
  return await api.get(`/accounting/tax-audit-fee/${id}`);
};

export const updateTaxAuditFee = async (id, data) => {
  return await api.put(`/accounting/tax-audit-fee/update/${id}`, data);
};

export const deleteTaxAuditFee = async (id) => {
  return await api.delete(`/accounting/tax-audit-fee/delete/${id}`);
};

export const filterTaxAuditFee = async (
  type,

  value,

  year,

  financialYear,
) => {
  return await api.get(
    "/accounting/tax-audit-fee/filter",

    {
      params: {
        type,

        value,

        year,

        financialYear,
      },
    },
  );
};
export const searchTaxAuditFee = async (keyword) => {
  return await api.get(
    `/accounting/tax-audit-fee/search/${keyword}`
  );
};
export const saveTDSFee = async (data) => {
  return await api.post("/accounting/tds-fee/add", data);
};

export const getTDSFee = async () => {
  return await api.get("/accounting/tds-fee/all");
};

export const getTDSFeeById = async (id) => {
  return await api.get(`/accounting/tds-fee/${id}`);
};

export const updateTDSFee = async (id, data) => {
  return await api.put(`/accounting/tds-fee/update/${id}`, data);
};

export const deleteTDSFee = async (id) => {
  return await api.delete(`/accounting/tds-fee/delete/${id}`);
};

export const filterTDSFee = async (
  type,

  value,

  year,

  financialYear,
) => {
  return await api.get(
    "/accounting/tds-fee/filter",

    {
      params: {
        type,

        value,

        year,

        financialYear,
      },
    },
  );
};
export const searchTDSFee = async (keyword) => {
  return await api.get(
    `/accounting/tds-fee/search/${keyword}`
  );
};
export const getProfitSummary = async (
  searchType,

  searchValue,

  currentYear,
) => {
  return await api.get(
    "/profit/summary",

    {
      params: {
        searchType,

        searchValue,

        currentYear,
      },
    },
  );
};
