import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '../../services/api';
import styles from './VehicleCard.module.css';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: (id: string) => void;
}

const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick(vehicle.id);
    navigate(`/ad/${vehicle.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  const formatNumber = (n: number) => n?.toLocaleString() || '0';

  // Format category from API (e.g., "CAR" -> "Cars")
  const formatCategory = (cat: string) => {
    if (!cat) return 'Cars';
    const categoryMap: Record<string, string> = {
      'CAR': 'Cars',
      'SCOOTER': 'Scooters',
      'MOTOR_BICYCLE': 'Motor Bicycle',
      'VAN': 'Vans',
      'LARGE_VEHICLE': 'Large Vehicles'
    };
    return categoryMap[cat.toUpperCase()] || cat;
  };

  // Helper to construct full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Construct full URL - images are served from the base backend URL without /api/v1
    // Backend serves files at http://localhost:5002/vehicles/...
    const backendUrl = import.meta.env.VITE_VEHICLE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5002';
    return `${backendUrl}/${imagePath}`;
  };

  // Map API fields to card display fields
  const vehicleData = {
    id: vehicle.id,
    title: `${vehicle.make || ''} ${vehicle.model || ''}`.trim() || 'Vehicle',
    category: formatCategory(vehicle.category),
    image: getImageUrl(vehicle.images?.[0] || vehicle.image),
    images: vehicle.images || [],
    rentalAmount: vehicle.pricePerDay || 0,
    available: vehicle.status === 'AVAILABLE',
    manufacturer: vehicle.make || 'Unknown',
    year: vehicle.year || new Date().getFullYear(),
    location: vehicle.district || vehicle.location || 'Sri Lanka',
    description: vehicle.description || 'No description',
    seats: vehicle.seats || 0
  };

  console.log('VehicleCard - Original vehicle:', vehicle);
  console.log('VehicleCard - Processed image URL:', vehicleData.image);

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${vehicleData.title} ${vehicleData.category} ${vehicleData.rentalAmount}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={vehicleData.image}
          alt={vehicleData.title}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
          }}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{vehicleData.title}</h3>
          <div className={styles.categoryPill}>{vehicleData.category}</div>
        </div>

        <div className={styles.rentalRow}>
          <span className={styles.label}>Price per day :</span>
          <span className={styles.priceNumber}>LKR</span>
          <span className={styles.priceNumber}>{formatNumber(vehicleData.rentalAmount)}</span>
        </div>

        <div className={styles.availability}>
          {vehicleData.available ? (
            <span className={styles.available}>Available</span>
          ) : (
            <span className={styles.notAvailable}>Not available</span>
          )}
        </div>

        <div className={styles.extraInfo}>
          <div className={styles.infoCol}>
            <div className={styles.manufacturer}>
              <span className={styles.label}>Brand:</span>
              <span className={styles.value}>{vehicleData.manufacturer}</span>
            </div>
            <div className={styles.model}>
              <span className={styles.label}>Year:</span>
              <span className={styles.value}>{vehicleData.year}</span>
            </div>
            <div className={styles.description}>
              <span className={styles.label}>Description:</span>
              <span className={styles.value}>{vehicleData.description}</span>
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.location}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className={styles.locationText}>{vehicleData.location}</span>
            </div>
            <div className={styles.seats}>
              <span className={styles.label}>Seats:</span>
              <span className={styles.value}>{vehicleData.seats}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;