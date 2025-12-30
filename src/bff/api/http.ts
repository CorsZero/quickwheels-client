// api/http.ts
import axios from "axios";
import { TokenManager } from '../../utils/tokenManager';


// HTTP client for Vehicle API
const VEHICLE_BASE_URL = (import.meta.env.VITE_VEHICLE_API_BASE_URL as string);

export const httpVehicle = axios.create({
  baseURL: VEHICLE_BASE_URL,
});

// Add request interceptor to attach fresh token on each request
httpVehicle.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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



// HTTP client for Booking API
const BOOKING_BASE_URL = (import.meta.env.VITE_BOOKING_API_BASE_URL as string);

export const httpBooking = axios.create({
  baseURL: BOOKING_BASE_URL,
});

// Add request interceptor to attach fresh token on each request
httpBooking.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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


// HTTP client for Auth API
const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_API_BASE_URL as string);

export const httpAuth = axios.create({
  baseURL: AUTH_BASE_URL,
});

// Add request interceptor to attach fresh token on each request
httpAuth.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to properly handle errors
httpAuth.interceptors.response.use(
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
