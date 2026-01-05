import {
    useVehicles,
    useVehicleById,
    useMyListings,
    useCreateVehicle,
    useUpdateVehicle,
    useUpdateVehicleStatus,
    useRemoveVehicle
} from '../queries/vehicle.queries';

export const useVehicleService = () => {
    const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError, isError: vehiclesHasError } = useVehicles();
    const vehicleById = useVehicleById();
    const { data: myListings, isLoading: listingsLoading, error: listingsError, isError: listingsHasError } = useMyListings(1, 10);
    const createVehicle = useCreateVehicle();
    const updateVehicle = useUpdateVehicle();
    const updateVehicleStatus = useUpdateVehicleStatus();
    const removeVehicle = useRemoveVehicle();

    const GetAllVehicles = (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        if (!vehiclesHasError) {
            console.log("All vehicles : ", vehicles.data.vehicles);
            console.log("Pagination details : ", vehicles.data.pagination);
            onSuccess?.(vehicles);
        } else {
            onError?.(vehiclesError);
        }
    };

    const GetVehicleById = (
        id: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        vehicleById.mutate(id, {
            onSuccess: (data) => {
                console.log("Vehicle data:", data.data);
                onSuccess?.(data);
            },
            onError: (error: any) => {
                console.log(error.response?.data?.message);
                onError?.(error);
            }
        });
    };

    const GetMyListings = (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        if (!listingsHasError) {
            console.log("My Listed Vehicles:", myListings.data.vehicles);
            onSuccess?.(myListings);
        } else {
            onError?.(listingsError);
        }
    };

    const CreateVehicle = (
        vehicleData: {
            make: string;
            model: string;
            year: number;
            category: string;
            transmission: string;
            fuelType: string;
            seats: number;
            pricePerDay: number;
            location: string;
            district: string;
            description: string;
            features: string[];
        },
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        createVehicle.mutate(
            vehicleData,
            {
                onSuccess: (data) => {
                    console.log('created vehicle:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    const UpdateVehicle = (
        vehicleID: string,
        vehicleData: {
            make?: string;
            model?: string;
            year?: number;
            pricePerDay?: number;
            location?: string;
            images?: string[];
        },
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        updateVehicle.mutate(
            {
                vehicleId: vehicleID,
                vehicleData
            },
            {
                onSuccess: (data) => {
                    console.log('Updated Vehicle:', data.data.vehicle);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const UpdateVehicleStatus = (
        vehicleID: string,
        status: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        updateVehicleStatus.mutate(
            {
                vehicleId: vehicleID,
                status: { status }
            },
            {
                onSuccess: (data) => {
                    console.log(data.data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response?.data.message);
                    onError?.(error);
                }
            }
        );
    };

    const RemoveVehicle = (
        vehicleID: string,
        reason: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        removeVehicle.mutate(
            {
                vehicleId: vehicleID,
                removalData: { reason }
            },
            {
                onSuccess: (data) => {
                    console.log(data.data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response?.data.message);
                    onError?.(error);
                }
            }
        );
    };

    return {
        vehicles,
        vehiclesLoading,
        vehiclesError,
        vehiclesHasError,
        myListings,
        listingsLoading,
        listingsError,
        listingsHasError,
        GetAllVehicles,
        GetVehicleById,
        GetMyListings,
        CreateVehicle,
        UpdateVehicle,
        UpdateVehicleStatus,
        RemoveVehicle,
        isPending: {
            vehicleById: vehicleById.isPending,
            createVehicle: createVehicle.isPending,
            updateVehicle: updateVehicle.isPending,
            updateVehicleStatus: updateVehicleStatus.isPending,
            removeVehicle: removeVehicle.isPending
        }
    };
};
