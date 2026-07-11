import api from "./api";

export const getCompany = () => {
    return api.get("/company");
};

export const saveCompany = (data) => {
    return api.post("/company/save", data);
};

export const updateCompany = (id, data) => {
    return api.put(`/company/update/${id}`, data);
};

export const deleteCompany = (id) => {
    return api.delete(`/company/delete/${id}`);
};