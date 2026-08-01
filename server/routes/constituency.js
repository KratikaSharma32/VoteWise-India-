const express = require('express');
const router = express.Router();
const constituencies = require('../data/constituencies.json');

router.get('/', (req, res) => {
  const { state, type, urbanRural } = req.query;
  let result = [...constituencies];
  if (state) result = result.filter(c => c.state.toLowerCase().includes(state.toLowerCase()));
  if (type) result = result.filter(c => c.type === type);
  if (urbanRural) result = result.filter(c => c.urbanRural === urbanRural);
  res.json({ success: true, count: result.length, data: result });
});

router.get('/search/:name', (req, res) => {
  const results = constituencies.filter(c =>
    c.name.toLowerCase().includes(req.params.name.toLowerCase()) ||
    c.currentMP.toLowerCase().includes(req.params.name.toLowerCase())
  );
  res.json({ success: true, count: results.length, data: results });
});

router.get('/:id', (req, res) => {
  const con = constituencies.find(c => c.id === req.params.id);
  if (!con) return res.status(404).json({ success: false, error: 'Constituency not found' });
  res.json({ success: true, data: con });
});

module.exports = router;
