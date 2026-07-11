import api from "./api";

export const getSales = async () => {
  return await api.get("/sales/all");
};

export const getSalesById = async (id) => {
  return await api.get(`/sales/${id}`);
};

export const saveSales = async (data) => {
  return await api.post("/sales/add", data);
};

export const updateSales = async (id, data) => {
  return await api.put(
    `/sales/update/${id}`,

    data,
  );
};

export const deleteSales = async (id) => {
  return await api.delete(`/sales/delete/${id}`);
};

export const searchSales = async (keyword) => {
  return await api.get(`/sales/search/${keyword}`);
};

export const getTodaySales = async () => {
  return await api.get("/sales/today");
};

export const getMonthlySales = async () => {
  return await api.get("/sales/monthly");
};

export const getSalesSummary = async () => {
  return await api.get("/sales/summary");
};

export const filterSales = async (
  type,

  value,

  year,
) => {
  return await api.get(
    `/sales/filter?type=${type}&value=${value}&year=${year}`,
  );
};
