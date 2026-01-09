import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  fetchBookingDetails,
  fetchMyRentals,
  fetchMyRequests,
  fetchAllIncomingRequests,
  checkAvailability,
  approveBooking,
  rejectBooking,
  cancelBooking,
  startRental,
  completeRental,
} from "../api/booking.api";

// queries/booking.queries.ts
export const useBookingDetails = () => {
  return useMutation({
    mutationFn: (bookingId: string) => fetchBookingDetails(bookingId),
  });
};

export const useMyRentals = () => {
  return useMutation({
    mutationFn: ({ status, page = 1, limit = 10 }: { status?: string; page?: number; limit?: number }) =>
      fetchMyRentals(status, page, limit),
  });
};

export const useMyRequests = () => {
  return useMutation({
    mutationFn: (requestData: any) => fetchMyRequests(requestData),
  });
};

export const useAllIncomingRequests = () => {
  return useMutation({
    mutationFn: ({ status, page = 1, limit = 100 }: { status?: string; page?: number; limit?: number }) =>
      fetchAllIncomingRequests(status, page, limit),
  });
};

export const useAvailability = () => {
  return useMutation({
    mutationFn: ({ vehicleId, startDate, endDate }: { vehicleId: string; startDate: string; endDate: string }) =>
      checkAvailability(vehicleId, startDate, endDate),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData: { vehicleId: string; notes: string; }) =>
      createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, approvalData }: { bookingId: string; approvalData: any }) =>
      approveBooking(bookingId, approvalData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, rejectionData }: { bookingId: string; rejectionData: any }) =>
      rejectBooking(bookingId, rejectionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

export const useStartRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, startData }: { bookingId: string; startData: any }) =>
      startRental(bookingId, startData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

export const useCompleteRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, completionData }: { bookingId: string; completionData: any }) =>
      completeRental(bookingId, completionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};
