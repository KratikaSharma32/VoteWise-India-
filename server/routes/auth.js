const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SECRET = process.env.JWT_SECRET || 'votewise_secret_2024_secure';

const users = [
  { id:'u1', fullName:'Rahul Sharma', email:'citizen@votewise.in',   password:'password', role:'citizen'   },
  { id:'u2', fullName:'Arjun Patel',  email:'candidate@votewise.in', password:'password', role:'candidate' },
  { id:'u3', fullName:'Priya Nair',   email:'employee@votewise.in',  password:'password', role:'employee'  },
  { id:'u4', fullName:'Admin User',   email:'admin@votewise.in',     password:'password', role:'admin'     },
];
const resetTokens = {};
let nextId = 5;

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error:'Email and password required' });
  const user = users.find(u => u.email===email && u.password===password);
  if (!user) return res.status(401).json({ error:'Invalid email or password' });
  const { password:_, ...safe } = user;
  const token = jwt.sign({ id:user.id, role:user.role }, SECRET, { expiresIn:'7d' });
  res.json({ success:true, token, user:safe });
});

router.post('/register', (req, res) => {
  const { fullName, email, phone, password, role } = req.body;
  if (!fullName||!email||!password||!role) return res.status(400).json({ error:'All fields required' });
  if (users.find(u=>u.email===email)) return res.status(409).json({ error:'Email already registered' });
  const newUser = { id:`u${nextId++}`, fullName, email, phone, password, role };
  users.push(newUser);
  const { password:_, ...safe } = newUser;
  const token = jwt.sign({ id:newUser.id, role:newUser.role }, SECRET, { expiresIn:'7d' });
  res.status(201).json({ success:true, token, user:safe });
});

// ── FORGOT PASSWORD — sends real Gmail via Nodemailer ──
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error:'Email required' });
  const user = users.find(u=>u.email===email);
  if (!user) return res.json({ success:true, message:'If that email exists, a reset link was sent.' });

  const token = jwt.sign({ email, type:'reset' }, SECRET, { expiresIn:'15m' });
  resetTokens[token] = { email, expires: Date.now() + 15*60*1000 };
  const resetUrl = `http://localhost:3000/forgot-password?token=${token}`;

  const emailConfigured = process.env.EMAIL_USER
    && process.env.EMAIL_PASS
    && process.env.EMAIL_USER !== 'your_gmail@gmail.com';

  if (emailConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"VoteWise India" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your VoteWise India password',
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#FAF7F2;border-radius:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
            <span style="font-size:24px">🗳️</span>
            <strong style="font-size:18px;color:#1F2937">VoteWise India</strong>
          </div>
          <h2 style="color:#1F2937;margin:0 0 8px">Reset Your Password</h2>
          <p style="color:#6B7280;margin:0 0 24px;line-height:1.6">Click below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#E87461;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Reset Password →</a>
          <p style="color:#9CA3AF;font-size:12px;margin-top:28px">If you did not request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #E5DED3;margin:20px 0"/>
          <p style="color:#9CA3AF;font-size:11px">VoteWise India · Civic Intelligence Platform · Educational Use Only</p>
        </div>`,
      });
      return res.json({ success:true, message:'Reset link sent! Check your Gmail inbox (and spam folder).' });
    } catch (err) {
      console.error('Nodemailer error:', err.message);
      return res.json({
        success:true,
        message:'Email sending failed — check EMAIL_USER/EMAIL_PASS in .env. Using dev fallback.',
        devToken: token, devUrl: resetUrl,
      });
    }
  }

  // No email configured — dev mode fallback
  console.log('[DEV] Reset link:', resetUrl);
  res.json({
    success: true,
    message: 'Gmail not configured yet — see .env setup instructions. Using dev link below.',
    devToken: token,
    devUrl: resetUrl,
  });
});

router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token||!newPassword) return res.status(400).json({ error:'Token and password required' });
  const record = resetTokens[token];
  if (!record||Date.now()>record.expires) return res.status(400).json({ error:'Reset link has expired. Request a new one.' });
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.type!=='reset') throw new Error('Invalid token type');
    const user = users.find(u=>u.email===decoded.email);
    if (!user) return res.status(404).json({ error:'User not found' });
    user.password = newPassword;
    delete resetTokens[token];
    res.json({ success:true, message:'Password reset successfully! You can now login.' });
  } catch {
    res.status(400).json({ error:'Invalid or expired reset token.' });
  }
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error:'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    const user = users.find(u=>u.id===decoded.id);
    if (!user) return res.status(404).json({ error:'User not found' });
    const { password:_, ...safe } = user;
    res.json({ success:true, user:safe });
  } catch { res.status(401).json({ error:'Invalid token' }); }
});

module.exports = router;
