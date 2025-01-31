import axiosInstance from "./axios";

export const login = async () => {
  const { data } = await axiosInstance.get("/auth");
  window.location.href = data.data;
};

export const logout = async () => {
  const { data } = await axiosInstance.get("/auth/logout");
  // if (data.success) {
  //   window.location.href = "/";
  // }
  window.location.reload();
  // window.location.href = "/";
};
