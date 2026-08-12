# VoteWise India — Email & OAuth Setup Guide

This project ships fully working out of the box for **everything except real Gmail sending and real Google/Microsoft login**, because those require credentials only you can generate (Anthropic/Claude cannot create these on your behalf — they're tied to your personal Google/Microsoft developer accounts).

## 1. Forgot Password — Real Gmail Emails

Without setup, clicking "Send Reset Link" shows a **dev mode** message with a clickable token button — fully functional for testing, just not a real email.

**To send real emails:**
1. Go to https://myaccount.google.com/apppasswords
2. Turn on 2-Step Verification on your Google account (required first)
3. Generate an App Password for "Mail"
4. Open `.env` in the project root and fill in:
   ```
   EMAIL_USER=youraddress@gmail.com
   EMAIL_PASS=the16characterapppassword
   ```
5. Restart the server (`npm run server`)
6. Now "Forgot Password" emails arrive in the real inbox.

## 2. Google / Microsoft Login

Without setup, clicking these buttons shows an info box explaining what's needed — they don't silently fail or fake success.

**To enable Google Sign-In:**
1. https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID → Web application
3. Authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy the Client ID + Secret into:
   - `.env` (root): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `client/.env`: `REACT_APP_GOOGLE_CLIENT_ID` (same Client ID, public-safe)
5. Restart both server and client

**To enable Microsoft Sign-In:**
1. https://portal.azure.com → App registrations → New registration
2. Redirect URI: `http://localhost:3000/auth/microsoft/callback`
3. Copy Application (client) ID + generate a Client Secret into:
   - `.env` (root): `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`
   - `client/.env`: `REACT_APP_MICROSOFT_CLIENT_ID`
4. Restart both server and client

## 3. Candidate Photos

All 8 candidates now use Indian/South Asian professional headshots from Unsplash, replacing the earlier non-Indian placeholder set.

## 4. Parliament Hero Image

The homepage hero uses a real photograph of the Parliament of India (Wikimedia Commons), shown via an `<img>` tag with an Unsplash fallback if the primary source is unreachable.
