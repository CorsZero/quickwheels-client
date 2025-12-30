// api/http.ts
import axios from "axios";

const token = localStorage.getItem("authToken");

export const http = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add response interceptor to properly handle errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we have a response from the server, attach it to the error
    if (error.response) {
      // Extract the server's error message/data
      const serverError = error.response.data;
      
      // Create a more descriptive error message
      const errorMessage = serverError?.message || 
                          serverError?.error || 
                          serverError?.title ||
                          `Request failed with status code ${error.response.status}`;
      
      // Attach the full server response for debugging
      error.message = errorMessage;
      error.serverResponse = serverError;
      error.statusCode = error.response.status;
    }
    
    return Promise.reject(error);
  }
);
