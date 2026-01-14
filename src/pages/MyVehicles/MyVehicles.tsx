/**
 * Quick Wheel Vehicle Rental App
 * Page: My Vehicles
 * Description: Display all vehicles listed by the user
 * Tech: React + TypeScript + CSS Modules
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../queries/user.queries';
import { useVehicleService } from '../../services/VehicleService';
import styles from './MyVehicles.module.css';

// Vehicle interface based on API response
interface Vehicle {
    id: string;
    ownerId: string;
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
    images: string[];
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

const MyVehicles = () => {
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const isLoggedIn = !!profile?.data;

    // Use VehicleService with enableMyListings flag set to true when logged in
    const { myListings, listingsLoading, listingsHasError, listingsError } = useVehicleService(isLoggedIn);

    // Extract vehicles from the response and filter out removed/inactive vehicles
    const vehicles: Vehicle[] = (myListings?.data?.vehicles || []).filter((vehicle: Vehicle) => vehicle.isActive);

    // Helper to construct full image URL
    const getImageUrl = (imagePath: string | undefined): string => {
        if (!imagePath) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';

        // If already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Construct full URL from vehicle service base URL
        const backendUrl = import.meta.env.VITE_VEHICLE_API_BASE_URL || 'http://localhost:5001';
        return `${backendUrl}/${imagePath}`;
    };

    // Format category for display
    const formatCategory = (category: string): string => {
        const categoryMap: Record<string, string> = {
            'CAR': 'Car',
            'SCOOTER': 'Scooter',
            'MOTOR_BICYCLE': 'Motor Bicycle',
            'VAN': 'Van',
            'LARGE_VEHICLE': 'Large Vehicle'
        };
        return categoryMap[category?.toUpperCase()] || category || 'Vehicle';
    };

    // Format transmission for display
    const formatTransmission = (transmission: string): string => {
        const transmissionMap: Record<string, string> = {
            'AUTOMATIC': 'Auto',
            'MANUAL': 'Manual'
        };
        return transmissionMap[transmission?.toUpperCase()] || transmission || 'N/A';
    };

    // Format fuel type for display
    const formatFuelType = (fuelType: string): string => {
        const fuelMap: Record<string, string> = {
            'PETROL': 'Petrol',
            'DIESEL': 'Diesel',
            'ELECTRIC': 'Electric',
            'HYBRID': 'Hybrid'
        };
        return fuelMap[fuelType?.toUpperCase()] || fuelType || 'N/A';
    };

    // Get status badge class
    const getStatusClass = (status: string): string => {
        switch (status?.toUpperCase()) {
            case 'AVAILABLE':
                return styles.statusAvailable;
            case 'RENTED':
                return styles.statusRented;
            case 'MAINTENANCE':
                return styles.statusMaintenance;
            default:
                return styles.statusDefault;
        }
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Log the data for debugging
    useEffect(() => {
        if (myListings) {
            // Data available for debugging if needed
        }
    }, [myListings, vehicles]);

    // Handle card click to navigate to vehicle management page
    const handleVehicleClick = (vehicleId: string) => {
        navigate(`/vehicle-management/${vehicleId}`);
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.myVehicles}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>Login Required</div>
                        <h2>Login Required</h2>
                        <p>Please log in to view your listed vehicles.</p>
                        <button className={styles.loginButton} onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (listingsLoading) {
        return (
            <div className={styles.myVehicles}>
                <div className={styles.container}>
                    <h1 className={styles.title}>My Vehicles</h1>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading your vehicles...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (listingsHasError) {
        return (
            <div className={styles.myVehicles}>
                <div className={styles.container}>
                    <h1 className={styles.title}>My Vehicles</h1>
                    <div className={styles.errorState}>
                        <div className={styles.errorIcon}>Error</div>
                        <h2>Something went wrong</h2>
                        <p>{((listingsError as any)?.response?.data?.message) || listingsError?.message || 'Failed to load your vehicles'}</p>
                        <button className={styles.retryButton} onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.myVehicles}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>My Vehicles</h1>
                        <span className={styles.vehicleCount}>
                            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} listed
                        </span>
                    </div>
                    <button className={styles.createButton} onClick={() => navigate('/create-ad')}>
                        + Create New Listing
                    </button>
                </div>

                {vehicles.length > 0 ? (
                    <div className={styles.vehiclesGrid}>
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className={styles.vehicleCard}
                                onClick={() => handleVehicleClick(vehicle.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleVehicleClick(vehicle.id);
                                    }
                                }}
                            >
                                {/* Image Gallery Section */}
                                <div className={styles.imageSection}>
                                    <div className={styles.mainImage}>
                                        <img
                                            src={getImageUrl(vehicle.images?.[0])}
                                            alt={`${vehicle.make} ${vehicle.model}`}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
                                            }}
                                        />
                                        {vehicle.images?.length > 1 && (
                                            <div className={styles.imageCount}>
                                                <span>📷 {vehicle.images.length}</span>
                                            </div>
                                        )}
                                    </div>
                                    {vehicle.images?.length > 1 && (
                                        <div className={styles.thumbnailRow}>
                                            {vehicle.images.slice(1, 4).map((img: string, index: number) => (
                                                <div key={index} className={styles.thumbnail}>
                                                    <img
                                                        src={getImageUrl(img)}
                                                        alt={`${vehicle.make} ${vehicle.model} - ${index + 2}`}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {vehicle.images.length > 4 && (
                                                <div className={styles.moreImages}>
                                                    +{vehicle.images.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Details Section */}
                                <div className={styles.detailsSection}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.vehicleTitle}>
                                            {vehicle.make} {vehicle.model}
                                        </h3>
                                        <span className={`${styles.statusBadge} ${getStatusClass(vehicle.status)}`}>
                                            {vehicle.status}
                                        </span>
                                    </div>

                                    <div className={styles.vehicleSpecs}>
                                        <span className={styles.specItem}>
                                            <span className={styles.specIcon}>📅</span>
                                            {vehicle.year}
                                        </span>
                                        <span className={styles.specItem}>
                                            <span className={styles.specIcon}>🚗</span>
                                            {formatCategory(vehicle.category)}
                                        </span>
                                        <span className={styles.specItem}>
                                            <span className={styles.specIcon}>⚙️</span>
                                            {formatTransmission(vehicle.transmission)}
                                        </span>
                                        <span className={styles.specItem}>
                                            <span className={styles.specIcon}>⛽</span>
                                            {formatFuelType(vehicle.fuelType)}
                                        </span>
                                        <span className={styles.specItem}>
                                            <span className={styles.specIcon}>👥</span>
                                            {vehicle.seats} seats
                                        </span>
                                    </div>

                                    <div className={styles.locationInfo}>
                                        <span className={styles.locationIcon}>📍</span>
                                        <span>{vehicle.location}, {vehicle.district}</span>
                                    </div>

                                    {vehicle.description && (
                                        <p className={styles.description}>
                                            {vehicle.description.length > 100
                                                ? `${vehicle.description.substring(0, 100)}...`
                                                : vehicle.description}
                                        </p>
                                    )}

                                    {vehicle.features?.length > 0 && (
                                        <div className={styles.featuresRow}>
                                            {vehicle.features.slice(0, 3).map((feature, index) => (
                                                <span key={index} className={styles.featureTag}>
                                                    {feature}
                                                </span>
                                            ))}
                                            {vehicle.features.length > 3 && (
                                                <span className={styles.moreFeatures}>
                                                    +{vehicle.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <div className={styles.priceSection}>
                                            <span className={styles.priceLabel}>Price per day</span>
                                            <span className={styles.priceValue}>
                                                LKR {vehicle.pricePerDay.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles.dateInfo}>
                                            <span>Listed: {formatDate(vehicle.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>No Vehicles</div>
                        <h2>No Vehicles Listed</h2>
                        <p>You haven't listed any vehicles yet. Create your first listing!</p>
                        <button className={styles.createButton} onClick={() => navigate('/create-ad')}>
                            Create Your First Ad
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVehicles;
