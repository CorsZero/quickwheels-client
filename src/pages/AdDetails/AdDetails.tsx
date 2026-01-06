/**
 * Quick Wheel Vehicle Rental App
 * Page: AdDetails
 * Description: Shows VehicleDetails component for a specific vehicle
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicleService } from '../../services/VehicleService';
import Alert from '../../components/Alert/Alert';
import VehicleDetails from '../../components/VehicleDetails/VehicleDetails';
import type { Vehicle } from '../../services/api';
import styles from './AdDetails.module.css';

const AdDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { GetVehicleById, isPending } = useVehicleService();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Vehicle ID not provided');
      return;
    }

    GetVehicleById(
      id,
      (response) => {
        if (response?.data?.vehicle) {
          setVehicle(response.data.vehicle);
        } else {
          setError('Vehicle not found');
        }
      },
      (errorMsg) => {
        setError(errorMsg || 'Failed to load vehicle details');
      }
    );
  }, [id, GetVehicleById]);

  if (isPending) {
    return (
      <div className={styles.adDetails}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading vehicle details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={styles.adDetails}>
        <div className={styles.container}>
          {error && (
            <Alert
              message={error}
              type="error"
              duration={0}
              onClose={() => navigate('/ads')}
            />
          )}
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>
              {error || 'Vehicle not found'}
            </h2>
            <p className={styles.errorMessage}>
              {error === 'Vehicle not found'
                ? 'The vehicle you are looking for does not exist or has been removed.'
                : 'We encountered an error while loading the vehicle details. Please try again.'
              }
            </p>
            <div className={styles.errorActions}>
              <button
                className={styles.backButton}
                onClick={() => navigate('/ads')}
              >
                ← Browse All Vehicles
              </button>
              <button
                className={styles.homeButton}
                onClick={() => navigate('/')}
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adDetails}>
      <div className={styles.container}>
        {/* Back Navigation */}
        <div className={styles.navigation}>
          <button
            className={styles.backLink}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            className={styles.browseLink}
            onClick={() => navigate('/ads')}
          >
            Browse All Vehicles
          </button>
        </div>

        {/* Vehicle Details */}
        <VehicleDetails vehicle={vehicle} />
      </div>
    </div>
  );
};

export default AdDetails;