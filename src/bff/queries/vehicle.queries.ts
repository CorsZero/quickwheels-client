import { useQuery } from "@tanstack/react-query";
import { fetchVehicles } from "../api/vehicle.api";

// queries/vehicle.queries.ts
export const useVehicles = () =>
  useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });
