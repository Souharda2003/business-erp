import api from "./api";

// Add Other Sales
export const saveOtherSales = (data) => {
  return api.post("/other-sales/add", data);
};

// Get All Other Sales
export const getAllOtherSales = () => {
  return api.get("/other-sales/all");
};

// Get By Id
export const getOtherSalesById = (id) => {
  return api.get(`/other-sales/${id}`);
};

// Update
export const updateOtherSales = (id, data) => {
  return api.put(`/other-sales/update/${id}`, data);
};

// Delete
export const deleteOtherSales = (id) => {
  return api.delete(`/other-sales/delete/${id}`);
};

// Search
export const searchOtherSales = (keyword) => {
  return api.get(`/other-sales/search/${keyword}`);
};

// Filter
export const filterOtherSales = (
  type,
  value,
  year,
  serviceType
) => {
  return api.get("/other-sales/filter", {
    params: {
      type,
      value,
      year,
      serviceType,
    },
  });
};