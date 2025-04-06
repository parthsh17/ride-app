const express = require('express');
const axios = require('axios');
const Ride = require('../models/Ride');
const router = express.Router();

const ORS_API_KEY = '5b3ce3597851110001cf6248051f15a93d914a76b14ba821d5bdaf14';

// Get coordinates from location name
async function geocodeLocation(locationName) {
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(locationName)}`;
  const response = await axios.get(url);
  const coords = response.data.features[0]?.geometry.coordinates;
  if (!coords) throw new Error(`Could not geocode location: ${locationName}`);
  return { lng: coords[0], lat: coords[1] };
}

async function getRouteData(pickup, destination) {
  const response = await axios.post(
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
    {
      coordinates: [
        [pickup.lng, pickup.lat],
        [destination.lng, destination.lat]
      ]
    },
    {
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const route = response.data.features[0];
  const distance = route.properties.summary.distance / 1000; // in km
  const geometry = route.geometry;

  return { distance, geometry };
}

// Book Ride
router.post('/', async (req, res) => {
  const { pickupLocation, destinationLocation, prices } = req.body;

  try {
    const pickup = await geocodeLocation(pickupLocation);
    const destination = await geocodeLocation(destinationLocation);

    const { distance, geometry } = await getRouteData(pickup, destination);

    const fares = {
      uber: prices.uber * distance,
      ola: prices.ola * distance,
      rapido: prices.rapido * distance
    };

    const newRide = new Ride({ pickup, destination, distance, fares });
    await newRide.save();

    res.json({ distance, fares, geometry });
  } catch (err) {
    console.error("Error booking ride:", err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

module.exports = router;
