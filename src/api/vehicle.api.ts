import { httpVehicle } from "./http";

// api/vehicle.api.ts
export const fetchVehicles = async () => {
  const res = await httpVehicle.get("/vehicles");
  return res.data;
};

export const fetchVehicleById = async (vehicleId: string) => {
  const res = await httpVehicle.get(`/vehicles/${vehicleId}`);
  return res.data;
};

export const fetchMyListings = async (page: number = 1, limit: number = 10) => {
  const res = await httpVehicle.get(`/vehicles/my-listings?page=${page}&limit=${limit}`);
  return res.data;
};

export const createVehicle = async (vehicleData: any) => {
  const res = await httpVehicle.post("/vehicles", vehicleData);
  return res.data;
};

export const updateVehicle = async (vehicleId: string, vehicleData: any) => {
  const res = await httpVehicle.put(`/vehicles/${vehicleId}`, vehicleData);
  return res.data;
};

export const updateVehicleStatus = async (vehicleId: string, status: any) => {
  const res = await httpVehicle.patch(`/vehicles/${vehicleId}/status`, status);
  return res.data;
};

export const removeVehicle = async (vehicleId: string, removalData: any) => {
  const res = await httpVehicle.patch(`/vehicles/${vehicleId}/remove`, removalData);
  return res.data;
};
