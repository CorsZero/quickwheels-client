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

const Home = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <VehicleList title="Latest Vehicles" limit={20} />
      <About />
    </div>
  );
};

export default Home;