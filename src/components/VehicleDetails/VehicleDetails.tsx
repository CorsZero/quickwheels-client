/**
 * Quick Wheel Vehicle Rental App Component
 * Component: VehicleDetails
 * Description: Displays detailed vehicle information with booking functionality
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Shows vehicle images in a carousel
 * - Displays title, price, status, delivery details, manufacturer info
 * - Duration selector for booking
 * - Book button (disabled for seller or unavailable vehicles)
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookVehicle } from '../../services/api';
import type { Vehicle } from '../../services/api';
import styles from './VehicleDetails.module.css';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isLoggedIn } = useAuth();

  const totalPrice = vehicle.rentalAmount * duration;
  const isOwner = user?.id === vehicle.sellerId;
  const canBook = isLoggedIn && !isOwner && vehicle.available && startDate;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBook = async () => {
    if (!canBook) return;

    setLoading(true);
    setError('');

    try {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);
      
      await bookVehicle(vehicle.id, startDate, endDate.toISOString().split('T')[0]);
      setBookingSuccess(true);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (bookingSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✅</div>
        <h2 className={styles.successTitle}>Booking Successful!</h2>
        <p className={styles.successMessage}>
          Your booking for {vehicle.title} has been confirmed.
          Check your profile for booking details.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.vehicleDetails}>
      {/* Image Carousel */}
      <div className={styles.imageSection}>
        <div className={styles.carousel}>
          <div className={styles.imageContainer}>
            <img
              src={vehicle.images[currentImageIndex]}
              alt={`${vehicle.title} - Image ${currentImageIndex + 1}`}
              className={styles.mainImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
              }}
            />
            
            {vehicle.images.length > 1 && (
              <>
                <button
                  className={`${styles.carouselButton} ${styles.prevButton}`}
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  className={`${styles.carouselButton} ${styles.nextButton}`}
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}
          </div>
          
          {vehicle.images.length > 1 && (
            <div className={styles.thumbnails}>
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${
                    index === currentImageIndex ? styles.active : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className={styles.detailsSection}>
        <div className={styles.header}>
          <h1 className={styles.title}>{vehicle.title}</h1>
          <div className={styles.status}>
            {vehicle.available ? (
              <span className={styles.available}>✓ Available</span>
            ) : (
              <span className={styles.unavailable}>✗ Not Available</span>
            )}
          </div>
        </div>

        <div className={styles.price}>
          <span className={styles.amount}>LKR {vehicle.rentalAmount.toLocaleString()}</span>
          <span className={styles.period}>/ day</span>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Category:</span>
            <span className={styles.value}>{vehicle.category}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Manufacturer:</span>
            <span className={styles.value}>{vehicle.manufacturer}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Model:</span>
            <span className={styles.value}>{vehicle.model}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Year:</span>
            <span className={styles.value}>{vehicle.year}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Location:</span>
            <span className={styles.value}>📍 {vehicle.location}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Seller:</span>
            <span className={styles.value}>👤 {vehicle.sellerName}</span>
          </div>
        </div>

        <div className={styles.description}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p className={styles.descriptionText}>{vehicle.description}</p>
        </div>

        <div className={styles.delivery}>
          <h3 className={styles.sectionTitle}>Delivery Details</h3>
          <p className={styles.deliveryText}>{vehicle.deliveryDetails}</p>
        </div>

        {/* Booking Section */}
        {isLoggedIn && !isOwner && vehicle.available && (
          <div className={styles.booking}>
            <h3 className={styles.sectionTitle}>Book This Vehicle</h3>
            
            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <div className={styles.bookingForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="startDate" className={styles.inputLabel}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getMinDate()}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="duration" className={styles.inputLabel}>
                  Duration (days)
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={styles.input}
                >
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'day' : 'days'}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.total}>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.totalAmount}>
                  LKR {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleBook}
                disabled={!canBook || loading}
                className={styles.bookButton}
              >
                {loading ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </div>
        )}

        {/* Login prompt for non-logged in users */}
        {!isLoggedIn && vehicle.available && (
          <div className={styles.loginPrompt}>
            <p>Please log in to book this vehicle</p>
          </div>
        )}

        {/* Owner message */}
        {isOwner && (
          <div className={styles.ownerMessage}>
            <p>This is your vehicle listing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;