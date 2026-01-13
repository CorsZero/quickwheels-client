// user.api.ts - Auth API functions (pure - no token handling)
import { httpAuth } from './http';

// Register new user
export const register = async (userData: {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: string;
}) => {
  const response = await httpAuth.post('/auth/register', userData);
  return response.data;
};

// Login user - tokens are set as HttpOnly cookies by backend
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await httpAuth.post('/auth/login', credentials);
  return response.data;
};

// Get current user profile
export const getProfile = async () => {
  const response = await httpAuth.get('/auth/profile');
  return response.data;
};

// Update user profile (with optional profile image)
export const updateProfile = async (profileData: FormData | {
  FullName?: string;
  Phone?: string;
  ProfileImage?: File;
}) => {
  // Check if profileData is FormData
  const isFormData = profileData instanceof FormData;
  
  const response = await httpAuth.patch('/auth/profile', profileData, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : undefined,
  });
  return response.data;
};

// Delete profile image
export const deleteProfileImage = async () => {
  const response = await httpAuth.delete('/auth/profile/image');
  return response.data;
};

// Refresh token - uses HttpOnly cookie, no params needed
export const refreshToken = async () => {
  const response = await httpAuth.post('/auth/refresh');
  return response.data;
};

// Logout user - clears HttpOnly cookies
export const logout = async () => {
  const response = await httpAuth.post('/auth/logout');
  return response.data;
};

// Forgot password - send reset email
export const forgotPassword = async (email: string) => {
  const response = await httpAuth.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password with token
export const resetPassword = async (data: {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await httpAuth.post('/auth/reset-password', data);
  return response.data;
};

// Change password (requires authentication)
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await httpAuth.post('/auth/change-password', data);
  return response.data;
};
