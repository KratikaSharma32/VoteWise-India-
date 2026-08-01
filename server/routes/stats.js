const express = require('express');
const router  = express.Router();
const parties        = require('../data/parties.json');
const candidates     = require('../data/candidates.json');
const constituencies = require('../data/constituencies.json');
const performance    = require('../data/performance.json');

router.get('/', (req, res) => {
  const womenCandidates = candidates.filter(c => c.gender === 'Female').length;
  const avgTurnout      = constituencies.reduce((s,c) => s + c.turnout2019, 0) / constituencies.length;
  const avgScore        = performance.reduce((s,p) => s + p.overallScore, 0) / performance.length;

  res.json({
    success: true,
    data: {
      totalParties:        parties.length,
      totalCandidates:     candidates.length,
      totalConstituencies: constituencies.length,
      totalVoters:         constituencies.reduce((s,c) => s + c.voters, 0),
      avgVoterTurnout:     Math.round(avgTurnout * 10) / 10,
      womenCandidates,
      womenPct:            Math.round((womenCandidates / candidates.length) * 100),
      cleanCandidates:     candidates.filter(c => c.criminalCases === 0).length,
      statesRepresented:   [...new Set(constituencies.map(c => c.state))].length,
      avgPromiseScore:     Math.round(avgScore),
    }
  });
});

module.exports = router;
