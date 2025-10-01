// File Path: frontend/src/features/properties/components/form-steps/LocationMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, LatLng, Icon } from 'leaflet';
import { useState, useEffect } from 'react';

// Leaflet's default icon path can break in Next.js. This fixes it.
const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPosition?: [number, number];
}

const MapEvents = ({ onMapClick, setMarkerPosition }: { onMapClick: (latlng: LatLng) => void; setMarkerPosition: (pos: LatLng) => void; }) => {
    useMapEvents({
        click(e) {
            setMarkerPosition(e.latlng);
            onMapClick(e.latlng);
        },
    });
    return null;
};

export const LocationMap = ({ onLocationSelect, initialPosition }: LocationMapProps) => {
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(initialPosition ? new LatLng(initialPosition[0], initialPosition[1]) : null);

    const handleMapClick = (latlng: LatLng) => {
        onLocationSelect(latlng.lat, latlng.lng);
    };

    // Default center for the map if no initial position is provided
    const mapCenter: LatLngExpression = initialPosition || [-7.7956, 110.3695]; // Yogyakarta

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden z-0">
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onMapClick={handleMapClick} setMarkerPosition={setMarkerPosition} />
                {markerPosition && (
                    <Marker position={markerPosition} icon={defaultIcon} />
                )}
            </MapContainer>
        </div>
    );
};
