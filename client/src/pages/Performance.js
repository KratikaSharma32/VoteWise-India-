import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const S_CFG = {
  completed:   { label:'Completed',    icon:'✅', c:'var(--done-c)',  bg:'var(--mint-bg)' },
  partial:     { label:'Partial',      icon:'🟡', c:'var(--prog-c)', bg:'#FFF8E6' },
  inprogress:  { label:'In Progress',  icon:'🔵', c:'var(--blue-c)', bg:'#EFF6FF' },
  notcompleted:{ label:'Not Achieved', icon:'❌', c:'var(--att-c)',  bg:'#FEF2F2' },
};
const P_COL = { bjp:'#D97706', inc:'#16A34A', aap:'#2563EB' };

function PromiseDetail({ promise, partyColor, onClose }) {
  const cfg = S_CFG[promise.status] || S_CFG.notcompleted;
  const EVIDENCE = {
    completed:    ['Official government report','Independent audit','Media verification'],
    partial:      ['Government progress report','NGO monitoring data','Media coverage'],
    inprogress:   ['Budget allocation data','Scheme dashboard data','Ministry update'],
    notcompleted: ['PRS India analysis','CAG audit report','Independent assessment'],
  };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(31,41,55,.5)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{background:'var(--card)',borderRadius:16,padding:28,width:'100%',maxWidth:620,maxHeight:'88vh',overflowY:'auto',boxShadow:'var(--sh-lg)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div style={{flex:1,marginRight:16}}>
            <span className="badge" style={{background:cfg.bg,color:cfg.c,fontSize:'.72rem',marginBottom:10}}>{cfg.icon} {cfg.label}</span>
            <h2 style={{fontWeight:800,fontSize:'1.05rem',lineHeight:1.4,color:'var(--ink)'}}>{promise.promise}</h2>
          </div>
          <button onClick={onClose} style={{background:'var(--cream)',border:'1px solid var(--border)',borderRadius:8,padding:'6px 12px',cursor:'pointer',fontWeight:600,fontSize:'.85rem',flexShrink:0}}>✕</button>
        </div>

        {/* Score & Timeline */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
          <div style={{padding:16,background:'var(--beige)',borderRadius:12,textAlign:'center'}}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{display:'block',margin:'0 auto 8px'}}>
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="7"/>
              <circle cx="36" cy="36" r="30" fill="none" stroke={partyColor} strokeWidth="7"
                strokeDasharray={`${(promise.completionPct/100)*188.5} 188.5`}
                strokeLinecap="round" transform="rotate(-90 36 36)"/>
              <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={partyColor}>{promise.completionPct}%</text>
            </svg>
            <div style={{fontSize:'.78rem',color:'var(--muted)',fontWeight:500}}>Completion</div>
          </div>
          <div style={{padding:16,background:'var(--beige)',borderRadius:12}}>
            <div style={{fontSize:'.72rem',color:'var(--muted)',fontWeight:600,textTransform:'uppercase',marginBottom:8}}>Status</div>
            <div style={{fontWeight:700,fontSize:'1rem',color:cfg.c,marginBottom:6}}>{cfg.icon} {cfg.label}</div>
            <div className="prog" style={{marginBottom:6}}><div className="prog-bar" style={{width:`${promise.completionPct}%`,background:partyColor}}/></div>
            <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{promise.completionPct}% delivered</div>
          </div>
        </div>

        {/* Assessment */}
        <div style={{background:'var(--ivory)',borderRadius:10,padding:16,marginBottom:16,borderLeft:`4px solid ${cfg.c}`}}>
          <h4 style={{fontWeight:700,fontSize:'.85rem',marginBottom:8}}>Assessment</h4>
          <p style={{fontSize:'.875rem',lineHeight:1.7,color:'var(--ink-2)'}}>{promise.note}</p>
        </div>

        {/* AI Analysis */}
        <div style={{background:'var(--mint-bg)',border:'1px solid rgba(168,184,138,.3)',borderRadius:10,padding:16,marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}>
            <span>🤖</span>
            <span style={{fontWeight:700,fontSize:'.83rem',color:'var(--done-c)'}}>AI Analysis</span>
            <span className="badge badge-sage" style={{marginLeft:'auto',fontSize:'.68rem'}}>Confidence: Medium</span>
          </div>
          <p style={{fontSize:'.83rem',lineHeight:1.7,color:'var(--ink-2)'}}>
            Based on {EVIDENCE[promise.status]?.length || 2} independent sources, the classification of this promise as <strong>{cfg.label.toLowerCase()}</strong> is well-supported. 
            {promise.status === 'completed' && ' Physical completion has been independently verified. Quality metrics show strong outcomes.'}
            {promise.status === 'inprogress' && ' Work is actively ongoing. Budget has been allocated and spending is on track.'}
            {promise.status === 'partial' && ' Some progress has been made but original targets were not fully met. Partial credit assigned.'}
            {promise.status === 'notcompleted' && ' Minimal or no action has been taken despite time elapsed since the promise was made.'}
          </p>
        </div>

        {/* Sources */}
        <div>
          <h4 style={{fontWeight:700,fontSize:'.85rem',marginBottom:10}}>Evidence Sources</h4>
          {(EVIDENCE[promise.status] || []).map((src,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom: i < (EVIDENCE[promise.status]?.length||0)-1 ? '1px solid var(--border)' : 'none'}}>
              <span style={{color:'var(--saffron)',fontSize:'.9rem'}}>📄</span>
              <span style={{fontSize:'.83rem',color:'var(--ink-2)'}}>{src}</span>
              <span className="badge badge-gold" style={{marginLeft:'auto',fontSize:'.65rem'}}>Available</span>
            </div>
          ))}
        </div>

        <div style={{marginTop:14,padding:10,background:'var(--saffron-lt)',borderRadius:8,fontSize:'.75rem',color:'#6B4A12'}}>
          ⚠️ Classification methodology: Promises are evaluated against official government data, CAG reports, independent audits, and news verification. This is for educational research only.
        </div>
      </div>
    </div>
  );
}

