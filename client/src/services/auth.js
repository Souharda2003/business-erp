import api from "./api";
export const loginUser = async (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = async (data) => {
  return api.post("/auth/register", data);
};


export const sendOTP = async (mobile) => {
  return await api.post(
    "/auth/send-otp",

    {
      mobile,
    },
  );
};


export const verifyOTP = async (
  mobile,

  otp,
) => {
  return await api.post(
    "/auth/verify-otp",

    {
      mobile,

      otp,
    },
  );
};


export const resetPassword = async (
  mobile,

  password,
) => {
  return await api.post(
    "/auth/reset-password",

    {
      mobile,

      password,
    },
  );
};


export const resendOTP = async (mobile) => {
  return await api.post(
    "/auth/resend-otp",

    {
      mobile,
    },
  );
};


export const changePassword = async (newPassword) => {
  return await api.put(
    "/auth/change-password",

    {
      newPassword,
    },
  );
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.log(err);
  }

  localStorage.clear();

  window.location.href = "/login";
};
