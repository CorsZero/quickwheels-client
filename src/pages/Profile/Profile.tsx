/**
 * Quick Wheel Vehicle Rental App
 * Page: Profile
 * Description: User profile with booked rides, posted ads, and account management
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserAds } from '../../services/api';
import type { Vehicle, BookedRide } from '../../services/api';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  
  const [userAds, setUserAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserAds = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const ads = await getUserAds(user.id);
        setUserAds(ads);
      } catch (err) {
        setError('Failed to load your ads');
        console.error('Error fetching user ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, [user, isLoggedIn, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getStatusColor = (status: BookedRide['status']) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isLoggedIn || !user) {
    return (
      <div className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.loginRequired}>
            <div className={styles.loginIcon}>🔒</div>
            <h2 className={styles.loginTitle}>Login Required</h2>
            <p className={styles.loginMessage}>
              Please log in to view your profile and manage your bookings.
            </p>
            <button 
              className={styles.loginButton}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        {/* Profile Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <span className={styles.avatarIcon}>👤</span>
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>Welcome, {user.name}!</h1>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link to="/create-ad" className={styles.createAdButton}>
              + Create New Ad
            </Link>
          </div>
        </div>

        {/* Booked Rides Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Bookings</h2>
          {user.bookedRides.length > 0 ? (
            <div className={styles.bookingsContainer}>
              <div className={styles.bookingsScroll}>
                {user.bookedRides.slice(0, 5).map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingImage}>
                      <img 
                        src={booking.vehicleImage} 
                        alt={booking.vehicleTitle}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div className={styles.bookingDetails}>
                      <h3 className={styles.bookingTitle}>{booking.vehicleTitle}</h3>
                      <div className={styles.bookingDates}>
                        <span className={styles.dateRange}>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className={styles.bookingAmount}>
                        LKR {booking.totalAmount.toLocaleString()}
                      </div>
                      <div className={`${styles.bookingStatus} ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {user.bookedRides.length > 5 && (
                <div className={styles.showMore}>
                  <p>{user.bookedRides.length - 5} more bookings...</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📅</div>
              <h3 className={styles.emptyTitle}>No bookings yet</h3>
              <p className={styles.emptyMessage}>
                Start exploring our vehicles and make your first booking!
              </p>
              <Link to="/ads" className={styles.browseButton}>
                Browse Vehicles
              </Link>
            </div>
          )}
        </section>

        {/* User Ads Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Vehicle Ads</h2>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading your ads...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          ) : userAds.length > 0 ? (
            <div className={styles.adsGrid}>
              {userAds.map((ad) => (
                <div key={ad.id} className={styles.adCard}>
                  <div className={styles.adImage}>
                    <img 
                      src={ad.image} 
                      alt={ad.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className={`${styles.adStatus} ${ad.available ? styles.available : styles.unavailable}`}>
                      {ad.available ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                  <div className={styles.adDetails}>
                    <h3 className={styles.adTitle}>{ad.title}</h3>
                    <div className={styles.adCategory}>{ad.category}</div>
                    <div className={styles.adPrice}>
                      LKR {ad.rentalAmount.toLocaleString()}/day
                    </div>
                    <div className={styles.adActions}>
                      <Link to={`/ad/${ad.id}`} className={styles.viewButton}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🚗</div>
              <h3 className={styles.emptyTitle}>No ads created yet</h3>
              <p className={styles.emptyMessage}>
                Start earning by listing your vehicle for rent!
              </p>
              <Link to="/create-ad" className={styles.createButton}>
                Create Your First Ad
              </Link>
            </div>
          )}
        </section>

        {/* Account Actions */}
        <section className={styles.section}>
          <div className={styles.accountActions}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              🚪 Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;