// server/routes/preferences.js
const express = require('express');
const router = express.Router();
// const AWS = require('aws-sdk'); // enable if using DynamoDB

// Mock in-memory for now:
let userPreferences = {}; // { userId: { tempThreshold: 30, uvAlert: true, rainAlert: false } }

router.post('/', (req, res) => {
  const userId = req.user.userId; // from auth middleware
  const { tempThreshold, uvAlert, rainAlert } = req.body;
  userPreferences[userId] = { tempThreshold, uvAlert, rainAlert };
  res.json({ message: 'Preferences saved' });
});

router.get('/', (req, res) => {
  const userId = req.user.userId;
  res.json(userPreferences[userId] || {});
});

module.exports = router;
