const express = require('express');
const router = express.Router();
const parties    = require('../data/parties.json');
const candidates = require('../data/candidates.json');
const constituencies = require('../data/constituencies.json');
const performance = require('../data/performance.json');

// Helper
const rank = (arr, key, asc=false) => [...arr].sort((a,b) => asc ? a[key]-b[key] : b[key]-a[key]);

function civicAnswer(msg) {
  const m = msg.toLowerCase();

  // Candidate comparison: education
  if (m.includes('education') && (m.includes('best') || m.includes('highest') || m.includes('strong') || m.includes('candidate'))) {
    const eduRank = candidates.map(c => ({
      name: c.name, party: c.party, constituency: c.constituency,
      education: c.education,
      score: c.education.includes('PhD')?100:c.education.includes('MBBS')||c.education.includes('MD')?95:c.education.includes('B.Tech')||c.education.includes('IIT')?90:c.education.includes('MA')||c.education.includes('MBA')||c.education.includes('LLB')?80:60
    })).sort((a,b)=>b.score-a.score);
    return {
      summary: `**Education Analysis — All Candidates**\n\nBased on highest educational qualifications:\n\n${eduRank.map((c,i)=>`**${i+1}. ${c.name}** (${c.party})\n   📚 ${c.education} — Score: ${c.score}/100`).join('\n\n')}`,
      confidence: 'High', sources: ['Affidavit data — ECI','Candidate self-declaration'], evidence: 'Based on official affidavit-disclosed qualifications.'
    };
  }

  // Criminal cases
  if (m.includes('criminal') || m.includes('case') || m.includes('clean')) {
    const clean = candidates.filter(c=>c.criminalCases===0);
    const withCases = candidates.filter(c=>c.criminalCases>0);
    return {
      summary: `**Criminal Case Analysis**\n\n✅ **${clean.length} candidates with ZERO criminal cases:**\n${clean.map(c=>`  - ${c.name} (${c.party}, ${c.constituency})`).join('\n')}\n\n⚠️ **${withCases.length} candidate(s) with pending cases:**\n${withCases.map(c=>`  - ${c.name} (${c.party}) — ${c.criminalCases} case(s)\n    ${c.criminalDetails.map(d=>`    Section: ${d.section} | ${d.description} | Status: ${d.status}`).join('\n')}`).join('\n')}`,
      confidence: 'High', sources: ['ECI Affidavit Database','Association for Democratic Reforms (ADR)'], evidence: 'Criminal disclosure is mandatory under Supreme Court order. All figures are self-declared in affidavits.'
    };
  }

  // Assets
  if (m.includes('asset') || m.includes('wealth') || m.includes('richest')) {
    const sorted = rank(candidates.map(c=>({name:c.name,party:c.party,assets:c.assets,net:c.netAssets})), 'assets');
    return {
      summary: `**Candidate Assets — Ranked by Declaration**\n\n${candidates.sort((a,b)=>{const av=parseFloat(a.assets.replace(/[₹,A-Za-z]/g,''));const bv=parseFloat(b.assets.replace(/[₹,A-Za-z]/g,''));return bv-av;}).map((c,i)=>`**${i+1}. ${c.name}** (${c.party})\n   💰 Gross: ${c.assets} | Net: ${c.netAssets}`).join('\n\n')}`,
      confidence: 'High', sources: ['ECI Affidavit Database','National Election Watch'], evidence: 'Asset declarations are legally mandatory. Figures are self-reported and audited by returning officers.'
    };
  }

  // Attendance
  if (m.includes('attendance') || m.includes('parliament session') || m.includes('active mp')) {
    const ranked = candidates.filter(c=>c.attendance>0).sort((a,b)=>b.attendance-a.attendance);
    return {
      summary: `**Parliamentary Attendance — Ranked**\n\n${ranked.map((c,i)=>`**${i+1}. ${c.name}** (${c.party})\n   📊 Attendance: ${c.attendance}% | Questions Raised: ${c.questionsRaised}`).join('\n\n')}\n\n📌 First-time candidates (Priya Nair, Meera Patil, Amit Tiwari as ex-Councilor) have no Lok Sabha attendance record.`,
      confidence: 'High', sources: ['PRS Legislative Research','Lok Sabha Secretariat'], evidence: 'Attendance is recorded by Lok Sabha secretariat. Questions raised verified through Parliament archives.'
    };
  }

  // Compare two candidates
  if (m.includes('compare') && (m.includes('candidate') || m.includes('vs') || m.includes('versus'))) {
    return {
      summary: `**How to Compare Candidates**\n\nVoteWise India's Comparison Tool lets you:\n\n1. 🔍 **Go to Candidates page** → Select up to 3 candidates → Click "Compare"\n2. 📊 **Metrics compared**: Education, Criminal Cases, Assets, Experience, Attendance, Win Probability\n3. 📥 **Download comparison** as PDF\n\n**Quick Comparison — New Delhi:**\n- Rajesh Sharma (BJP): MBA, 0 cases, ₹4.2Cr, 82% attendance\n- Priya Nair (INC): LLB, 0 cases, ₹1.8Cr, first-time candidate\n- Amit Tiwari (AAP): B.Tech IIT, 0 cases, ₹92L, ex-councilor`,
      confidence: 'High', sources: ['VoteWise Candidate Database'], evidence: 'All data sourced from official ECI affidavits.'
    };
  }

  // Women candidates
  if (m.includes('women') || m.includes('female') || m.includes('gender')) {
    const women = candidates.filter(c=>c.gender==='Female');
    return {
      summary: `**Women Candidates in Database**\n\n${women.map(c=>`**${c.name}** (${c.party}, ${c.constituency})\n   🎓 ${c.education}\n   💰 Assets: ${c.assets}\n   ⚡ Win Probability: ${c.winProbability}%\n   📌 Key Issues: ${c.keyIssues.join(', ')}`).join('\n\n')}\n\n📊 **${women.length}/${candidates.length} (${Math.round(women.length/candidates.length*100)}%) candidates are women** in our tracked database — vs national average of ~15%.`,
      confidence: 'High', sources: ['ECI Affidavit Database','ADR Gender Report 2024'], evidence: 'Based on official affidavit gender declarations.'
    };
  }

  // Development constituency
  if (m.includes('constituency') || m.includes('development') || m.includes('my area')) {
    return {
      summary: `**Constituency Development Analysis**\n\nOur tracked constituencies and their key metrics:\n\n${constituencies.map(c=>`**${c.name}** (${c.state})\n   📊 Literacy: ${c.literacy}% | Turnout: ${c.turnout2019}% | Population: ${(c.population/100000).toFixed(1)}L\n   🏛️ Current MP: ${c.currentMP} (${c.currentParty})\n   🗳️ Polling Stations: ${c.pollingStations.toLocaleString()}`).join('\n\n')}\n\n💡 Visit the **Constituency Explorer** for development dashboards, charts, and government scheme data.`,
      confidence: 'Medium', sources: ['ECI Constituency Data','Census 2011','Delimitation Commission'], evidence: 'Official ECI and census data. Development indicators are composite scores.'
    };
  }

  // NOTA
  if (m.includes('nota')) {
    return {
      summary: `**NOTA — None of the Above**\n\nIntroduced by Supreme Court order in 2013:\n\n- 🗳️ Appears as the **last option** on every EVM\n- ❌ **Does NOT trigger re-election** — the candidate with most votes wins regardless\n- 📊 **2019 NOTA votes**: 65.1 lakh (1.06% of total votes)\n- 📈 NOTA is highest in **Chhattisgarh** (3.2%) and lowest in **Jammu & Kashmir**\n- 💡 Scholars debate whether NOTA should trigger re-election if it wins — currently not the case\n\n🔗 Official ECI position: NOTA registers voter dissent but has no electoral consequence.`,
      confidence: 'High', sources: ['Supreme Court Order 2013','ECI Official Notification','PRS India'], evidence: 'Constitutional and legal basis thoroughly documented.'
    };
  }

  // Parties
  if (m.includes('bjp') || m.includes('bharatiya')) {
    const p = parties.find(x=>x.id==='bjp');
    return {
      summary: `**${p.name} (${p.abbreviation})**\n\n- Founded: ${p.founded} | Ideology: ${p.ideology}\n- President: ${p.president} | Symbol: ${p.symbol}\n- 2019 Result: **${p.seatsWon} seats** (${p.voteShare}% vote share)\n- Governing: ${p.states}+ states\n\n${p.description}\n\n📋 Key Manifesto Promises:\n${p.manifesto.slice(0,4).map(m=>`  → ${m}`).join('\n')}`,
      confidence: 'High', sources: ['ECI Official Data','Parliament Archives'], evidence: 'Party data from official ECI registry and published manifestos.'
    };
  }

  if (m.includes('congress') || m.includes(' inc ') || m.includes('indian national')) {
    const p = parties.find(x=>x.id==='inc');
    return {
      summary: `**${p.name} (${p.abbreviation})**\n\n- Founded: ${p.founded} — India's oldest party\n- Ideology: ${p.ideology} | President: ${p.president}\n- 2019 Result: **${p.seatsWon} seats** (${p.voteShare}% vote share)\n\n${p.description}`,
      confidence: 'High', sources: ['ECI Official Data','Parliament Archives'], evidence: 'Party data from official ECI registry.'
    };
  }

  // Voting process
  if (m.includes('how to vote') || m.includes('register') || m.includes('voter id') || m.includes('epic')) {
    return {
      summary: `**Voter Registration & Voting Process**\n\n**Step 1: Register**\n→ Visit voters.eci.gov.in → Fill Form 6 → Submit ID proof\n\n**Step 2: Get Voter ID (EPIC)**\n→ Delivered within 30 days OR use Aadhaar at booth\n\n**Step 3: Find Your Booth**\n→ electoralsearch.eci.gov.in → enter name & district\n\n**Step 4: Polling Day**\n→ Carry photo ID → Press EVM button → Verify on VVPAT slip\n\n📌 Alternative IDs: Aadhaar, Passport, PAN Card, Driving Licence, Bank Passbook with photo`,
      confidence: 'High', sources: ['ECI Official Portal','Representation of People Act 1950'], evidence: 'Official ECI voting guidelines.'
    };
  }

  // EVM
  if (m.includes('evm') || m.includes('electronic voting') || m.includes('tamper')) {
    return {
      summary: `**Electronic Voting Machines (EVM) — Fact Sheet**\n\n✅ **EVMs are NOT connected to internet** — standalone devices\n✅ **VVPAT** prints paper confirmation of every vote\n✅ **Tested** by technical experts committee before deployment\n✅ Sealed with **tamper-evident seals** on polling day\n\n📊 In use since **2004 general elections**\n🏭 Manufactured by: BEL (Bharat Electronics) & ECIL\n\n🚫 **Common myths busted:**\n- "EVMs can be hacked via Bluetooth" — FALSE (no wireless hardware)\n- "Results changed remotely" — FALSE (no network connection)\n- "Same company makes all EVMs" — FALSE (two PSUs, cross-verified)`,
      confidence: 'High', sources: ['ECI Technical Committee Report','Supreme Court Verdict 2024','BEL Manufacturing Specs'], evidence: 'Technical specifications verified by independent experts and judiciary.'
    };
  }

  // Default smart response
  return {
    summary: `I'm **VoteWise AI** — your civic intelligence assistant.\n\nI can provide research on:\n\n🏛️ **Candidates** — Education, assets, criminal cases, attendance\n⚖️ **Comparisons** — "Who has best attendance?" / "Richest candidate?"\n📍 **Constituencies** — Development indicators, election results\n📊 **Parties** — Ideology, seats, manifestos\n✅ **Promises** — Evidence-based tracking of manifesto delivery\n🗳️ **Voting** — Registration, EVMs, NOTA, process\n\n**Try asking:**\n→ "Which candidate has best education?"\n→ "Who has zero criminal cases?"\n→ "Show women candidates"\n→ "Compare BJP and Congress"\n→ "What is NOTA?"`,
    confidence: 'N/A', sources: ['VoteWise India Database','ECI Official Data'], evidence: 'All responses are evidence-based with source attribution.'
  };
}

router.post('/chat', (req, res) => {
  const { message } = req.body;
  if (!message || message.trim().length === 0)
    return res.status(400).json({ success: false, error: 'Message required' });
  if (message.length > 500)
    return res.status(400).json({ success: false, error: 'Message too long' });

  const answer = civicAnswer(message);
  res.json({
    success: true,
    data: {
      message: answer.summary,
      confidence: answer.confidence,
      sources: answer.sources,
      evidence: answer.evidence,
      timestamp: new Date().toISOString(),
      disclaimer: 'Educational platform only. For official data visit eci.gov.in'
    }
  });
});

module.exports = router;
