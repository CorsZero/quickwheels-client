import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVehicles,
  fetchVehicleById,
  fetchMyListings,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  removeVehicle,
} from "../api/vehicle.api";

// queries/vehicle.queries.ts
export const useVehicles = () =>
  useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });

export const useVehicleById = (vehicleId: string) =>
  useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicleById(vehicleId),
    enabled: !!vehicleId,
  });

export const useMyListings = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ["myListings", page, limit],
    queryFn: () => fetchMyListings(page, limit),
  });

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, vehicleData }: { vehicleId: string; vehicleData: any }) =>
      updateVehicle(vehicleId, vehicleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
};

export const useUpdateVehicleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, statusData }: { vehicleId: string; statusData: any }) =>
      updateVehicleStatus(vehicleId, statusData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
};

export const useRemoveVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, removalData }: { vehicleId: string; removalData: any }) =>
      removeVehicle(vehicleId, removalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
};
