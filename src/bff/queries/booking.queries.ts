import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  fetchBookingDetails,
  fetchMyRentals,
  fetchMyRequests,
  checkAvailability,
  approveBooking,
  rejectBooking,
  cancelBooking,
  startRental,
  completeRental,
} from "../api/booking.api";

// queries/booking.queries.ts
export const useBookingDetails = (bookingId: string) =>
  useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingDetails(bookingId),
    enabled: !!bookingId,
  });

export const useMyRentals = (status?: string, page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ["myRentals", status, page, limit],
    queryFn: () => fetchMyRentals(status, page, limit),
  });

export const useMyRequests = (requestData: any) =>
  useQuery({
    queryKey: ["myRequests"],
    queryFn: () => fetchMyRequests(requestData),
  });

export const useAvailability = (vehicleId: string, startDate: string, endDate: string) =>
  useQuery({
    queryKey: ["availability", vehicleId, startDate, endDate],
    queryFn: () => checkAvailability(vehicleId, startDate, endDate),
    enabled: !!vehicleId && !!startDate && !!endDate,
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
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
