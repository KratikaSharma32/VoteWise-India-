import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PARTY_COL = p => {
  if (p.includes('BJP'))   return { bg:'#FEF3E2', c:'#D97706' };
  if (p.includes('INC'))   return { bg:'#F0FDF4', c:'#16A34A' };
  if (p.includes('TMC'))   return { bg:'#EFF6FF', c:'#2563EB' };
  if (p.includes('AIMIM')) return { bg:'#F5F3FF', c:'#7C3AED' };
  if (p.includes('Shiv'))  return { bg:'#FEF3E2', c:'#D97706' };
  return { bg:'var(--cream)', c:'var(--muted)' };
};

const INDICATORS = [
  { key:'literacy',       label:'Education',      icon:'📚', color:'var(--sage)' },
  { key:'healthcare',     label:'Healthcare',     icon:'🏥', color:'var(--saffron)' },
  { key:'infrastructure', label:'Infrastructure', icon:'🏗️', color:'var(--gold)' },
  { key:'environment',    label:'Environment',    icon:'🌿', color:'#59A96A' },
];

function IndicatorDrill({ con, indicator, onClose }) {
  const val   = indicator.key === 'literacy' ? con.literacy
               : indicator.key === 'healthcare' ? Math.round(con.literacy * 0.75)
               : indicator.key === 'infrastructure' ? Math.round(con.literacy * 0.85)
               : Math.round(con.literacy * 0.65);

  const DATA_MOCK = {
    literacy:       { headline:`${con.literacy}% literacy rate`, trend:'↑ +3.2% since 2019', national:'National avg: 77.7%', insight:'Literacy in this constituency is above the national average. Government schools have seen improved pass rates over the last 3 years.', schemes:['PM Poshan (Mid-Day Meal)','Beti Bachao Beti Padhao','Samagra Shiksha Abhiyan'], history:[72,74,76,78,con.literacy] },
    healthcare:     { headline:`${Math.round(con.literacy*.75)}% healthcare access`, trend:'↑ +5.1% since 2019', national:'National avg: 60%', insight:'Primary healthcare coverage has improved due to Ayushman Bharat and PMJAY. Mobile health units are active in rural pockets.', schemes:['Ayushman Bharat PM-JAY','National Health Mission','Pradhan Mantri Surakshit Matritva Abhiyan'], history:[52,55,58,61,Math.round(con.literacy*.75)] },
    infrastructure: { headline:`${Math.round(con.literacy*.85)}% infra development`, trend:'↑ +8.4% since 2019', national:'National avg: 65%', insight:'Road connectivity under PM Gram Sadak Yojana has reached 94% of villages. Piped water supply expanded to 78% of households.', schemes:['PM Gram Sadak Yojana','Jal Jeevan Mission','Smart Cities Mission'], history:[60,64,67,71,Math.round(con.literacy*.85)] },
    environment:    { headline:`${Math.round(con.literacy*.65)}% environment index`, trend:'↓ -1.2% since 2019', national:'National avg: 55%', insight:'Air quality has declined due to industrial expansion. Wetland preservation is flagged as a concern by NGT. Tree cover improved marginally.', schemes:['National Clean Air Programme','CAMPA Fund','Green India Mission'], history:[68,66,64,63,Math.round(con.literacy*.65)] },
  };
  const d = DATA_MOCK[indicator.key];

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(31,41,55,.5)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{background:'var(--card)',borderRadius:16,padding:28,width:'100%',maxWidth:600,maxHeight:'85vh',overflowY:'auto',boxShadow:'var(--sh-lg)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'1.5rem'}}>{indicator.icon}</span>
            <div>
              <h2 style={{fontWeight:800,fontSize:'1.1rem'}}>{indicator.label} Dashboard</h2>
              <div style={{fontSize:'.8rem',color:'var(--muted)'}}>{con.name}, {con.state}</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:'var(--cream)',border:'1px solid var(--border)',borderRadius:8,padding:'6px 12px',cursor:'pointer',fontWeight:600,fontSize:'.85rem'}}>✕</button>
        </div>

        {/* Score hero */}
        <div style={{background:'var(--beige)',borderRadius:12,padding:20,marginBottom:20,textAlign:'center'}}>
          <div style={{fontSize:'3rem',fontWeight:800,color:indicator.color,lineHeight:1}}>{val}%</div>
          <div style={{fontSize:'.85rem',fontWeight:600,color:'var(--ink)',marginTop:4}}>{d.headline}</div>
          <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:10}}>
            <span style={{fontSize:'.78rem',color:d.trend.startsWith('↑')?'var(--done-c)':'var(--att-c)',fontWeight:600}}>{d.trend}</span>
            <span style={{fontSize:'.78rem',color:'var(--muted)'}}>|</span>
            <span style={{fontSize:'.78rem',color:'var(--muted)'}}>{d.national}</span>
          </div>
        </div>

        {/* Trend chart */}
        <div style={{marginBottom:20}}>
          <h4 style={{fontWeight:700,fontSize:'.85rem',marginBottom:12}}>Historical Trend (2015–2024)</h4>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80,background:'var(--ivory)',borderRadius:10,padding:'12px 16px 0'}}>
            {d.history.map((v,i) => (
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{width:'100%',background: i===d.history.length-1 ? indicator.color : `${indicator.color}50`,borderRadius:'3px 3px 0 0',height:`${(v/100)*68}px`,transition:'height .5s ease'}}/>
                <span style={{fontSize:'.6rem',color:'var(--muted)'}}>{2015+i*2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div style={{background:'var(--mint-bg)',border:'1px solid rgba(168,184,138,.3)',borderRadius:10,padding:16,marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <span>🤖</span>
            <span style={{fontWeight:700,fontSize:'.83rem',color:'var(--done-c)'}}>AI Insight</span>
          </div>
          <p style={{fontSize:'.83rem',lineHeight:1.7,color:'var(--ink-2)'}}>{d.insight}</p>
        </div>

        {/* Government Schemes */}
        <div>
          <h4 style={{fontWeight:700,fontSize:'.85rem',marginBottom:10}}>Active Government Schemes</h4>
          {d.schemes.map((s,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom: i<d.schemes.length-1?'1px solid var(--border)':'none'}}>
              <span style={{fontSize:'.9rem'}}>📋</span>
              <span style={{fontSize:'.83rem',color:'var(--ink-2)'}}>{s}</span>
              <span className="badge badge-sage" style={{marginLeft:'auto',fontSize:'.68rem'}}>Active</span>
            </div>
          ))}
        </div>

        <div style={{marginTop:14,padding:10,background:'var(--saffron-lt)',borderRadius:8,fontSize:'.75rem',color:'#6B4A12'}}>
          📋 Source: Census 2011, NITI Aayog District SDG Index, Government scheme dashboards. AI insights are research-generated.
        </div>
      </div>
    </div>
  );
}

export default function Constituency() {
  const [all, setAll]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [stateF, setStateF]   = useState('');
  const [expanded, setExpanded] = useState(null);
  const [drill, setDrill]     = useState(null); // {con, indicator}

  useEffect(() => {
    axios.get('/api/constituency').then(r => { setAll(r.data.data); setFiltered(r.data.data); setLoading(false); });
  }, []);

  useEffect(() => {
    let r = [...all];
    if (search) r = r.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.currentMP.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
    );
    if (stateF) r = r.filter(c => c.state === stateF);
    setFiltered(r);
  }, [search, stateF, all]);

  const states = [...new Set(all.map(c => c.state))];

  return (
    <div style={{paddingTop:62,minHeight:'100vh',background:'var(--cream)'}}>
      <div className="page-top" style={{background:'var(--card)'}}>
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Constituencies</div>
          <h1 style={{fontSize:'1.75rem',fontWeight:800,marginBottom:6}}>Constituency Explorer</h1>
          <p style={{color:'var(--muted)',fontSize:'.875rem'}}>Explore demographics, development indicators, and election history. Click any metric to drill deeper.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px'}}>
        <div className="alert-warn" style={{marginBottom:20}}>
          ⚠️ Sample data for demonstration. Visit <strong>eci.gov.in</strong> for official constituency data.
        </div>

        {/* Search */}
        <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:'1 1 280px'}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--light)'}}>🔍</span>
            <input className="form-input" style={{paddingLeft:36}} placeholder="Search constituency, MP or state..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <select className="form-select" style={{width:180}} value={stateF} onChange={e => setStateF(e.target.value)}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{display:'flex',alignItems:'center',fontSize:'.83rem',color:'var(--muted)',marginLeft:'auto'}}>
            <strong style={{color:'var(--ink)',marginRight:4}}>{filtered.length}</strong> constituencies
          </div>
        </div>

        {loading ? <div className="spinner"/> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:20}}>
            {filtered.map(con => {
              const badge  = PARTY_COL(con.currentParty);
              const isExp  = expanded === con.id;
              const indicators = INDICATORS.map(ind => ({
                ...ind,
                val: ind.key==='literacy' ? con.literacy
                   : ind.key==='healthcare' ? Math.round(con.literacy*.75)
                   : ind.key==='infrastructure' ? Math.round(con.literacy*.85)
                   : Math.round(con.literacy*.65),
              }));

              return (
                <div key={con.id} className="card" style={{
                  border: isExp ? '2px solid var(--sage)' : '1px solid var(--border)',
                  overflow:'hidden',
                }}>
                  <div style={{padding:22}}>
                    {/* Top row */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                      <div>
                        <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:6}}>{con.name}</h3>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                          <span className="badge badge-sage" style={{fontSize:'.68rem'}}>{con.type}</span>
                          <span className="badge badge-gray" style={{fontSize:'.68rem'}}>{con.state}</span>
                          <span className="badge badge-gray" style={{fontSize:'.68rem'}}>{con.urbanRural}</span>
                        </div>
                      </div>
                      <span className="badge" style={{background:badge.bg,color:badge.c,fontSize:'.72rem',flexShrink:0}}>{con.currentParty}</span>
                    </div>

                    {/* Current MP */}
                    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--mint-bg)',borderRadius:8,marginBottom:14}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:'var(--sage)',opacity:.7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>👤</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:'.875rem'}}>{con.currentMP}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)'}}>Current Representative</div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                      {[
                        {l:'Voters',v:(con.voters/100000).toFixed(1)+'L'},
                        {l:'Turnout',v:con.turnout2019+'%'},
                        {l:'Literacy',v:con.literacy+'%'},
                      ].map(s => (
                        <div key={s.l} style={{textAlign:'center',padding:'9px 6px',background:'var(--ivory)',borderRadius:8}}>
                          <div style={{fontWeight:700,fontSize:'.95rem',color:'var(--ink)'}}>{s.v}</div>
                          <div style={{fontSize:'.65rem',color:'var(--muted)',marginTop:2}}>{s.l}</div>
                        </div>
                      ))}
                    </div>

                    {/* Turnout bar */}
                    <div style={{marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'.72rem',color:'var(--muted)',marginBottom:4}}>
                        <span>2019 Voter Turnout</span><span style={{fontWeight:600}}>{con.turnout2019}%</span>
                      </div>
                      <div className="prog"><div className="prog-bar" style={{width:`${con.turnout2019}%`,background:'var(--sage)'}}/></div>
                    </div>

                    {/* ── INTERACTIVE DEVELOPMENT INDICATORS ── */}
                    <div>
                      <div style={{fontSize:'.72rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>
                        Development Indicators — <span style={{color:'var(--coral)',fontWeight:600}}>click to explore</span>
                      </div>
                      {indicators.map(ind => (
                        <div key={ind.key}
                          onClick={() => setDrill({con,indicator:ind})}
                          style={{
                            display:'flex',alignItems:'center',gap:10,
                            marginBottom:8,padding:'6px 10px',
                            borderRadius:8,cursor:'pointer',
                            border:'1px solid transparent',
                            transition:'var(--t)',
                          }}
                          onMouseEnter={e => {e.currentTarget.style.background='var(--cream)';e.currentTarget.style.borderColor='var(--border)';}}
                          onMouseLeave={e => {e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='transparent';}}
                        >
                          <span style={{fontSize:'.9rem',width:20,textAlign:'center',flexShrink:0}}>{ind.icon}</span>
                          <span style={{fontSize:'.78rem',color:'var(--ink-2)',width:88,flexShrink:0}}>{ind.label}</span>
                          <div className="prog" style={{flex:1,height:6}}>
                            <div className="prog-bar" style={{width:`${ind.val}%`,background:ind.color}}/>
                          </div>
                          <span style={{fontSize:'.72rem',fontWeight:700,color:ind.color,width:32,textAlign:'right',flexShrink:0}}>{ind.val}%</span>
                          <span style={{fontSize:'.7rem',color:'var(--light)'}}>›</span>
                        </div>
                      ))}
                    </div>

                    {/* Expanded details */}
                    {isExp && (
                      <div style={{marginTop:14,borderTop:'1px solid var(--border)',paddingTop:14,animation:'fadeUp .3s ease'}}>
                        <h4 style={{fontWeight:700,fontSize:'.83rem',marginBottom:10}}>Constituency Details</h4>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                          {[
                            {l:'Population',v:con.population.toLocaleString('en-IN')},
                            {l:'Area',v:con.area},
                            {l:'Polling Stations',v:con.pollingStations.toLocaleString()},
                            {l:'Reservation',v:con.reservationCategory},
                            {l:'Districts',v:con.districts?.join(', ')},
                          ].map(x => (
                            <div key={x.l} style={{padding:'8px 10px',background:'var(--ivory)',borderRadius:7}}>
                              <div style={{fontSize:'.65rem',color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}}>{x.l}</div>
                              <div style={{fontSize:'.82rem',fontWeight:500,marginTop:2,color:'var(--ink-2)'}}>{x.v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => setExpanded(isExp ? null : con.id)}
                      style={{marginTop:12,fontSize:'.72rem',color:'var(--muted)',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'right',padding:0}}>
                      {isExp ? '↑ Less info' : '↓ More details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:12}}>🗺️</div>
            <p style={{fontWeight:600,fontSize:'1rem',color:'var(--ink)'}}>No constituencies found</p>
          </div>
        )}
      </div>

      {/* Drill-down modal */}
      {drill && (
        <IndicatorDrill con={drill.con} indicator={drill.indicator} onClose={() => setDrill(null)}/>
      )}
    </div>
  );
}
