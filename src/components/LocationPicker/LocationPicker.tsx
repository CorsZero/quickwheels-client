/**
 * LocationPicker Component
 * Allows users to select a location on a map using OpenStreetMap + Leaflet
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LocationPicker.module.css';

// Fix for default marker icon in Leaflet with webpack/vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
    compact?: boolean;
}

interface LocationMarkerProps {
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
}

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }: LocationMarkerProps) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
};

// Component to recenter map
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setView([lat, lng], 15);
    }, [lat, lng, map]);

    return null;
};

const LocationPicker = ({ onLocationSelect, initialLat, initialLng, compact }: LocationPickerProps) => {
    // Default to Colombo, Sri Lanka
    const defaultLat = 6.9271;
    const defaultLng = 79.8612;

    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        initialLat || defaultLat,
        initialLng || defaultLng
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Update parent when position changes
    useEffect(() => {
        if (position) {
            onLocationSelect(position[0], position[1]);
        }
    }, [position, onLocationSelect]);

    // Get current location using IP-based geolocation (works on HTTP)
    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);

        try {
            // Try browser geolocation first (works on HTTPS and localhost)
            if (navigator.geolocation && window.isSecureContext) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                        setPosition(newPos);
                        setMapCenter(newPos);
                        setIsLoadingLocation(false);
                    },
                    async () => {
                        // If browser geolocation fails, try IP-based geolocation
                        await getLocationByIP();
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                // If not secure context, use IP-based geolocation
                await getLocationByIP();
            }
        } catch (error) {
            // Final fallback to default location
            const defaultPos: [number, number] = [defaultLat, defaultLng];
            setPosition(defaultPos);
            setMapCenter(defaultPos);
            setIsLoadingLocation(false);
        }
    };

    // Get location based on IP address (works on HTTP)
    const getLocationByIP = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.latitude && data.longitude) {
                const newPos: [number, number] = [data.latitude, data.longitude];
                setPosition(newPos);
                setMapCenter(newPos);
            } else {
                // Fallback to default location
                const defaultPos: [number, number] = [defaultLat, defaultLng];
                setPosition(defaultPos);
                setMapCenter(defaultPos);
            }
        } catch (error) {
            // Fallback to default location
            const defaultPos: [number, number] = [defaultLat, defaultLng];
            setPosition(defaultPos);
            setMapCenter(defaultPos);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handlePositionChange = (newPos: [number, number]) => {
        setPosition(newPos);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const confirmLocation = () => {
        closeModal();
    };

    return (
        <div className={styles.locationPicker}>
            {!compact && (
                <div className={styles.locationDisplay}>
                    {position ? (
                        <div className={styles.selectedLocation}>
                            <span className={styles.locationIcon}>📍</span>
                            <span className={styles.locationText}>Location selected</span>
                        </div>
                    ) : (
                        <span className={styles.noLocation}>No location selected</span>
                    )}
                </div>
            )}

            <div className={compact ? styles.compactActions : styles.actions}>
                <button
                    type="button"
                    className={compact ? `${styles.compactButton} ${styles.compactPrimary}` : styles.selectButton}
                    onClick={openModal}
                >
                    Select on Map
                </button>
                <button
                    type="button"
                    className={compact ? `${styles.compactButton} ${styles.compactSecondary}` : styles.currentButton}
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                >
                    {isLoadingLocation ? (
                        <span className={styles.buttonSpinner} aria-live="polite">
                            <span className={styles.spinner} />
                            Getting...
                        </span>
                    ) : (
                        'Use Current Location'
                    )}
                </button>
            </div>

            {/* Map Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Select Vehicle Location</h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <p className={styles.instruction}>Click on the map to select the vehicle location</p>

                            <div className={styles.mapContainer}>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={13}
                                    className={styles.map}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker position={position} setPosition={handlePositionChange} />
                                    {position && <RecenterMap lat={position[0]} lng={position[1]} />}
                                </MapContainer>
                            </div>

                            {position && (
                                <div className={styles.selectedInfo}>
                                    <strong>Selected:</strong> Location selected
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                type="button"
                                className={styles.useCurrentBtn}
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                aria-busy={isLoadingLocation}
                            >
                                {isLoadingLocation ? (
                                    <span className={styles.buttonSpinner} aria-live="polite">
                                        <span className={styles.spinner} />
                                        Getting Location...
                                    </span>
                                ) : (
                                    '🎯 Use My Location'
                                )}
                            </button>
                            <button
                                type="button"
                                className={styles.confirmButton}
                                onClick={confirmLocation}
                                disabled={!position}
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
