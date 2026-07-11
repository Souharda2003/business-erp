import api from "./api";
export const uploadFile = async (formData) => {
    return await api.post(
        "/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};
export const uploadLogo = async (formData) => {
    return await api.post(
        "/upload/logo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};
export const uploadProfile = async (formData) => {
    return await api.post(
        "/upload/profile",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};
export const uploadInvoice = async (formData) => {
    return await api.post(
        "/upload/invoice",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};