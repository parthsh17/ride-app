import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';

const decodePolyline = (geometry) => {
  const coords = [];
  let prevLat = 0, prevLng = 0;
  for (const coord of geometry.coordinates) {
    const [lng, lat] = coord;
    coords.push([lat, lng]);
  }
  return coords;
};

const MapComponent = ({ geometry }) => {
  const routeCoords = decodePolyline(geometry);
  if (routeCoords.length === 0) return null;

  return (
    <MapContainer
      center={routeCoords[0]}
      zoom={14}
      style={{ height: '400px', width: '100%', marginTop: '1rem' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={routeCoords[0]}>
        <Popup>Pickup</Popup>
      </Marker>
      <Marker position={routeCoords[routeCoords.length - 1]}>
        <Popup>Destination</Popup>
      </Marker>
      <Polyline positions={routeCoords} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;
