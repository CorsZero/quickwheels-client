import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookVehicle } from '../../services/api';
import type { Vehicle } from '../../services/api';
import type { AlertType } from '../Alert/Alert';
import Alert from '../Alert/Alert';
import styles from './VehicleDetails.module.css';
import img1 from '../../assets/testAssets/344x258.jpg';
import img2 from '../../assets/testAssets/344x258.jpg';
import img3 from '../../assets/testAssets/344x258.jpg';
import img5 from '../../assets/testAssets/img2.jpg';
import img6 from '../../assets/testAssets/img3.jpg';
import img7 from '../../assets/testAssets/img4.jpg';
import img8 from '../../assets/testAssets/344x258.jpg';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const THUMBS_PER_PAGE = 4;

// Recreated Vehicle Details to match the provided mock 1:1
const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const { user, isLoggedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<AlertType>('info');
  const [thumbPage, setThumbPage] = useState(0);
  const [thumbsPerPage, setThumbsPerPage] = useState(4);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isOwner = user?.id === vehicle.sellerId;
  const canBook = isLoggedIn && !isOwner && vehicle.available && !loading;

  // 4 Mercedes images as requested
  const sampleImages = [
    img1,
    img2,
    img3,
    img8,
    img5,
    img6,
    img7,
    img8,
  ];

 

  const hasImages = sampleImages.length > 0;
  const thumbsPerPageUsed = thumbsPerPage;
  const totalPages = Math.ceil(sampleImages.length / Math.max(1, thumbsPerPageUsed));
  const startIdx = thumbPage * thumbsPerPageUsed;
  const endIdx = startIdx + thumbsPerPageUsed;
  const visibleThumbs = sampleImages.map((s, i) => ({ src: s, idx: i })).slice(startIdx, endIdx);

  // Mock vehicle data for local testing when a real `vehicle` prop isn't provided
  const MOCK_VEHICLE: Partial<Vehicle> = {
    id: 'mock-1',
    title: 'Vehicle Name',
    rentalAmount: 2500,
    available: true,
    location: 'Matara - Waligama',
    manufacturer: 'Mercedes',
    year: 2021,
    description: 'Sample vehicle used for local UI testing.',
    deliveryDetails: 'Deliver to specific area or Self Pick up',
    sellerId: 'mock-seller',
    images: sampleImages,
  };

  const displayVehicle: Vehicle = ({ ...MOCK_VEHICLE, ...(vehicle || {}), images: sampleImages } as unknown) as Vehicle;

  const formattedPrice = `LKR $${Number(displayVehicle.rentalAmount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // thumbnail page navigation
  const goThumbPrev = () => {
    if (thumbPage > 0) setThumbPage((p) => p - 1);
  };
  const goThumbNext = () => {
    if (thumbPage < totalPages - 1) setThumbPage((p) => p + 1);
  };

  // adjust thumbnails per page based on screen width
  useEffect(() => {
    function updateThumbsPerPage() {
      const w = window.innerWidth;
      if (w < 480) setThumbsPerPage(3);
      else if (w < 768) setThumbsPerPage(4);
      else setThumbsPerPage(4);
    }
    updateThumbsPerPage();
    window.addEventListener('resize', updateThumbsPerPage);
    return () => window.removeEventListener('resize', updateThumbsPerPage);
  }, []);

  // ensure selected main image is visible in the current thumb page
  useEffect(() => {
    const newPage = Math.floor(currentImageIndex / Math.max(1, thumbsPerPage));
    if (newPage !== thumbPage) setThumbPage(newPage);
  }, [currentImageIndex, thumbsPerPage]);

  useEffect(() => {
    // when the user changes the main image or thumbnail page, ensure the card is visible at the top
    if (rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentImageIndex, thumbPage]);

  const handleBook = async () => {
    if (!canBook) return;
    try {
      setLoading(true);
      setMessage('');
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + Number(duration || 1));
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      await bookVehicle(displayVehicle.id || vehicle.id, startStr, endStr);
      setMessage('Booked successfully. Check your profile for details.');
    } catch (e) {
      setMessage('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap} ref={rootRef}>
      <div className={styles.card}>
        <h2 className={styles.title}>{displayVehicle.title || 'Vehicle Name'}</h2>

        <div className={styles.mainImageBox}>
          <img
            src={sampleImages[currentImageIndex]}
            alt={`${vehicle.title || 'Vehicle'} image ${currentImageIndex + 1}`}
          />
        </div>

        <div className={styles.thumbRow}>
          <button
            className={`${styles.navBtn} ${styles.left} ${thumbPage === 0 ? styles.disabled : ''}`}
            onClick={goThumbPrev}
            disabled={thumbPage === 0}
            aria-label="Previous thumbnails"
          >
            ‹
          </button>
          <div className={styles.thumbs}>
            {hasImages
              ? visibleThumbs.map(({ src, idx }) => (
                  <button
                    key={idx}
                    className={`${styles.thumb} ${idx === currentImageIndex ? styles.active : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Thumb ${idx + 1}`}
                    />
                  </button>
                ))
              : Array.from({ length: THUMBS_PER_PAGE }).map((_, idx) => (
                  <div key={idx} className={styles.ghostThumb}></div>
                ))}
          </div>
          <button
            className={`${styles.navBtn} ${styles.right} ${thumbPage >= totalPages - 1 ? styles.disabled : ''}`}
            onClick={goThumbNext}
            disabled={thumbPage >= totalPages - 1}
            aria-label="Next thumbnails"
          >
            ›
          </button>
        </div>

        <div className={styles.statusRow}>
          <span className={displayVehicle.available ? styles.available : styles.unavailable}>
            {displayVehicle.available ? 'Available' : 'Not Available'}
          </span>
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.priceLabel}>Price Per Day :</div>
          <div className={styles.priceValue}>{formattedPrice}</div>
        </div>

        {displayVehicle.location && (
          <div className={styles.locationBadge}>{String(displayVehicle.location).toUpperCase()}</div>
        )}

        <div className={styles.textDetails}>
           <div className={styles.textGap}>
          <p><strong>Manufacturer</strong></p>
          <p>{displayVehicle.manufacturer || '—'}</p></div>
          <div className={styles.textGap}>
          <p><strong>YOM</strong></p>
          <p>{displayVehicle.year || '—'}</p>
          </div>
          <div className={styles.textGap}>
          <p><strong>Optional details</strong></p>
          <p>{displayVehicle.description || '—'}</p></div>
          <p><strong>Delivery Mode</strong> : {displayVehicle.deliveryDetails || 'Deliver to specific area or Self Pick up'}</p>
          <p><strong>Security deposit type</strong> as described by the seller</p>
        </div>

        <div className={styles.durationRow}>
          <span className={styles.durationLabel}>Select Duration :&nbsp;</span>
          <span className={styles.daysText}>Days</span>
          <select
            className={styles.durationSelect}
            aria-label="Duration in days"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <ul className={styles.notes}>
          <li>
            If the vehicle is already booked or not available at the time, this button should blurred
          </li>
          <li className={styles.alert}>
            PAY & BOOK BUTTON IS NOT AVAILABLE WHEN LOGGED AS A SELLER THEY CAN ONLY VIEW
          </li>
        </ul>

        {message && (
          <Alert 
            message={message} 
            type={messageType} 
            onClose={() => setMessage('')}
          />
        )}

        <div className={styles.actions}>
          <button
            className={styles.bookBtn}
            onClick={handleBook}
            disabled={!canBook}
            aria-disabled={!canBook}
          >
            {loading ? 'Booking…' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;