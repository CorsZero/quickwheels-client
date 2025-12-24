/**
 * Quick Wheel Vehicle Rental App
 * Page: Ads
 * Description: Full ad list with pagination (20 per page, next/prev)
 * Tech: React + TypeScript + CSS Modules
 */
import Hero from '../../components/Hero/Hero';
import VehicleList from '../../components/VehicleList/VehicleList';
import styles from './Ads.module.css';

const Ads = () => {
  return (
    <div className={styles.ads}>
     
       
          <Hero />
        <VehicleList 
          title="All Available Vehicles"
          showPagination={true}
        />

    </div>
  );
};

export default Ads;