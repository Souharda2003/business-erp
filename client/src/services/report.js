import api from "./api";
export const getReport = async () => {
    return await api.get("/report/all");
};
export const getDailyReport = async () => {
    return await api.get("/report/daily");
};
export const getMonthlyReport = async () => {
    return await api.get("/report/monthly");
};
export const getYearlyReport = async () => {
    return await api.get("/report/yearly");
};
export const searchReport = async (keyword) => {
    return await api.get(`/report/search/${keyword}`);
};
export const getReportSummary = async () => {
    return await api.get("/report/summary");
};