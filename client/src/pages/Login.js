import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO = [
  {label:'Citizen',   email:'citizen@votewise.in'},
  {label:'Candidate', email:'candidate@votewise.in'},
  {label:'Employee',  email:'employee@votewise.in'},
  {label:'Admin',     email:'admin@votewise.in'},
];

export default function Login() {
  const [form, setForm]   = useState({email:'', password:''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOAuthInfo, setShowOAuthInfo] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const map  = {citizen:'/dashboard/citizen', candidate:'/dashboard/candidate', employee:'/dashboard/employee', admin:'/dashboard/admin'};
      navigate(map[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Try a demo account above.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', background:'var(--ivory)'}}>
      {/* Left — Parliament photo */}
      <div style={{
        flex:1, display:'none', position:'relative', overflow:'hidden',
      }} className="login-left">
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url('/images/parliament_1785049389.jpg')`,
          backgroundSize:'cover', backgroundPosition:'center 35%',
        }}/>
        {/* Warm ivory overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(160deg, rgba(168,184,138,0.55) 0%, rgba(147,160,107,0.70) 35%, rgba(62,48,40,0.82) 75%, rgba(40,30,20,0.90) 100%)',
        }}/>
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'40px 36px',
        }}>
          <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:24}}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:'linear-gradient(135deg,var(--sage),#7A9E62)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem',
            }}>🗳️</div>
            <span style={{color:'#fff', fontWeight:700, fontSize:'1.05rem'}}>VoteWise India</span>
          </div>
          {[
            {icon:'⚖️', text:'Transparent civic information'},
            {icon:'🤖', text:'AI-powered research'},
            {icon:'📋', text:'Evidence-based analysis'},
          ].map((x,i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:12, marginBottom:14}}>
              <div style={{
                width:34, height:34, borderRadius:9,
                background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem', flexShrink:0,
              }}>{x.icon}</div>
              <span style={{color:'rgba(255,255,255,.9)', fontWeight:500, fontSize:'.95rem'}}>{x.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        width:'100%', maxWidth:460,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'48px 40px', background:'var(--card)',
        boxShadow:'-4px 0 24px rgba(31,41,55,.06)',
      }}>
        <Link to="/" style={{display:'flex', alignItems:'center', gap:8, marginBottom:30, textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--sage),#7A9E62)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.82rem'}}>🗳️</div>
          <span style={{fontWeight:700, color:'var(--ink)', fontSize:'.95rem'}}>VoteWise India</span>
        </Link>

        <h1 style={{fontSize:'1.6rem', fontWeight:800, marginBottom:4, color:'var(--ink)'}}>Welcome Back!</h1>
        <p style={{color:'var(--muted)', fontSize:'.875rem', marginBottom:24}}>Login to your account to continue</p>

        {/* Demo chips */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:'.72rem', color:'var(--muted)', marginBottom:7, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase'}}>
            Demo accounts — password: <code style={{background:'var(--beige)',padding:'1px 5px',borderRadius:4}}>password</code>
          </p>
          <div style={{display:'flex', gap:7, flexWrap:'wrap'}}>
            {DEMO.map(d => (
              <button key={d.label}
                onClick={() => setForm({email:d.email, password:'password'})}
                style={{
                  padding:'5px 12px', borderRadius:20, fontSize:'.75rem', fontWeight:600,
                  background: form.email===d.email ? 'var(--mint-bg)' : 'var(--ivory)',
                  color: form.email===d.email ? 'var(--done-c)' : 'var(--muted)',
                  border: `1px solid ${form.email===d.email ? 'var(--sage)' : 'var(--border-mid)'}`,
                  cursor:'pointer', transition:'all .2s', fontFamily:'inherit',
                }}
              >{d.label}</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            background:'var(--coral-lt)', border:'1px solid rgba(232,116,97,.25)',
            borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:16,
            fontSize:'.83rem', color:'var(--att-c)', display:'flex', alignItems:'center', gap:8,
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone</label>
            <input className="form-input" type="email" placeholder="Enter email"
              value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} required/>
          </div>
          <div className="form-group">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
              <label className="form-label" style={{margin:0}}>Password</label>
              <Link to="/forgot-password" style={{fontSize:'.78rem', color:'var(--sage)', fontWeight:600}}>Forgot Password?</Link>
            </div>
            <input className="form-input" type="password" placeholder="Enter your password"
              value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required/>
          </div>

          <button type="submit" className="btn btn-coral" disabled={loading} style={{
            width:'100%', justifyContent:'center', padding:'13px', fontSize:'.95rem', marginTop:4,
            opacity: loading ? .75 : 1,
          }}>
            {loading ? 'Signing in...' : 'Login →'}
          </button>
        </form>

        <div style={{display:'flex', alignItems:'center', gap:10, margin:'20px 0'}}>
          <div style={{flex:1, height:1, background:'var(--border)'}}/> 
          <span style={{fontSize:'.78rem', color:'var(--muted)'}}>or</span>
          <div style={{flex:1, height:1, background:'var(--border)'}}/>
        </div>

                <button className="btn btn-card" style={{width:'100%',justifyContent:'center',fontSize:'.88rem',gap:10,padding:'12px'}}
          onClick={()=>{
            const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
            if (!clientId) { setShowOAuthInfo(true); return; }
            const redirectUri = encodeURIComponent('http://localhost:3000/auth/google/callback');
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {showOAuthInfo && (
          <div style={{marginTop:12,padding:'10px 14px',background:'var(--saffron-lt)',border:'1px solid rgba(213,161,91,.3)',borderRadius:'var(--r-md)',fontSize:'.78rem',color:'#6B4A12',lineHeight:1.6}}>
            <strong>Google Sign-In not configured.</strong> Add <code style={{background:'var(--beige)',padding:'1px 4px',borderRadius:3}}>REACT_APP_GOOGLE_CLIENT_ID</code> to client/.env and restart.
            <button onClick={()=>setShowOAuthInfo(false)} style={{marginLeft:8,background:'none',border:'none',color:'#6B4A12',fontWeight:600,cursor:'pointer',fontSize:'.75rem',padding:0}}>Dismiss</button>
          </div>
        )}

        <p style={{textAlign:'center', marginTop:22, fontSize:'.875rem', color:'var(--muted)'}}>
          No account?{' '}
          <Link to="/register" style={{color:'var(--sage)', fontWeight:600}}>Register here</Link>
        </p>
      </div>

      <style>{`@media(min-width:768px){.login-left{display:flex!important}}`}</style>
    </div>
  );
}
