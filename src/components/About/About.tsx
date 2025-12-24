/**
 * Quick Wheel Vehicle Rental App Component
 * Component: About
 * Description: Static about section with mission statement and rental process info
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Displays company mission and values
 * - Shows rental process steps
 * - Static content section
 */

import styles from './About.module.css';

const About = () => {
  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        {/* Mission Statement */}
        <div className={styles.mission}>
          <h2 className={styles.title}>About Quick Wheel</h2>
          <p className={styles.description}>
            Quick Wheel is Sri Lanka's premier vehicle rental platform, connecting travelers and locals 
            with reliable, affordable transportation solutions. Whether you need a car for a business trip, 
            a scooter for city exploration, or a van for group travel, we've got you covered.
          </p>
          <p className={styles.description}>
            Our mission is to make transportation accessible, convenient, and trustworthy for everyone. 
            We believe that the right vehicle can transform your journey, and we're here to ensure 
            you find exactly what you need.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;