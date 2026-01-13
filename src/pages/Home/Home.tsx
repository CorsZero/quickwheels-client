/**
 * Quick Wheel Vehicle Rental App
 * Page: Home
 * Description: Homepage with Hero section, category filters, latest ads, and About section
 * Tech: React + TypeScript + CSS Modules
 */

import Hero from '../../components/Hero/Hero';
import VehicleCard from '../../components/VehicleCard/VehicleCard';
import About from '../../components/About/About';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { useVehicleService } from '../../services/VehicleService';

const Home = () => {
  const navigate = useNavigate();
  const { vehicles, vehiclesLoading, vehiclesError } = useVehicleService();

  // Extract vehicles array from response
  const displayVehicles = vehicles?.data?.vehicles?.slice(0, 8) || [];

  return (
    <div className={styles.home}>
      <Hero />
      <h2 className={styles.hotHeading}><em>HOT Ads</em></h2>

      <div className={styles.vehicleSection}>
        {vehiclesLoading && <p className={styles.loading}>Loading vehicles...</p>}
        {vehiclesError && <p className={styles.error}>Failed to load vehicles</p>}

        {!vehiclesLoading && !vehiclesError && displayVehicles.length > 0 && (
          <div className={styles.vehicleGrid}>
            {displayVehicles.map((vehicle: any) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {!vehiclesLoading && !vehiclesError && displayVehicles.length === 0 && (
          <p className={styles.loading}>No vehicles available</p>
        )}
      </div>

      <div className={styles.showMoreContainer}>
        <button
          className={styles.showMoreButton}
          onClick={() => navigate('/ads')}
        >
          Show More Ads
        </button>
      </div>
      <About />
    </div>
  );
};

export default Home;