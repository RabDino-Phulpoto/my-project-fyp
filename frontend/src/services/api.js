import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Flask backend URL
});

export const uploadImage = (data) => api.post("/upload", data);
export const getResults = () => api.get("/results");
export const getReports = () => api.get("/reports");
