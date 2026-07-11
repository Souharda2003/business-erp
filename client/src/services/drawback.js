import api from "./api";

export const saveDrawback = async (data) => {
  return await api.post("/drawback/add", data);
};

export const getDrawback = async () => {
  return await api.get("/drawback/all");
};

export const getDrawbackById = async (id) => {
  return await api.get(`/drawback/${id}`);
};

export const updateDrawback = async (id, data) => {
  return await api.put(`/drawback/update/${id}`, data);
};

export const deleteDrawback = async (id) => {
  return await api.delete(`/drawback/delete/${id}`);
};

export const searchDrawback = async (keyword) => {
  return await api.get(`/drawback/search/${keyword}`);
};

export const filterDrawback = async (type, value, year) => {
  return await api.get(
    `/drawback/filter?type=${type}&value=${value}&year=${year}`
  );
};

export const getInvoiceList = async () => {
  return await api.get("/drawback/invoice-list");
};

export const getProductList = async () => {
  return await api.get("/drawback/product-list");
};