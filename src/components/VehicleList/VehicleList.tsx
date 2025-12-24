/**
 * Quick Wheel Vehicle Rental App Component
 * Component: VehicleList
 * Description: Displays a grid of vehicle cards with loading and error states
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Shows grid of VehicleCard components
 * - Handles loading and error states
 * - Responsive grid layout
 */

import { useAds } from '../../contexts/AdsContext';
import VehicleCard from '../VehicleCard/VehicleCard';
import styles from './VehicleList.module.css';

interface VehicleListProps {
  title?: string;
  showPagination?: boolean;
  limit?: number;
  showHeader?: boolean;
}

const VehicleList = ({ title = "Available Vehicles", showPagination = false, limit, showHeader = true }: VehicleListProps) => {
  const { ads, loading, error, currentPage, totalPages, fetchAds } = useAds();

  const displayedAds = limit ? ads.slice(0, limit) : ads;

  const handlePageChange = async (page: number) => {
    if (showPagination && page !== currentPage) {
      await fetchAds(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.paginationButton}
          aria-label="Previous page"
        >
          ←
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${
            i === currentPage ? styles.active : ''
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.paginationButton}
          aria-label="Next page"
        >
          →
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </div>
        <div className={styles.paginationButtons}>
          {pages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className={styles.vehicleList}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.vehicleList}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => fetchAds(currentPage)}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (displayedAds.length === 0) {
    return (
      <section className={styles.vehicleList}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No vehicles found</h3>
            <p className={styles.emptyMessage}>
              Try adjusting your search criteria or browse different categories.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.vehicleList}>
      <div className={styles.container}>
        {showHeader && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.resultsCount}>
              {displayedAds.length} {displayedAds.length === 1 ? 'vehicle' : 'vehicles'} found
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {displayedAds.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
            />
          ))}
        </div>

        {renderPagination()}
      </div>
    </section>
  );
};

export default VehicleList;