import api from "./api";
export const getStock = async () => {
    return await api.get("/stock/all");
};
export const getStockById = async (id) => {
    return await api.get(`/stock/${id}`);
};
export const saveStock = async (data) => {
    return await api.post("/stock/add", data);
};
export const updateStock = async (id, data) => {
    return await api.put(`/stock/update/${id}`, data);
};
export const deleteStock = async (id) => {
    return await api.delete(`/stock/delete/${id}`);
};
export const searchStock = async (keyword) => {
    return await api.get(`/stock/search/${keyword}`);
};
export const getLowStock = async () => {
    return await api.get("/stock/low-stock");
};
export const getStockSummary = async () => {
    return await api.get("/stock/summary");
};