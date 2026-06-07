'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapComponent.module.css';

// Fix for default marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  hotspots?: { coords: [number, number]; radius: number; color: string; label: string }[];
  customPin?: [number, number] | null;
  onPinDrop?: (latlng: [number, number]) => void;
  onPinRemove?: () => void;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapClickListener({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapComponent({ 
  center = [25.4358, 81.8463], 
  zoom = 14, 
  hotspots = [],
  customPin = null,
  onPinDrop,
  onPinRemove,
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`${styles.mapPlaceholder} glass-panel animate-fade-in`}>Loading Map...</div>;
  }

  return (
    <div className={`${styles.mapWrapper} glass-panel animate-fade-in`}>
      <MapContainer center={center} zoom={zoom} className={styles.mapContainer} zoomControl={false}>
        <MapUpdater center={center} zoom={zoom} />
        {onPinDrop && <MapClickListener onMapClick={onPinDrop} />}
        
        {/* Dark theme map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Dynamic Hotspots */}
        {hotspots.map((spot, i) => (
          <Circle 
            key={i} 
            center={spot.coords} 
            radius={spot.radius} 
            pathOptions={{ color: spot.color, fillColor: spot.color, fillOpacity: 0.4 }}
          >
            <Popup>{spot.label}</Popup>
          </Circle>
        ))}

        <Marker position={center} icon={customIcon}>
          <Popup>Command Center Focus</Popup>
        </Marker>

        {/* Custom Surveillance Pin (only one at a time) */}
        {customPin && (
          <Marker position={customPin} icon={customIcon}>
            <Popup>
              <strong>📍 Custom Surveillance Point</strong><br/>
              Lat: {customPin[0].toFixed(4)}, Lng: {customPin[1].toFixed(4)}<br/>
              <button 
                onClick={(e) => { e.stopPropagation(); onPinRemove?.(); }}
                style={{ background: 'none', border: 'none', color: '#ff1744', cursor: 'pointer', marginTop: '4px', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Remove Pin
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
