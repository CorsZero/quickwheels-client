import { useState } from 'react';
import {
    useVehicles,
    useVehicleById,
    useMyListings,
    useCreateVehicle,
    useUpdateVehicle,
    useUpdateVehicleStatus,
    useRemoveVehicle
} from '../../bff/queries/vehicle.queries';
import Alert, { type AlertType } from '../../components/Alert/Alert';


const VehicleService = () => {

    const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError, isError: vehiclesHasError } = useVehicles();
    const vehicleById = useVehicleById();
    const { data: myListings, isLoading: listingsLoading, error: listingsError, isError: listingsHasError } = useMyListings(1, 10);
    const createVehicle = useCreateVehicle();
    const updateVehicle = useUpdateVehicle();
    const updateVehicleStatus = useUpdateVehicleStatus();
    const removeVehicle = useRemoveVehicle();

    const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertType }>({
        show: false,
        message: '',
        type: 'info'
    });





    const GetAllVehicles = () => {
        if (!vehiclesHasError) {
            console.log("All vehicles : ", vehicles.data.vehicles);
            console.log("Pagination details : ", vehicles.data.pagination);
            setAlert({ show: true, message: 'Vehicles fetched successfully!', type: 'success' });
        } else {
            setAlert({ show: true, message: (vehiclesError as any)?.response?.data?.message || 'Failed to fetch vehicles', type: 'error' });
        }
    };

    const GetVehicleById = (id: string) => {
        vehicleById.mutate(id, {
            onSuccess: (data) => {
                console.log("Vehicle data:", data.data);
                setAlert({ show: true, message: 'Vehicle fetched successfully!', type: 'success' });
            },
            onError: (error: any) => {
                console.log(error.response?.data?.message);
                setAlert({ show: true, message: error.response?.data?.message, type: 'error' });
            }
        });
    };

    const GetMyListings = () => {
        if (!listingsHasError) {
            console.log("My Listed Vehicles:", myListings.data.vehicles);
            setAlert({ show: true, message: 'Listings fetched successfully!', type: 'success' });
        } else {
            setAlert({ show: true, message: (listingsError as any)?.response?.data?.message || 'Failed to fetch listings', type: 'error' });
        }
    };

    const CreateVehicle = () => {
        createVehicle.mutate(
            {
                make: "Skyline",
                model: "GTR 35",
                year: 2019,
                category: "CAR",
                transmission: "manual",
                fuelType: "PETROL",
                seats: 2,
                pricePerDay: 15000,
                location: "Colombo",
                district: "Colombo",
                description: "Well maintained and professional",
                features: ["AC", "Bluetooth", "GPS"],
            },
            {
                onSuccess: (data) => {
                    console.log('created vehicle:', data.data);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    setAlert({ show: true, message: error.response?.data?.message, type: 'error' });
                }
            }
        );
    };

    const UpdateVehicle = (vehicleID: string) => {
        updateVehicle.mutate(
            {
                vehicleId: vehicleID,
                vehicleData: {
                    make: 'Toyota',
                    model: 'Axio',
                    year: 2016,
                    pricePerDay: 8000,
                    location: 'Matara',
                    images: ["dadasdsadsadas", "dsadsaasdasweq"]
                }
            },
            {
                onSuccess: (data) => {
                    console.log('Updated Vehicle:', data.data.vehicle);
                    setAlert({ show: true, message: data.data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response?.data);
                    setAlert({ show: true, message: error.response?.data?.message || 'Failed to update vehicle', type: 'error' });
                }
            }
        );
    };

    const UpdateVehicleStatus = (vehicleID: string) => {
        updateVehicleStatus.mutate(
            {
                vehicleId: vehicleID,
                status: { status: "available" }
            },
            {
                onSuccess: (data) => {
                    console.log(data.data.message);
                    setAlert({ show: true, message: data.data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response?.data.message);
                    setAlert({ show: true, message: error.response?.data?.message, type: 'error' });
                }
            }
        );
    };

    const RemoveVehicle = (vehicleID: string) => {
        removeVehicle.mutate(
            {
                vehicleId: vehicleID,
                removalData: { reason: 'No longer available' }
            },
            {
                onSuccess: (data) => {
                    console.log(data.data.message);
                    setAlert({ show: true, message: data.data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response?.data.message);
                    setAlert({ show: true, message: error.response?.data?.message, type: 'error' });
                }
            }
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Vehicle Service Test Page</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                <button onClick={GetAllVehicles} disabled={vehiclesLoading}>
                    {vehiclesLoading ? 'Loading...' : 'Get All Vehicles'}
                </button>
                <button onClick={() => GetVehicleById('4da8a377-7de6-435a-87ee-156eaf865183')} disabled={vehicleById.isPending}>
                    {vehicleById.isPending ? 'Loading...' : 'Get Vehicle By ID'}
                </button>
                <button onClick={GetMyListings} disabled={listingsLoading}>
                    {listingsLoading ? 'Loading...' : 'Get My Listings'}
                </button>
                <button onClick={CreateVehicle} disabled={createVehicle.isPending}>
                    {createVehicle.isPending ? 'Creating...' : 'Create Vehicle'}
                </button>
                <button onClick={() => UpdateVehicle("4da8a377-7de6-435a-87ee-156eaf865183")} disabled={updateVehicle.isPending}>
                    {updateVehicle.isPending ? 'Updating...' : 'Update Vehicle'}
                </button>
                <button onClick={() => UpdateVehicleStatus("4da8a377-7de6-435a-87ee-156eaf865183")} disabled={updateVehicleStatus.isPending}>
                    {updateVehicleStatus.isPending ? 'Updating...' : 'Update Vehicle Status'}
                </button>
                <button onClick={() => RemoveVehicle("4da8a377-7de6-435a-87ee-156eaf865183")} disabled={removeVehicle.isPending}>
                    {removeVehicle.isPending ? 'Removing...' : 'Remove Vehicle'}
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

export default VehicleService;
