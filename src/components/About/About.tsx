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
  const processSteps = [
    {
      icon: '🔍',
      title: 'Browse & Search',
      description: 'Find the perfect vehicle from our wide selection of cars, scooters, motorcycles, vans, and large vehicles.'
    },
    {
      icon: '📅',
      title: 'Book Online',
      description: 'Select your dates, choose duration, and book instantly through our secure online platform.'
    },
    {
      icon: '🚗',
      title: 'Pick Up or Delivery',
      description: 'Either pick up your vehicle at the specified location or enjoy our convenient delivery service.'
    },
    {
      icon: '🌟',
      title: 'Enjoy Your Ride',
      description: 'Hit the road and enjoy your adventure with confidence, knowing you have reliable transportation.'
    }
  ];

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

        {/* Rental Process */}
        <div className={styles.process}>
          <h3 className={styles.processTitle}>How It Works</h3>
          <div className={styles.steps}>
            {processSteps.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Why Choose Quick Wheel?</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <h4 className={styles.featureTitle}>Verified Vehicles</h4>
              <p className={styles.featureDescription}>
                All vehicles are verified for safety and quality before listing
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💰</div>
              <h4 className={styles.featureTitle}>Best Prices</h4>
              <p className={styles.featureDescription}>
                Competitive rates with no hidden fees or surprise charges
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📞</div>
              <h4 className={styles.featureTitle}>24/7 Support</h4>
              <p className={styles.featureDescription}>
                Round-the-clock customer support for any questions or issues
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h4 className={styles.featureTitle}>Instant Booking</h4>
              <p className={styles.featureDescription}>
                Quick and easy booking process with immediate confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>1000+</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Vehicle Options</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>5</div>
            <div className={styles.statLabel}>Vehicle Categories</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>99%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;