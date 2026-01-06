/**
 * Quick Wheel Vehicle Rental App
 * Page: Profile
 * Description: User profile with booked rides and posted ads
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../queries/user.queries';
import Alert from '../../components/Alert/Alert';
import type { Vehicle, BookedRide } from '../../services/api';
import styles from './Profile.module.css';
import profileIcon from '../../assets/profileAssets/profile.svg';
import emailIcon from '../../assets/profileAssets/email.svg';
import nicIcon from '../../assets/profileAssets/nic.svg';
import locationIcon from '../../assets/profileAssets/location.svg';
import mobileIcon from '../../assets/profileAssets/mobile number.svg';
import profileIdIcon from '../../assets/profileAssets/profile id.svg';
import VehicleCard from '../../components/VehicleCard/VehicleCard';

const Profile = () => {
  const navigate = useNavigate();

  // Get profile data from API
  const { data: profile, isLoading, error, isError } = useProfile();

  // Extract user data from profile response
  const user = profile?.data ? {
    id: profile.data.id || '',
    name: profile.data.fullName || profile.data.name || '',
    email: profile.data.email || '',
    phone: profile.data.phone || '',
    bookedRides: []
  } : null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const [userAds, setUserAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    nic: '',
    address: '',
    mobile: user?.phone || '',
    profileId: user?.id || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        nic: '',
        address: '',
        mobile: user.phone,
        profileId: user.id
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // TODO: Implement API call to save profile
    console.log('Saving profile:', formData);
    setShowEditModal(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    // Reset form data
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        nic: '',
        address: '',
        mobile: user.phone,
        profileId: user.id
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.loginRequired}>
            <h2 className={styles.loginTitle}>Loading Profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            onClose={() => setErrorMsg('')}
          />
        )}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            duration={3000}
            onClose={() => setSuccessMessage('')}
          />
        )}
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.profileHeader}>
            <div>
              <h1 className={styles.welcomeTitle}>WELCOME {user.name}</h1>
              <p className={styles.userSubtitle}>{user.email}</p>
            </div>
            <button
              className={styles.editProfileButton}
              onClick={() => setShowEditModal(true)}
            >
              Edit profile
            </button>
          </div>

          {/* Scheduled Rides Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.badge} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="17" rx="2" ry="2" fill="#FF8000" opacity="0.14" />
                  <rect x="3" y="7" width="18" height="2" rx="1" fill="#FF8000" />
                  <rect x="7" y="2" width="2" height="4" rx="1" fill="#FF8000" />
                  <rect x="15" y="2" width="2" height="4" rx="1" fill="#FF8000" />
                  <rect x="7" y="11" width="3" height="3" rx="0.6" fill="#FF8000" />
                  <rect x="12" y="11" width="3" height="3" rx="0.6" fill="#FF8000" />
                  <rect x="7" y="16" width="3" height="3" rx="0.6" fill="#FF8000" />
                  <rect x="12" y="16" width="3" height="3" rx="0.6" fill="#FF8000" />
                </svg>
              </span>
              MY SCHEDULED RIDES
            </h2>
            {user.bookedRides && user.bookedRides.length > 0 ? (
              <div className={styles.vehicleGrid}>
                {user.bookedRides.map((booking: BookedRide) => {
                  // Convert booking to Vehicle format for VehicleCard
                  const vehicleData: Vehicle = {
                    id: booking.id,
                    make: 'N/A',
                    model: 'N/A',
                    year: new Date().getFullYear(),
                    category: booking.status === 'active' ? 'Active Booking' : 'Completed',
                    seats: 5,
                    pricePerDay: booking.totalAmount,
                    location: 'Your Booking',
                    district: '',
                    description: '',
                    images: [booking.vehicleImage],
                    status: booking.status,
                    createdAt: new Date().toISOString()
                  };
                  return (
                    <div
                      key={booking.id}
                      onClick={() => navigate(`/scheduled-ride/${booking.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <VehicleCard vehicle={vehicleData} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyMessage}>
                No scheduled rides yet. <span onClick={() => navigate('/ads')} style={{ cursor: 'pointer', color: '#667eea' }}>Browse vehicles</span>
              </div>
            )}
          </section>

          {/* Purchased Rides Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.badge} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 6.5L7 3h10l1.5 3.5" fill="#FF8000" opacity="0.14" />
                  <path d="M5 10l2-5h10l2 5" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 10h16c1.1 0 2 .9 2 2v4.5a1.5 1.5 0 0 1-1.5 1.5H19" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 18H3.5A1.5 1.5 0 0 1 2 16.5V12c0-1.1.9-2 2-2" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7" cy="17" r="2" fill="#FF8000" />
                  <circle cx="17" cy="17" r="2" fill="#FF8000" />
                  <path d="M9 13h6" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              MY PURCHASED RIDES
            </h2>
            {isLoading ? (
              <div className={styles.emptyMessage}>Loading your vehicles...</div>
            ) : errorMsg ? (
              <div className={styles.emptyMessage}>{errorMsg}</div>
            ) : userAds.length > 0 ? (
              <div className={styles.vehicleGrid}>
                {userAds.map((ad) => (
                  <VehicleCard key={ad.id} vehicle={ad} />
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

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>User Profile</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={profileIcon} alt="" className={styles.iconImg} />
                    </span>
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={emailIcon} alt="" className={styles.iconImg} />
                    </span>
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={nicIcon} alt="" className={styles.iconImg} />
                    </span>
                    NIC no:
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your NIC number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={locationIcon} alt="" className={styles.iconImg} />
                    </span>
                    Address:
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    placeholder="Enter your address"
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={mobileIcon} alt="" className={styles.iconImg} />
                    </span>
                    Mobile no:
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span className={styles.labelIcon}>
                      <img src={profileIdIcon} alt="" className={styles.iconImg} />
                    </span>
                    Profile ID:
                  </label>
                  <input
                    type="text"
                    name="profileId"
                    value={formData.profileId}
                    className={styles.formInput}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.saveButton} onClick={handleSaveProfile}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Profile;