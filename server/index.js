const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rideRoutes = require('./routes/rides');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/rideBookingDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

app.use('/api/rides', rideRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
