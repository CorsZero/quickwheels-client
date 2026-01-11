/**
 * Quick Wheel Vehicle Rental App
 * Page: Profile
 * Description: User profile with profile image management
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserService } from '../../services/UserService';
import Alert from '../../components/Alert/Alert';
import styles from './ProfileModal.module.css';
import profileIcon from '../../assets/profileAssets/profile.svg';
import emailIcon from '../../assets/profileAssets/email.svg';
import nicIcon from '../../assets/profileAssets/nic.svg';
import locationIcon from '../../assets/profileAssets/location.svg';
import mobileIcon from '../../assets/profileAssets/mobile number.svg';

const Profile = () => {
  const navigate = useNavigate();
  const {
    profile,
    isLoading,
    UpdateProfileWithImage,
    DeleteProfileImage,
    isPending
  } = useUserService();

  // Extract user data from profile response
  const user = profile?.data ? {
    id: profile.data.id || '',
    name: profile.data.fullName || profile.data.name || '',
    email: profile.data.email || '',
    phone: profile.data.phone || '',
    profileImage: profile.data.profileImage || null
  } : null;

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    address: '',
    mobile: ''
  });

  // Profile image states
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        nic: '',
        address: '',
        mobile: user.phone
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeNewImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setNewProfileImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDeleteExistingImage = () => {
    if (!user?.profileImage) return;

    setIsDeletingImage(true);

    DeleteProfileImage(
      () => {
        setAlertMessage('Profile image deleted successfully!');
        setAlertType('success');
        setIsDeletingImage(false);
      },
      (error) => {
        const errorMessage = error?.response?.data?.message || 'Failed to delete profile image';
        setAlertMessage(errorMessage);
        setAlertType('error');
        setIsDeletingImage(false);
      }
    );
  };

  const handleSaveProfile = () => {
    UpdateProfileWithImage(
      {
        fullName: formData.name,
        phone: formData.mobile,
        profileImage: newProfileImage || undefined
      },
      () => {
        setAlertMessage('Profile updated successfully!');
        setAlertType('success');

        // Clear new image preview
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setNewProfileImage(null);
        setImagePreview(null);
      },
      (error) => {
        const errorMessage = error?.response?.data?.message || 'Failed to update profile';
        setAlertMessage(errorMessage);
        setAlertType('error');
      }
    );
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Get current display image
  const displayImage = imagePreview || user?.profileImage || null;

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
          {alertMessage && (
            <Alert
              message={alertMessage}
              type={alertType}
              duration={5000}
              onClose={() => setAlertMessage('')}
            />
          )}

          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>User Profile</h2>
            <button className={styles.closeButton} onClick={handleClose}>
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            {/* Profile Image Section */}
            <div className={styles.profileImageSection}>
              <div className={styles.profileImageContainer}>
                {displayImage ? (
                  <div className={styles.imageWrapper}>
                    <img
                      src={displayImage}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                    {isDeletingImage && (
                      <div className={styles.imageLoadingOverlay}>
                        <div className={styles.spinner}></div>
                      </div>
                    )}
                    {/* Delete button for existing image */}
                    {user?.profileImage && !imagePreview && (
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={handleDeleteExistingImage}
                        disabled={isDeletingImage}
                        title="Delete profile image"
                      >
                        ×
                      </button>
                    )}
                    {/* Cancel button for new image preview */}
                    {imagePreview && (
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={removeNewImage}
                        title="Cancel new image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.profileImagePlaceholder}>
                    <span className={styles.placeholderIcon}>👤</span>
                  </div>
                )}
              </div>

              <div className={styles.imageUploadSection}>
                <label htmlFor="profileImage" className={styles.uploadLabel}>
                  {displayImage ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </div>
            </div>

            {/* Form Fields */}
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
                disabled
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
            <button
              className={styles.saveButton}
              onClick={handleSaveProfile}
              disabled={isPending.updateProfile}
            >
              {isPending.updateProfile ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;