import {
    useBookingDetails,
    useMyRentals,
    useMyRequests,
    useAvailability,
    useCreateBooking,
    useApproveBooking,
    useRejectBooking,
    useCancelBooking,
    useStartRental,
    useCompleteRental
} from '../queries/booking.queries';
import { useVehicleById } from '../queries/vehicle.queries';
import { useProfile } from '../queries/user.queries';

export const useBookingService = () => {
    const createBooking = useCreateBooking();
    const bookingDetails = useBookingDetails();
    const myRentals = useMyRentals();
    const myRequests = useMyRequests();
    const availability = useAvailability();
    const approveBooking = useApproveBooking();
    const rejectBooking = useRejectBooking();
    const cancelBooking = useCancelBooking();
    const startRental = useStartRental();
    const completeRental = useCompleteRental();
    const vehicleById = useVehicleById();
    const { data: profileData } = useProfile();

    const GetBookingDetails = (
        bookingId: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        bookingDetails.mutate(bookingId, {
            onSuccess: (data) => {
                console.log("Booking Details:", data.data);
                onSuccess?.(data);
            },
            onError: (error: any) => {
                console.log('Get booking details error:', error.response?.data);
                onError?.(error);
            }
        });
    };

    const GetMyRentals = (
        status?: string,
        page: number = 1,
        limit: number = 10,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        myRentals.mutate(
            { status, page, limit },
            {
                onSuccess: (data) => {
                    console.log("My Rentals:", data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Get rentals error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const GetMyRequests = (
        ownerVehicleIds: string[],
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        myRequests.mutate(
            { ownerVehicleIds },
            {
                onSuccess: (data) => {
                    console.log("My Requests:", data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Get requests error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const CheckAvailability = (
        vehicleId: string,
        startDate: string,
        endDate: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        availability.mutate(
            {
                vehicleId,
                startDate,
                endDate
            },
            {
                onSuccess: (data) => {
                    console.log("Availability:", data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Check availability error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const CreateBooking = (
        vehicleId: string,
        notes: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        // First, fetch the vehicle details to get the owner ID
        vehicleById.mutate(vehicleId, {
            onSuccess: (vehicleData) => {
                const vehicleOwnerId = vehicleData.data?.ownerId;
                const currentUserId = profileData?.data?.id;

                console.log('Vehicle Owner ID:', vehicleOwnerId);
                console.log('Current User ID:', currentUserId);

                // Check if the current user is the vehicle owner
                if (vehicleOwnerId === currentUserId) {
                    onError?.({
                        response: {
                            data: {
                                message: 'You cannot book your own vehicle!'
                            }
                        }
                    });
                    return;
                }

                // Proceed with creating the booking if user is not the owner
                createBooking.mutate(
                    {
                        vehicleId,
                        notes
                    },
                    {
                        onSuccess: (data) => {
                            console.log('Created Booking:', data.data);
                            onSuccess?.(data);
                        },
                        onError: (error: any) => {
                            console.log('Create booking error:', error.response?.data);
                            onError?.(error);
                        }
                    }
                );
            },
            onError: (error: any) => {
                console.log('Fetch vehicle error:', error.response?.data);
                onError?.(error);
            }
        });
    };

    const ApproveBooking = (
        bookingId: string,
        ownerVehicleIds: string[],
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        approveBooking.mutate(
            {
                bookingId,
                approvalData: {
                    ownerVehicleIds
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Booking approved:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Approve booking error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const RejectBooking = (
        bookingId: string,
        reason: string,
        ownerVehicleIds: string[],
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        rejectBooking.mutate(
            {
                bookingId,
                rejectionData: {
                    reason,
                    ownerVehicleIds
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Booking rejected:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Reject booking error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const CancelBooking = (
        bookingId: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        cancelBooking.mutate(
            bookingId,
            {
                onSuccess: (data) => {
                    console.log('Booking cancelled:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Cancel booking error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const StartRental = (
        bookingId: string,
        ownerVehicleIds: string[],
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        startRental.mutate(
            {
                bookingId,
                startData: {
                    ownerVehicleIds
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Rental started:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Start rental error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    const CompleteRental = (
        bookingId: string,
        ownerVehicleIds: string[],
        finalPrice: number,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        completeRental.mutate(
            {
                bookingId,
                completionData: {
                    ownerVehicleIds,
                    finalPrice
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Rental completed:', data.data);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log('Complete rental error:', error.response?.data);
                    onError?.(error);
                }
            }
        );
    };

    return {
        profileData,
        GetBookingDetails,
        GetMyRentals,
        GetMyRequests,
        CheckAvailability,
        CreateBooking,
        ApproveBooking,
        RejectBooking,
        CancelBooking,
        StartRental,
        CompleteRental,
        isPending: {
            bookingDetails: bookingDetails.isPending,
            myRentals: myRentals.isPending,
            myRequests: myRequests.isPending,
            availability: availability.isPending,
            createBooking: createBooking.isPending,
            approveBooking: approveBooking.isPending,
            rejectBooking: rejectBooking.isPending,
            cancelBooking: cancelBooking.isPending,
            startRental: startRental.isPending,
            completeRental: completeRental.isPending
        }
    };
};
