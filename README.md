<div align="center">

# 🗳️ VoteWise India

### AI-Powered Civic Intelligence Platform for Informed Voting Decisions

**🔗 Live Demo:** [https://vote-wise-india-five.vercel.app](https://vote-wise-india-five.vercel.app)

[![Live Demo](https://img.shields.io/badge/demo-live-A8B88A?style=for-the-badge)](https://vote-wise-india-five.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

</div>

---

## 📸 Preview

<!--
  Paste your screenshots below, one per line, replacing the placeholder text.
  Example:
  ![Home Page](./screenshots/home.png)
  ![Candidate Profile](./screenshots/candidate-profile.png)
-->

| Home Page | Candidates Explorer |
|---|---|
| _paste screenshot here_ | _paste screenshot here_ |

| Candidate Profile | Constituency Explorer |
|---|---|
| _paste screenshot here_ | _paste screenshot here_ |

| Promise Tracker | Admin Dashboard |
|---|---|
| _paste screenshot here_ | _paste screenshot here_ |

---

## 📖 About the Project

**VoteWise India** is a full-stack civic intelligence platform built to help Indian citizens make **informed, evidence-based voting decisions**. Instead of relying on political noise, the platform gives voters direct access to structured, verifiable information about candidates, parties, constituencies, and government promise delivery — all backed by an AI research assistant.

This project was built as a final-year engineering project, designed and developed independently to demonstrate a complete end-to-end MERN-stack application: authentication, role-based dashboards, a multi-step verification workflow, an AI assistant, and a fully deployed production environment.

> ⚠️ **Disclaimer:** VoteWise India is an independent educational project. It is **not** an official Election Commission of India (ECI) platform, and all sample data is used for demonstration purposes only.

---

## ✨ Key Features

### For Citizens
- 🔍 **Candidate Explorer** — search, filter, and compare candidates by education, assets, criminal record, and legislative attendance
- 📍 **Constituency Explorer** — interactive drill-downs into education, healthcare, infrastructure, and environmental development indicators
- 📋 **Promise Tracker** — evidence-based tracking of whether political parties delivered on manifesto promises
- 📰 **News Intelligence** — curated civic news with AI-generated trust scores and summaries
- 🤖 **AI Civic Assistant** — ask natural-language questions about candidates, parties, and elections, with cited sources

### Multi-Role Governance Workflow
The platform models a realistic verification pipeline, not just static dashboards:

```
Candidate submits profile
        ↓
Admin reviews & assigns to Employee
        ↓
Employee verifies education, assets, criminal records
        ↓
Admin approves or rejects
        ↓
Verified profile becomes visible to citizens
```

- **Citizen Dashboard** — saved candidates, tracked promises, notifications, AI research history
- **Candidate Dashboard** — profile management, manifesto submission, verification status tracking
- **Employee Dashboard** — assigned verification tasks, evidence review, status updates
- **Admin Dashboard** — user management, candidate approvals, platform-wide analytics, misinformation reports

### Authentication
- Email/password login with JWT sessions
- Google OAuth 2.0 sign-in
- Gmail-based password reset flow (Nodemailer)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router 6, Axios, CSS variables (no framework) |
| **Backend** | Node.js, Express 4, JWT, Nodemailer |
| **Data** | JSON-based data layer (MongoDB-ready architecture) |
| **Auth** | JWT sessions + Google OAuth 2.0 |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🚀 Live Deployment

| Service | URL |
|---|---|
| **Frontend (Vercel)** | [vote-wise-india-five.vercel.app](https://vote-wise-india-five.vercel.app) |
| **Backend API (Render)** | `https://votewise-india.onrender.com/api` |

> Note: The backend runs on Render's free tier, which sleeps after periods of inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Citizen | `citizen@votewise.in` | `password` |
| Candidate | `candidate@votewise.in` | `password` |
| Employee | `employee@votewise.in` | `password` |
| Admin | `admin@votewise.in` | `password` |

---

## 💻 Running Locally

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/KratikaSharma32/VoteWise-India-.git
cd VoteWise-India-
npm run install-all
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example` for the full list):

```env
PORT=5001
JWT_SECRET=your_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

Create `client/.env`:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Run

```bash
npm run dev
```

This starts the backend on `http://localhost:5001` and the frontend on `http://localhost:3000`.

For full setup instructions (Gmail App Password, Google OAuth registration, deployment steps), see [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) and [`DEPLOYMENT_NOTES.md`](./DEPLOYMENT_NOTES.md).

---

## 📁 Project Structure

```
votewise-india/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # Route-level pages
│       ├── pages/dashboards/# Role-specific dashboards
│       ├── components/      # Shared UI components
│       ├── context/         # Auth context
│       └── utils/           # API client, helpers
├── server/                  # Express backend
│   ├── routes/               # API route handlers
│   └── data/                 # JSON data layer
├── DEPLOYMENT_NOTES.md
└── SETUP_GUIDE.md
```

---

## 👩‍💻 Author

**Kratika Sharma**
B.Tech Computer Science Engineering, ITM University, Gwalior

---

<div align="center">

**[🔗 View Live Project](https://vote-wise-india-five.vercel.app)**

</div>
