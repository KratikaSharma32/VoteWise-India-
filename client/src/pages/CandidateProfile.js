import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const P_COLORS = { bjp:'#D97706', inc:'#16A34A', aap:'#2563EB', sp:'#DC2626', tmc:'#0891B2', bjd:'#059669' };

function StarRating({ rating, total }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:6}}>
      <div style={{display:'flex', gap:2}}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{color: i<=Math.round(rating) ? '#E0C879' : 'var(--border-mid)', fontSize:'1rem'}}>★</span>
        ))}
      </div>
      <span style={{fontWeight:700, fontSize:'.9rem'}}>{rating.toFixed(1)}</span>
      <span style={{color:'var(--muted)', fontSize:'.8rem'}}>({total.toLocaleString('en-IN')} ratings)</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card" style={{padding:24, marginBottom:16}}>
      <h3 style={{fontWeight:700, fontSize:'1rem', marginBottom:16, paddingBottom:10, borderBottom:'1px solid var(--border)', color:'var(--ink)'}}>{title}</h3>
      {children}
    </div>
  );
}

export default function CandidateProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/candidates/${id}`)
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => { setError('Candidate not found'); setLoading(false); });
  }, [id]);

  if (loading) return <div style={{paddingTop:62}}><div className="spinner" style={{marginTop:80}}/></div>;
  if (error) return (
    <div style={{paddingTop:62, minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'3rem', marginBottom:16}}>😔</div>
        <h2 style={{marginBottom:8}}>Candidate Not Found</h2>
        <Link to="/candidates" className="btn btn-sage" style={{marginTop:12}}>← Back to Candidates</Link>
      </div>
    </div>
  );

  const c = data;
  const col = P_COLORS[c.partyId] || 'var(--sage)';
  const TABS = ['overview', 'financial', 'legislative', 'manifesto', 'news', 'ai-summary'];

  return (
    <div style={{paddingTop:62, background:'var(--ivory)', minHeight:'100vh'}}>

      {/* ─── Header Banner ─── */}
      <div style={{background:'var(--card)', borderBottom:'1px solid var(--border)', padding:'28px 0'}}>
        <div className="container">
          <div className="breadcrumb" style={{marginBottom:12}}>
            <Link to="/">Home</Link> › <Link to="/candidates">Candidates</Link> › {c.name}
          </div>
          <div style={{display:'flex', alignItems:'flex-start', gap:24, flexWrap:'wrap'}}>
            {/* Avatar */}
            <div style={{
                width:96, height:96, borderRadius:'50%', flexShrink:0,
                background:`linear-gradient(135deg, ${col}22, ${col}44)`,
                border:`3px solid ${col}40`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'2.4rem',
              }}>👤</div>

            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap'}}>
                <h1 style={{fontSize:'1.75rem', fontWeight:800}}>{c.name}</h1>
                <span className="badge badge-sage">✓ Verified</span>
                {c.criminalCases > 0 && <span className="badge badge-coral">⚠️ {c.criminalCases} Case(s)</span>}
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:10}}>
                <span className="badge" style={{background:`${col}15`, color:col, fontSize:'.78rem'}}>{c.party}</span>
                <span className="badge badge-gray">{c.type}</span>
                <span className="badge badge-gray">📍 {c.constituency}, {c.state}</span>
                <span className="badge badge-gray">{c.gender} · {c.age} yrs</span>
              </div>
              <StarRating rating={c.publicRating} total={c.totalRatings}/>
            </div>

            {/* Win probability */}
            <div style={{textAlign:'center', flexShrink:0}}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="7"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke={col} strokeWidth="7"
                  strokeDasharray={`${(c.winProbability/100)*213.6} 213.6`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"/>
                <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill={col}>{c.winProbability}%</text>
              </svg>
              <div style={{fontSize:'.72rem', color:'var(--muted)', marginTop:4}}>Win Est.</div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{display:'flex', gap:12, marginTop:20, flexWrap:'wrap'}}>
            {[
              { l:'Attendance', v: c.attendance > 0 ? `${c.attendance}%` : 'First-timer', highlight: c.attendance >= 80 },
              { l:'Questions Raised', v: c.questionsRaised || '–' },
              { l:'Previous Wins', v: c.previousWins },
              { l:'Net Assets', v: c.netAssets },
              { l:'Criminal Cases', v: c.criminalCases, warn: c.criminalCases > 0 },
            ].map(s => (
              <div key={s.l} style={{
                padding:'10px 16px', background:'var(--ivory)',
                borderRadius:'var(--r-md)', border:'1px solid var(--border)',
              }}>
                <div style={{fontSize:'.68rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em'}}>{s.l}</div>
                <div style={{fontWeight:700, fontSize:'1rem', marginTop:2, color: s.warn ? 'var(--att-c)' : s.highlight ? 'var(--done-c)' : 'var(--ink)'}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tab bar ─── */}
      <div style={{background:'var(--card)', borderBottom:'1px solid var(--border)', position:'sticky', top:62, zIndex:40}}>
        <div className="container" style={{display:'flex', gap:0, overflowX:'auto'}}>
          {[
            {id:'overview', label:'Overview'},
            {id:'financial', label:'Financial'},
            {id:'legislative', label:'Legislative'},
            {id:'manifesto', label:'Manifesto'},
            {id:'news', label:'News'},
            {id:'ai-summary', label:'AI Summary'},
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:'14px 20px', border:'none', borderBottom:`2px solid ${activeTab===tab.id ? 'var(--coral)' : 'transparent'}`,
              background:'transparent', fontSize:'.85rem', fontWeight: activeTab===tab.id ? 600 : 400,
              color: activeTab===tab.id ? 'var(--coral)' : 'var(--muted)',
              cursor:'pointer', whiteSpace:'nowrap', transition:'var(--t)',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start'}}>
        <div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <Section title="Biography">
                <p style={{fontSize:'.9rem', lineHeight:1.75, color:'var(--ink-2)'}}>{c.bio}</p>
              </Section>

              <Section title="Education">
                {c.educationDetails.map((e,i) => (
                  <div key={i} style={{display:'flex', gap:14, marginBottom: i < c.educationDetails.length-1 ? 14 : 0, paddingBottom: i < c.educationDetails.length-1 ? 14 : 0, borderBottom: i < c.educationDetails.length-1 ? '1px solid var(--border)' : 'none'}}>
                    <div style={{width:40, height:40, borderRadius:10, background:'var(--mint-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0}}>🎓</div>
                    <div>
                      <div style={{fontWeight:600, fontSize:'.9rem'}}>{e.degree}</div>
                      <div style={{fontSize:'.82rem', color:'var(--muted)', marginTop:2}}>{e.institution}</div>
                      <div style={{fontSize:'.78rem', color:'var(--light)', marginTop:1}}>Class of {e.year}</div>
                    </div>
                  </div>
                ))}
              </Section>

              <Section title="Election History">
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Year</th><th>Constituency</th><th>Result</th><th>Votes</th><th>Margin</th></tr></thead>
                    <tbody>
                      {c.electionHistory.map((h,i) => (
                        <tr key={i}>
                          <td style={{fontWeight:600}}>{h.year}</td>
                          <td>{h.constituency}</td>
                          <td><span className={`badge ${h.result==='Won'?'badge-sage':h.result==='Lost'?'badge-coral':'badge-gray'}`}>{h.result}</span></td>
                          <td>{h.votes.toLocaleString('en-IN')}</td>
                          <td style={{color: h.margin > 0 ? 'var(--done-c)' : h.margin < 0 ? 'var(--att-c)' : 'var(--muted)', fontWeight:600}}>
                            {h.margin > 0 ? '+' : ''}{h.margin.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Key Projects">
                {c.projects.map((p,i) => (
                  <div key={i} style={{padding:14, background:'var(--ivory)', borderRadius:'var(--r-md)', marginBottom: i < c.projects.length-1 ? 10 : 0, borderLeft:`3px solid ${p.status==='Completed'?'var(--done-c)':p.status==='In Progress'?'var(--saffron)':'var(--light)'}`}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
                      <div style={{fontWeight:600, fontSize:'.88rem'}}>{p.name}</div>
                      <span className={`badge ${p.status==='Completed'?'badge-sage':p.status==='In Progress'?'badge-saffron':'badge-gray'}`} style={{fontSize:'.7rem'}}>{p.status}</span>
                    </div>
                    <div style={{fontSize:'.8rem', color:'var(--muted)', marginBottom:4}}>Budget: <strong>{p.budget}</strong></div>
                    <div style={{fontSize:'.8rem', color:'var(--ink-2)'}}>{p.impact}</div>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* FINANCIAL */}
          {activeTab === 'financial' && (
            <>
              <Section title="Asset Declaration">
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20}}>
                  {[
                    { l:'Gross Assets', v:c.assets, color:'var(--done-c)' },
                    { l:'Liabilities', v:c.liabilities, color:'var(--att-c)' },
                    { l:'Net Assets', v:c.netAssets, color:'var(--ink)' },
                  ].map(s => (
                    <div key={s.l} style={{padding:16, background:'var(--ivory)', borderRadius:'var(--r-md)', textAlign:'center'}}>
                      <div style={{fontSize:'.72rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', marginBottom:6}}>{s.l}</div>
                      <div style={{fontSize:'1.1rem', fontWeight:800, color:s.color}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <h4 style={{fontWeight:600, fontSize:'.85rem', marginBottom:12, color:'var(--ink-2)'}}>Breakdown</h4>
                {c.assetBreakdown.map((a,i) => (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom: i < c.assetBreakdown.length-1 ? '1px solid var(--border)' : 'none'}}>
                    <span style={{fontSize:'.875rem', color:'var(--ink-2)'}}>{a.item}</span>
                    <span style={{fontWeight:600, fontSize:'.875rem'}}>{a.value}</span>
                  </div>
                ))}
                <div style={{marginTop:14, padding:12, background:'var(--saffron-lt)', borderRadius:'var(--r-md)', fontSize:'.78rem', color:'#6B4A12'}}>
                  📋 Source: Affidavit filed with Election Commission of India. Self-declared figures, audited by Returning Officer.
                </div>
              </Section>

              {c.criminalDetails && c.criminalDetails.length > 0 ? (
                <Section title="Criminal Cases">
                  {c.criminalDetails.map((d,i) => (
                    <div key={i} style={{padding:14, background:'var(--coral-lt)', borderRadius:'var(--r-md)', border:'1px solid rgba(232,116,97,.2)'}}>
                      <div style={{fontWeight:600, fontSize:'.88rem', marginBottom:4}}>Section: {d.section}</div>
                      <div style={{fontSize:'.83rem', color:'var(--muted)', marginBottom:6}}>{d.description}</div>
                      <div style={{display:'flex', gap:8}}>
                        <span className="badge badge-coral">{d.status}</span>
                        <span className="badge badge-gray">Filed: {d.year}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              ) : (
                <Section title="Criminal Cases">
                  <div style={{display:'flex', gap:12, alignItems:'center', padding:'16px', background:'var(--mint-bg)', borderRadius:'var(--r-md)'}}>
                    <span style={{fontSize:'1.5rem'}}>✅</span>
                    <div>
                      <div style={{fontWeight:600, color:'var(--done-c)'}}>Zero Criminal Cases</div>
                      <div style={{fontSize:'.8rem', color:'var(--muted)', marginTop:2}}>No criminal cases declared in affidavit filed with ECI.</div>
                    </div>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* LEGISLATIVE */}
          {activeTab === 'legislative' && (
            <>
              <Section title="Parliamentary Performance">
                {c.attendance > 0 ? (
                  <>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20}}>
                      {[
                        { l:'Attendance', v:`${c.attendance}%`, color: c.attendance>=75?'var(--done-c)':'var(--att-c)' },
                        { l:'Questions Raised', v:c.questionsRaised, color:'var(--saffron)' },
                        { l:'Debates Participated', v:c.debatesParticipated, color:'var(--blue-c)' },
                      ].map(s => (
                        <div key={s.l} style={{padding:16, background:'var(--ivory)', borderRadius:'var(--r-md)', textAlign:'center'}}>
                          <div style={{fontSize:'.7rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', marginBottom:6}}>{s.l}</div>
                          <div style={{fontSize:'1.4rem', fontWeight:800, color:s.color}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{display:'flex', justifyContent:'space-between', fontSize:'.78rem', color:'var(--muted)', marginBottom:4}}>
                        <span>Attendance Rate</span><span style={{fontWeight:600, color: c.attendance>=75?'var(--done-c)':'var(--att-c)'}}>{c.attendance}%</span>
                      </div>
                      <div className="prog"><div className="prog-bar" style={{width:`${c.attendance}%`, background: c.attendance>=75?'var(--sage)':'var(--coral)'}}/></div>
                    </div>
                    <div style={{fontSize:'.78rem', color:'var(--muted)', marginTop:8}}>
                      National average attendance: ~74% | Source: PRS Legislative Research
                    </div>
                  </>
                ) : (
                  <div style={{padding:16, background:'var(--cream)', borderRadius:'var(--r-md)', fontSize:'.88rem', color:'var(--muted)'}}>
                    📌 No Lok Sabha legislative record — {c.name} is contesting Parliament for the first time.
                    {c.experience && <div style={{marginTop:8, color:'var(--ink-2)'}}>Prior experience: {c.experience}</div>}
                  </div>
                )}
              </Section>
            </>
          )}

          {/* MANIFESTO */}
          {activeTab === 'manifesto' && (
            <Section title="Key Manifesto Promises">
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                {c.manifesto.map((m,i) => (
                  <div key={i} style={{
                    display:'flex', gap:12, alignItems:'flex-start',
                    padding:'12px 14px', background:'var(--ivory)', borderRadius:'var(--r-md)',
                  }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%', flexShrink:0,
                      background:'var(--mint-bg)', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'.8rem', fontWeight:700, color:'var(--done-c)',
                    }}>{i+1}</div>
                    <span style={{fontSize:'.875rem', color:'var(--ink-2)', lineHeight:1.6}}>{m}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14, padding:12, background:'var(--saffron-lt)', borderRadius:'var(--r-md)', fontSize:'.78rem', color:'#6B4A12'}}>
                📋 Source: Official party manifesto and candidate declaration. Visit the Promise Tracker to check delivery status.
              </div>
            </Section>
          )}

          {/* NEWS */}
          {activeTab === 'news' && (
            <Section title={`News Mentions — ${c.name}`}>
              {c.newsMentions && c.newsMentions.length > 0 ? (
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {c.newsMentions.map((n,i) => (
                    <div key={i} style={{
                      padding:'14px 16px', background:'var(--ivory)', borderRadius:'var(--r-md)',
                      borderLeft:`3px solid ${n.sentiment==='positive'?'var(--done-c)':n.sentiment==='negative'?'var(--att-c)':'var(--border-mid)'}`,
                    }}>
                      <h4 style={{fontWeight:600, fontSize:'.875rem', marginBottom:6, color:'var(--ink)'}}>{n.headline}</h4>
                      <div style={{display:'flex', gap:8, alignItems:'center'}}>
                        <span style={{fontSize:'.75rem', fontWeight:600, color:'var(--saffron)'}}>{n.source}</span>
                        <span style={{fontSize:'.72rem', color:'var(--light)'}}>·</span>
                        <span style={{fontSize:'.75rem', color:'var(--light)'}}>{n.date}</span>
                        <span className={`badge ${n.sentiment==='positive'?'badge-sage':n.sentiment==='negative'?'badge-coral':'badge-gray'}`} style={{fontSize:'.68rem', marginLeft:'auto'}}>
                          {n.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{color:'var(--muted)', fontSize:'.875rem'}}>No recent news mentions tracked.</div>
              )}
            </Section>
          )}

          {/* AI SUMMARY */}
          {activeTab === 'ai-summary' && (
            <Section title="AI Research Summary">
              <div style={{padding:16, background:'var(--mint-bg)', borderRadius:'var(--r-md)', marginBottom:14, border:'1px solid rgba(168,184,138,.3)'}}>
                <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:12}}>
                  <span style={{fontSize:'1.2rem'}}>🤖</span>
                  <span style={{fontWeight:700, fontSize:'.9rem', color:'var(--done-c)'}}>VoteWise AI Analysis</span>
                  <span className="badge badge-sage" style={{marginLeft:'auto', fontSize:'.68rem'}}>Confidence: {c.aiConfidence}</span>
                </div>
                <p style={{fontSize:'.88rem', lineHeight:1.75, color:'var(--ink-2)'}}>{c.aiSummary}</p>
              </div>
              <div style={{padding:12, background:'var(--saffron-lt)', borderRadius:'var(--r-md)', fontSize:'.78rem', color:'#6B4A12'}}>
                ⚠️ AI summary is generated from official affidavit data, PRS legislative records, and news sources. It is for research purposes only and does not constitute an endorsement.
              </div>
            </Section>
          )}

        </div>

        {/* ─── Right sidebar ─── */}
        <div>
          <div className="card" style={{padding:20, marginBottom:16}}>
            <h4 style={{fontWeight:700, fontSize:'.85rem', marginBottom:14}}>Quick Facts</h4>
            {[
              { l:'Profession', v:c.profession },
              { l:'Experience', v:c.experience },
              { l:'Constituency', v:`${c.constituency}, ${c.state}` },
              { l:'Type', v:c.type },
              { l:'Age', v:`${c.age} years` },
            ].map(x => (
              <div key={x.l} style={{display:'flex', flexDirection:'column', marginBottom:10}}>
                <span style={{fontSize:'.68rem', color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em'}}>{x.l}</span>
                <span style={{fontSize:'.83rem', color:'var(--ink-2)', marginTop:2, fontWeight:500}}>{x.v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:20, marginBottom:16}}>
            <h4 style={{fontWeight:700, fontSize:'.85rem', marginBottom:12}}>Key Issues</h4>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {c.keyIssues.map(iss => (
                <span key={iss} className="badge badge-sage" style={{fontSize:'.75rem'}}>{iss}</span>
              ))}
            </div>
          </div>

          {c.related && c.related.length > 0 && (
            <div className="card" style={{padding:20}}>
              <h4 style={{fontWeight:700, fontSize:'.85rem', marginBottom:14}}>Related Candidates</h4>
              {c.related.map(r => (
                <Link key={r.id} to={`/candidates/${r.id}`} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'9px 0',
                  borderBottom:'1px solid var(--border)', textDecoration:'none',
                }}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>👤</div>
                  <div>
                    <div style={{fontWeight:600, fontSize:'.83rem', color:'var(--ink)'}}>{r.name}</div>
                    <div style={{fontSize:'.72rem', color:'var(--muted)'}}>{r.party} · {r.constituency}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
