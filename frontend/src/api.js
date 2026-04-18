import axiosInstance from "./axiosConfig";

export const sendOTP = (data) =>
  axiosInstance.post(`/api/auth/send-otp`, data);

export const verifyOTP = (data) =>
  axiosInstance.post(`/api/auth/verify-otp`, data);

export const registerUser = (data) =>
  axiosInstance.post(`/api/auth/register`, data);

export const loginUser = (data) =>
  axiosInstance.post(`/api/auth/login`, data);

export const getUserInfo = (token) =>
  axiosInstance.get(`/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });

export const forgotPasswordStart = (data) =>
  axiosInstance.post(`/api/auth/forgot-password`, data);

export const forgotPasswordVerify = (data) =>
  axiosInstance.post(`/api/auth/forgot-verify-otp`, data);

export const resetPassword = (data) =>
  axiosInstance.post(`/api/auth/reset-password`, data);

export const getUserStats = () =>
  axiosInstance.get(`/api/user-stats`);

export const getUserReports = (page = 1, limit = 10, filter = "all") =>
  axiosInstance.get(`/api/user-reports`, { params: { page, limit, filter } });
