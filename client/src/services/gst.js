import api from "./api";

export const getGSTHistory = async () => {
  return await api.get("/gst/history");
};

export const filterGST = async (
  type,

  value,

  year,
) => {
  return await api.get(
    "/gst/filter",

    {
      params: {
        type,

        value,

        year,
      },
    },
  );
};

export const getGSTById = async (id) => {
  return await api.get(`/gst/${id}`);
};

export const updateGST = async (
  id,

  data,
) => {
  return await api.put(
    `/gst/update/${id}`,

    data,
  );
};

export const deleteGST = async (id) => {
  return await api.delete(`/gst/delete/${id}`);
};

export const saveGST = async (data) => {
  return await api.post(
    "/gst/add",

    data,
  );
};

export const searchGST = async (keyword) => {
  return await api.get(`/gst/search/${keyword}`);
};
export const getGSTInvoiceById = (id) => {
  return api.get(`/gst/invoice/${id}`);
};
