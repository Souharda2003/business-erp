import api from "./api";

// Get All Purchase

export const getPurchases = () => {

    return api.get("/purchase/all");

};

// Get Single Purchase

export const getPurchaseById = (id) => {

    return api.get(`/purchase/${id}`);

};

// Save Purchase

export const savePurchase = (data) => {

    return api.post("/purchase", data);

};

// Update Purchase

export const updatePurchase = (id, data) => {

    return api.put(`/purchase/update/${id}`, data);

};

// Delete Purchase

export const deletePurchase = (id) => {

    return api.delete(`/purchase/delete/${id}`);

};

// Filter Purchase

export const filterPurchase = (type, value, year) => {

    return api.get(

        `/purchase/filter?type=${type}&value=${value}&year=${year}`

    );

};