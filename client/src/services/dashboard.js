
import api from "./api";

export const getDashboard = async (financialYear) => {
  return await api.get(`/report/dashboard?financialYear=${financialYear}`);
};
export const getPurchaseTrend = (financialYear) => {
  return api.get(`/report/purchase-trend?financialYear=${financialYear}`);
};
export const getAccountingSummary = async (financialYear) => {
  return await api.get("/report/accounting-summary", {
    params: {
      financialYear,
    },
  });
};
