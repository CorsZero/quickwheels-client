import { http } from "./http";

// api/vehicle.api.ts
export const fetchVehicles = async () => {
  const res = await http.get("/vehicles");
  return res.data;
};
