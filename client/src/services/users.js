import api from "./api";

export const getUsers=()=>{

return api.get("/users/all");

};

export const deleteUser=(id)=>{

return api.delete(`/users/${id}`);

};

export const changeStatus=(data)=>{

return api.put("/users/status",data);

};