import axios from "axios";
const API_URL = "http://127.0.0.1:5000";

export const startRegistration = (data) =>
  axios.post(`${API_URL}/auth/register-start`, data);

export const completeRegistration = (data) =>
  axios.post(`${API_URL}/auth/register-complete`, data);

// already had:
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data); // (old simple path, optional)
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const forgotPassword = (data) => axios.post(`${API_URL}/auth/forgot`, data);
export const resetPassword = (token, data) =>
  axios.post(`${API_URL}/auth/reset/${token}`, data);
export const getUserInfo = (token) =>
  axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }});
