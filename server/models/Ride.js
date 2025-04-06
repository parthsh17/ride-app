const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  pickup: Object,
  destination: Object,
  distance: Number,
  fares: {
    uber: Number,
    ola: Number,
    rapido: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
