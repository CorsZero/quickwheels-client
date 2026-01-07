/**
 * Quick Wheel Vehicle Rental App
 * Page: AdDetails
 * Description: Shows detailed vehicle information
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicleService } from '../../services/VehicleService';
import { useProfile } from '../../queries/user.queries';
import Alert from '../../components/Alert/Alert';
import styles from './AdDetails.module.css';

interface VehicleData {
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

const AdDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { GetVehicleById } = useVehicleService();
  const { data: profile } = useProfile();

  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rentalDays, setRentalDays] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isLoggedIn = !!profile?.data;
  const isOwner = profile?.data?.id === vehicle?.ownerId;

  useEffect(() => {
    if (!id) {
      setError('Vehicle ID not provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    GetVehicleById(
      id,
      (response) => {
        if (response?.data) {
          setVehicle(response.data);
        } else {
          setError('Vehicle not found');
        }
        setIsLoading(false);
      },
      (errorMsg) => {
        setError(errorMsg || 'Failed to load vehicle details');
        setIsLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const formatTransmission = (transmission: string): string => {
    const transmissionMap: Record<string, string> = {
      'AUTOMATIC': 'Automatic',
      'MANUAL': 'Manual'
    };
    return transmissionMap[transmission?.toUpperCase()] || transmission || 'N/A';
  };

  const formatFuelType = (fuelType: string): string => {
    const fuelMap: Record<string, string> = {
      'PETROL': 'Petrol',
      'DIESEL': 'Diesel',
      'ELECTRIC': 'Electric',
      'HYBRID': 'Hybrid'
    };
    return fuelMap[fuelType?.toUpperCase()] || fuelType || 'N/A';
  };

  const getStatusBadgeClass = (status: string): string => {
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPrice = vehicle ? vehicle.pricePerDay * rentalDays : 0;

  if (isLoading) {
    return (
      <div className={styles.adDetails}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading vehicle details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={styles.adDetails}>
        <div className={styles.container}>
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>{error || 'Vehicle not found'}</h2>
            <p className={styles.errorMessage}>
              {error === 'Vehicle not found'
                ? 'The vehicle you are looking for does not exist or has been removed.'
                : 'We encountered an error while loading the vehicle details. Please try again.'}
            </p>
            <div className={styles.errorActions}>
              <button className={styles.backButton} onClick={() => navigate('/ads')}>
                ← Browse All Vehicles
              </button>
              <button className={styles.homeButton} onClick={() => navigate('/')}>
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adDetails}>
      <div className={styles.container}>
        {/* Back Navigation */}
        <div className={styles.navigation}>
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className={styles.browseLink} onClick={() => navigate('/ads')}>
            Browse All Vehicles
          </button>
        </div>

        {/* Alert Messages */}
        {bookingSuccess && (
          <Alert
            message="Booking created successfully! Redirecting to My Rides..."
            type="success"
            duration={5000}
            onClose={() => setBookingSuccess(false)}
          />
        )}
        {bookingError && (
          <Alert
            message={bookingError}
            type="error"
            duration={5000}
            onClose={() => setBookingError('')}
          />
        )}

        {/* Main Content */}
        <div className={styles.detailsWrapper}>
          {/* Left Column - Images and Details */}
          <div className={styles.leftColumn}>
            {/* Image Gallery */}
            <div className={styles.imageGallery}>
              <div className={styles.mainImageContainer}>
                <img
                  src={vehicle.images[selectedImageIndex] || vehicle.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className={styles.mainImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
                  }}
                />
                {vehicle.images.length > 1 && (
                  <div className={styles.imageCounter}>
                    {selectedImageIndex + 1} / {vehicle.images.length}
                  </div>
                )}
              </div>

              {vehicle.images.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                  {vehicle.images.map((img, index) => (
                    <div
                      key={index}
                      className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.thumbnailActive : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.make} ${vehicle.model} - ${index + 1}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Information */}
            <div className={styles.infoCard}>
              <div className={styles.headerRow}>
                <h1 className={styles.vehicleTitle}>
                  {vehicle.make} {vehicle.model}
                </h1>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>

              <div className={styles.specs}>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>📅</span>
                  <div>
                    <div className={styles.specLabel}>Year</div>
                    <div className={styles.specValue}>{vehicle.year}</div>
                  </div>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>🚗</span>
                  <div>
                    <div className={styles.specLabel}>Category</div>
                    <div className={styles.specValue}>{formatCategory(vehicle.category)}</div>
                  </div>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>⚙️</span>
                  <div>
                    <div className={styles.specLabel}>Transmission</div>
                    <div className={styles.specValue}>{formatTransmission(vehicle.transmission)}</div>
                  </div>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>⛽</span>
                  <div>
                    <div className={styles.specLabel}>Fuel Type</div>
                    <div className={styles.specValue}>{formatFuelType(vehicle.fuelType)}</div>
                  </div>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>👥</span>
                  <div>
                    <div className={styles.specLabel}>Seats</div>
                    <div className={styles.specValue}>{vehicle.seats}</div>
                  </div>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specIcon}>📍</span>
                  <div>
                    <div className={styles.specLabel}>Location</div>
                    <div className={styles.specValue}>{vehicle.location}, {vehicle.district}</div>
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p>{vehicle.description || 'No description available.'}</p>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className={styles.features}>
                  <h3 className={styles.sectionTitle}>Features</h3>
                  <div className={styles.featuresList}>
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className={styles.featureTag}>
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.additionalInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Listed on:</span>
                  <span className={styles.infoValue}>{formatDate(vehicle.createdAt)}</span>
                </div>
                {vehicle.updatedAt && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Last updated:</span>
                    <span className={styles.infoValue}>{formatDate(vehicle.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.priceSection}>
                <div className={styles.priceLabel}>Price per day</div>
                <div className={styles.priceValue}>LKR {vehicle.pricePerDay.toLocaleString()}</div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.rentalSection}>
                <label htmlFor="rentalDays" className={styles.rentalLabel}>
                  Number of days
                </label>
                <input
                  id="rentalDays"
                  type="number"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className={styles.rentalInput}
                />
              </div>

              <div className={styles.totalSection}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>LKR {totalPrice.toLocaleString()}</span>
              </div>

              {isOwner ? (
                <div className={styles.ownerNotice}>
                  <span>🔒</span>
                  <span>This is your vehicle listing</span>
                </div>
              ) : vehicle.status !== 'AVAILABLE' ? (
                <button className={styles.bookingButtonDisabled} disabled>
                  Not Available
                </button>
              ) : !isLoggedIn ? (
                <button className={styles.bookingButton} onClick={() => navigate('/login')}>
                  Login to Book
                </button>
              ) : (
                <button className={styles.bookingButton} >
                  Book Now
                </button>
              )}

              <div className={styles.bookingNote}>
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation up to 24 hours</p>
                <p>✓ Secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;