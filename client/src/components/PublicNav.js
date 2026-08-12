import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/',             label: 'Home' },
  { to: '/candidates',   label: 'Explore' },
  { to: '/constituency', label: 'Constituencies' },
  { to: '/parties',      label: 'Parties' },
  { to: '/news',         label: 'News & Updates' },
  { to: '/about',        label: 'About Us' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setMobileOpen(false), [location]);

  const solid = !isHome || scrolled;

  const handleDash = () => {
    const map = { citizen:'/dashboard/citizen', candidate:'/dashboard/candidate', employee:'/dashboard/employee', admin:'/dashboard/admin' };
    navigate(map[user.role] || '/');
  };

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        background: solid ? 'rgba(255,253,249,0.96)' : 'transparent',
        backdropFilter: solid ? 'blur(18px)' : 'none',
        borderBottom: solid ? '1px solid var(--border)' : 'none',
        transition: 'all .3s ease',
        boxShadow: solid ? '0 1px 12px rgba(31,41,55,.06)' : 'none',
      }}>
        <div className="container" style={{display:'flex',alignItems:'center',height:62,gap:0}}>
          {/* Logo */}
          <Link to="/" style={{display:'flex',alignItems:'center',gap:9,marginRight:28,textDecoration:'none',flexShrink:0}}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:'linear-gradient(135deg, var(--sage), #7A9E62)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1rem', boxShadow:'0 2px 8px rgba(168,184,138,.4)',
            }}>🗳️</div>
            <span style={{
              fontWeight:700, fontSize:'1rem',
              color: solid ? 'var(--ink)' : '#FFFFFF',
              letterSpacing:'-.01em',
              textShadow: solid ? 'none' : '0 1px 6px rgba(0,0,0,.6)',
            }}>VoteWise <span style={{color:'var(--coral)'}}>India</span></span>
          </Link>

          {/* Desktop links */}
          <div style={{display:'flex',alignItems:'center',gap:2,flex:1}} className="nav-desktop">
            {NAV.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link key={l.to} to={l.to} style={{
                  padding:'6px 13px', borderRadius:6,
                  fontSize:'.85rem', fontWeight: active ? 600 : 400,
                  color: solid
                    ? (active ? 'var(--ink)' : 'var(--muted)')
                    : (active ? '#FFFFFF' : 'rgba(255,255,255,0.90)'),
                  background: active
                    ? (solid ? 'var(--mint-bg)' : 'rgba(0,0,0,.18)')
                    : 'transparent',
                  textShadow: solid ? 'none' : '0 1px 6px rgba(0,0,0,.7)',
                  fontWeight: active ? 600 : 500,
                  transition:'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = solid ? 'var(--ink)' : '#FFFFFF'; e.currentTarget.style.background = solid ? 'var(--cream)' : 'rgba(0,0,0,.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = solid ? (active?'var(--ink)':'var(--muted)') : (active?'#FFFFFF':'rgba(255,255,255,0.90)'); e.currentTarget.style.background = active ? (solid?'var(--mint-bg)':'rgba(0,0,0,.18)') : 'transparent'; }}
                >{l.label}</Link>
              );
            })}
          </div>

          {/* Auth */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginLeft:'auto'}} className="nav-desktop">
            {user ? (
              <>
                <button onClick={handleDash} style={{
                  padding:'7px 16px', borderRadius:6, border:'1.5px solid var(--border-mid)',
                  background:'transparent', fontSize:'.83rem', fontWeight:600,
                  color: solid ? 'var(--ink)' : '#fff',
                  borderColor: solid ? 'var(--border-mid)' : 'rgba(255,255,255,.35)',
                  cursor:'pointer',
                }}>Dashboard</button>
                <button onClick={logout} style={{
                  padding:'7px 14px', borderRadius:6, border:'none',
                  background:'rgba(232,116,97,.12)', color:'var(--coral)',
                  fontSize:'.83rem', fontWeight:600, cursor:'pointer',
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding:'7px 16px', borderRadius:6,
                  border: solid ? '1.5px solid var(--border-mid)' : '1.5px solid rgba(168,232,144,.5)',
                  background:'transparent', fontSize:'.83rem', fontWeight:600,
                  color: solid ? 'var(--ink)' : '#FFFFFF',
                  textShadow: solid ? 'none' : '0 1px 4px rgba(0,0,0,.35)',
                }}>Login</Link>
                <Link to="/register" className="btn btn-coral" style={{padding:'7px 16px',fontSize:'.83rem'}}>Register</Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(o => !o)} className="nav-mobile"
            style={{background:'none',border:'none',color: solid?'var(--ink)':'#FFFFFF',fontSize:'1.3rem',textShadow: solid?'none':'0 1px 6px rgba(0,0,0,.7)',cursor:'pointer',marginLeft:'auto'}}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position:'fixed', top:62, left:0, right:0, bottom:0, zIndex:999,
          background:'var(--card)', padding:16,
          display:'flex', flexDirection:'column', gap:4,
          animation:'fadeIn .2s ease',
        }}>
          {NAV.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding:'13px 16px', borderRadius:8, color:'var(--ink)',
              fontSize:'1rem', fontWeight: location.pathname===l.to ? 600 : 400,
              background: location.pathname===l.to ? 'var(--mint-bg)' : 'transparent',
            }}>{l.label}</Link>
          ))}
          <div style={{marginTop:16,display:'flex',gap:10}}>
            {user ? (
              <button onClick={logout} className="btn btn-outline" style={{flex:1,justifyContent:'center'}}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{flex:1,justifyContent:'center'}}>Login</Link>
                <Link to="/register" className="btn btn-coral" style={{flex:1,justifyContent:'center'}}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){.nav-desktop{display:none!important}}
        @media(min-width:901px){.nav-mobile{display:none!important}}
      `}</style>
    </>
  );
}
