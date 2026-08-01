import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {value:'citizen',   label:'👤 Citizen',       desc:'Access information, compare candidates, track promises'},
  {value:'candidate', label:'🏛️ Candidate',     desc:'Manage profile, manifesto, and voter engagement'},
  {value:'employee',  label:'💼 Official',       desc:'Verify data, manage tasks, update constituency info'},
  {value:'admin',     label:'⚙️ Administrator',  desc:'Full platform oversight and content management'},
];

export default function Register() {
  const [form, setForm] = useState({fullName:'', email:'', phone:'', password:'', confirmPassword:'', role:''});
  const [agree, setAgree]   = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!agree) return setError('Please agree to Terms & Conditions.');
    if (!form.role) return setError('Please select your role.');
    setError(''); setLoading(true);
    try {
      const user = await register(form);
      const map  = {citizen:'/dashboard/citizen', candidate:'/dashboard/candidate', employee:'/dashboard/employee', admin:'/dashboard/admin'};
      navigate(map[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', background:'var(--ivory)'}}>
      {/* Left panel */}
      <div style={{
        width:320, flexShrink:0, display:'none', position:'relative', overflow:'hidden',
      }} className="reg-left">
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url('/images/parliament_1785049389.jpg')`,
          backgroundSize:'cover', backgroundPosition:'center',
        }}/>
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(160deg, rgba(168,184,138,0.50) 0%, rgba(147,160,107,0.65) 30%, rgba(62,48,40,0.85) 70%, rgba(40,30,20,0.92) 100%)',
          padding:'36px 28px', display:'flex', flexDirection:'column', justifyContent:'flex-end',
        }}>
          <h2 style={{color:'#fff', fontSize:'1.25rem', fontWeight:700, marginBottom:10}}>
            Be part of informed democracy
          </h2>
          <p style={{color:'rgba(255,255,255,.65)', fontSize:'.85rem', lineHeight:1.7, marginBottom:24}}>
            Join thousands of citizens making evidence-based voting decisions.
          </p>
          {ROLES.map(r => (
            <div key={r.value} style={{display:'flex', gap:10, marginBottom:13}}>
              <div style={{
                width:32, height:32, borderRadius:8,
                background:'rgba(255,255,255,.14)', backdropFilter:'blur(8px)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:.85+'rem', flexShrink:0,
              }}>{r.label.split(' ')[0]}</div>
              <div>
                <div style={{color:'#fff', fontWeight:600, fontSize:'.83rem'}}>{r.label.split(' ').slice(1).join(' ')}</div>
                <div style={{color:'rgba(255,255,255,.55)', fontSize:'.72rem', lineHeight:1.4, marginTop:1}}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex:1, background:'var(--card)', padding:'40px 44px',
        display:'flex', flexDirection:'column', justifyContent:'center',
        overflowY:'auto', boxShadow:'-4px 0 24px rgba(31,41,55,.06)',
      }}>
        <div style={{maxWidth:480, width:'100%', margin:'0 auto'}}>
          <Link to="/" style={{display:'flex', alignItems:'center', gap:8, marginBottom:24, textDecoration:'none'}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--sage),#7A9E62)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.82rem'}}>🗳️</div>
            <span style={{fontWeight:700, color:'var(--ink)', fontSize:'.95rem'}}>VoteWise India</span>
          </Link>

          <h1 style={{fontSize:'1.55rem', fontWeight:800, marginBottom:4, color:'var(--ink)'}}>Create Your Account</h1>
          <p style={{color:'var(--muted)', fontSize:'.875rem', marginBottom:22}}>Join VoteWise India</p>

          {error && (
            <div style={{
              background:'var(--coral-lt)', border:'1px solid rgba(232,116,97,.25)',
              borderRadius:'var(--r-md)', padding:'10px 14px', marginBottom:16,
              fontSize:'.83rem', color:'var(--att-c)',
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Enter your full name"
                value={form.fullName} onChange={e => setForm(f => ({...f, fullName:e.target.value}))} required/>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))}/>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Create a password"
                  value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Confirm password"
                  value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword:e.target.value}))} required/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <select className="form-select" value={form.role}
                onChange={e => setForm(f => ({...f, role:e.target.value}))} required>
                <option value="">Select your role ▾</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <label style={{display:'flex', alignItems:'flex-start', gap:9, marginBottom:20, cursor:'pointer'}}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                style={{marginTop:3, accentColor:'var(--sage)', flexShrink:0}}/>
              <span style={{fontSize:'.82rem', color:'var(--muted)', lineHeight:1.55}}>
                I agree to the{' '}
                <a href="#" style={{color:'var(--sage)', fontWeight:600}}>Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" style={{color:'var(--sage)', fontWeight:600}}>Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="btn btn-coral" disabled={loading} style={{
              width:'100%', justifyContent:'center', padding:'13px', fontSize:'.95rem',
              opacity: loading ? .75 : 1,
            }}>
              {loading ? 'Creating Account...' : 'Register →'}
            </button>
          </form>

          <p style={{textAlign:'center', marginTop:18, fontSize:'.875rem', color:'var(--muted)'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color:'var(--sage)', fontWeight:600}}>Login here</Link>
          </p>
        </div>
      </div>

      <style>{`@media(min-width:768px){.reg-left{display:flex!important}}`}</style>
    </div>
  );
}
