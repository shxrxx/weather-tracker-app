# weather-tracker-app
---

````markdown
# 🌤️ Weather Tracker – Cloud-Based Real-Time Weather Monitoring App

Weather Tracker is a web-based application that allows users to search and view real-time weather updates from cities around the world.  
Built with HTML, CSS, JavaScript (frontend) and Node.js + Express (backend), it fetches live data from the OpenWeatherMap API and stores user search history in Firebase Realtime Database.

---

## ✅ Features (Phase 1 - MVP)
- Search for real-time weather by city name
- Display temperature, humidity, wind speed, and weather conditions
- Save and view search history from the cloud
- Responsive, mobile-friendly user interface

---

## 🛠️ Technology Stack

| Layer    | Technology / Tool                      |
|---------:|----------------------------------------|
| Frontend | HTML5, CSS3, JavaScript (ES6)          |
| Backend  | Node.js, Express.js                    |
| API      | OpenWeatherMap                         |
| Database | Firebase Realtime Database (NoSQL)     |
| Hosting  | Local (planned: Vercel / GitHub Pages) |

---

## 🚀 Getting Started

Follow these steps to run the app locally:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/weather-tracker-app.git
cd weather-tracker-app
````

### 2. Install backend dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the project root:

```plaintext
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
```

### 4. Start the server

```bash
npx nodemon server/index.js
```

The app will be available at:
📍 `http://localhost:5000`

---

## 🖼️ Project Structure

```plaintext
weather-tracker-app/
├── public/
│   ├── index.html
│   ├── css/styles.css
│   └── js/main.js
├── server/
│   ├── index.js
│   └── routes/weather.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ✏️ Planned Future Features

```plaintext
User authentication (Amazon Cognito)

Personalized weather alerts and notifications

Advanced data integrations (UV index, air quality, pollen)

Interactive charts (temperature trends, hourly forecast)

Progressive Web App (offline access, install on device)

Historical analytics dashboard

Persistent search history in AWS DynamoDB

Deploy backend on AWS (EC2, Elastic Beanstalk, or Lambda)
```
---
## 🔧 Planned AWS services

| Purpose                      | Service                          |
| ---------------------------- | -------------------------------- |
| Authentication               | Amazon Cognito                   |
| NoSQL database               | Amazon DynamoDB                  |
| Hosting / backend deployment | EC2 / Elastic Beanstalk / Lambda |
| Object storage (optional)    | Amazon S3                        |
| Monitoring & logs (optional) | Amazon CloudWatch                |

---

## 📚 Learn More

OpenWeatherMap API : https://openweathermap.org/api

AWS DynamoDB : https://aws.amazon.com/dynamodb/

Amazon Cognito : https://aws.amazon.com/cognito/

Node.js & Express.js : https://expressjs.com/


---

## 📦 License

MIT License – feel free to fork and build on top!



> ⚡ *Made with love & JavaScript by \sharon* 🌱

```


