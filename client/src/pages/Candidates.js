import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const P_COLORS = { bjp:'#D97706', inc:'#16A34A', aap:'#2563EB', sp:'#DC2626', tmc:'#0891B2', bjd:'#059669' };

export default function Candidates() {
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ party:'', state:'', gender:'', q:'' });
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(f => ({ ...f, q: params.get('q') || '' }));
    axios.get('/api/candidates').then(r => { setAll(r.data.data); setLoading(false); });
  }, []);

  useEffect(() => {
    let r = [...all];
    if (filters.q) r = r.filter(c =>
      c.name.toLowerCase().includes(filters.q.toLowerCase()) ||
      c.constituency.toLowerCase().includes(filters.q.toLowerCase()) ||
      c.party.toLowerCase().includes(filters.q.toLowerCase())
    );
    if (filters.party) r = r.filter(c => c.partyId === filters.party);
    if (filters.state) r = r.filter(c => c.state === filters.state);
    if (filters.gender) r = r.filter(c => c.gender === filters.gender);
    setFiltered(r);
  }, [filters, all]);

  const toggleCompare = (c) => {
    setCompare(prev =>
      prev.find(x => x.id === c.id)
        ? prev.filter(x => x.id !== c.id)
        : prev.length < 3 ? [...prev, c] : prev
    );
  };

  const states  = [...new Set(all.map(c => c.state))];
  const parties = [...new Map(all.map(c => [c.partyId, { id:c.partyId, name:c.party }])).values()];

  return (
    <div style={{paddingTop:62, minHeight:'100vh', background:'var(--ivory)'}}>

      {/* Header */}
      <div className="page-top">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Candidates</div>
          <h1 style={{fontSize:'1.75rem', fontWeight:800, marginBottom:6}}>All Candidates</h1>
          <p style={{color:'var(--muted)', fontSize:'.875rem'}}>Browse and research candidates. Click any card to view the full profile.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px'}}>
        <div style={{display:'flex', gap:20, alignItems:'flex-start'}}>

          {/* Filter sidebar */}
          <div style={{width:200, flexShrink:0}}>
            <div className="card" style={{padding:18, position:'sticky', top:80}}>
              <h3 style={{fontWeight:700, fontSize:'.875rem', marginBottom:14, color:'var(--ink)'}}>Filters</h3>
              {[
                { label:'Party', key:'party', opts: parties.map(p => ({v:p.id, l:p.name})) },
                { label:'State', key:'state', opts: states.map(s => ({v:s, l:s})) },
                { label:'Gender', key:'gender', opts: [{v:'Male',l:'Male'},{v:'Female',l:'Female'}] },
              ].map(f => (
                <div key={f.key} style={{marginBottom:12}}>
                  <label style={{fontSize:'.75rem', fontWeight:600, color:'var(--muted)', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'.04em'}}>{f.label}</label>
                  <select className="form-select" style={{fontSize:'.82rem', padding:'8px 10px'}}
                    value={filters[f.key]} onChange={e => setFilters(p => ({...p, [f.key]:e.target.value}))}>
                    <option value="">All {f.label}s</option>
                    {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
              {(filters.party || filters.state || filters.gender || filters.q) && (
                <button className="btn btn-outline" style={{width:'100%', justifyContent:'center', fontSize:'.8rem', padding:'8px'}}
                  onClick={() => setFilters({party:'',state:'',gender:'',q:''})}>
                  Clear All ✕
                </button>
              )}
            </div>
          </div>

          {/* Main list */}
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
              <div style={{flex:1, position:'relative', minWidth:200}}>
                <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--light)'}}>🔍</span>
                <input className="form-input" style={{paddingLeft:36}} placeholder="Search by name, party, constituency..."
                  value={filters.q} onChange={e => setFilters(f => ({...f, q:e.target.value}))}/>
              </div>
              {compare.length > 0 && (
                <button className="btn btn-coral" onClick={() => setShowCompare(true)}>
                  Compare ({compare.length}) →
                </button>
              )}
              <span style={{fontSize:'.82rem', color:'var(--muted)', flexShrink:0}}>
                <strong style={{color:'var(--ink)'}}>{filtered.length}</strong> results
              </span>
            </div>

            {loading ? <div className="spinner"/> : (
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {filtered.map(c => {
                  const col = P_COLORS[c.partyId] || 'var(--sage)';
                  const inCmp = compare.find(x => x.id === c.id);
                  return (
                    <div key={c.id} className="card" style={{display:'flex', alignItems:'center', overflow:'hidden', transition:'var(--t)'}}>
                      <div style={{width:4, alignSelf:'stretch', background:col, flexShrink:0}}/>
                      {/* Photo */}
                      <div style={{
                        width:58, height:58, borderRadius:'50%',
                        background:`${col}15`, border:`2px solid ${col}30`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'1.5rem', margin:'14px 14px 14px 16px', flexShrink:0,
                      }}>👤</div>
                      {/* Info */}
                      <div style={{flex:1, padding:'14px 0', minWidth:0}}>
                        <div style={{display:'flex', alignItems:'center', gap:7, marginBottom:5, flexWrap:'wrap'}}>
                          <span style={{fontWeight:700, fontSize:'1rem'}}>{c.name}</span>
                          <span className="badge badge-sage" style={{fontSize:'.68rem'}}>✓ Verified</span>
                          {c.criminalCases > 0 && <span className="badge badge-coral" style={{fontSize:'.68rem'}}>⚠️ {c.criminalCases} case(s)</span>}
                        </div>
                        <div style={{fontSize:'.8rem', color:'var(--muted)', marginBottom:5}}>
                          <span className="badge" style={{background:`${col}12`,color:col,fontSize:'.7rem',marginRight:6}}>{c.party}</span>
                          📍 {c.constituency}, {c.state}
                        </div>
                        <div style={{display:'flex', gap:16, fontSize:'.75rem', color:'var(--light)', flexWrap:'wrap'}}>
                          <span>🎓 {c.education}</span>
                          <span>💰 {c.assets}</span>
                          {c.attendance > 0 && <span style={{color: c.attendance>=75?'var(--done-c)':'var(--att-c)'}}>📊 {c.attendance}% attendance</span>}
                        </div>
                      </div>
                      {/* Actions */}
                      <div style={{padding:'14px 14px 14px 10px', display:'flex', flexDirection:'column', gap:7, flexShrink:0}}>
                        <Link to={`/candidates/${c.id}`} className="btn btn-dark btn-sm" style={{justifyContent:'center'}}>
                          View Profile
                        </Link>
                        <button onClick={() => toggleCompare(c)} className="btn btn-sm" style={{
                          justifyContent:'center',
                          background: inCmp ? 'var(--coral-lt)' : 'var(--cream)',
                          color: inCmp ? 'var(--coral)' : 'var(--ink)',
                          border: `1px solid ${inCmp ? 'rgba(232,116,97,.3)' : 'var(--border)'}`,
                          cursor: !inCmp && compare.length >= 3 ? 'not-allowed' : 'pointer',
                        }}>
                          {inCmp ? '✓ Added' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div style={{textAlign:'center', padding:'60px 0', color:'var(--muted)'}}>
                <div style={{fontSize:'2.5rem', marginBottom:12}}>🔍</div>
                <p style={{fontWeight:600, fontSize:'1rem', color:'var(--ink)'}}>No candidates found</p>
                <p style={{fontSize:'.875rem', marginTop:4}}>Try adjusting filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {showCompare && compare.length > 0 && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(31,41,55,.5)', zIndex:2000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} onClick={e => e.target === e.currentTarget && setShowCompare(false)}>
          <div style={{
            background:'var(--card)', borderRadius:16, padding:28,
            width:'100%', maxWidth:820, maxHeight:'85vh', overflowY:'auto',
            boxShadow:'var(--sh-lg)',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
              <h2 style={{fontWeight:800, fontSize:'1.2rem'}}>Compare Candidates</h2>
              <button onClick={() => setShowCompare(false)} style={{
                background:'var(--cream)', border:'1px solid var(--border)', borderRadius:8,
                padding:'6px 12px', cursor:'pointer', fontWeight:600, fontSize:'.85rem',
              }}>✕ Close</button>
            </div>
            {/* Headers */}
            <div style={{display:'grid', gridTemplateColumns:`200px repeat(${compare.length},1fr)`, marginBottom:0}}>
              <div/>
              {compare.map(c => {
                const col = P_COLORS[c.partyId]||'var(--sage)';
                return (
                  <div key={c.id} style={{textAlign:'center', padding:'12px 8px', borderBottom:`2px solid ${col}`}}>
                    <div style={{width:48,height:48,borderRadius:'50%',background:`${col}15`,margin:'0 auto 8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>👤</div>
                    <div style={{fontWeight:700, fontSize:'.875rem', marginBottom:2}}>{c.name}</div>
                    <div style={{fontSize:'.72rem', color:'var(--muted)', marginBottom:5}}>{c.party}</div>
                    <button onClick={() => setCompare(p => p.filter(x => x.id !== c.id))} style={{fontSize:'.72rem', color:'var(--att-c)', background:'none', border:'none', cursor:'pointer'}}>Remove</button>
                  </div>
                );
              })}
            </div>
            {/* Rows */}
            {[
              {l:'Education', fn: c => c.education},
              {l:'Criminal Cases', fn: c => c.criminalCases === 0 ? '✅ None' : `⚠️ ${c.criminalCases}`, warn: true},
              {l:'Net Assets', fn: c => c.netAssets},
              {l:'Experience', fn: c => c.experience},
              {l:'Attendance', fn: c => c.attendance > 0 ? `${c.attendance}%` : 'First-timer'},
              {l:'Win Probability', fn: c => `${c.winProbability}%`},
              {l:'Public Rating', fn: c => `${c.publicRating}/5`},
              {l:'Constituency', fn: c => c.constituency},
            ].map((row, ri) => (
              <div key={row.l} style={{
                display:'grid', gridTemplateColumns:`200px repeat(${compare.length},1fr)`,
                background: ri%2===0 ? 'var(--ivory)' : 'var(--card)',
                borderTop:'1px solid var(--border)',
              }}>
                <div style={{padding:'12px 14px', fontWeight:600, fontSize:'.83rem', color:'var(--muted)'}}>{row.l}</div>
                {compare.map(c => (
                  <div key={c.id} style={{padding:'12px 14px', textAlign:'center', fontSize:'.83rem', color:'var(--ink-2)', borderLeft:'1px solid var(--border)'}}>
                    {row.fn(c)}
                  </div>
                ))}
              </div>
            ))}
            <div style={{textAlign:'center', marginTop:16}}>
              <button className="btn btn-outline" style={{gap:6}}>⬇ Download Comparison</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
