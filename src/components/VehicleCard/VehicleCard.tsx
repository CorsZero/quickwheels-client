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

  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${vehicle.title} ${vehicle.category} ${vehicle.rentalAmount}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={vehicle.image}
          alt={vehicle.title}
          className={styles.image}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.src = vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
          }}
        />
       
      </div>

      <div className={styles.details}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{vehicle.title}</h3>
          <div className={styles.categoryPill}>{vehicle.category}</div>
        </div>

        <div className={styles.rentalRow}>
          <span className={styles.label}>Price per day :</span>
           <span className={styles.priceNumber}>LKR</span>
          <span className={styles.priceNumber}>{formatNumber(vehicle.rentalAmount)}</span>
        </div>

        <div className={styles.availability}>
          {vehicle.available ? (
            <span className={styles.available}>Available</span>
          ) : (
            <span className={styles.notAvailable}>Not available</span>
          )}
        </div>

        <div className={styles.extraInfo}>
          <div className={styles.infoCol}>
            <div className={styles.manufacturer}>
              <span className={styles.label}>Brand:</span>
              <span className={styles.value}>{vehicle.manufacturer}</span>
            </div>
            <div className={styles.model}>
              <span className={styles.label}>Year:</span>
              <span className={styles.value}>{vehicle.year}</span>
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.location}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className={styles.locationText}>{vehicle.location}</span>
            </div>
            <div className={styles.delivery}>
              <span className={styles.label}>Delivery:</span>
              <span className={styles.value}>{vehicle.deliveryDetails || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;