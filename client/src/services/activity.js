import api from "./api";
export const getActivityLog = async () => {
    return await api.get("/activity");

};