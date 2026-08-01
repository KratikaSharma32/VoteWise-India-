import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const P_COL = { bjp:'#D97706', inc:'#16A34A', aap:'#2563EB', sp:'#DC2626', tmc:'#0891B2', bjd:'#059669' };

export default function Parties() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [perfData, setPerfData] = useState([]);

  useEffect(() => {
    axios.get('/api/parties').then(r => { setParties(r.data.data); setLoading(false); });
    axios.get('/api/performance').then(r => setPerfData(r.data.data)).catch(() => {});
  }, []);

  const getScore = (partyId) => perfData.find(p => p.partyId === partyId)?.overallScore;

  return (
    <div style={{paddingTop:62, minHeight:'100vh', background:'var(--ivory)'}}>
      <div className="page-top">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Parties</div>
          <h1 style={{fontSize:'1.75rem', fontWeight:800, marginBottom:6}}>Party Intelligence</h1>
          <p style={{color:'var(--muted)', fontSize:'.875rem'}}>Neutral profiles — ideology, history, seats, manifesto and promise delivery scores.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px'}}>
        <div className="alert-warn" style={{marginBottom:24}}>
          ⚠️ All information is for educational awareness only. This platform does not endorse any party. Verify at <strong>eci.gov.in</strong>
        </div>

        {/* Seat distribution bar */}
        {!loading && (
          <div className="card" style={{padding:24, marginBottom:24}}>
            <h3 style={{fontWeight:700, fontSize:'.95rem', marginBottom:16}}>2019 Lok Sabha — Seat Distribution (543 seats)</h3>
            <div style={{display:'flex', height:28, borderRadius:8, overflow:'hidden', marginBottom:14, gap:1}}>
              {parties.map(p => (
                <div key={p.id}
                  title={`${p.abbreviation}: ${p.seatsWon} seats (${p.voteShare}%)`}
                  onClick={() => setSelected(selected?.id===p.id ? null : p)}
                  style={{
                    width:`${(p.seatsWon/543)*100}%`, background:P_COL[p.id]||'var(--sage)',
                    cursor:'pointer', transition:'opacity .2s', opacity: selected && selected.id !== p.id ? .5 : 1,
                  }}/>
              ))}
              <div style={{flex:1, background:'var(--beige)'}} title="Others"/>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:'6px 18px'}}>
              {parties.map(p => (
                <div key={p.id} style={{display:'flex', alignItems:'center', gap:6, fontSize:'.78rem', cursor:'pointer'}}
                  onClick={() => setSelected(selected?.id===p.id ? null : p)}>
                  <div style={{width:9, height:9, borderRadius:2, background:P_COL[p.id]||'var(--sage)'}}/>
                  <span style={{color:'var(--muted)'}}>{p.abbreviation}</span>
                  <strong style={{color:'var(--ink)'}}>{p.seatsWon}</strong>
                </div>
              ))}
              <div style={{display:'flex', alignItems:'center', gap:6, fontSize:'.78rem'}}>
                <div style={{width:9, height:9, borderRadius:2, background:'var(--beige)'}}/>
                <span style={{color:'var(--muted)'}}>Others</span>
                <strong>{543-parties.reduce((s,p)=>s+p.seatsWon,0)}</strong>
              </div>
            </div>
          </div>
        )}

        {loading ? <div className="spinner"/> : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20}}>
            {parties.map(p => {
              const col  = P_COL[p.id] || 'var(--sage)';
              const isSel = selected?.id === p.id;
              const score = getScore(p.id);
              return (
                <div key={p.id} className="card" style={{
                  cursor:'pointer',
                  border: isSel ? `2px solid ${col}` : '1px solid var(--border)',
                  borderTop:`4px solid ${col}`,
                  transition:'var(--t)',
                }} onClick={() => setSelected(isSel ? null : p)}>
                  <div style={{padding:22}}>
                    {/* Header */}
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
                      <div>
                        <h3 style={{fontWeight:700, fontSize:'1rem', marginBottom:5}}>{p.name}</h3>
                        <span className="badge" style={{background:`${col}18`, color:col, fontSize:'.7rem'}}>{p.abbreviation}</span>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:800, fontSize:'1.6rem', color:col, lineHeight:1}}>{p.seatsWon}</div>
                        <div style={{fontSize:'.7rem', color:'var(--muted)'}}>2019 seats</div>
                      </div>
                    </div>

                    <p style={{fontSize:'.83rem', color:'var(--muted)', lineHeight:1.65, marginBottom:14}}>{p.description}</p>

                    {/* Info grid */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14}}>
                      {[
                        {l:'Founded', v:p.founded},
                        {l:'Vote Share', v:`${p.voteShare}%`},
                        {l:'President', v:p.president},
                        {l:'Symbol', v:p.symbol},
                      ].map(x => (
                        <div key={x.l} style={{background:'var(--ivory)', borderRadius:8, padding:'8px 10px'}}>
                          <div style={{fontSize:'.65rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em'}}>{x.l}</div>
                          <div style={{fontSize:'.83rem', fontWeight:500, marginTop:2, color:'var(--ink-2)'}}>{x.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Promise score if available */}
                    {score && (
                      <div style={{marginBottom:14}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'.75rem', color:'var(--muted)', marginBottom:5}}>
                          <span>Promise Delivery Score</span>
                          <span style={{fontWeight:700, color:score>=70?'var(--done-c)':score>=50?'var(--prog-c)':'var(--att-c)'}}>{score}%</span>
                        </div>
                        <div className="prog" style={{height:6}}>
                          <div className="prog-bar" style={{
                            width:`${score}%`,
                            background: score>=70?'var(--sage)':score>=50?'var(--saffron)':'var(--coral)',
                          }}/>
                        </div>
                        <Link to="/performance" onClick={e=>e.stopPropagation()} style={{fontSize:'.72rem', color:'var(--sage)', fontWeight:600, display:'block', marginTop:4}}>
                          View Promise Tracker →
                        </Link>
                      </div>
                    )}

                    <p style={{fontSize:'.75rem', color:'var(--light)', fontStyle:'italic', marginBottom:12}}>{p.ideology}</p>

                    {/* Expanded manifesto */}
                    {isSel && (
                      <div style={{borderTop:'1px solid var(--border)', paddingTop:14, animation:'fadeUp .3s ease'}}>
                        <h4 style={{fontWeight:700, fontSize:'.83rem', color:col, marginBottom:10}}>Key Manifesto Points</h4>
                        <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:6}}>
                          {p.manifesto.map((m,i) => (
                            <li key={i} style={{display:'flex', gap:8, fontSize:'.82rem', color:'var(--ink-2)'}}>
                              <span style={{color:col, flexShrink:0, marginTop:1}}>→</span>{m}
                            </li>
                          ))}
                        </ul>
                        <Link to="/candidates" onClick={e=>e.stopPropagation()}
                          style={{display:'inline-flex', alignItems:'center', gap:5, marginTop:12, fontSize:'.78rem', color:col, fontWeight:600}}>
                          View {p.abbreviation} Candidates →
                        </Link>
                      </div>
                    )}

                    <div style={{marginTop:10, fontSize:'.72rem', color:'var(--muted)', textAlign:'right'}}>
                      {isSel ? '↑ Close' : '↓ View Manifesto'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
