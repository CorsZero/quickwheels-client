/**
 * Quick Wheel Vehicle Rental App
 * Page: Home
 * Description: Homepage with Hero section, category filters, latest ads, and About section
 * Tech: React + TypeScript + CSS Modules
 */

import Hero from '../../components/Hero/Hero';
import VehicleList from '../../components/VehicleList/VehicleList';
import About from '../../components/About/About';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      <Hero />
      <h2 className={styles.hotHeading}><em>HOT Ads</em></h2>
      <VehicleList limit={8} showHeader={false} />
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