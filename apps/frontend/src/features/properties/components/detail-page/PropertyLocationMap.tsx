// File Path: frontend/src/features/properties/components/detail-page/PropertyLocationMap.tsx
'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, Icon } from 'leaflet';

const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface PropertyLocationMapProps {
    position: [number, number];
}

export const PropertyLocationMap = ({ position }: PropertyLocationMapProps) => {
    const mapCenter: LatLngExpression = position;

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden z-0 mt-4">
            <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter} icon={defaultIcon} />
            </MapContainer>
        </div>
    );
};
