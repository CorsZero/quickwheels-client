/**
 * Quick Wheel Vehicle Rental App
 * Page: My Rides
 * Description: Display all booked vehicles by the user
 * Tech: React + TypeScript + CSS Modules
 */

import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../queries/user.queries';
import VehicleCard from '../../components/VehicleCard/VehicleCard';
import type { Vehicle, BookedRide } from '../../services/api';
import styles from './MyRides.module.css';

const MyRides = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading } = useProfile();

    const user = profile?.data ? {
        id: profile.data.id || '',
        name: profile.data.fullName || profile.data.name || '',
        email: profile.data.email || '',
        bookedRides: [] as BookedRide[]
    } : null;

    if (isLoading) {
        return (
            <div className={styles.myRides}>
                <div className={styles.container}>
                    <h1 className={styles.title}>My Scheduled Rides</h1>
                    <div className={styles.loading}>Loading your rides...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.myRides}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔒</div>
                        <h2>Login Required</h2>
                        <p>Please log in to view your scheduled rides.</p>
                        <button className={styles.loginButton} onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.myRides}>
            <div className={styles.container}>
                <h1 className={styles.title}>My Scheduled Rides</h1>

                {user.bookedRides && user.bookedRides.length > 0 ? (
                    <div className={styles.ridesGrid}>
                        {user.bookedRides.map((booking: BookedRide) => {
                            const vehicleData: Vehicle = {
                                id: booking.id,
                                make: 'N/A',
                                model: 'N/A',
                                year: new Date().getFullYear(),
                                category: booking.status === 'active' ? 'Active Booking' : 'Completed',
                                seats: 5,
                                pricePerDay: booking.totalAmount,
                                location: 'Your Booking',
                                district: '',
                                description: '',
                                images: [booking.vehicleImage],
                                status: booking.status,
                                createdAt: new Date().toISOString()
                            };
                            return (
                                <div
                                    key={booking.id}
                                    onClick={() => navigate(`/scheduled-ride/${booking.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <VehicleCard vehicle={vehicleData} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📅</div>
                        <h2>No Scheduled Rides</h2>
                        <p>You haven't booked any vehicles yet.</p>
                        <button className={styles.browseButton} onClick={() => navigate('/ads')}>
                            Browse Vehicles
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRides;
