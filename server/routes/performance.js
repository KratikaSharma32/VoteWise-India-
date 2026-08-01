const express = require('express');
const router = express.Router();
const performance = require('../data/performance.json');

router.get('/', (req, res) => {
  const summary = performance.map(p => ({
    partyId: p.partyId,
    party: p.party,
    period: p.period,
    overallScore: p.overallScore,
    totalPromises: p.promises.length,
    completed: p.promises.filter(x => x.status === 'completed').length,
    partial: p.promises.filter(x => x.status === 'partial').length,
    inProgress: p.promises.filter(x => x.status === 'inprogress').length,
    notCompleted: p.promises.filter(x => x.status === 'notcompleted').length
  }));
  res.json({ success: true, count: summary.length, data: summary });
});

router.get('/:partyId', (req, res) => {
  const record = performance.find(p => p.partyId === req.params.partyId);
  if (!record) return res.status(404).json({ success: false, error: 'Performance data not found' });
  res.json({ success: true, data: record });
});

module.exports = router;
