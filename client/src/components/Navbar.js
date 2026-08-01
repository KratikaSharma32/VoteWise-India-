import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/parties', label: 'Parties' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/performance', label: 'Performance' },
  { to: '/constituency', label: 'Constituency' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: solid ? 'rgba(250,247,242,0.96)' : 'transparent',
        backdropFilter: solid ? 'blur(18px)' : 'none',
        borderBottom: solid ? '1px solid rgba(74,63,53,0.1)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div className="wrap" style={{ display:'flex', alignItems:'center', height:66, justifyContent:'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'linear-gradient(135deg,#E07B39,#3A7D44)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
              fontSize:'1.1rem', color:'white', letterSpacing:'-0.02em',
            }}>V</div>
            <div>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
                fontSize:'1.1rem', lineHeight:1.1, letterSpacing:'-0.01em',
                color: solid ? 'var(--ink)' : 'white',
              }}>
                VoteWise <span style={{color:'var(--saffron)'}}>India</span>
              </div>
              <div style={{
                fontSize:'0.62rem', letterSpacing:'0.08em', textTransform:'uppercase',
                fontWeight:500, color: solid ? 'var(--taupe)' : 'rgba(255,255,255,0.6)',
              }}>Civic Intelligence</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display:'flex', gap:2 }} className="nav-links">
            {links.map(l => {
              const active = pathname === l.to;
              return (
                <Link key={l.to} to={l.to} style={{
                  padding:'7px 15px', borderRadius:'var(--r-full)',
                  fontSize:'0.86rem', fontWeight: active ? 600 : 400,
                  color: solid ? (active ? 'var(--ink)' : 'var(--stone)') : (active ? 'white' : 'rgba(255,255,255,0.75)'),
                  background: active ? (solid ? 'var(--linen)' : 'rgba(255,255,255,0.15)') : 'transparent',
                  transition:'var(--t)',
                }}>
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
              className="btn btn-saffron" style={{fontSize:'0.8rem', padding:'9px 20px'}}>
              Official ECI ↗
            </a>
            <button onClick={() => setOpen(!open)} className="nav-burger"
              style={{ display:'none', background:'none', border:'none', cursor:'pointer', fontSize:'1.3rem',
                color: solid ? 'var(--ink)' : 'white' }}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile */}
      {open && (
        <div style={{
          position:'fixed', top:66, left:0, right:0, bottom:0, zIndex:899,
          background:'var(--cream)', padding:24, display:'flex', flexDirection:'column', gap:6,
          animation:'fadeIn 0.2s ease',
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding:'14px 20px', borderRadius:'var(--r-md)',
              fontWeight:600, fontSize:'1rem',
              color: pathname === l.to ? 'var(--saffron)' : 'var(--ink)',
              background: pathname === l.to ? 'var(--saffron-pale)' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:860px){
          .nav-links{display:none!important}
          .nav-burger{display:flex!important}
        }
      `}</style>
    </>
  );
}
