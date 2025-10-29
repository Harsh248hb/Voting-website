import axios from "axios";

const API_URL = "http://localhost:3000"; 

export const api = axios.create({
  baseURL: API_URL
});

// Attach token if found
api.interceptors.request.use((req) => {
 
  const token = localStorage.getItem("token");
    console.log("Sending token:", token);
  if (token) req.headers["Authorization"] = `Bearer ${token}`;
  return req;
});
