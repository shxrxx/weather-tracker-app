const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // serve frontend files

// This line must exactly match the path to your weather.js
const weatherRoutes = require('./routes/weather');  

app.use('/api', weatherRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
