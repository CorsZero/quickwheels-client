import { httpBooking } from "./http";

// api/booking.api.ts
export const createBooking = async (bookingData: any) => {
  const res = await httpBooking.post("/bookings", bookingData);
  return res.data;
};

export const fetchBookingDetails = async (bookingId: string) => {
  const res = await httpBooking.get(`/bookings/${bookingId}`);
  return res.data;
};

export const fetchMyRentals = async (status?: string, page: number = 1, limit: number = 10) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (status) params.append('status', status);
  const res = await httpBooking.get(`/bookings/my-rentals?${params.toString()}`);
  return res.data;
};

export const fetchMyRequests = async (requestData: any) => {
  const res = await httpBooking.post("/bookings/my-requests", requestData);
  return res.data;
};

export const checkAvailability = async (vehicleId: string, startDate: string, endDate: string) => {
  const res = await httpBooking.get(`/bookings/availability/${vehicleId}?startDate=${startDate}&endDate=${endDate}`);
  return res.data;
};

export const approveBooking = async (bookingId: string, approvalData: any) => {
  const res = await httpBooking.patch(`/bookings/${bookingId}/approve`, approvalData);
  return res.data;
};

export const rejectBooking = async (bookingId: string, rejectionData: any) => {
  const res = await httpBooking.patch(`/bookings/${bookingId}/reject`, rejectionData);
  return res.data;
};

export const cancelBooking = async (bookingId: string) => {
  const res = await httpBooking.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

export const startRental = async (bookingId: string, startData: any) => {
  const res = await httpBooking.patch(`/bookings/${bookingId}/start`, startData);
  return res.data;
};

export const completeRental = async (bookingId: string, completionData: any) => {
  const res = await httpBooking.patch(`/bookings/${bookingId}/complete`, completionData);
  return res.data;
};
