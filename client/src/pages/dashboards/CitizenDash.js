import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DashNav from '../../components/DashNav';
import { useAuth } from '../../context/AuthContext';

const PARTY_DATA = [
  {name:'INC',pct:42,color:'#16A34A'},{name:'BJP',pct:38,color:'#D97706'},
  {name:'AAP',pct:10,color:'#2563EB'},{name:'Others',pct:10,color:'var(--muted)'},
];
const TREND=[20,30,25,45,55,70];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
const SAVED=[
  {id:'c001',name:'Rajesh Kumar Sharma',party:'BJP', con:'New Delhi'},
  {id:'c006',name:'Ananya Chakraborty',  party:'TMC',con:'Kolkata North'},
  {id:'c008',name:'Meera Patil Deshmukh',party:'INC',con:'Mumbai South'},
  {id:'c004',name:'Sunita Devi Yadav',   party:'SP', con:'Lucknow'},
];
const NOTIFICATIONS=[
  {msg:'Candidate Arjun Patel profile updated & verified',type:'info', time:'2 hrs ago', unread:true},
  {msg:'New constituency data available for Delhi',      type:'info', time:'5 hrs ago', unread:true},
  {msg:'Your report on EVM data was reviewed by admin',  type:'check',time:'1 day ago', unread:true},
  {msg:'Promise tracker updated: AAP Yamuna cleanup',    type:'info', time:'2 days ago',unread:false},
];
const AI_HISTORY=[
  {q:'Which candidate has best education?',     a:'Meera Patil Deshmukh (MBBS+MD) ranks highest.',time:'Today'},
  {q:'Who has zero criminal cases?',            a:'6 out of 8 tracked candidates have zero cases.',time:'Yesterday'},
  {q:'Compare BJP and Congress performance',    a:'BJP delivered 71%, INC delivered 58% of promises.',time:'2 days ago'},
];
const REPORTS=[
  {title:'Candidate Comparison — New Delhi',created:'15 May 2024',status:'Saved'},
  {title:'Development Analysis — Bangalore Central',created:'10 May 2024',status:'Saved'},
];
const TRACKED_PROMISES=[
  {party:'BJP',promise:'PM Awaas — 10 crore houses',pct:72,status:'inprogress'},
  {party:'AAP',promise:'Yamuna cleanup by 2025',     pct:20,status:'notcompleted'},
  {party:'INC',promise:'Food Security Act',           pct:100,status:'completed'},
];

const TABS=[
  {id:'overview',     label:'Dashboard'},
  {id:'saved',        label:'Saved Candidates'},
  {id:'promises',     label:'Tracked Promises'},
  {id:'notifications',label:'Notifications'},
  {id:'ai-history',   label:'AI Research History'},
  {id:'reports',      label:'My Reports'},
  {id:'settings',     label:'Settings'},
];

