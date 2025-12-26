/**
 * Quick Wheel Vehicle Rental App
 * Page: CreateAd
 * Description: Form for creating new vehicle rental ads
 * Tech: React + TypeScript + CSS Modules
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAds } from '../../contexts/AdsContext';
import Alert from '../../components/Alert/Alert';
import type { CreateAdData, Vehicle } from '../../services/api';
import styles from './CreateAd.module.css';

const CreateAd = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { createAd, loading, error } = useAds();

  const [formData, setFormData] = useState<CreateAdData>({
    title: '',
    category: 'Cars',
    image: '',
    images: [],
    rentalAmount: 0,
    description: '',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    deliveryDetails: '',
    location: ''
  });

  const [success, setSuccess] = useState(false);
  const [newAdId, setNewAdId] = useState<string>('');

  const categories: Vehicle['category'][] = ['Cars', 'Scooters', 'Motor Bicycle', 'Vans', 'Large Vehicles'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara', 'Jaffna', 'Kurunegala', 'Anuradhapura', 'Badulla', 'Ratnapura'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rentalAmount' || name === 'year' ? Number(value) : value
    }));
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: newImages[0] || '' // Set first image as main image
    }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageUrl = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: newImages[0] || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.title || !formData.category || !formData.image || formData.rentalAmount <= 0) {
      return;
    }

    try {
      const newAd = await createAd(formData);
      if (newAd) {
        setNewAdId(newAd.id);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error creating ad:', err);
    }
  };

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className={styles.createAd}>
        <div className={styles.container}>
          <div className={styles.loginRequired}>
            <div className={styles.loginIcon}>🔒</div>
            <h2 className={styles.loginTitle}>Login Required</h2>
            <p className={styles.loginMessage}>
              You need to be logged in to create vehicle rental ads.
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

  // Success state
  if (success) {
    return (
      <div className={styles.createAd}>
        <div className={styles.container}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h2 className={styles.successTitle}>Ad Created Successfully!</h2>
            <p className={styles.successMessage}>
              Your vehicle rental ad has been created and is now live.
            </p>
            <div className={styles.successActions}>
              <button 
                className={styles.viewAdButton}
                onClick={() => navigate(`/ad/${newAdId}`)}
              >
                View Your Ad
              </button>
              <button 
                className={styles.createAnotherButton}
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    title: '',
                    category: 'Cars',
                    image: '',
                    images: [],
                    rentalAmount: 0,
                    description: '',
                    manufacturer: '',
                    model: '',
                    year: new Date().getFullYear(),
                    deliveryDetails: '',
                    location: ''
                  });
                }}
              >
                Create Another Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createAd}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Vehicle Rental Ad</h1>
          <p className={styles.subtitle}>
            List your vehicle for rent and start earning today
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <Alert 
              message={error} 
              type="error" 
              onClose={() => {}}
            />
          )}

          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="title" className={styles.label}>
                Vehicle Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., Toyota Corolla 2020"
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="rentalAmount" className={styles.label}>
                  Rental Amount (LKR/day) *
                </label>
                <input
                  type="number"
                  id="rentalAmount"
                  name="rentalAmount"
                  value={formData.rentalAmount || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., 8500"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Vehicle Details</h3>
            
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="manufacturer" className={styles.label}>
                  Manufacturer *
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="model" className={styles.label}>
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., Corolla"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="year" className={styles.label}>
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Images</h3>
            <p className={styles.sectionDescription}>
              Add image URLs for your vehicle. The first image will be used as the main image.
            </p>
            
            {formData.images.map((url, index) => (
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
                  disabled={index === 0}
                >
                  Remove
                </button>
              </div>
            ))}
            
            {formData.images.length === 0 && (
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

          {/* Description and Location */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Additional Details</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Describe your vehicle, its condition, features, etc."
                rows={4}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="location" className={styles.label}>
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="deliveryDetails" className={styles.label}>
                  Delivery Details
                </label>
                <input
                  type="text"
                  id="deliveryDetails"
                  name="deliveryDetails"
                  value={formData.deliveryDetails}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., Free delivery within 10km"
                />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating...' : 'Create Ad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;