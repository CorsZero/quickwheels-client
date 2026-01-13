/**
 * Quick Wheel Vehicle Rental App
 * Page: Vehicle Management
 * Description: Manage vehicle details and booking requests
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicleService } from '../../services/VehicleService';
import { useProfile } from '../../queries/user.queries';
import Alert from '../../components/Alert/Alert';
import styles from './VehicleManagement.module.css';

interface VehicleData {
    id: string;
    ownerId: string;
    make: string;
    model: string;
    year: number;
    category: string;
    transmission: string;
    fuelType: string;
    seats: number;
    pricePerDay: number;
    location: string;
    district: string;
    description: string;
    features: string[];
    images: string[];
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

const VehicleManagement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const { GetVehicleById, UpdateVehicle, DeleteVehicleImage, RemoveVehicle, UpdateVehicleStatus, isPending: vehiclePending } = useVehicleService();

    const [vehicle, setVehicle] = useState<VehicleData | null>(null);
    const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeReason, setRemoveReason] = useState('');

    // Edit form state
    const [editFormData, setEditFormData] = useState({
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
        description: '',
        images: [] as string[],
        newImages: [] as File[]
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);

    // Alert states
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const categories = ['CAR', 'VAN', 'SUV', 'BIKE'];
    const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara', 'Jaffna', 'Kurunegala', 'Anuradhapura', 'Badulla', 'Ratnapura'];

    const isLoggedIn = !!profile?.data;
    const currentUserId = profile?.data?.id;

    // Fetch vehicle details
    useEffect(() => {
        if (!id || !isLoggedIn) return;

        setIsLoadingVehicle(true);
        GetVehicleById(
            id,
            (response) => {
                const vehicleData = response.data;

                // Check if current user is the owner
                if (vehicleData.ownerId !== currentUserId) {
                    navigate(`/ad/${id}`);
                    return;
                }

                setVehicle(vehicleData);
                setEditFormData({
                    make: vehicleData.make,
                    model: vehicleData.model,
                    year: vehicleData.year,
                    category: vehicleData.category,
                    transmission: vehicleData.transmission,
                    fuelType: vehicleData.fuelType,
                    seats: vehicleData.seats,
                    pricePerDay: vehicleData.pricePerDay,
                    location: vehicleData.location,
                    district: vehicleData.district,
                    description: vehicleData.description,
                    images: vehicleData.images || [],
                    newImages: []
                });
                setImagePreviews([]);
                setIsLoadingVehicle(false);
            },
            (error) => {
                setIsLoadingVehicle(false);
                setAlertMessage('Failed to load vehicle details');
                setAlertType('error');
            }
        );
    }, [id, isLoggedIn, currentUserId]);

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'pricePerDay' || name === 'year' || name === 'seats' ? Number(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

            setEditFormData(prev => ({
                ...prev,
                newImages: [...prev.newImages, ...newFiles]
            }));

            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (index: number) => {
        if (!id) return;

        const imageUrl = editFormData.images[index];
        setDeletingImageIndex(index);

        // Call API to delete image from S3
        DeleteVehicleImage(
            id,
            imageUrl,
            (response) => {
                setAlertMessage('Image deleted successfully!');
                setAlertType('success');
                setDeletingImageIndex(null);

                // Refetch vehicle data to get fresh presigned URLs
                GetVehicleById(
                    id,
                    (fetchResponse) => {
                        const refreshedVehicle = fetchResponse.data;
                        setVehicle(refreshedVehicle);
                        setEditFormData(prev => ({
                            ...prev,
                            images: refreshedVehicle.images || []
                        }));
                    },
                    (fetchError) => {
                        setEditFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                        }));
                    }
                );
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || 'Failed to delete image';
                setAlertMessage(errorMessage);
                setAlertType('error');
                setDeletingImageIndex(null);
            }
        );
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setEditFormData(prev => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateVehicle = (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        // Prepare update data - only text fields and new images
        // Image deletion is handled separately via DeleteVehicleImage
        const updateData = {
            make: editFormData.make,
            model: editFormData.model,
            year: editFormData.year,
            category: editFormData.category,
            transmission: editFormData.transmission,
            fuelType: editFormData.fuelType,
            seats: editFormData.seats,
            pricePerDay: editFormData.pricePerDay,
            location: editFormData.location,
            district: editFormData.district,
            description: editFormData.description,
            newImages: editFormData.newImages
        };

        UpdateVehicle(
            id,
            updateData,
            (response) => {
                setAlertMessage('Vehicle updated successfully!');
                setAlertType('success');

                // Clear preview URLs for new images
                imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                setImagePreviews([]);

                // Refetch vehicle data to get fresh presigned URLs
                GetVehicleById(
                    id,
                    (fetchResponse) => {
                        const refreshedVehicle = fetchResponse.data;
                        setVehicle(refreshedVehicle);

                        // Update form with fresh data
                        setEditFormData({
                            make: refreshedVehicle.make,
                            model: refreshedVehicle.model,
                            year: refreshedVehicle.year,
                            category: refreshedVehicle.category,
                            transmission: refreshedVehicle.transmission,
                            fuelType: refreshedVehicle.fuelType,
                            seats: refreshedVehicle.seats,
                            pricePerDay: refreshedVehicle.pricePerDay,
                            location: refreshedVehicle.location,
                            district: refreshedVehicle.district,
                            description: refreshedVehicle.description,
                            images: refreshedVehicle.images || [],
                            newImages: []
                        });
                    },
                    (fetchError) => {
                        if (response?.data?.vehicle) {
                            const updatedVehicle = response.data.vehicle;
                            setVehicle(updatedVehicle);
                            setEditFormData({
                                make: updatedVehicle.make,
                                model: updatedVehicle.model,
                                year: updatedVehicle.year,
                                category: updatedVehicle.category,
                                transmission: updatedVehicle.transmission,
                                fuelType: updatedVehicle.fuelType,
                                seats: updatedVehicle.seats,
                                pricePerDay: updatedVehicle.pricePerDay,
                                location: updatedVehicle.location,
                                district: updatedVehicle.district,
                                description: updatedVehicle.description,
                                images: updatedVehicle.images || [],
                                newImages: []
                            });
                        }
                    }
                );
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || 'Failed to update vehicle';
                setAlertMessage(errorMessage);
                setAlertType('error');
            }
        );
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleRemoveVehicle = () => {
        if (!id || !removeReason.trim()) {
            setAlertMessage('Please provide a reason for removing the vehicle');
            setAlertType('error');
            return;
        }

        RemoveVehicle(
            id,
            removeReason.trim(),
            () => {
                setAlertMessage('Vehicle removed successfully');
                setAlertType('success');
                setShowRemoveModal(false);
                setTimeout(() => {
                    navigate('/my-vehicles');
                });
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || 'Failed to remove vehicle';
                setAlertMessage(errorMessage);
                setAlertType('error');
            }
        );
    };

    const handleMaintenanceMode = () => {
        if (!id || !vehicle) return;

        const newStatus = vehicle.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';

        UpdateVehicleStatus(
            id,
            newStatus,
            () => {
                setAlertMessage(newStatus === 'MAINTENANCE'
                    ? 'Vehicle set to maintenance mode'
                    : 'Vehicle is now available');
                setAlertType('success');
                setVehicle(prev => prev ? { ...prev, status: newStatus } : null);
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || 'Failed to update vehicle status';
                setAlertMessage(errorMessage);
                setAlertType('error');
            }
        );
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.container}>
                <div className={styles.errorBox}>
                    <h2>Login Required</h2>
                    <button onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            </div>
        );
    }

    if (isLoadingVehicle) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading vehicle details...</div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className={styles.container}>
                <div className={styles.errorBox}>
                    <h2>Vehicle not found</h2>
                    <button onClick={() => navigate('/my-vehicles')}>Back to My Vehicles</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.vehicleManagement}>
            <div className={styles.container}>
                {/* Alert */}
                {alertMessage && (
                    <Alert
                        message={alertMessage}
                        type={alertType}
                        duration={5000}
                        onClose={() => setAlertMessage('')}
                    />
                )}

                {/* Back Button */}
                <button className={styles.backButton} onClick={() => navigate('/my-vehicles')}>
                    ← Back to My Vehicles
                </button>

                <div className={styles.formWrapper}>
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Edit Vehicle Details</h2>
                        </div>

                        <form onSubmit={handleUpdateVehicle} className={styles.form}>
                            {/* Image Section */}
                            <div className={styles.imageSection}>
                                <div className={styles.imagePlaceholder}>
                                    {editFormData.images.length > 0 || imagePreviews.length > 0 ? (
                                        <div className={styles.mainImageDisplay}>
                                            <img
                                                src={editFormData.images[0] || imagePreviews[0]}
                                                alt={`${editFormData.make} ${editFormData.model}`}
                                                className={styles.mainImage}
                                            />
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

                                {(editFormData.images.length > 0 || imagePreviews.length > 0) && (
                                    <div className={styles.imageThumbnails}>
                                        {/* Existing images */}
                                        {editFormData.images.map((image, index) => (
                                            <div key={`existing-${index}`} className={styles.thumbnail}>
                                                <img src={image} alt={`Preview ${index + 1}`} />
                                                {deletingImageIndex === index && (
                                                    <div className={styles.imageLoadingOverlay}>
                                                        <div className={styles.spinner}></div>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className={styles.removeButton}
                                                    disabled={deletingImageIndex === index}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {/* New images */}
                                        {imagePreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className={styles.thumbnail}>
                                                <img src={preview} alt={`New ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className={styles.removeButton}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
                                        value={editFormData.make}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.model}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.year}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.category}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.location}
                                        onChange={handleEditInputChange}
                                        placeholder="e.g., Colombo"
                                        required
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="transmission">Transmission</label>
                                    <select
                                        id="transmission"
                                        name="transmission"
                                        value={editFormData.transmission}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.fuelType}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.seats}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.district}
                                        onChange={handleEditInputChange}
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
                                        value={editFormData.pricePerDay || ''}
                                        onChange={handleEditInputChange}
                                        placeholder="e.g., 8500"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Optional Details */}
                            <div className={styles.optionalDetails}>
                                <label htmlFor="description">Description & Optional Details</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditInputChange}
                                    placeholder="Describe your vehicle, its condition, features, delivery mode, security deposit info, etc."
                                    rows={5}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className={styles.actions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={vehiclePending.updateVehicle}
                                >
                                    {vehiclePending.updateVehicle ? 'Saving...' : 'SAVE CHANGES'}
                                </button>
                            </div>

                            {/* Vehicle Management Actions */}
                            <div className={styles.managementActions}>
                                <button
                                    type="button"
                                    className={`${styles.maintenanceButton} ${vehicle?.status === 'MAINTENANCE' ? styles.maintenanceActive : ''}`}
                                    onClick={handleMaintenanceMode}
                                    disabled={vehiclePending.updateVehicleStatus}
                                >
                                    {vehiclePending.updateVehicleStatus
                                        ? 'Updating...'
                                        : vehicle?.status === 'MAINTENANCE'
                                            ? 'Exit Maintenance Mode'
                                            : 'Set Maintenance Mode'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.removeVehicleButton}
                                    onClick={() => setShowRemoveModal(true)}
                                >
                                    Remove Vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Remove Vehicle Modal */}
                {showRemoveModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3 className={styles.modalTitle}>Remove Vehicle</h3>
                            <p className={styles.modalText}>
                                Are you sure you want to remove this vehicle? This action cannot be undone.
                                All images will be permanently deleted.
                            </p>
                            <div className={styles.modalInput}>
                                <label htmlFor="removeReason">Reason for removal</label>
                                <textarea
                                    id="removeReason"
                                    value={removeReason}
                                    onChange={(e) => setRemoveReason(e.target.value)}
                                    placeholder="Please provide a reason..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowRemoveModal(false);
                                        setRemoveReason('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={styles.confirmRemoveButton}
                                    onClick={handleRemoveVehicle}
                                    disabled={!removeReason.trim() || vehiclePending.removeVehicle}
                                >
                                    {vehiclePending.removeVehicle ? 'Removing...' : 'Remove Vehicle'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleManagement;
