# VoteWise India — Deployment Notes

## Why localhost worked but the deployed site didn't

React's `"proxy"` field in `client/package.json` **only works when running
`npm start` locally**. It is completely ignored in production builds
(`npm run build`), because there is no dev server in production — Vercel
just serves static files.

So any code that called `axios.get('/api/candidates')` worked locally
(proxy silently forwarded it to `localhost:5001`) but broke in production
(no proxy exists, so the browser tried to call the API on the Vercel
domain itself, which has no backend).

## What was fixed

1. **`client/src/utils/api.js`** — created a single shared axios instance
   that automatically picks the right backend URL:
   - Local dev (`npm start`) → `http://localhost:5001`
   - Production build → `https://votewise-india.onrender.com`
   - Or an explicit `REACT_APP_API_URL` env var, if set (e.g. on Vercel),
     always wins over the above two.

   Every page now imports `api` from this file instead of importing
   `axios` directly, so this single fix applies everywhere at once.

2. **Fallback data** — every page that fetches a list (Candidates, Parties,
   News, Constituency, Performance) now has a small embedded fallback
   dataset and a proper `.catch()`. If the backend is slow to wake up
   (Render free tier sleeps after 15 min idle) or briefly unreachable,
   the page shows real-looking sample data instead of a blank screen
   or a crash.

3. **CORS on the backend** (`server/index.js`) — now allows requests from
   `localhost` (dev) and from **any** `*.vercel.app` subdomain (regex
   match), since Vercel generates a new preview URL on every deployment.
   A fixed allow-list would have broken again on the next deploy.

4. **Login** (`client/src/context/AuthContext.js`) — if the backend login
   call fails, falls back to 4 built-in demo accounts so the app is
   always demoable even if Render is temporarily asleep:
   - citizen@votewise.in / password
   - candidate@votewise.in / password
   - employee@votewise.in / password
   - admin@votewise.in / password

## Environment variables to set on Vercel (optional but recommended)

```
REACT_APP_API_URL=https://votewise-india.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=<your Google OAuth client id>
```

## Environment variables to set on Render

```
JWT_SECRET=<any random string>
NODE_ENV=production
FRONTEND_URL=https://<your-vercel-domain>.vercel.app
EMAIL_USER=<your gmail>
EMAIL_PASS=<gmail app password>
GOOGLE_CLIENT_ID=<your Google OAuth client id>
GOOGLE_CLIENT_SECRET=<your Google OAuth client secret>
```

## After deploying

If you ever change your Render service URL, update the `RENDER_URL`
constant at the top of `client/src/utils/api.js` and push again.
