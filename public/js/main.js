// Firebase config and initialization (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyD97QM0cJ_dlIGNCCHkY8DwSI_9N9YZFr0",
  authDomain: "weather-tracker-app-203af.firebaseapp.com",
  projectId: "weather-tracker-app-203af",
  storageBucket: "weather-tracker-app-203af.firebasestorage.app",
  messagingSenderId: "891012355877",
  appId: "1:891012355877:web:3aa841dd16e6684c5b6ccc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  // Auth elements
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const authMessage = document.getElementById('authMessage');

  // Weather elements
  const searchBtn = document.getElementById('searchBtn');
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');
  const historyList = document.getElementById('historyList');

  // Clear History button (hidden initially)
  const clearHistoryBtn = document.createElement('button');
  clearHistoryBtn.textContent = '🗑️ Clear History';
  clearHistoryBtn.style.display = 'none';
  clearHistoryBtn.className = 'btn-clear-history';
  historyList.parentNode.insertBefore(clearHistoryBtn, historyList.nextSibling);

  // Show or hide UI based on auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      authMessage.textContent = `Logged in as ${user.email}`;
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      emailInput.style.display = 'none';
      passwordInput.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      // Load user-specific history
      loadHistory(user.uid);
    } else {
      authMessage.textContent = 'Please log in or sign up';
      loginBtn.style.display = 'inline-block';
      signupBtn.style.display = 'inline-block';
      emailInput.style.display = 'inline-block';
      passwordInput.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      historyList.innerHTML = '';
      weatherResult.innerHTML = '<p>Please login to see your search history and save searches.</p>';
      clearHistoryBtn.style.display = 'none';
    }
  });

  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      authMessage.textContent = '⚠️ Please enter email and password.';
      return;
    }
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        authMessage.textContent = '✅ Logged in successfully.';
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(err => {
        authMessage.textContent = `❌ Login failed: ${err.message}`;
      });
  });

  signupBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      authMessage.textContent = '⚠️ Please enter email and password.';
      return;
    }
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        authMessage.textContent = '✅ Account created. You are now logged in.';
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(err => {
        authMessage.textContent = `❌ Signup failed: ${err.message}`;
      });
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      authMessage.textContent = 'You have been logged out.';
      historyList.innerHTML = '';
      weatherResult.innerHTML = '';
      clearHistoryBtn.style.display = 'none';
    });
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (confirm('Are you sure you want to clear the entire search history?')) {
      try {
        await database.ref(`searches/${user.uid}`).remove();
        loadHistory(user.uid);
      } catch (err) {
        console.error('Error clearing history:', err);
        alert('Failed to clear history.');
      }
    }
  });

  // Search button event
  searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    const user = auth.currentUser;
    if (!user) {
      alert('⚠️ Please log in to search and save history.');
      return;
    }
    if (!city) {
      alert('⚠️ Please enter a city name.');
      return;
    }
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (res.ok) {
        displayWeather(data);
        await saveToHistory(user.uid, city);
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
        alert(`❌ ${data.error || 'Failed to fetch weather data.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error fetching weather data.');
    }
  });

  // Draw chart for city
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
              label: '🌡️ Temperature (°C)',
              data: data.map(item => item.temp),
              borderColor: '#007BFF',
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { font: { size: 14 } } },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: { display: true, title: { display: true, text: 'Date / Time' } },
            y: { display: true, title: { display: true, text: 'Temperature (°C)' }, suggestedMin: 0 },
          },
        },
      });
    } catch (error) {
      console.error('Error drawing chart:', error);
    }
  }

  // Display current weather info
  function displayWeather(data) {
    weatherResult.innerHTML = `
      <h3>📍 ${data.city}</h3>
      <p>🌡️ <strong>Temperature:</strong> ${data.temperature} °C</p>
      <p>💧 <strong>Humidity:</strong> ${data.humidity}%</p>
      <p>💨 <strong>Wind Speed:</strong> ${data.windSpeed} m/s</p>
      <p>🌦️ <strong>Condition:</strong> ${capitalizeFirstLetter(data.condition)}</p>
    `;
  }

  // Display extended weather data (UV index, AQI)
  function displayExtendedWeather(data) {
    const uvIndex = data.uvi !== undefined ? data.uvi : 'N/A';
    const aqi = data.aqi !== undefined ? data.aqi : 'N/A';

    weatherResult.innerHTML += `
      <p>☀️ <strong>UV Index:</strong> ${uvIndex}</p>
      <p>🌫️ <strong>Air Quality Index:</strong> ${aqi}</p>
    `;
  }

  // Save city search history to Firebase under user ID
  async function saveToHistory(uid, city) {
    try {
      const normalizedCity = city.trim().toLowerCase();

      const userSearchesRef = database.ref(`searches/${uid}`);
      const snapshot = await userSearchesRef.orderByChild('cityLower').equalTo(normalizedCity).once('value');

      if (snapshot.exists()) {
        const key = Object.keys(snapshot.val())[0];
        await userSearchesRef.child(key).update({ timestamp: new Date().toISOString() });
      } else {
        await userSearchesRef.push({
          city,
          cityLower: normalizedCity,
          timestamp: new Date().toISOString()
        });
      }

      loadHistory(uid);
    } catch (err) {
      console.error('Error saving history to Firebase:', err);
    }
  }

  // Load user-specific search history and update UI
  function loadHistory(uid) {
    if (!uid) return;
    try {
      const userSearchesRef = database.ref(`searches/${uid}`);
      userSearchesRef.off();

      userSearchesRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        historyList.innerHTML = '';

        const entries = Object.values(data).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (entries.length === 0) {
          clearHistoryBtn.style.display = 'none';
          historyList.innerHTML = '<li>No search history found.</li>';
        } else {
          clearHistoryBtn.style.display = 'inline-block';
        }

        entries.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `🌆 <strong>${item.city}</strong>`;
          li.className = 'history-item';
          li.title = 'Click to search this city';
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => {
            cityInput.value = item.city;
            searchBtn.click();
          });
          historyList.appendChild(li);
        });
      });
    } catch (err) {
      console.error('Error loading history from Firebase:', err);
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
