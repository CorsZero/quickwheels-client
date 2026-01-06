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
import styles from './ProfileModal.module.css';
import profileIcon from '../../assets/profileAssets/profile.svg';
import emailIcon from '../../assets/profileAssets/email.svg';
import nicIcon from '../../assets/profileAssets/nic.svg';
import locationIcon from '../../assets/profileAssets/location.svg';
import mobileIcon from '../../assets/profileAssets/mobile number.svg';
import profileIdIcon from '../../assets/profileAssets/profile id.svg';

const Profile = () => {
  const navigate = useNavigate();

  // Get profile data from API
  const { data: profile, isLoading } = useProfile();

  // Extract user data from profile response
  const user = profile?.data ? {
    id: profile.data.id || '',
    name: profile.data.fullName || profile.data.name || '',
    email: profile.data.email || '',
    phone: profile.data.phone || ''
  } : null;

  const [successMessage, setSuccessMessage] = useState('');
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
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      navigate(-1); // Go back to previous page
    }, 2000);
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className={styles.profileModal}>
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Loading Profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profileModal}>
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.loginIcon}>🔒</div>
            <h2 className={styles.modalTitle}>Login Required</h2>
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
    <div className={styles.profileModal}>
      <div className={styles.modalOverlay} onClick={handleClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {successMessage && (
            <Alert
              message={successMessage}
              type="success"
              duration={2000}
              onClose={() => setSuccessMessage('')}
            />
          )}

          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>User Profile</h2>
            <button className={styles.closeButton} onClick={handleClose}>
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
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.saveButton} onClick={handleSaveProfile}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;