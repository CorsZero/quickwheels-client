// api/http.ts
import axios from "axios";

const token = localStorage.getItem("authToken");

const VEHICLE_BASE_URL = (import.meta.env.VITE_VEHICLE_API_BASE_URL as string);

export const httpVehicle = axios.create({
  baseURL: VEHICLE_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add response interceptor to properly handle errors
httpVehicle.interceptors.response.use(
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




const BOOKING_BASE_URL = (import.meta.env.VITE_BOOKING_API_BASE_URL as string);

export const httpBooking = axios.create({
  baseURL: BOOKING_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add response interceptor to properly handle errors
httpBooking.interceptors.response.use(
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
