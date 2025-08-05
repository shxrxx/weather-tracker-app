// server/alerts/alertChecker.js
const fetch = require('node-fetch');

async function checkAlerts() {
  for (const userId in userPreferences) {
    const prefs = userPreferences[userId];
    // Replace with real saved cities
    const cities = ['Ottawa'];

    for (const city of cities) {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
      const data = await res.json();
      if (data.main.temp > prefs.tempThreshold) {
        console.log(`Send alert to ${userId}: temp too high in ${city}`);
      }
    }
  }
}

module.exports = checkAlerts;
