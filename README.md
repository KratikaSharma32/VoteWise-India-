# 🗳️ VoteWise India — Civic Intelligence Platform

> **⚠️ Educational Platform Only** — Not an official Election Commission system. All data is mock/sample for demonstration purposes.

A redesigned, full-stack civic intelligence platform empowering Indian citizens with neutral, transparent information about elections, parties, candidates, and governance.

---

## ✨ What's New in This Version

- **Stunning redesigned UI** — Syne + DM Sans typography, earthy government-inspired color palette, rich animations
- **Stronger backend** — Helmet security, rate limiting, Morgan logging, full error handling
- **Richer data** — 6 parties, 8 candidates, 3 party performance records, 8 constituencies
- **Live stats endpoint** — `/api/stats` for platform-wide aggregates
- **Interactive UI** — Expandable cards, seat distribution bar, circular progress indicators
- **Mobile responsive** — Full mobile menu, fluid grids
- **Better AI** — 15+ intent patterns with dynamic data injection

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm

### Install & Run

```bash
# Install all dependencies
npm run install-all

# Start development (backend + frontend simultaneously)
npm run dev
```

Then open:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Health**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
votewise-india/
├── server/
│   ├── data/
│   │   ├── parties.json          # 6 major parties with manifestos
│   │   ├── candidates.json       # 8 candidate profiles
│   │   ├── performance.json      # Promise tracking for BJP, INC, AAP
│   │   └── constituencies.json  # 8 constituency profiles
│   ├── routes/
│   │   ├── parties.js            # GET /api/parties
│   │   ├── candidates.js         # GET /api/candidates (filterable)
│   │   ├── performance.js        # GET /api/performance
│   │   ├── constituency.js       # GET /api/constituency + search
│   │   ├── stats.js              # GET /api/stats (aggregates)
│   │   └── ai.js                 # POST /api/ai/chat
│   └── index.js                  # Express server with security middleware
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js         # Sticky transparent → frosted nav
│       │   └── Footer.js         # Dark footer with links
│       ├── pages/
│       │   ├── Home.js           # Hero + stats bar + features grid
│       │   ├── Parties.js        # Seat distribution + party cards
│       │   ├── Candidates.js     # Filterable candidate profiles
│       │   ├── Performance.js    # Promise tracker with progress bars
│       │   ├── Constituency.js   # Searchable constituency finder
│       │   └── AIAssistant.js    # Chat interface
│       ├── App.js
│       ├── index.js
│       └── index.css             # Full design system with CSS variables
└── package.json
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/stats` | Platform-wide statistics |
| GET | `/api/parties` | All parties (filterable by ideology, seats) |
| GET | `/api/parties/:id` | Single party by ID |
| GET | `/api/candidates` | All candidates (filter by state, party, gender) |
| GET | `/api/candidates/:id` | Single candidate |
| GET | `/api/performance` | Promise tracking summary for all parties |
| GET | `/api/performance/:partyId` | Detailed promises for one party |
| GET | `/api/constituency` | All constituencies (filter by state, type) |
| GET | `/api/constituency/search/:name` | Search by name or MP name |
| GET | `/api/constituency/:id` | Single constituency |
| POST | `/api/ai/chat` | AI chatbot — body: `{ "message": "..." }` |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary font | Syne (display/headings) |
| Body font | DM Sans |
| Saffron | `#FF6B00` |
| India Green | `#138808` |
| Ashoka Blue | `#000080` |
| Surface | `#f8f7f4` |
| Border radius | 8px / 14px / 20px / 28px |

---

## 🔒 Security Features

- **Helmet.js** — HTTP security headers
- **Rate limiting** — 200 req/15min global, 30 req/min for AI
- **Input validation** — Message length and type checking
- **CORS** — Environment-aware origin control
- **Morgan** — Request logging

---

## 🌐 Official Resources

- [Election Commission of India](https://eci.gov.in)
- [Voter Registration](https://voters.eci.gov.in)
- [Electoral Roll Search](https://electoralsearch.eci.gov.in)
- [National Voter Service Portal](https://nvsp.in)

---

## ⚖️ Legal & Ethics

- **No real voting** — Platform does not conduct elections
- **Sample data** — All profiles are demonstration data
- **Politically neutral** — No endorsements or bias
- **Educational only** — For awareness and civic education
- **MIT License**

---

Built with ❤️ for Indian Democracy
