// user.queries.ts - TanStack Query hooks for auth operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TokenManager } from '../../utils/tokenManager';
import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../api/user.api';

// Query: Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation: Register new user
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Store token if returned (handle nested response)
      const token = data?.data?.token || data?.token;
      if (token) {
        TokenManager.setToken(token);
      }
      // Invalidate profile to fetch new user data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Login user
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token (handle nested response)
      const token = data.data.accessToken;
      if (token) {
        TokenManager.setToken(token);
      }
      // Invalidate profile to fetch logged-in user data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate profile to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Refresh token
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Update stored token (handle nested response)
      const token = data?.data?.token || data?.token;
      if (token) {
        TokenManager.setToken(token);
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Logout user
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear token
      TokenManager.removeToken();
      // Clear all cached data
      queryClient.clear();
    },
  });
};

// Mutation: Forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

// Mutation: Reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

// Mutation: Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
