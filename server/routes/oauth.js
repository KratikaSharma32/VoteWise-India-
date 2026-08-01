const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

const SECRET       = process.env.JWT_SECRET || 'votewise_secret_2024_secure';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Google OAuth — exchange code for token
router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(501).json({ error: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env' });
  }
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    // FIXED: redirect_uri must exactly match what was registered in Google Console
    const redirectUri = `${FRONTEND_URL}/auth/google/callback`;
    console.log('[Google OAuth] Exchanging code, redirect_uri:', redirectUri);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    console.log('[Google OAuth] Token response keys:', Object.keys(tokens));

    if (tokens.error) {
      console.error('[Google OAuth] Error:', tokens.error, tokens.error_description);
      return res.status(400).json({ error: `Google error: ${tokens.error_description || tokens.error}` });
    }
    if (!tokens.access_token) {
      return res.status(400).json({ error: 'Failed to get access token from Google' });
    }

    // Get user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();
    console.log('[Google OAuth] Profile:', profile.email, profile.name);

    const appToken = jwt.sign(
      { email: profile.email, role: 'citizen', provider: 'google' },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: appToken,
      user: {
        id:       `google_${profile.id}`,
        fullName: profile.name,
        email:    profile.email,
        role:     'citizen',
        avatar:   profile.picture,
      }
    });
  } catch (err) {
    console.error('[Google OAuth] Exception:', err.message);
    res.status(500).json({ error: 'OAuth exchange failed: ' + err.message });
  }
});

// Microsoft OAuth — exchange code for token
router.post('/microsoft/callback', async (req, res) => {
  const { code } = req.body;
  const clientId     = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(501).json({ error: 'Microsoft OAuth not configured.' });
  }
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const redirectUri = `${FRONTEND_URL}/auth/microsoft/callback`;

    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    'authorization_code',
        scope:         'openid email profile',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) {
      return res.status(400).json({ error: tokens.error_description || tokens.error });
    }
    if (!tokens.access_token) {
      return res.status(400).json({ error: 'Failed to get access token from Microsoft' });
    }

    const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    const appToken = jwt.sign(
      { email: profile.mail || profile.userPrincipalName, role: 'citizen', provider: 'microsoft' },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: appToken,
      user: {
        id:       `ms_${profile.id}`,
        fullName: profile.displayName,
        email:    profile.mail || profile.userPrincipalName,
        role:     'citizen',
      }
    });
  } catch (err) {
    console.error('[Microsoft OAuth] Exception:', err.message);
    res.status(500).json({ error: 'OAuth exchange failed: ' + err.message });
  }
});

module.exports = router;
