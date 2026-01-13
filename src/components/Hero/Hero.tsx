

import { useState } from 'react';
import styles from './Hero.module.css';
import searchIcon from '../../assets/images/iconsax-search.svg';
import arrowIcon from '../../assets/images/arrow-down.svg';

const categories = ['All', 'Cars', 'Scooters', 'Motor Bicycle', 'Vans', 'Large Vehicles'];

const Hero = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = async () => {
    // Search functionality can be implemented later with VehicleService
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            QUICK WHEEL
          </h1>

          {/* Search Bar and Category Filter Container */}
          <div className={styles.categoriesSectionContainer}>
            {/* Search Bar */}
            <div className={styles.searchSection}>
              <div className={styles.searchBar}>
                <img src={searchIcon} alt="Search" className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={styles.searchInput}
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className={styles.categoriesSection}>
              <div className={styles.categoryChips}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`${styles.categoryChip} ${selectedCategory === category ? styles.active : ''
                      }`}
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Down Arrow */}
          <div className={styles.downArrow}>
            <div className={styles.arrowIcon}>
              <img src={arrowIcon} alt="Down Arrow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;