/**
 * Quick Wheel Vehicle Rental App
 * Page: Profile
 * Description: User profile with booked rides and posted ads
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
              Please log in to view your profile.
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
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.profileHeader}>
            <div>
              <h1 className={styles.welcomeTitle}>WELCOME {user.name}</h1>
              <p className={styles.userSubtitle}>{user.email}</p>
            </div>
            <button className={styles.editProfileButton}>
              Edit profile
            </button>
          </div>

          {/* Scheduled Rides Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.badge}>📅</span>
              MY SCHEDULED RIDES
            </h2>
            {user.bookedRides.length > 0 ? (
              <div className={styles.ridesList}>
                {user.bookedRides.map((booking) => (
                  <div key={booking.id} className={styles.rideCard}>
                    <div className={styles.rideImage}>
                      <img 
                        src={booking.vehicleImage} 
                        alt={booking.vehicleTitle}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div className={styles.rideInfo}>
                      <h3 className={styles.rideTitle}>{booking.vehicleTitle}</h3>
                      <span className={styles.categoryBadge}>
                        {booking.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                      <div className={styles.rentalAmount}>
                        Rental amount : <span>{booking.totalAmount}</span>
                      </div>
                      <div className={styles.availability}>
                        <span className={booking.status === 'active' ? styles.available : styles.unavailable}>
                          {booking.status === 'active' ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyMessage}>
                No scheduled rides yet. <span onClick={() => navigate('/ads')} style={{cursor: 'pointer', color: '#667eea'}}>Browse vehicles</span>
              </div>
            )}
          </section>

          {/* Purchased Rides Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.badge}>🚗</span>
              MY PURCHASED RIDES
            </h2>
            {loading ? (
              <div className={styles.emptyMessage}>Loading your vehicles...</div>
            ) : error ? (
              <div className={styles.emptyMessage}>{error}</div>
            ) : userAds.length > 0 ? (
              <div className={styles.ridesList}>
                {userAds.map((ad) => (
                  <div key={ad.id} className={styles.rideCard}>
                    <div className={styles.rideImage}>
                      <img 
                        src={ad.image} 
                        alt={ad.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div className={styles.rideInfo}>
                      <h3 className={styles.rideTitle}>{ad.title}</h3>
                      <span className={styles.categoryBadge}>{ad.category}</span>
                      <div className={styles.rentalAmount}>
                        Rental amount : <span>{ad.rentalAmount}</span>
                      </div>
                      <div className={styles.availability}>
                        <span className={ad.available ? styles.available : styles.unavailable}>
                          {ad.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyMessage}>
                No vehicles listed yet. Create your first ad!
              </div>
            )}
          </section>

          {/* Logout Button */}
          <div className={styles.footerActions}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;