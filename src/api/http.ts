// api/http.ts
// Secure cookie-based authentication - no JS token handling
import axios, { type AxiosInstance, type AxiosError } from "axios";

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for automatic token refresh via HttpOnly cookies
const createResponseErrorInterceptor = (client: AxiosInstance, _serviceName: string) => async (error: AxiosError) => {
  const originalRequest: any = error.config;

  // If 401 error and not already retrying
  if (error.response?.status === 401 && !originalRequest._retry) {
    // Don't try to refresh for login/register endpoints
    if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue this request while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => client(originalRequest))
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Refresh uses HttpOnly cookies - no token in body
      await axios.post(
        '/api/auth/refresh',
        {},
        { withCredentials: true }
      );

      processQueue(null);
      isRefreshing = false;

      // Retry original request - cookies are automatically sent
      return client(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError);
      isRefreshing = false;

      // Let the component handle the 401 error
      // Don't auto-redirect - viewing public content doesn't require auth
      return Promise.reject(refreshError);
    }
  }

  // Format error response for consistent handling
  if (error.response) {
    const serverError: any = error.response.data;
    (error as any).message = serverError?.message || serverError?.error || serverError?.title || `Request failed with status code ${error.response.status}`;
    (error as any).serverResponse = serverError;
    (error as any).statusCode = error.response.status;
  } else if (error.request) {
    (error as any).message = 'Network error - Unable to reach server';
    (error as any).statusCode = 0;
    (error as any).serverResponse = null;
  } else {
    (error as any).message = error.message || 'An unexpected error occurred';
    (error as any).statusCode = 0;
    (error as any).serverResponse = null;
  }

  return Promise.reject(error);
};

// Helper to setup interceptors
const setupInterceptors = (client: AxiosInstance, serviceName: string) => {
  client.interceptors.response.use(
    (response) => response,
    createResponseErrorInterceptor(client, serviceName)
  );
};

// Create HTTP clients with credentials (cookies sent automatically)
export const httpVehicle = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send/receive HttpOnly cookies
});

export const httpBooking = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const httpAuth = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Setup interceptors for all clients
setupInterceptors(httpVehicle, 'Vehicle Service');
setupInterceptors(httpBooking, 'Booking Service');
setupInterceptors(httpAuth, 'Auth Service');
