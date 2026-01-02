import { useState } from 'react';
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
} from '../../queries/booking.queries';
import Alert, { type AlertType } from '../../components/Alert/Alert';


const BookingService = () => {

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

    const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertType }>({
        show: false,
        message: '',
        type: 'info'
    });


    const GetBookingDetails = (bookingId: string) => {
        bookingDetails.mutate(bookingId, {
            onSuccess: (data) => {
                console.log("Booking Details:", data.data);
                setAlert({ show: true, message: 'Booking details fetched successfully!', type: 'success' });
            },
            onError: (error: any) => {
                console.log('Get booking details error:', error.response?.data);
                setAlert({ show: true, message: error.response?.data?.message || 'Failed to fetch booking details', type: 'error' });
            }
        });
    };

    const GetMyRentals = () => {
        myRentals.mutate(
            { status: undefined, page: 1, limit: 10 },
            {
                onSuccess: (data) => {
                    console.log("My Rentals:", data.data);
                    setAlert({ show: true, message: 'Rentals fetched successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Get rentals error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to fetch rentals', type: 'error' });
                }
            }
        );
    };

    // this is for vehicle owner
    const GetMyRequests = () => {
        myRequests.mutate(
            { ownerVehicleIds: ["4da8a377-7de6-435a-87ee-156eaf865183"] },
            {
                onSuccess: (data) => {
                    console.log("My Requests:", data.data);
                    setAlert({ show: true, message: 'Requests fetched successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Get requests error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to fetch requests', type: 'error' });
                }
            }
        );
    };

    const CheckAvailability = () => {
        availability.mutate(
            {
                vehicleId: "4da8a377-7de6-435a-87ee-156eaf865183",
                startDate: "2026-02-01T10:00:00Z",
                endDate: "2026-02-05T10:00:00Z"
            },
            {
                onSuccess: (data) => {
                    console.log("Availability:", data.data);
                    setAlert({ show: true, message: 'Availability checked successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Check availability error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to check availability', type: 'error' });
                }
            }
        );
    };

    const CreateBooking = () => {
        createBooking.mutate(
            {
                vehicleId: "4da8a377-7de6-435a-87ee-156eaf865183",
                notes: "Booking notes here"
            },
            {
                onSuccess: (data) => {
                    console.log('Created Booking:', data.data);
                    setAlert({ show: true, message: data.message || 'Booking created successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Create booking error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to create booking', type: 'error' });
                }
            }
        );
    };
    ``
    const ApproveBooking = (bookingId: string) => {
        approveBooking.mutate(
            {
                bookingId: bookingId,
                approvalData: {
                    ownerVehicleIds: ["4da8a377-7de6-435a-87ee-156eaf865183"]
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Booking approved:', data.data);
                    setAlert({ show: true, message: data.message || 'Booking approved successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Approve booking error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to approve booking', type: 'error' });
                }
            }
        );
    };

    const RejectBooking = (bookingId: string) => {
        rejectBooking.mutate(
            {
                bookingId: bookingId,
                rejectionData: {
                    reason: "Vehicle not available",
                    ownerVehicleIds: ["4da8a377-7de6-435a-87ee-156eaf865183"]
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Booking rejected:', data.data);
                    setAlert({ show: true, message: data.message || 'Booking rejected successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Reject booking error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to reject booking', type: 'error' });
                }
            }
        );
    };

    const CancelBooking = (bookingId: string) => {
        cancelBooking.mutate(
            bookingId,
            {
                onSuccess: (data) => {
                    console.log('Booking cancelled:', data.data);
                    setAlert({ show: true, message: data.message || 'Booking cancelled successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Cancel booking error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to cancel booking', type: 'error' });
                }
            }
        );
    };

    const StartRental = (bookingId: string) => {
        startRental.mutate(
            {
                bookingId: bookingId,
                startData: {
                    ownerVehicleIds: ["4da8a377-7de6-435a-87ee-156eaf865183"]
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Rental started:', data.data);
                    setAlert({ show: true, message: data.message || 'Rental started successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Start rental error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to start rental', type: 'error' });
                }
            }
        );
    };

    const CompleteRental = (bookingId: string) => {
        completeRental.mutate(
            {
                bookingId: bookingId,
                completionData: {
                    ownerVehicleIds: ["4da8a377-7de6-435a-87ee-156eaf865183"],
                    finalPrice: 250
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Rental completed:', data.data);
                    setAlert({ show: true, message: data.message || 'Rental completed successfully!', type: 'success' });
                },
                onError: (error: any) => {
                    console.log('Complete rental error:', error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to complete rental', type: 'error' });
                }
            }
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Booking Service Test Page</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => GetBookingDetails('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={bookingDetails.isPending}>
                    {bookingDetails.isPending ? 'Loading...' : 'Get Booking Details'}
                </button>
                <button onClick={GetMyRentals} disabled={myRentals.isPending}>
                    {myRentals.isPending ? 'Loading...' : 'Get My Rentals'}
                </button>
                <button onClick={GetMyRequests} disabled={myRequests.isPending}>
                    {myRequests.isPending ? 'Loading...' : 'Get My Requests'}
                </button>
                <button onClick={CheckAvailability} disabled={availability.isPending}>
                    {availability.isPending ? 'Loading...' : 'Check Availability'}
                </button>
                <button onClick={CreateBooking} disabled={createBooking.isPending}>
                    {createBooking.isPending ? 'Creating...' : 'Create Booking'}
                </button>
                <button onClick={() => ApproveBooking('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={approveBooking.isPending}>
                    {approveBooking.isPending ? 'Approving...' : 'Approve Booking'}
                </button>
                <button onClick={() => RejectBooking('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={rejectBooking.isPending}>
                    {rejectBooking.isPending ? 'Rejecting...' : 'Reject Booking'}
                </button>
                <button onClick={() => CancelBooking('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={cancelBooking.isPending}>
                    {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
                </button>
                <button onClick={() => StartRental('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={startRental.isPending}>
                    {startRental.isPending ? 'Starting...' : 'Start Rental'}
                </button>
                <button onClick={() => CompleteRental('59c9f3c5-606f-4064-950b-6dfdf345f704')} disabled={completeRental.isPending}>
                    {completeRental.isPending ? 'Completing...' : 'Complete Rental'}
                </button>
            </div>

            {alert.show && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        duration={5000}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                </div>
            )}
        </div>
    );
};

export default BookingService;