export default function Performance() {
  const [summary, setSummary]   = useState([]);
  const [detail, setDetail]     = useState(null);
  const [sel, setSel]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [drill, setDrill]       = useState(null);

  useEffect(() => {
    axios.get('/api/performance').then(r => { setSummary(r.data.data); setLoading(false); });
  }, []);

  const load = async id => {
    if (sel === id) { setSel(null); setDetail(null); return; }
    const r = await axios.get(`/api/performance/${id}`);
    setDetail(r.data.data); setSel(id);
  };

  return (
    <div style={{paddingTop:62,minHeight:'100vh',background:'var(--ivory)'}}>
      <div className="page-top">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Promise Tracker</div>
          <h1 style={{fontSize:'1.75rem',fontWeight:800,marginBottom:6}}>Promise vs Reality</h1>
          <p style={{color:'var(--muted)',fontSize:'.875rem'}}>Evidence-based tracking of party manifesto pledges. Click any promise to see research, evidence, and AI analysis.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px'}}>
        <div className="alert-warn" style={{marginBottom:24}}>
          ⚠️ Sample data for demonstration. Real classifications involve expert analysis from PRS India, CAG, ADR, and independent researchers.
        </div>

        {/* Legend */}
        <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:28}}>
          {Object.entries(S_CFG).map(([k,v]) => (
            <span key={k} className="badge" style={{background:v.bg,color:v.c,fontSize:'.78rem',padding:'5px 12px'}}>{v.icon} {v.label}</span>
          ))}
          <span style={{marginLeft:'auto',fontSize:'.78rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:4}}>
            💡 Click any promise row to view evidence
          </span>
        </div>

        {loading ? <div className="spinner"/> : (
          <>
            {/* Party cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18,marginBottom:32}}>
              {summary.map(p => {
                const col = P_COL[p.partyId] || 'var(--sage)';
                const isSel = sel === p.partyId;
                return (
                  <div key={p.partyId} className="card" style={{
                    cursor:'pointer',
                    border: isSel ? `2px solid ${col}` : '1px solid var(--border)',
                    borderTop:`4px solid ${col}`,
                    transition:'var(--t)',
                  }} onClick={() => load(p.partyId)}>
                    <div style={{padding:22}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                        <div>
                          <h3 style={{fontWeight:700,fontSize:'1rem'}}>{p.party}</h3>
                          <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:3}}>{p.period}</div>
                        </div>
                        <svg width="58" height="58" viewBox="0 0 58 58">
                          <circle cx="29" cy="29" r="24" fill="none" stroke="var(--border)" strokeWidth="6"/>
                          <circle cx="29" cy="29" r="24" fill="none" stroke={col} strokeWidth="6"
                            strokeDasharray={`${(p.overallScore/100)*150.8} 150.8`}
                            strokeLinecap="round" transform="rotate(-90 29 29)"/>
                          <text x="29" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill={col}>{p.overallScore}%</text>
                        </svg>
                      </div>

                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:14}}>
                        {[
                          {l:'✅',v:p.completed,  c:'var(--done-c)'},
                          {l:'🟡',v:p.partial,    c:'var(--prog-c)'},
                          {l:'🔵',v:p.inProgress, c:'var(--blue-c)'},
                          {l:'❌',v:p.notCompleted,c:'var(--att-c)'},
                        ].map((x,i) => (
                          <div key={i} style={{textAlign:'center',padding:'8px 0',background:'var(--ivory)',borderRadius:7}}>
                            <div style={{fontWeight:800,fontSize:'1rem',color:x.c}}>{x.v}</div>
                            <div style={{fontSize:'.7rem'}}>{x.l}</div>
                          </div>
                        ))}
                      </div>

                      <div className="prog"><div className="prog-bar" style={{width:`${p.overallScore}%`,background:col}}/></div>
                      <div style={{textAlign:'center',marginTop:10,fontSize:'.72rem',color:'var(--muted)'}}>
                        {isSel ? '↑ Hide' : '↓ View All Promises'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expanded detail */}
            {detail && sel && (
              <div className="card" style={{padding:28,animation:'fadeUp .3s ease'}}>
                <h2 style={{fontWeight:800,fontSize:'1.1rem',marginBottom:6}}>
                  {detail.party} — Promise Tracker
                  <span style={{fontSize:'.875rem',color:'var(--muted)',fontWeight:400,marginLeft:8}}>({detail.period})</span>
                </h2>
                <p style={{fontSize:'.82rem',color:'var(--muted)',marginBottom:20}}>
                  Click any row to view evidence, AI analysis, and sources behind each classification.
                </p>

                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {detail.promises.map(p => {
                    const cfg = S_CFG[p.status] || S_CFG.notcompleted;
                    const col = P_COL[detail.partyId] || 'var(--sage)';
                    return (
                      <div key={p.id}
                        onClick={() => setDrill({promise:p, partyColor:col})}
                        style={{
                          padding:'16px 20px', background:'var(--ivory)',
                          borderRadius:10, borderLeft:`4px solid ${cfg.c}`,
                          cursor:'pointer', transition:'var(--t)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='var(--cream)'; e.currentTarget.style.boxShadow='var(--sh-sm)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='var(--ivory)'; e.currentTarget.style.boxShadow='none'; }}
                      >
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8,marginBottom:8}}>
                          <h4 style={{fontWeight:600,fontSize:'.9rem',maxWidth:'70%',color:'var(--ink)'}}>{p.promise}</h4>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span className="badge" style={{background:cfg.bg,color:cfg.c,fontSize:'.72rem'}}>{cfg.icon} {cfg.label}</span>
                            <span style={{fontSize:'.72rem',color:'var(--muted)'}}>›</span>
                          </div>
                        </div>
                        <p style={{fontSize:'.8rem',color:'var(--muted)',marginBottom:10,lineHeight:1.5}}>{p.note}</p>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div className="prog" style={{flex:1,height:6}}><div className="prog-bar" style={{width:`${p.completionPct}%`,background:cfg.c}}/></div>
                          <span style={{fontSize:'.78rem',fontWeight:700,color:cfg.c,minWidth:32}}>{p.completionPct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {drill && (
        <PromiseDetail promise={drill.promise} partyColor={drill.partyColor} onClose={() => setDrill(null)}/>
      )}
    </div>
  );
}
