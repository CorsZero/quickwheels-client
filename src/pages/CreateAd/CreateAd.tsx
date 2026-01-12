/**
 * Quick Wheel Vehicle Rental App
 * Page: CreateAd
 * Description: Form for creating new vehicle rental ads
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../queries/user.queries';
import { useVehicleService } from '../../services/VehicleService';
import { LocationPicker } from '../../components/LocationPicker';
import type { Vehicle } from '../../services/api';
import styles from './CreateAd.module.css';

const CreateAd = () => {
  const navigate = useNavigate();

  // Check if user is logged in via cookies
  const { data: profile, isLoading: profileLoading } = useProfile();
  const isLoggedIn = !!profile?.data;

  const { CreateVehicle, isPending } = useVehicleService();
  const isCreating = isPending.createVehicle;

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'CAR' as Vehicle['category'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 4,
    pricePerDay: 0,
    location: '',
    district: '',
    latitude: null as number | null,
    longitude: null as number | null,
    description: '',
    features: [] as string[],
    images: [] as File[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [newAdId, setNewAdId] = useState<string>('');

  const categories: Vehicle['category'][] = ['CAR', 'VAN', 'SUV', 'BIKE'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara', 'Jaffna', 'Kurunegala', 'Anuradhapura', 'Badulla', 'Ratnapura'];

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerDay' || name === 'year' || name === 'seats' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));

      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted with data:', formData);

    if (!isLoggedIn) {
      console.log('User not logged in, redirecting...');
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.make || !formData.model || !formData.category || formData.images.length === 0 || formData.pricePerDay <= 0 || !formData.location || !formData.district) {
      console.log('Validation failed:', {
        make: formData.make,
        model: formData.model,
        category: formData.category,
        imagesCount: formData.images.length,
        pricePerDay: formData.pricePerDay,
        location: formData.location,
        district: formData.district
      });
      alert('Please fill in all required fields');
      return;
    }

    console.log('Validation passed, calling CreateVehicle...');

    CreateVehicle(
      formData,
      (response) => {
        console.log('Vehicle created successfully:', response);
        if (response?.data?.vehicle?.id) {
          setNewAdId(response.data.vehicle.id);
          setSuccess(true);
        }
      },
      (errorMsg) => {
        console.error('Error creating ad:', errorMsg);
        alert('Error creating ad. Check console for details.');
      }
    );
  };

  // Show loading while checking authentication
  if (profileLoading) {
    return (
      <div className={styles.createAd}>
        <div className={styles.container}>
          <div className={styles.loginRequired}>
            <h2 className={styles.loginTitle}>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className={styles.createAd}>
        <div className={styles.container}>
          <div className={styles.loginRequired}>
            <div className={styles.loginIcon}>Login Required</div>
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
            <div className={styles.successIcon}>✓ Ad Created Successfully!</div>
            <h2 className={styles.successTitle}>Your Vehicle is Now Listed</h2>
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
                  setNewAdId('');
                  // Clean up image previews
                  imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                  setImagePreviews([]);
                  setFormData({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    category: 'CAR',
                    transmission: 'Automatic',
                    fuelType: 'Petrol',
                    seats: 4,
                    pricePerDay: 0,
                    location: '',
                    district: '',
                    latitude: null,
                    longitude: null,
                    description: '',
                    features: [],
                    images: []
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
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Fill Vehicle Details</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Image Section */}
              <div className={styles.imageSection}>
                <div className={styles.imagePlaceholder}>
                  {imagePreviews.length > 0 ? (
                    <div className={styles.mainImageDisplay}>
                      <img src={imagePreviews[0]} alt="Main vehicle" className={styles.mainImage} />
                    </div>
                  ) : (
                    <div className={styles.imagePlus}>+</div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className={styles.imageThumbnails}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={styles.thumbnail}>
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className={styles.removeButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <p className={styles.imageError}>At least one image is required</p>
                )}
              </div>

              <h3 className={styles.sectionLabel}>Vehicle Name</h3>

              {/* Vehicle Details Grid */}
              <div className={styles.fieldsGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="make">Manufacturer</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="model">Model</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Corolla"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="year">Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="category">Type (Category)</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="location">City</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Colombo"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="transmission">Transmission</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="fuelType">Fuel Type</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="seats">Seats</label>
                  <input
                    type="number"
                    id="seats"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="2"
                    max="50"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="district">District</label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select District</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="pricePerDay">Price Per Day (LKR)</label>
                  <input
                    type="number"
                    id="pricePerDay"
                    name="pricePerDay"
                    value={formData.pricePerDay || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 8500"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Map Location Section */}
              <div className={styles.locationSection}>
                <h3 className={styles.sectionLabel}>Vehicle Location (Map)</h3>
                <p className={styles.locationHint}>
                  Select the exact pickup location for your vehicle on the map
                </p>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLat={formData.latitude ?? undefined}
                  initialLng={formData.longitude ?? undefined}
                />
              </div>

              {/* Optional Details */}
              <div className={styles.optionalDetails}>
                <label htmlFor="description">Description & Optional Details</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your vehicle, its condition, features, delivery mode, security deposit info, etc."
                  rows={5}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className={styles.actions}>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={styles.submitButton}
                >
                  {isCreating ? 'Submitting...' : 'SUBMIT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAd;