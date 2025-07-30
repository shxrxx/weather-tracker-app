const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Temporary in-memory storage for search history (replace with DB later)
let searchHistory = [];

// OpenWeatherMap API key from .env
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// GET /api/weather?city=cityName
router.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      return res.status(weatherData.cod).json({ error: weatherData.message });
    }

    // Prepare response
    const result = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      condition: weatherData.weather[0].description,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// POST /api/save-history
router.post('/save-history', (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  // Save with timestamp
  searchHistory.push({ city, timestamp: new Date().toISOString() });

  // Limit history length (optional)
  if (searchHistory.length > 20) searchHistory.shift();

  res.json({ message: 'Search saved' });
});

// GET /api/get-history
router.get('/get-history', (req, res) => {
  // Return latest first
  const historyReversed = [...searchHistory].reverse();
  res.json(historyReversed);
});

module.exports = router;
