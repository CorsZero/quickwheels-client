import { http } from "./http";

// api/vehicle.api.ts
export const fetchVehicles = async () => {
  const res = await http.get("/vehicles");
  return res.data;
};

export const fetchVehicleById = async (vehicleId: string) => {
  const res = await http.get(`/vehicles/${vehicleId}`);
  return res.data;
};

export const fetchMyListings = async (page: number = 1, limit: number = 10) => {
  const res = await http.get(`/vehicles/my-listings?page=${page}&limit=${limit}`);
  return res.data;
};

export const createVehicle = async (vehicleData: any) => {
  const res = await http.post("/vehicles", vehicleData);
  return res.data;
};

export const updateVehicle = async (vehicleId: string, vehicleData: any) => {
  const res = await http.put(`/vehicles/${vehicleId}`, vehicleData);
  return res.data;
};

export const updateVehicleStatus = async (vehicleId: string, statusData: any) => {
  const res = await http.patch(`/vehicles/${vehicleId}/status`, statusData);
  return res.data;
};

export const removeVehicle = async (vehicleId: string, removalData: any) => {
  const res = await http.patch(`/vehicles/${vehicleId}/remove`, removalData);
  return res.data;
};