function Section({title,children,action}){
  return(
    <div className="card" style={{padding:22,marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
        <h3 style={{fontWeight:700,fontSize:'.95rem'}}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function CitizenDash(){
  const {user}=useAuth();
  const [tab,setTab]=useState('overview');

  return(
    <div className="dash-layout">
      <Sidebar/>
      <div className="dash-main">
        <DashNav/>
        {/* Tab bar */}
        <div style={{background:'var(--card)',borderBottom:'1px solid var(--border)',overflowX:'auto'}}>
          <div style={{display:'flex',minWidth:'max-content'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'13px 18px',border:'none',borderBottom:`2px solid ${tab===t.id?'var(--coral)':'transparent'}`,
                background:'transparent',fontSize:'.83rem',fontWeight:tab===t.id?600:400,
                color:tab===t.id?'var(--coral)':'var(--muted)',cursor:'pointer',whiteSpace:'nowrap',
                transition:'var(--t)',fontFamily:'inherit',
              }}>
                {t.label}
                {t.id==='notifications'&&<span style={{marginLeft:5,background:'var(--coral)',color:'#fff',borderRadius:10,padding:'1px 6px',fontSize:'.62rem'}}>3</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-body">

          {/* OVERVIEW */}
          {tab==='overview'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:3}}>Dashboard Overview</h1>
              <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:20}}>Welcome back, {user?.fullName}!</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:20}}>
                {[
                  {icon:'🔖',label:'Saved Candidates',val:SAVED.length,  c:'var(--done-c)',  onClick:()=>setTab('saved')},
                  {icon:'✅',label:'Tracked Promises',val:TRACKED_PROMISES.length,c:'var(--blue-c)',onClick:()=>setTab('promises')},
                  {icon:'🤖',label:'AI Queries',       val:AI_HISTORY.length,c:'var(--saffron)',onClick:()=>setTab('ai-history')},
                  {icon:'📊',label:'Reports Saved',    val:REPORTS.length, c:'var(--prog-c)', onClick:()=>setTab('reports')},
                ].map(s=>(
                  <div key={s.label} className="stat-card" style={{cursor:'pointer',transition:'var(--t)'}}
                    onClick={s.onClick}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--sh-md)'}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--sh-xs)'}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div><div className="stat-val" style={{color:s.c}}>{s.val}</div><div className="stat-label">{s.label}</div></div>
                      <span style={{fontSize:'1.3rem'}}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <Section title="Election Insights">
                  <p style={{fontSize:'.78rem',color:'var(--muted)',marginBottom:10}}>Voter Turnout Trend</p>
                  <div style={{display:'flex',alignItems:'flex-end',gap:5,height:72,marginBottom:10}}>
                    {TREND.map((v,i)=>(
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                        <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===TREND.length-1?'var(--sage)':'var(--mint)',height:`${(v/70)*72}px`}}/>
                        <span style={{fontSize:'.58rem',color:'var(--light)'}}>{MONTHS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:'.78rem',color:'var(--muted)',marginBottom:8}}>Top Parties by Popularity</p>
                  {PARTY_DATA.map(pd=>(
                    <div key={pd.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:'.72rem',color:'var(--muted)',width:40}}>{pd.name}</span>
                      <div className="prog" style={{flex:1,height:5}}><div className="prog-bar" style={{width:`${pd.pct}%`,background:pd.color}}/></div>
                      <span style={{fontSize:'.7rem',color:'var(--muted)',width:26,textAlign:'right'}}>{pd.pct}%</span>
                    </div>
                  ))}
                </Section>

                <Section title="Recent Saved Candidates" action={<button className="btn btn-card btn-sm" onClick={()=>setTab('saved')}>View All</button>}>
                  {SAVED.map((c,i)=>(
                    <Link key={i} to={`/candidates/${c.id}`} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<SAVED.length-1?'1px solid var(--border)':'none',textDecoration:'none'}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>👤</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'.83rem',color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{c.party} · {c.con}</div>
                      </div>
                      <span className="badge badge-sage" style={{fontSize:'.63rem'}}>✓</span>
                    </Link>
                  ))}
                </Section>
              </div>

              <Section title="Quick Actions">
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {[
                    {to:'/candidates',   label:'🔍 Explore Candidates'},
                    {to:'/constituency', label:'📍 Find Constituency'},
                    {to:'/performance',  label:'✅ Track Promises'},
                    {to:'/parties',      label:'🏛️ Party Intelligence'},
                    {to:'/news',         label:'📰 Civic News'},
                  ].map(a=>(
                    <Link key={a.to} to={a.to} className="btn btn-card" style={{fontSize:'.8rem',padding:'8px 14px'}}>{a.label}</Link>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* SAVED CANDIDATES */}
          {tab==='saved'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Saved Candidates</h1>
              <Section title={`${SAVED.length} Saved Candidates`} action={<Link to="/candidates" className="btn btn-coral btn-sm">Browse More</Link>}>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {SAVED.map((c,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)'}}>
                      <div style={{width:48,height:48,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>👤</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:'.9rem'}}>{c.name}</div>
                        <div style={{fontSize:'.78rem',color:'var(--muted)',marginTop:2}}>{c.party} · {c.con}</div>
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <Link to={`/candidates/${c.id}`} className="btn btn-dark btn-sm">View Profile</Link>
                        <button className="btn btn-card btn-sm" style={{color:'var(--att-c)'}}>✕ Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* TRACKED PROMISES */}
          {tab==='promises'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Tracked Promises</h1>
              <Section title="Promises You're Following" action={<Link to="/performance" className="btn btn-coral btn-sm">Full Tracker</Link>}>
                {TRACKED_PROMISES.map((p,i)=>{
                  const cfg={completed:{c:'var(--done-c)',bg:'var(--mint-bg)',l:'Completed'},inprogress:{c:'var(--blue-c)',bg:'#EFF6FF',l:'In Progress'},notcompleted:{c:'var(--att-c)',bg:'var(--coral-lt)',l:'Not Achieved'}}[p.status];
                  return(
                    <div key={i} style={{padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10,borderLeft:`3px solid ${cfg.c}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <div>
                          <div style={{fontWeight:600,fontSize:'.875rem'}}>{p.promise}</div>
                          <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:2}}>{p.party}</div>
                        </div>
                        <span className="badge" style={{background:cfg.bg,color:cfg.c,fontSize:'.7rem'}}>{cfg.l}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div className="prog" style={{flex:1,height:6}}><div className="prog-bar" style={{width:`${p.pct}%`,background:cfg.c}}/></div>
                        <span style={{fontSize:'.75rem',fontWeight:700,color:cfg.c,minWidth:30}}>{p.pct}%</span>
                      </div>
                    </div>
                  );
                })}
                <button className="btn btn-card btn-sm" style={{marginTop:10}}>+ Track More Promises</button>
              </Section>
            </>
          )}

          {/* NOTIFICATIONS */}
          {tab==='notifications'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Notifications</h1>
              <Section title="Recent Notifications" action={<button className="btn btn-card btn-sm">Mark All Read</button>}>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {NOTIFICATIONS.map((n,i)=>(
                    <div key={i} style={{
                      display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',
                      background:n.unread?'var(--mint-bg)':'var(--ivory)',
                      borderRadius:'var(--r-md)',
                      border:n.unread?'1px solid rgba(168,184,138,.35)':'1px solid transparent',
                    }}>
                      <span style={{fontSize:'1.1rem',flexShrink:0}}>{n.type==='check'?'✅':'ℹ️'}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'.85rem',fontWeight:n.unread?600:400,color:'var(--ink)',lineHeight:1.5}}>{n.msg}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)',marginTop:3}}>{n.time}</div>
                      </div>
                      {n.unread&&<div style={{width:8,height:8,borderRadius:'50%',background:'var(--coral)',flexShrink:0,marginTop:4}}/>}
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* AI RESEARCH HISTORY */}
          {tab==='ai-history'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>AI Research History</h1>
              <Section title="Past Queries" action={<button className="btn btn-coral btn-sm" onClick={()=>document.getElementById('ai-toggle-btn')?.click()}>Ask AI Now</button>}>
                {AI_HISTORY.map((h,i)=>(
                  <div key={i} style={{padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10,borderLeft:'3px solid var(--sage)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                      <div style={{fontWeight:600,fontSize:'.875rem',color:'var(--ink)'}}>{h.q}</div>
                      <span style={{fontSize:'.72rem',color:'var(--muted)',flexShrink:0,marginLeft:10}}>{h.time}</span>
                    </div>
                    <div style={{fontSize:'.83rem',color:'var(--ink-2)',lineHeight:1.5,padding:'8px 10px',background:'var(--mint-bg)',borderRadius:8}}>
                      🤖 {h.a}
                    </div>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* REPORTS */}
          {tab==='reports'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>My Reports</h1>
              <Section title="Saved Research Reports" action={<button className="btn btn-coral btn-sm">+ Create Report</button>}>
                {REPORTS.map((r,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10}}>
                    <span style={{fontSize:'1.3rem'}}>📊</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'.875rem'}}>{r.title}</div>
                      <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:2}}>Created: {r.created}</div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-dark btn-sm">View</button>
                      <button className="btn btn-card btn-sm">⬇ Export</button>
                    </div>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* SETTINGS */}
          {tab==='settings'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Settings</h1>
              <Section title="Notification Preferences">
                {[
                  {l:'Email notifications for new verified candidates',c:true},
                  {l:'Promise tracker updates',c:true},
                  {l:'Breaking civic news alerts',c:false},
                  {l:'AI research recommendations',c:true},
                ].map((s,i)=>(
                  <label key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
                    <span style={{fontSize:'.875rem',color:'var(--ink)'}}>{s.l}</span>
                    <div style={{width:44,height:24,borderRadius:12,background:s.c?'var(--sage)':'var(--border)',position:'relative'}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:s.c?23:3,boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
                    </div>
                  </label>
                ))}
                <button className="btn btn-coral" style={{marginTop:14}}>Save Preferences</button>
              </Section>
              <Section title="Privacy">
                <p style={{fontSize:'.875rem',color:'var(--muted)',marginBottom:14}}>Manage your data and research history.</p>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button className="btn btn-card btn-sm">Download My Data</button>
                  <button className="btn btn-card btn-sm" style={{color:'var(--att-c)'}}>Delete Research History</button>
                </div>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
