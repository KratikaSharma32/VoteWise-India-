import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FEATURES = [
  { icon:'🧑‍💼', title:'Candidate Analysis',    desc:'Deep profiles — education, assets, attendance, criminal records.', to:'/candidates',   accent:'var(--sage)',    topRow:true },
  { icon:'🏛️',  title:'Party Intelligence',     desc:'Compare parties on ideology, seats, and manifesto delivery.',     to:'/parties',      accent:'var(--saffron)', topRow:true },
  { icon:'🗺️',  title:'Constituency Explorer',  desc:'Demographics, development indicators, election history.',          to:'/constituency', accent:'var(--gold)',    topRow:true },
  { icon:'📋',  title:'Promise Tracker',         desc:'Evidence-based tracking of government manifesto delivery.',       to:'/performance',  accent:'var(--sage)',    topRow:false },
  { icon:'📰',  title:'News Intelligence',       desc:'Curated civic news with trust scores and AI summaries.',          to:'/news',         accent:'var(--saffron)', topRow:false },
  { icon:'🤖',  title:'AI Civic Assistant',      desc:'Research-grade civic intelligence. Ask anything, get cited answers.', to:'#ai',      accent:'var(--coral)',   topRow:false },
];

export default function Home() {
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/stats').then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) navigate(`/candidates?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div style={{paddingTop:62}}>

      {/* ═══ HERO ═══ */}
      <section style={{position:'relative', minHeight:'90vh', display:'flex', alignItems:'center', overflow:'hidden'}}>
        {/* Parliament of India — Sansad Bhavan, New Delhi */}
        <img
          src="/images/parliament_1785049389.jpg"
          alt="Sansad Bhavan - Parliament of India, New Delhi"
          style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center 45%',
            filter:'brightness(0.85) saturate(1.12)',
            zIndex:0,
          }}
        />
        {/* Warm ivory left-side overlay */}
        <div style={{
          position:'absolute', inset:0, zIndex:1,
          background:'linear-gradient(100deg, rgba(250,247,242,0.94) 0%, rgba(244,238,227,0.88) 28%, rgba(233,221,199,0.62) 48%, rgba(220,208,188,0.25) 66%, rgba(200,185,165,0.03) 82%, transparent 100%)',
        }}/>

        <div className="container" style={{position:'relative', zIndex:2, padding:'72px 24px'}}>
          <div style={{maxWidth:640}}>
            <div className="fu" style={{
              display:'inline-flex', alignItems:'center', gap:7,
              background:'rgba(168,184,138,0.18)', border:'1px solid rgba(168,184,138,0.4)',
              borderRadius:20, padding:'5px 14px', marginBottom:20,
              fontSize:'.78rem', color:'var(--done-c)', fontWeight:600, letterSpacing:'.03em',
            }}>
              🇮🇳 &nbsp;India's Civic Intelligence Platform
            </div>

            <h1 className="fu d1" style={{
              fontSize:'clamp(2.2rem, 6vw, 3.8rem)', fontWeight:800,
              color:'var(--ink)', lineHeight:1.05, marginBottom:18,
              letterSpacing:'-.02em',
            }}>
              Make Smarter<br/>
              Election Decisions<br/>
              <span style={{color:'var(--coral)'}}>with AI</span>
            </h1>

            <p className="fu d2" style={{
              fontSize:'clamp(.95rem, 2vw, 1.1rem)', color:'var(--ink-2)',
              lineHeight:1.75, marginBottom:32, maxWidth:500, opacity:.85,
            }}>
              Transparent information on candidates, parties, and governance —
              backed by evidence and AI research.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="fu d3" style={{
              display:'flex', maxWidth:520, marginBottom:24,
              background:'var(--card)', borderRadius:10,
              border:'1.5px solid var(--border-mid)',
              boxShadow:'0 4px 20px rgba(31,41,55,.12)', overflow:'hidden',
            }}>
              <span style={{padding:'0 14px', display:'flex', alignItems:'center', color:'var(--light)', fontSize:'1.05rem'}}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search candidates, parties, constituencies..."
                style={{
                  flex:1, border:'none', outline:'none', fontSize:'.9rem',
                  color:'var(--ink)', padding:'14px 0', background:'transparent',
                }}
              />
              <button type="submit" style={{
                background:'var(--coral)', color:'#fff', border:'none',
                padding:'0 20px', cursor:'pointer', fontWeight:600, fontSize:'.85rem',
                transition:'background .2s',
              }}
                onMouseEnter={e => e.target.style.background = 'var(--coral-h)'}
                onMouseLeave={e => e.target.style.background = 'var(--coral)'}
              >Search</button>
            </form>

            <div className="fu d4" style={{display:'flex', gap:12, flexWrap:'wrap'}}>
              <Link to="/candidates" className="btn btn-dark btn-lg" style={{fontSize:'.9rem'}}>
                🔍 Explore Candidates
              </Link>
              <button onClick={() => document.getElementById('ai-toggle-btn')?.click()}
                className="btn btn-lg" style={{
                  fontSize:'.9rem', background:'var(--coral)', color:'#fff',
                  border:'none', cursor:'pointer',
                }}>
                🤖 Ask VoteWise AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{background:'var(--beige)', borderBottom:'1px solid var(--border)', padding:'28px 0'}}>
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px,1fr))', gap:24}}>
            {[
              { icon:'🧑‍💼', val: stats ? stats.totalCandidates.toLocaleString('en-IN') : '12,842', label:'Total Candidates', bg:'var(--mint-bg)', ic:'👥' },
              { icon:'🏛️',  val: stats ? stats.totalParties : '672',              label:'Political Parties',    bg:'var(--saffron-lt)', ic:'🏛️' },
              { icon:'📍',  val: stats ? stats.totalConstituencies : '543',        label:'Constituencies',       bg:'var(--gold-lt)',    ic:'🗺️' },
              { icon:'🛡️',  val:'9,204',                                           label:'Verified Profiles',    bg:'var(--mint-bg)',    ic:'🛡️' },
              { icon:'🗳️',  val:'2024',                                            label:'Elections Covered',    bg:'var(--saffron-lt)', ic:'🗳️' },
            ].map((s,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{
                  width:44, height:44, borderRadius:10,
                  background:s.bg||'var(--card)', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.3rem', flexShrink:0, boxShadow:'var(--sh-xs)',
                }}>{s.ic||s.icon}</div>
                <div>
                  <div style={{fontWeight:800, fontSize:'1.3rem', color:'var(--ink)', lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:'.72rem', color:'var(--muted)', marginTop:2}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{background:'var(--ivory)', padding:'72px 0'}}>
        <div className="container">
          <div style={{textAlign:'center', marginBottom:48}}>
            <div style={{fontSize:'.75rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10}}>Platform Capabilities</div>
            <h2 style={{fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, marginBottom:12}}>Everything to Vote Wisely</h2>
            <p style={{color:'var(--muted)', fontSize:'.95rem', maxWidth:440, margin:'0 auto'}}>Research-grade civic intelligence, transparently presented.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="features-grid">
            {FEATURES.map((f,i) => (
              <Link key={i} to={f.to === '#ai' ? '/' : f.to}
                onClick={f.to === '#ai' ? e => { e.preventDefault(); document.getElementById('ai-toggle-btn')?.click(); } : undefined}
                className="card card-hover" style={{
                  padding:'24px 20px', textAlign:'center', textDecoration:'none', display:'block',
                  borderTop:`3px solid ${f.accent}`,
                }}>
                <div style={{
                  width:48, height:48, borderRadius:12,
                  background:'var(--cream)', margin:'0 auto 14px',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem',
                }}>{f.icon}</div>
                <h4 style={{fontWeight:700, fontSize:'.92rem', marginBottom:7, color:'var(--ink)'}}>{f.title}</h4>
                <p style={{fontSize:'.8rem', color:'var(--muted)', lineHeight:1.6}}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BELT ═══ */}
      <section style={{background:'var(--cream)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'56px 0', textAlign:'center'}}>
        <div className="container">
          <p style={{fontSize:'.75rem', color:'var(--muted)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10}}>Our Commitment</p>
          <h2 style={{fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:700, marginBottom:10, color:'var(--ink)'}}>Trusted. Transparent. Intelligent.</h2>
          <p style={{color:'var(--muted)', fontSize:'.95rem', maxWidth:460, margin:'0 auto 28px'}}>Empowering every citizen with knowledge for a better democracy. All data is sourced, cited, and verified.</p>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-coral btn-lg">Get Started Free</Link>
            <Link to="/about" className="btn btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
