import api from "./api";
export const saveRODTEP = async (data) => {
  return await api.post("/rodtep/add", data);
};
export const getRODTEP = async () => {
  return await api.get("/rodtep/all");
};
export const getRODTEPById = async (id) => {
  return await api.get(`/rodtep/${id}`);
};
export const updateRODTEP = async (id, data) => {
  return await api.put(`/rodtep/update/${id}`, data);
};
export const deleteRODTEP = async (id) => {
  return await api.delete(`/rodtep/delete/${id}`);
};
export const filterRODTEP = async (type, value, year) => {
  return await api.get(
    `/rodtep/filter?type=${type}&value=${value}&year=${year}`
  );
};
export const searchRODTEP = async (keyword) => {
  return await api.get(`/rodtep/search/${keyword}`);
};