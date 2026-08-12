import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ForgotPassword() {
  const [step, setStep]         = useState('email'); // email | sent | reset | done
  const [email, setEmail]       = useState('');
  const [devToken, setDevToken] = useState('');
  const [token, setToken]       = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  // Read token from URL if user clicked reset link
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) { setToken(t); setStep('reset'); }
  }, []);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true); setError('');
    try {
      const r = await api.post('/api/auth/forgot-password', { email });
      setDevToken(r.data.devToken || '');
      setStep('sent');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!newPass || newPass !== confirm) return setError('Passwords do not match.');
    const t = token || devToken;
    if (!t) return setError('No reset token. Please use the link from your email.');
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/reset-password', { token: t, newPassword: newPass });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh', background:'var(--ivory)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
    }}>
      <div style={{
        background:'var(--card)', borderRadius:20,
        boxShadow:'var(--sh-xl)', padding:'48px 40px',
        width:'100%', maxWidth:420, textAlign:'center',
        border:'1px solid var(--border)',
      }}>
        <Link to="/" style={{display:'flex', alignItems:'center', gap:8, justifyContent:'center', marginBottom:32, textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--sage),#7A9E62)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.82rem'}}>🗳️</div>
          <span style={{fontWeight:700, color:'var(--ink)', fontSize:'.95rem'}}>VoteWise India</span>
        </Link>

        {error && (
          <div style={{background:'var(--coral-lt)',border:'1px solid rgba(232,116,97,.25)',borderRadius:'var(--r-md)',padding:'10px 14px',marginBottom:16,fontSize:'.83rem',color:'var(--att-c)'}}>
            ⚠️ {error}
          </div>
        )}

        {/* ── STEP 1: Enter email ── */}
        {step === 'email' && (
          <>
            <div style={{width:68,height:68,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 20px',border:'2px solid rgba(168,184,138,.3)'}}>🔐</div>
            <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:10,color:'var(--ink)'}}>Reset Your Password</h2>
            <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:28,lineHeight:1.65}}>
              Enter your registered email and we'll send a reset link.
            </p>
            <div className="form-group" style={{textAlign:'left'}}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleSend()}/>
            </div>
            <button onClick={handleSend} disabled={!email||loading} className="btn btn-coral"
              style={{width:'100%',justifyContent:'center',padding:'13px',marginTop:4,fontSize:'.95rem',opacity:loading?.75:1}}>
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>
            <p style={{marginTop:20,fontSize:'.875rem',color:'var(--muted)'}}>
              Remember your password? <Link to="/login" style={{color:'var(--sage)',fontWeight:600}}>Login here</Link>
            </p>
          </>
        )}

        {/* ── STEP 2: Email sent ── */}
        {step === 'sent' && (
          <>
            <div style={{width:68,height:68,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 20px',border:'2px solid rgba(168,184,138,.3)'}}>✅</div>
            <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:10,color:'var(--ink)'}}>Check Your Email!</h2>
            <p style={{color:'var(--muted)',fontSize:'.875rem',lineHeight:1.65,marginBottom:8}}>
              A reset link has been sent to:
            </p>
            <p style={{fontWeight:700,color:'var(--done-c)',fontSize:'.95rem',marginBottom:20,background:'var(--mint-bg)',padding:'8px 16px',borderRadius:'var(--r-md)',display:'inline-block'}}>
              {email}
            </p>
            <p style={{color:'var(--muted)',fontSize:'.82rem',marginBottom:20,lineHeight:1.6}}>
              The link expires in <strong>15 minutes</strong>. Check your spam folder if you don't see it.
            </p>

            {/* Dev mode helper — shown when Gmail App Password not configured */}
            {devToken && (
              <div style={{background:'#FFF8E6',border:'2px solid #E0C879',borderRadius:'var(--r-md)',padding:'16px',marginBottom:16,textAlign:'left'}}>
                <div style={{fontWeight:700,color:'#8B6914',marginBottom:8,fontSize:'.85rem'}}>⚠️ Email not configured yet</div>
                <p style={{fontSize:'.8rem',color:'#8B6914',marginBottom:12,lineHeight:1.6}}>
                  To receive real emails, open <code style={{background:'rgba(0,0,0,.08)',padding:'1px 5px',borderRadius:3}}>.env</code> and add your Gmail App Password to <code style={{background:'rgba(0,0,0,.08)',padding:'1px 5px',borderRadius:3}}>EMAIL_PASS</code>.
                </p>
                <p style={{fontSize:'.8rem',color:'#8B6914',marginBottom:12,lineHeight:1.6}}>
                  For now, click below to reset your password directly:
                </p>
                <button onClick={()=>{setToken(devToken);setStep('reset');}}
                  style={{width:'100%',padding:'11px',background:'#2D7A3A',color:'#fff',border:'none',borderRadius:'var(--r-md)',fontWeight:700,fontSize:'.9rem',cursor:'pointer',fontFamily:'inherit'}}>
                  Continue to Reset Password →
                </button>
              </div>
            )}

            <Link to="/login" className="btn btn-card" style={{width:'100%',justifyContent:'center',padding:'11px'}}>Back to Login</Link>
          </>
        )}

        {/* ── STEP 3: Enter new password ── */}
        {step === 'reset' && (
          <>
            <div style={{width:68,height:68,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 20px',border:'2px solid rgba(168,184,138,.3)'}}>🔑</div>
            <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:10,color:'var(--ink)'}}>Create New Password</h2>
            <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:24,lineHeight:1.65}}>Choose a strong password for your account.</p>
            <div className="form-group" style={{textAlign:'left'}}>
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="Enter new password"
                value={newPass} onChange={e=>setNewPass(e.target.value)}/>
            </div>
            <div className="form-group" style={{textAlign:'left'}}>
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Confirm new password"
                value={confirm} onChange={e=>setConfirm(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleReset()}/>
            </div>
            {newPass && confirm && newPass !== confirm && (
              <p style={{fontSize:'.8rem',color:'var(--att-c)',textAlign:'left',marginBottom:10}}>⚠️ Passwords do not match</p>
            )}
            <button onClick={handleReset} disabled={!newPass||!confirm||loading} className="btn btn-coral"
              style={{width:'100%',justifyContent:'center',padding:'13px',fontSize:'.95rem',opacity:loading?.75:1}}>
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </>
        )}

        {/* ── STEP 4: Done ── */}
        {step === 'done' && (
          <>
            <div style={{width:68,height:68,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 20px',border:'2px solid rgba(168,184,138,.3)'}}>🎉</div>
            <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:10,color:'var(--ink)'}}>Password Reset!</h2>
            <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:24,lineHeight:1.65}}>
              Your password has been successfully updated. You can now login with your new password.
            </p>
            <Link to="/login" className="btn btn-coral" style={{width:'100%',justifyContent:'center',padding:'13px',display:'flex'}}>
              Login Now →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
