const express = require('express');
const router = express.Router();
const parties = require('../data/parties.json');

// GET /api/parties
router.get('/', (req, res) => {
  const { ideology, minSeats, maxSeats } = req.query;
  let result = [...parties];

  if (ideology) {
    result = result.filter(p =>
      p.ideology.toLowerCase().includes(ideology.toLowerCase())
    );
  }
  if (minSeats) result = result.filter(p => p.seatsWon >= parseInt(minSeats));
  if (maxSeats) result = result.filter(p => p.seatsWon <= parseInt(maxSeats));

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/parties/:id
router.get('/:id', (req, res) => {
  const party = parties.find(p => p.id === req.params.id);
  if (!party) {
    return res.status(404).json({ success: false, error: 'Party not found' });
  }
  res.json({ success: true, data: party });
});

module.exports = router;
