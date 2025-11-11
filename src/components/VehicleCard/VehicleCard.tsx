/**
 * Quick Wheel Vehicle Rental App Component
 * Component: VehicleCard
 * Description: Displays a single vehicle ad with image, name, rental amount, and availability.
 * Tech: React + TypeScript + CSS Modules.
 * Behavior:
 * - Props include id, title, category, image, rentalAmount, available.
 * - Clicking the card navigates to the details page.
 * - Use .card, .image, .details, .available, .notAvailable from CSS Module.
 */

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
    if (onClick) {
      onClick(vehicle.id);
    } else {
      navigate(`/ad/${vehicle.id}`);
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Cars':
        return '🚗';
      case 'Scooters':
        return '🛴';
      case 'Motor Bicycle':
        return '🏍️';
      case 'Vans':
        return '🚐';
      case 'Large Vehicles':
        return '🚚';
      default:
        return '🚗';
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img 
          src={vehicle.image} 
          alt={vehicle.title} 
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
          }}
        />
        <div className={styles.categoryBadge}>
          <span className={styles.categoryIcon}>{getCategoryIcon(vehicle.category)}</span>
          <span className={styles.categoryText}>{vehicle.category}</span>
        </div>
        {!vehicle.available && (
          <div className={styles.unavailableBadge}>
            Not Available
          </div>
        )}
      </div>
      
      <div className={styles.details}>
        <h3 className={styles.title}>{vehicle.title}</h3>
        
        <div className={styles.info}>
          <div className={styles.manufacturer}>
            <span className={styles.label}>Brand:</span>
            <span className={styles.value}>{vehicle.manufacturer}</span>
          </div>
          
          <div className={styles.location}>
            <span className={styles.locationIcon}>📍</span>
            <span className={styles.locationText}>{vehicle.location}</span>
          </div>
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>LKR {vehicle.rentalAmount.toLocaleString()}</span>
          <span className={styles.period}>/ day</span>
        </div>

        <div className={styles.availability}>
          {vehicle.available ? (
            <span className={styles.available}>✓ Available</span>
          ) : (
            <span className={styles.notAvailable}>✗ Not Available</span>
          )}
        </div>

        <div className={styles.seller}>
          <span className={styles.sellerIcon}>👤</span>
          <span className={styles.sellerName}>{vehicle.sellerName}</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;