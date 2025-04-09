import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { connectWebSocket } from '../services/websocketService';

const ATCOnlineMap = () => {
  const [aircraft, setAircraft] = useState([]);

  useEffect(() => {
    const socket = connectWebSocket((data) => {
      setAircraft((prev) => [...prev.filter(a => a.id !== data.id), data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '80vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {aircraft.map((plane) => (
        <Marker key={plane.id} position={[plane.lat, plane.lon]}>
          <Popup>
            <strong>{plane.callsign}</strong><br />
            Altitude: {plane.altitude} ft<br />
            Velocidade: {plane.speed} kt
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ATCOnlineMap;
