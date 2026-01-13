import {
    useVehicles,
    useVehicleById,
    useMyListings,
    useCreateVehicle,
    useUpdateVehicle,
    useUpdateVehicleStatus,
    useRemoveVehicle,
    useDeleteVehicleImage
} from '../queries/vehicle.queries';
import { useAllIncomingRequests } from '../queries/booking.queries';

export const useVehicleService = (enableMyListings: boolean = false) => {
    const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError, isError: vehiclesHasError } = useVehicles();
    const vehicleById = useVehicleById();
    const { data: myListings, isLoading: listingsLoading, error: listingsError, isError: listingsHasError, refetch: refetchListings } = useMyListings(1, 10, enableMyListings);
    const allIncomingRequests = useAllIncomingRequests();
    const createVehicle = useCreateVehicle();
    const updateVehicle = useUpdateVehicle();
    const updateVehicleStatus = useUpdateVehicleStatus();
    const removeVehicle = useRemoveVehicle();
    const deleteVehicleImage = useDeleteVehicleImage();

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

    const GetMyListings = async (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        try {
            // First, fetch the vehicle listings
            const listingsResult = await refetchListings();
            
            if (listingsResult.error) {
                onError?.(listingsResult.error);
                return;
            }

            if (!listingsResult.data) {
                onError?.(new Error('No listings data received'));
                return;
            }

            const vehicles = listingsResult.data.data.vehicles || [];
            console.log("My Listed Vehicles:", vehicles);

            // If no vehicles, return early with empty counts
            if (vehicles.length === 0) {
                onSuccess?.({
                    ...listingsResult.data,
                    data: {
                        ...listingsResult.data.data,
                        vehiclesWithCounts: []
                    }
                });
                return;
            }

            // Fetch all incoming booking requests
            allIncomingRequests.mutate(
                { status: 'PENDING', page: 1, limit: 100 },
                {
                    onSuccess: (bookingsData) => {
                        console.log("All Booking Requests:", bookingsData.data);
                        
                        const bookings = bookingsData.data?.bookings || [];
                        
                        // Count bookings per vehicle
                        const bookingCountsByVehicle: Record<string, number> = {};
                        bookings.forEach((booking: any) => {
                            const vehicleId = booking.vehicleId;
                            bookingCountsByVehicle[vehicleId] = (bookingCountsByVehicle[vehicleId] || 0) + 1;
                        });

                        console.log("Booking Counts by Vehicle:", bookingCountsByVehicle);

                        // Add booking counts to each vehicle
                        const vehiclesWithCounts = vehicles.map((vehicle: any) => ({
                            ...vehicle,
                            incomingRequestsCount: bookingCountsByVehicle[vehicle.id] || 0
                        }));

                        // Return enhanced data
                        onSuccess?.({
                            ...listingsResult.data,
                            data: {
                                ...listingsResult.data.data,
                                vehicles: vehiclesWithCounts,
                                vehiclesWithCounts
                            }
                        });
                    },
                    onError: (bookingsError: any) => {
                        console.error('Error fetching booking requests:', bookingsError);
                        // Still return vehicles but with 0 counts
                        const vehiclesWithCounts = vehicles.map((vehicle: any) => ({
                            ...vehicle,
                            incomingRequestsCount: 0
                        }));
                        
                        onSuccess?.({
                            ...listingsResult.data,
                            data: {
                                ...listingsResult.data.data,
                                vehicles: vehiclesWithCounts,
                                vehiclesWithCounts
                            }
                        });
                    }
                }
            );
        } catch (error) {
            console.error('Error in GetMyListings:', error);
            onError?.(error);
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
            latitude: number | null;
            longitude: number | null;
            description: string;
            features: string[];
            images: File[];
        },
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        // Build FormData
        const formData = new FormData();
        formData.append('make', vehicleData.make);
        formData.append('model', vehicleData.model);
        formData.append('year', vehicleData.year.toString());
        formData.append('category', vehicleData.category);
        formData.append('transmission', vehicleData.transmission);
        formData.append('fuelType', vehicleData.fuelType);
        formData.append('seats', vehicleData.seats.toString());
        formData.append('pricePerDay', vehicleData.pricePerDay.toString());
        formData.append('location', vehicleData.location);
        formData.append('district', vehicleData.district);
        formData.append('description', vehicleData.description);
        
        // Append latitude and longitude if available
        if (vehicleData.latitude !== null) {
            formData.append('latitude', vehicleData.latitude.toString());
        }
        if (vehicleData.longitude !== null) {
            formData.append('longitude', vehicleData.longitude.toString());
        }
        
        // Append features array
        vehicleData.features.forEach((feature) => {
            formData.append('features', feature);
        });
        
        // Append image files
        vehicleData.images.forEach((file) => {
            formData.append('images', file);
        });

        createVehicle.mutate(
            formData,
            {
                onSuccess: (data) => {
                    console.log('created vehicle:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response?.data?.message || error.message);
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
            category?: string;
            transmission?: string;
            fuelType?: string;
            seats?: number;
            pricePerDay?: number;
            location?: string;
            district?: string;
            description?: string;
            newImages?: File[];  // New image files to upload (optional)
        },
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        // Build FormData for multipart upload
        const formData = new FormData();
        
        // Append all text fields
        if (vehicleData.make) formData.append('make', vehicleData.make);
        if (vehicleData.model) formData.append('model', vehicleData.model);
        if (vehicleData.year) formData.append('year', vehicleData.year.toString());
        if (vehicleData.category) formData.append('category', vehicleData.category);
        if (vehicleData.transmission) formData.append('transmission', vehicleData.transmission);
        if (vehicleData.fuelType) formData.append('fuelType', vehicleData.fuelType);
        if (vehicleData.seats) formData.append('seats', vehicleData.seats.toString());
        if (vehicleData.pricePerDay) formData.append('pricePerDay', vehicleData.pricePerDay.toString());
        if (vehicleData.location) formData.append('location', vehicleData.location);
        if (vehicleData.district) formData.append('district', vehicleData.district);
        if (vehicleData.description) formData.append('description', vehicleData.description);
        
        // Append new image files (only if adding new images)
        if (vehicleData.newImages && vehicleData.newImages.length > 0) {
            vehicleData.newImages.forEach((file) => {
                formData.append('images', file);
            });
        }

        console.log('Updating vehicle with FormData:', {
            vehicleId: vehicleID,
            fields: Object.fromEntries(formData.entries()),
            newImagesCount: vehicleData.newImages?.length || 0
        });

        updateVehicle.mutate(
            {
                vehicleId: vehicleID,
                vehicleData: formData
            },
            {
                onSuccess: (data) => {
                    console.log('Updated Vehicle:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Update error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const DeleteVehicleImage = (
        vehicleID: string,
        imageUrl: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        deleteVehicleImage.mutate(
            {
                vehicleId: vehicleID,
                imageUrl: imageUrl
            },
            {
                onSuccess: (data) => {
                    console.log('Deleted image:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Delete image error:', error.response?.data);
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
        DeleteVehicleImage,
        isPending: {
            vehicleById: vehicleById.isPending,
            createVehicle: createVehicle.isPending,
            updateVehicle: updateVehicle.isPending,
            updateVehicleStatus: updateVehicleStatus.isPending,
            removeVehicle: removeVehicle.isPending,
            deleteVehicleImage: deleteVehicleImage.isPending
        }
    };
};
