/**
 * LocationView Component
 * Displays a location on a map using OpenStreetMap + Leaflet
 */

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LocationView.module.css';

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

interface LocationViewProps {
    latitude: number;
    longitude: number;
    locationName?: string;
    vehicleName?: string;
}

const LocationView = ({ latitude, longitude, locationName, vehicleName }: LocationViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const position: [number, number] = [latitude, longitude];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    const openInOpenStreetMap = () => {
        const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <button
                type="button"
                className={styles.viewButton}
                onClick={openModal}
            >
                📍 View Location
            </button>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Vehicle Location</h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            {locationName && (
                                <div className={styles.locationInfo}>
                                    <span className={styles.locationIcon}>📍</span>
                                    <span>{locationName}</span>
                                </div>
                            )}

                            <div className={styles.mapContainer}>
                                <MapContainer
                                    center={position}
                                    zoom={15}
                                    className={styles.map}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            <strong>{vehicleName || 'Vehicle Location'}</strong>
                                            {locationName && <><br />{locationName}</>}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>

                            <div className={styles.coordinates}>
                                <strong>Coordinates:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                type="button"
                                className={styles.externalButton}
                                onClick={openInGoogleMaps}
                            >
                                🗺️ Open in Google Maps
                            </button>
                            <button
                                type="button"
                                className={styles.externalButton}
                                onClick={openInOpenStreetMap}
                            >
                                🌍 Open in OpenStreetMap
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationView;
