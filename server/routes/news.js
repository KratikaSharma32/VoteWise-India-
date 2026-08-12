const express = require('express');
const router = express.Router();
const news = require('../data/news.json');

router.get('/', (req, res) => {
  const { category, verified } = req.query;
  let result = [...news];
  if (category) result = result.filter(n => n.category === category);
  if (verified === 'true') result = result.filter(n => n.verified);
  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ success: true, count: result.length, data: result });
});

router.get('/categories', (req, res) => {
  const cats = [...new Set(news.map(n => n.category))];
  res.json({ success: true, data: cats });
});

router.get('/:id', (req, res) => {
  const item = news.find(n => n.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'News not found' });
  res.json({ success: true, data: item });
});

module.exports = router;
