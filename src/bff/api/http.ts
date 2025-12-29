// api/http.ts
import axios from "axios";

const token = localStorage.getItem("authToken");

export const http = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
