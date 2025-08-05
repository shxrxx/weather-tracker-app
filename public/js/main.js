document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');
  const historyList = document.getElementById('historyList');

  loadHistory();

  searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
      alert('Please enter a city name.');
      return;
    }

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (res.ok) {
        displayWeather(data);
        await saveToHistory(city);
        drawChart(city);

        try {
          const extRes = await fetch(`/api/weather-extended?city=${encodeURIComponent(city)}`);
          const extData = await extRes.json();
          if (extRes.ok) {
            displayExtendedWeather(extData);
          } else {
            console.warn('Extended weather fetch failed:', extData.error);
          }
        } catch (err) {
          console.error('Error fetching extended weather:', err);
        }
      } else {
        alert(data.error || 'Failed to fetch weather data.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching weather data.');
    }
  });

  async function drawChart(city) {
    try {
      const res = await fetch(`/api/weather-history?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      const ctx = document.getElementById('tempChart').getContext('2d');

      if (window.tempChartInstance) {
        window.tempChartInstance.destroy();
      }

      window.tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.dt_txt),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: data.map(item => item.temp),
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { display: true, title: { display: true, text: 'Date/Time' } },
            y: { display: true, title: { display: true, text: 'Temperature (°C)' } },
          },
        },
      });
    } catch (error) {
      console.error('Error drawing chart:', error);
    }
  }

  function displayWeather(data) {
    weatherResult.innerHTML = `
      <h3>${data.city}</h3>
      <p>🌡️ Temperature: ${data.temperature} °C</p>
      <p>💧 Humidity: ${data.humidity}%</p>
      <p>💨 Wind Speed: ${data.windSpeed} m/s</p>
      <p>🌦️ Condition: ${data.condition}</p>
    `;
  }

  function displayExtendedWeather(data) {
    const uvIndex = data.uvi !== undefined ? data.uvi : 'N/A';
    const aqi = data.aqi !== undefined ? data.aqi : 'N/A';

    weatherResult.innerHTML += `
      <p>☀️ UV Index: ${uvIndex}</p>
      <p>🌫️ Air Quality Index: ${aqi}</p>
    `;
  }

  async function saveToHistory(city) {
    try {
      await fetch('/api/save-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      loadHistory();
    } catch (err) {
      console.error('Error saving history:', err);
    }
  }

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
