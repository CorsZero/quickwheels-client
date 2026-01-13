/**
 * Quick Wheel Vehicle Rental App
 * Page: ScheduledRideDetails
 * Description: Full details page for scheduled ride with edit, delete, and image management
 * Tech: React + TypeScript + CSS Modules
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AlertType } from '../../components/Alert/Alert';
import Alert from '../../components/Alert/Alert';
import styles from './ScheduledRideDetails.module.css';

const ScheduledRideDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Get user from localStorage
  const userString = localStorage.getItem('currentUser');
  const user = userString ? JSON.parse(userString) : null;

  // Find the booking from user's bookedRides
  const booking = user?.bookedRides.find((b: any) => b.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleTitle: booking?.vehicleTitle || '',
    vehicleImage: booking?.vehicleImage || '',
    totalAmount: booking?.totalAmount || 0,
    status: booking?.status || 'active',
    description: '',
    pickupLocation: '',
    driverName: ''
  });

  const [images, setImages] = useState<string[]>(booking?.vehicleImage ? [booking.vehicleImage] : []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const [thumbsPerPage, setThumbsPerPage] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hooks must run consistently: place effects before any early returns
  // adjust thumbnails per page based on screen width
  useEffect(() => {
    function updateThumbsPerPage() {
      const w = window.innerWidth;
      if (w < 480) setThumbsPerPage(3);
      else if (w < 768) setThumbsPerPage(4);
      else setThumbsPerPage(4);
    }
    updateThumbsPerPage();
    window.addEventListener('resize', updateThumbsPerPage);
    return () => window.removeEventListener('resize', updateThumbsPerPage);
  }, []);

  // ensure selected main image is visible in the current thumb page
  useEffect(() => {
    const newPage = Math.floor(currentImageIndex / Math.max(1, thumbsPerPage));
    if (newPage !== thumbPage) setThumbPage(newPage);
  }, [currentImageIndex, thumbsPerPage]);

  if (!booking) {
    return (
      <div className={styles.scheduledRide}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Scheduled Ride Not Found</h1>
            <p className={styles.subtitle}>
              The scheduled ride you're looking for doesn't exist.
            </p>
            <button
              className={styles.backLink}
              onClick={() => navigate('/profile')}
            >
              ← Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Thumbnail scroller logic
  const hasImages = images.length > 0;
  const thumbsPerPageUsed = thumbsPerPage;
  const totalPages = Math.ceil(images.length / Math.max(1, thumbsPerPageUsed));
  const startIdx = thumbPage * thumbsPerPageUsed;
  const endIdx = startIdx + thumbsPerPageUsed;
  const visibleThumbs = images.map((src, i) => ({ src, idx: i })).slice(startIdx, endIdx);

  const goThumbPrev = () => {
    if (thumbPage > 0) setThumbPage((p) => p - 1);
  };
  const goThumbNext = () => {
    if (thumbPage < totalPages - 1) setThumbPage((p) => p + 1);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? Number(value) : value
    }));
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
    setFormData(prev => ({
      ...prev,
      vehicleImage: newImages[0] || ''
    }));
  };

  const addImageUrl = () => {
    setImages([...images, '']);
  };

  const removeImageUrl = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData(prev => ({
      ...prev,
      vehicleImage: newImages[0] || ''
    }));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setImages(prev => {
            const newImages = [...prev, imageUrl];
            setFormData(prevData => ({
              ...prevData,
              vehicleImage: newImages[0] || ''
            }));
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    e.target.value = '';
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleTitle || !formData.vehicleImage || formData.totalAmount <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setIsEditing(false);
      setSuccessMessage('Ride details updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRide = async () => {
    if (window.confirm('Are you sure you want to delete this scheduled ride? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError('');
        setSuccessMessage('Ride deleted successfully! Redirecting...');
        setTimeout(() => navigate('/profile'), 1500);
      } catch (err) {
        setError('Failed to delete ride');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.scheduledRide}>
      <div className={styles.container}>
        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError('')}
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
        <div className={styles.header}>
          <h1 className={styles.title}>Scheduled Ride Details</h1>
          <p className={styles.subtitle}>
            View and manage your scheduled ride details
          </p>

        </div>

        {isEditing ? (
          <form onSubmit={handleSaveChanges} className={styles.form}>
            {error && (
              <Alert
                message={error}
                type="error"
                onClose={() => setError('')}
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

            {/* Basic Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>

              <div className={styles.inputGroup}>
                <label htmlFor="vehicleTitle" className={styles.label}>
                  Vehicle Title *
                </label>
                <input
                  type="text"
                  id="vehicleTitle"
                  name="vehicleTitle"
                  value={formData.vehicleTitle}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., Toyota Corolla 2020"
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="totalAmount" className={styles.label}>
                    Total Amount (LKR) *
                  </label>
                  <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount || ''}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., 50000"
                    min="1"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="status" className={styles.label}>
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  >
                    <option value="active">Active Booking</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Ride Details</h3>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="pickupLocation" className={styles.label}>
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., Colombo, Sri Lanka"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="driverName" className={styles.label}>
                    Driver Name
                  </label>
                  <input
                    type="text"
                    id="driverName"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter driver name"
                  />
                </div>
              </div>

            </div>

            {/* Images */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Images</h3>
              <p className={styles.sectionDescription}>
                Add image URLs or upload images from your computer. The first image will be used as the main image.
              </p>

              {/* File Upload */}
              <div className={styles.inputGroup}>
                <label htmlFor="imageUpload" className={styles.label}>
                  Upload Images from Computer
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className={styles.input}
                />
              </div>

              {/* URL-based Images */}
              <div style={{ marginTop: '1.5rem' }}>
                <p className={styles.sectionDescription} style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#999' }}>
                  Or add image URLs directly:
                </p>
              </div>
              {images.map((url, index) => (
                <div key={index} className={styles.imageRow}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    required={index === 0}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className={styles.removeImageButton}
                    disabled={images.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {images.length === 0 && (
                <div className={styles.imageRow}>
                  <input
                    type="url"
                    value=""
                    onChange={(e) => handleImageUrlChange(0, e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              )}

              <button
                type="button"
                onClick={addImageUrl}
                className={styles.addImageButton}
              >
                + Add Another Image
              </button>
            </div>

            {/* Description */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Additional Details</h3>

              <div className={styles.inputGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Add any additional notes about this scheduled ride..."
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRide}
                disabled={loading}
                className={styles.deleteButton}
              >
                Delete Ride
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.viewMode}>
            {hasImages ? (
              <div className={styles.gallery}>
                <div className={styles.mainImageBox}>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${formData.vehicleTitle} image ${currentImageIndex + 1}`}
                    className={styles.image}
                  />
                </div>

                <div className={styles.thumbRow}>
                  <button
                    className={`${styles.navBtn} ${styles.left} ${thumbPage === 0 ? styles.disabled : ''}`}
                    onClick={goThumbPrev}
                    disabled={thumbPage === 0}
                    aria-label="Previous thumbnails"
                  >
                    ‹
                  </button>
                  <div className={styles.thumbs}>
                    {visibleThumbs.map(({ src, idx }) => (
                      <button
                        key={idx}
                        className={`${styles.thumb} ${idx === currentImageIndex ? styles.active : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`Image ${idx + 1}`}
                      >
                        <img src={src} alt={`Thumb ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                  <button
                    className={`${styles.navBtn} ${styles.right} ${thumbPage >= totalPages - 1 ? styles.disabled : ''}`}
                    onClick={goThumbNext}
                    disabled={thumbPage >= totalPages - 1}
                    aria-label="Next thumbnails"
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.noImage}>📷 No image available</div>
            )}

            <div className={styles.detailsCard}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Vehicle Title</span>
                <span className={styles.value}>{formData.vehicleTitle}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Total Amount</span>
                <span className={styles.value}>Rs. {formData.totalAmount.toLocaleString()}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.value} ${styles.status} ${styles[formData.status]}`}>
                  {formData.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </div>

              {formData.pickupLocation && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Pickup Location</span>
                  <span className={styles.value}>{formData.pickupLocation}</span>
                </div>
              )}

              {formData.driverName && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Driver Name</span>
                  <span className={styles.value}>{formData.driverName}</span>
                </div>
              )}

              {formData.description && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Description</span>
                  <span className={styles.value}>{formData.description}</span>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => navigate('/profile')}
                className={styles.cancelButton}
              >
                Back to Profile
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.submitButton}
              >
                Edit Ride
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledRideDetails;
