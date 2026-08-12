const express = require('express');
const router = express.Router();
const candidates = require('../data/candidates.json');

router.get('/', (req, res) => {
  const { constituency, state, partyId, gender, type, q } = req.query;
  let result = [...candidates];
  if (q) result = result.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.constituency.toLowerCase().includes(q.toLowerCase()) || c.party.toLowerCase().includes(q.toLowerCase()));
  if (constituency) result = result.filter(c => c.constituency.toLowerCase().includes(constituency.toLowerCase()));
  if (state) result = result.filter(c => c.state.toLowerCase().includes(state.toLowerCase()));
  if (partyId) result = result.filter(c => c.partyId === partyId);
  if (gender) result = result.filter(c => c.gender.toLowerCase() === gender.toLowerCase());
  if (type) result = result.filter(c => c.type === type);
  res.json({ success: true, count: result.length, data: result });
});

router.get('/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ success: false, error: 'Candidate not found' });
  const related = candidates.filter(c => c.id !== candidate.id && (c.constituency === candidate.constituency || c.partyId === candidate.partyId)).slice(0, 3);
  res.json({ success: true, data: { ...candidate, related } });
});

module.exports = router;
