'use client';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
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

// This component will listen for changes to the center prop and update the map's view
const ChangeView = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export const LocationMap = ({ onLocationSelect, initialPosition }: LocationMapProps) => {
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(initialPosition ? new LatLng(initialPosition[0], initialPosition[1]) : null);

    // Update marker when initialPosition changes from the parent
    useEffect(() => {
        if (initialPosition) {
            setMarkerPosition(new LatLng(initialPosition[0], initialPosition[1]));
        }
    }, [initialPosition]);

    const handleMapClick = (latlng: LatLng) => {
        onLocationSelect(latlng.lat, latlng.lng);
    };

    // Default center for the map if no initial position is provided (centers on Indonesia)
    const mapCenter: LatLngExpression = initialPosition || [-2.5489, 118.0149];
    const zoomLevel = initialPosition ? 15 : 5;

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden z-0">
            <MapContainer center={mapCenter} zoom={zoomLevel} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={mapCenter} zoom={zoomLevel} />
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
