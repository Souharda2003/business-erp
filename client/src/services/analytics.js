import api from "./api";
export const getAnalytics = async(year)=>{

    return await api.get(
        `/analytics/summary?year=${year}`
    );

};
export const getBusinessAnalytics = async (financialYear) => {
    return await api.get(
        `/analytics/business?financialYear=${financialYear}`
    );
};