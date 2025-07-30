document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');
  const historyList = document.getElementById('historyList');

  // Load search history on page load
  loadHistory();

  // Handle search button click
  searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
      alert('Please enter a city name.');
      return;
    }

    try {
      // Fetch weather data from backend
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (res.ok) {
        displayWeather(data);
        saveToHistory(city);
      } else {
        alert(data.error || 'Failed to fetch weather data.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching weather data.');
    }
  });

  // Display weather data
  function displayWeather(data) {
    weatherResult.innerHTML = `
      <h3>${data.city}</h3>
      <p>🌡️ Temperature: ${data.temperature} °C</p>
      <p>💧 Humidity: ${data.humidity}%</p>
      <p>💨 Wind Speed: ${data.windSpeed} m/s</p>
      <p>🌦️ Condition: ${data.condition}</p>
    `;
  }

  // Save city to Firebase (Phase 1)
  async function saveToHistory(city) {
    try {
      await fetch('/api/save-history', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ city })
      });
      loadHistory(); // reload history
    } catch (err) {
      console.error('Error saving history:', err);
    }
  }

  // Load search history from backend
  async function loadHistory() {
    try {
      const res = await fetch('/api/get-history');
      const history = await res.json();

      historyList.innerHTML = '';
      history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.city;
        historyList.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading history:', err);
    }
  }
});
