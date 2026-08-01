import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATS = ['All','Election Updates','Government Announcements','Fact Checks','Economy','Education','Healthcare','Infrastructure','Technology','Civic Awareness'];

function TrustBar({ score }) {
  const color = score >= 90 ? 'var(--done-c)' : score >= 75 ? 'var(--saffron)' : 'var(--att-c)';
  return (
    <div style={{display:'flex',alignItems:'center',gap:7}}>
      <div style={{flex:1,height:5,background:'var(--border)',borderRadius:999,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${score}%`,background:color,borderRadius:999}}/>
      </div>
      <span style={{fontSize:'.72rem',fontWeight:700,color,minWidth:28}}>{score}%</span>
    </div>
  );
}

export default function News() {
  const [news, setNews]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]       = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/api/news').then(r => { setNews(r.data.data); setFiltered(r.data.data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (cat === 'All') setFiltered(news);
    else setFiltered(news.filter(n => n.category === cat));
  }, [cat, news]);

  const CAT_COLORS = {
    'Election Updates':       { bg:'var(--mint-bg)',  c:'var(--done-c)' },
    'Government Announcements':{ bg:'#EFF6FF',       c:'var(--blue-c)' },
    'Fact Checks':            { bg:'var(--coral-lt)', c:'var(--coral)' },
    'Economy':                { bg:'var(--gold-lt)',  c:'#8B6914' },
    'Education':              { bg:'var(--mint-bg)', c:'var(--done-c)' },
    'Healthcare':             { bg:'#F5F3FF',         c:'#7C3AED' },
    'Infrastructure':         { bg:'var(--saffron-lt)',c:'var(--saffron)' },
    'Technology':             { bg:'#EFF6FF',         c:'var(--blue-c)' },
    'Civic Awareness':        { bg:'var(--beige)',    c:'var(--muted)' },
  };

  return (
    <div style={{paddingTop:62,minHeight:'100vh',background:'var(--ivory)'}}>
      <div className="page-top">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › News & Updates</div>
          <h1 style={{fontSize:'1.75rem',fontWeight:800,marginBottom:6}}>News Intelligence Center</h1>
          <p style={{color:'var(--muted)',fontSize:'.875rem'}}>Curated civic news with AI summaries, trust scores, and verification status.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px'}}>
        {/* Category filter */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:'7px 14px', borderRadius:20,
              border: cat===c ? '1.5px solid var(--sage)' : '1px solid var(--border)',
              background: cat===c ? 'var(--mint-bg)' : 'var(--card)',
              color: cat===c ? 'var(--done-c)' : 'var(--muted)',
              fontWeight: cat===c ? 600 : 400,
              fontSize:'.82rem', cursor:'pointer', transition:'var(--t)',
              fontFamily:'inherit',
            }}>{c}</button>
          ))}
          <span style={{marginLeft:'auto',fontSize:'.82rem',color:'var(--muted)',display:'flex',alignItems:'center'}}>
            {filtered.length} articles
          </span>
        </div>

        {loading ? <div className="spinner"/> : (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {filtered.map(n => {
              const catStyle = CAT_COLORS[n.category] || {bg:'var(--cream)',c:'var(--muted)'};
              const isExp    = expanded === n.id;
              return (
                <div key={n.id} className="card" style={{overflow:'hidden'}}>
                  <div style={{padding:'20px 22px'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:16}}>
                      {/* Content */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
                          <span className="badge" style={{background:catStyle.bg,color:catStyle.c,fontSize:'.7rem'}}>{n.category}</span>
                          {n.verified
                            ? <span className="badge badge-sage" style={{fontSize:'.7rem'}}>✓ Verified</span>
                            : <span className="badge badge-coral" style={{fontSize:'.7rem'}}>⚠ Unverified</span>}
                        </div>

                        <h3 style={{fontWeight:700,fontSize:'1rem',lineHeight:1.4,marginBottom:8,color:'var(--ink)'}}>{n.headline}</h3>
                        <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.65,marginBottom:12}}>
                          {isExp ? n.summary : n.summary.slice(0,120) + (n.summary.length > 120 ? '...' : '')}
                        </p>

                        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                          <span style={{fontSize:'.78rem',fontWeight:600,color:'var(--saffron)'}}>{n.source}</span>
                          <span style={{fontSize:'.72rem',color:'var(--light)'}}>·</span>
                          <span style={{fontSize:'.75rem',color:'var(--light)'}}>{n.date}</span>
                          <button onClick={() => setExpanded(isExp ? null : n.id)} style={{
                            background:'none',border:'none',cursor:'pointer',
                            color:'var(--sage)',fontSize:'.78rem',fontWeight:600,
                            marginLeft:'auto',padding:0,fontFamily:'inherit',
                          }}>
                            {isExp ? 'Show Less ↑' : 'Read More ↓'}
                          </button>
                        </div>
                      </div>

                      {/* Trust score */}
                      <div style={{flexShrink:0,textAlign:'center',minWidth:70}}>
                        <div style={{fontSize:'.6rem',color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>Trust Score</div>
                        <div style={{
                          fontSize:'1.4rem',fontWeight:800,lineHeight:1,
                          color: n.trustScore>=90?'var(--done-c)':n.trustScore>=75?'var(--saffron)':'var(--att-c)',
                        }}>{n.trustScore}</div>
                        <div style={{fontSize:'.62rem',color:'var(--light)',marginTop:2}}>/100</div>
                      </div>
                    </div>

                    {/* AI Summary — shown when expanded */}
                    {isExp && n.aiSummary && (
                      <div style={{marginTop:14,padding:14,background:'var(--mint-bg)',borderRadius:10,border:'1px solid rgba(168,184,138,.25)'}}>
                        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
                          <span>🤖</span>
                          <span style={{fontWeight:700,fontSize:'.8rem',color:'var(--done-c)'}}>AI Summary</span>
                        </div>
                        <p style={{fontSize:'.82rem',lineHeight:1.7,color:'var(--ink-2)'}}>{n.aiSummary}</p>
                      </div>
                    )}

                    {/* Trust bar */}
                    <div style={{marginTop:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem',color:'var(--muted)',marginBottom:4}}>
                        <span>Source Reliability</span>
                      </div>
                      <TrustBar score={n.trustScore}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:12}}>📰</div>
            <p style={{fontWeight:600,color:'var(--ink)'}}>No articles in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
