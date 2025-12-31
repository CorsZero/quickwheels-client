// user.queries.ts - TanStack Query hooks for auth operations
// No token handling - cookies are managed by browser + backend
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Query: Get current user profile - THIS IS THE AUTH SOURCE OF TRUTH
// If profile loads → authenticated
// If 401 → not authenticated
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth errors
  });
};

// Mutation: Register new user
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Cookies are set by backend - just refetch profile
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Login user
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Cookies are set by backend - just refetch profile
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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Mutation: Refresh token (rarely called manually - interceptor handles it)
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
  });
};

// Mutation: Logout user
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Backend clears cookies - clear all cached data
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
