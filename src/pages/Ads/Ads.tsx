/**
 * Quick Wheel Vehicle Rental App
 * Page: Ads
 * Description: Full ad list with pagination (20 per page, next/prev)
 * Tech: React + TypeScript + CSS Modules
 */

import VehicleList from '../../components/VehicleList/VehicleList';
import styles from './Ads.module.css';

const Ads = () => {
  return (
    <div className={styles.ads}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Browse All Vehicles</h1>
          <p className={styles.subtitle}>
            Find the perfect vehicle for your next adventure from our extensive collection
          </p>
        </div>
        
        <VehicleList 
          title="All Available Vehicles"
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default Ads;