import { useEffect, useState } from 'react';
import axios from 'axios';

const RideHistory = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rides')
      .then(res => setRides(res.data))
      .catch(err => console.error('Error fetching ride history:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ride History</h2>
      {rides.length === 0 ? (
        <p>No rides booked yet.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride, i) => (
            <li key={i} className="border rounded p-4 shadow">
              <p><strong>Pickup:</strong> {ride.pickup.lat}, {ride.pickup.lng}</p>
              <p><strong>Destination:</strong> {ride.destination.lat}, {ride.destination.lng}</p>
              <p><strong>Distance:</strong> {ride.distance.toFixed(2)} km</p>
              <p><strong>Fares:</strong></p>
              <ul className="ml-5 list-disc">
                <li>Uber: ₹{ride.fares.uber.toFixed(2)}</li>
                <li>Ola: ₹{ride.fares.ola.toFixed(2)}</li>
                <li>Rapido: ₹{ride.fares.rapido.toFixed(2)}</li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">Booked on: {new Date(ride.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RideHistory;
