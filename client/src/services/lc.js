import api from "./api";
export const getLC = async () => {

    return await api.get("/lc/all");

};
export const getLCById = async (id) => {

    return await api.get(`/lc/${id}`);

};
export const saveLC = async (data) => {

    return await api.post("/lc/add", data);

};
export const updateLC = async (id, data) => {
    return await api.put(

        `/lc/update/${id}`,

        data

    );

};
export const filterLC = async(type,value,year)=>{

    return await api.get(
        `/lc/filter?type=${type}&value=${value}&year=${year}`
    );

};
export const deleteLC = async (id) => {

    return await api.delete(

        `/lc/delete/${id}`

    );

};

export const searchLC = async (keyword) => {

    return await api.get(

        `/lc/search/${keyword}`

    );

};