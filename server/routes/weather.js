const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

let searchHistory = [];

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const OPENUV_API_KEY = process.env.OPENUV_API_KEY;
const AQODP_API_TOKEN = process.env.AQODP_API_TOKEN;

// Basic weather data endpoint
router.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City parameter is required' });

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      return res.status(weatherData.cod).json({ error: weatherData.message });
    }

    const result = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      condition: weatherData.weather[0].description,
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Save search history endpoint
router.post('/save-history', (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City is required' });

  searchHistory.push({ city, timestamp: new Date().toISOString() });
  if (searchHistory.length > 20) searchHistory.shift();

  res.json({ message: 'Search saved' });
});

// Get search history endpoint
router.get('/get-history', (req, res) => {
  res.json([...searchHistory].reverse());
});

// Weather forecast history endpoint (3-hour intervals)
router.get('/weather-history', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== '200') return res.status(data.cod).json({ error: data.message });

    const temps = data.list.map(item => ({
      dt_txt: item.dt_txt,
      temp: item.main.temp,
    }));

    res.json(temps);
  } catch (error) {
    console.error('Error fetching weather history:', error);
    res.status(500).json({ error: 'Failed to fetch weather history' });
  }
});

// ... other code above remains same

// Extended weather data: UV Index only, AQI skipped (N/A)
router.get('/weather-extended', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // Get city coordinates (lat, lon) from OpenWeatherMap
    const geoRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}`
    );
    const geoData = await geoRes.json();
    if (geoData.cod !== 200) {
      return res.status(geoData.cod).json({ error: geoData.message });
    }
    const { lon, lat } = geoData.coord;

    // Fetch UV Index from OpenUV API
    const uvRes = await fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, {
      headers: { 'x-access-token': OPENUV_API_KEY },
    });
    const uvData = await uvRes.json();

    let uvi = null;
    if (uvRes.ok && uvData.result && typeof uvData.result.uv === 'number') {
      uvi = uvData.result.uv;
    } else {
      console.warn('OpenUV API error or no UV data:', uvData);
    }

    // Skip AQI for now
    const aqi = 'N/A';

    res.json({
      uvi: uvi !== null ? uvi : 'N/A',
      aqi,
    });
  } catch (error) {
    console.error('Error fetching extended weather:', error);
    res.status(500).json({ error: 'Failed to fetch extended weather data' });
  }
});

// ... rest of your router exports


module.exports = router;
