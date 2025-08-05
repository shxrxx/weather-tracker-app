const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware (optional for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import routes
const weatherRoutes = require('./routes/weather');
// If you have preferences and analytics routes, import and mount them similarly here

// Mount API routes BEFORE static middleware
app.use('/api', weatherRoutes);

// Serve frontend static files from project root 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
