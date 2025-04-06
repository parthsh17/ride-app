import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from './components/MapComponent';
import 'leaflet/dist/leaflet.css';

function App() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [prices, setPrices] = useState({ uber: '', ola: '', rapido: '' });
  const [result, setResult] = useState(null);

  const handleBookRide = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/rides', {
        pickupLocation,
        destinationLocation,
        prices: {
          uber: parseFloat(prices.uber),
          ola: parseFloat(prices.ola),
          rapido: parseFloat(prices.rapido)
        }
      });
      setResult(res.data);
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ride Booking App</h1>

      <div className="space-y-3">
        <div>
          <label>Pickup Location: </label>
          <input
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="e.g. India Gate"
          />
        </div>

        <div>
          <label>Destination Location: </label>
          <input
            value={destinationLocation}
            onChange={(e) => setDestinationLocation(e.target.value)}
            placeholder="e.g. Connaught Place"
          />
        </div>

        <div>
          <label>Uber (per km): </label>
          <input value={prices.uber} onChange={(e) => setPrices({ ...prices, uber: e.target.value })} />
          <label> Ola (per km): </label>
          <input value={prices.ola} onChange={(e) => setPrices({ ...prices, ola: e.target.value })} />
          <label> Rapido (per km): </label>
          <input value={prices.rapido} onChange={(e) => setPrices({ ...prices, rapido: e.target.value })} />
        </div>

        <button onClick={handleBookRide} className="bg-blue-500 text-white px-4 py-2 rounded">Book Ride</button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Ride Summary</h2>
          <p>Distance: {result.distance.toFixed(2)} km</p>
          <p>Uber: ₹{result.fares.uber.toFixed(2)} (₹{(result.fares.uber / result.distance).toFixed(2)}/km)</p>
          <p>Ola: ₹{result.fares.ola.toFixed(2)} (₹{(result.fares.ola / result.distance).toFixed(2)}/km)</p>
          <p>Rapido: ₹{result.fares.rapido.toFixed(2)} (₹{(result.fares.rapido / result.distance).toFixed(2)}/km)</p>
          <MapComponent geometry={result.geometry} />
        </div>
      )}
    </div>
  );
}

export default App;
