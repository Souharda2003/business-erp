import api from "./api";
export const getPayments = async () => {
  return await api.get("/payment/all");
};
export const getPaymentById = async (id) => {
  return await api.get(`/payment/${id}`);
};
export const savePayment = async (data) => {
  return await api.post("/payment/add", data);
};
export const updatePayment = async (id, data) => {
  return await api.put(
    `/payment/update/${id}`,

    data,
  );
};
export const deletePayment = async (id) => {
  return await api.delete(`/payment/delete/${id}`);
};
export const searchPayment = async (keyword) => {
  return await api.get(`/payment/search/${keyword}`);
};
export const getTodayPayments = async () => {
  return await api.get("/payment/today");
};
export const getMonthlyPayments = async () => {
  return await api.get("/payment/monthly");
};
export const getPaymentSummary = async () => {
  return await api.get("/payment/summary");
};
export const filterPayment = async (
  searchType,

  searchValue,

  currentYear,
) => {
  return await api.get(
    "/payment/filter",

    {
      params: {
        type: searchType,

        value: searchValue,

        year: currentYear,
      },
    },
  );
};
export const getPaymentLedger = async (
  customerName,

  financialYear,
) => {
  return await api.get(
    "/payment/ledger",

    {
      params: {
        customer_name: customerName,

        financial_year: financialYear,
      },
    },
  );
};
