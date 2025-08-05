const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // calculate stats from searchHistory
  res.json({
    mostSearched: ['Ottawa', 'Toronto'],
    totalSearches: 42
  });
});

module.exports = router;
