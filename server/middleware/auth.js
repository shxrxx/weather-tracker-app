// server/middleware/auth.js
const jwt = require('jsonwebtoken'); // or use Cognito SDK

// Simple middleware example: check for Authorization header
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token' });

  // ⚠️ Replace with Cognito token verification:
  try {
    // e.g., decode or validate token
    // const decoded = jwt.verify(token, YOUR_PUBLIC_KEY);
    req.user = { userId: 'dummyUserId' }; // mock for now
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
