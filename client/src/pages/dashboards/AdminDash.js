import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DashNav from '../../components/DashNav';
import api from '../../utils/api';

const GROWTH=[20,35,28,55,70,90];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
const ROLE_DATA=[
  {label:'Citizens',  pct:75,color:'var(--sage)'},
  {label:'Candidates',pct:10,color:'var(--saffron)'},
  {label:'Employees', pct:10,color:'#2563EB'},
  {label:'Admins',    pct:5, color:'#7C3AED'},
];
const PENDING_CANDIDATES=[
  {id:'c001',name:'Arjun Patel',     party:'INC',con:'Bangalore Central',submitted:'01 May 2024',employee:'Priya Nair',  status:'Under Review'},
  {id:'c002',name:'Priya Nair Menon',party:'INC',con:'New Delhi',         submitted:'05 May 2024',employee:'Unassigned', status:'Pending'},
  {id:'c003',name:'Amit Tiwari',     party:'AAP',con:'New Delhi',         submitted:'08 May 2024',employee:'Rahul Kumar', status:'Verified'},
];
const EMPLOYEES=[
  {name:'Priya Nair',  tasks:8, completed:5, pending:3, role:'Employee'},
  {name:'Rahul Kumar', tasks:6, completed:6, pending:0, role:'Employee'},
  {name:'Sneha Patel', tasks:4, completed:2, pending:2, role:'Employee'},
];
const USERS=[
  {name:'Rahul Sharma',  role:'citizen',   joined:'10 May 2024',status:'Active'},
  {name:'Arjun Patel',   role:'candidate', joined:'01 May 2024',status:'Pending Approval'},
  {name:'Priya Nair',    role:'employee',  joined:'15 Apr 2024',status:'Active'},
  {name:'Sneha Verma',   role:'citizen',   joined:'20 May 2024',status:'Active'},
];
const ACTIVITY=[
  {action:'New candidate registered',        who:'Arjun Mehta, Mumbai South', time:'2 min ago', type:'user'},
  {action:'Verification report submitted',   who:'Employee Priya — Arjun Patel',time:'15 min ago',type:'verify'},
  {action:'Misinformation report filed',     who:'Article: EVM tampering claims',time:'32 min ago',type:'flag'},
  {action:'Promise tracker updated',         who:'AAP — Yamuna cleanup entry',  time:'1 hr ago', type:'data'},
  {action:'Constituency data approved',      who:'Delhi — Education indicators', time:'2 hr ago', type:'data'},
];
const MISINFO=[
  {report:'EVM hacking claim in social media',filed:'Citizen: anon',date:'20 May 2024',status:'Under Review'},
  {report:'Incorrect candidate asset figures',filed:'Citizen: User42',date:'18 May 2024',status:'Resolved'},
  {report:'Fake election result claim',        filed:'Citizen: User89',date:'15 May 2024',status:'Pending'},
];

const TABS=[
  {id:'overview',   label:'Dashboard'},
  {id:'users',      label:'User Management'},
  {id:'candidates', label:'Candidate Approvals'},
  {id:'employees',  label:'Employees'},
  {id:'tasks',      label:'Tasks Management'},
  {id:'elections',  label:'Election Management'},
  {id:'reports',    label:'Reports & Analytics'},
  {id:'misinfo',    label:'Misinformation'},
  {id:'news',       label:'News Management'},
  {id:'settings',   label:'Settings'},
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

export default function AdminDash(){
  const [stats,setStats]=useState(null);
  const [tab,setTab]=useState('overview');
  const [candStatus,setCandStatus]=useState({c001:'Under Review',c002:'Pending',c003:'Verified'});

  useEffect(()=>{
    api.get('/api/stats').then(r=>setStats(r.data.data)).catch(()=>{});
  },[]);

  const approve=(id)=>setCandStatus(p=>({...p,[id]:'Approved'}));
  const reject =(id)=>setCandStatus(p=>({...p,[id]:'Rejected'}));

  return(
    <div className="dash-layout">
      <Sidebar/>
      <div className="dash-main">
        <DashNav/>
        <div style={{background:'var(--card)',borderBottom:'1px solid var(--border)',overflowX:'auto'}}>
          <div style={{display:'flex',minWidth:'max-content'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'13px 16px',border:'none',
                borderBottom:`2px solid ${tab===t.id?'var(--coral)':'transparent'}`,
                background:'transparent',fontSize:'.82rem',fontWeight:tab===t.id?600:400,
                color:tab===t.id?'var(--coral)':'var(--muted)',cursor:'pointer',
                whiteSpace:'nowrap',transition:'var(--t)',fontFamily:'inherit',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="dash-body">

          {/* ── OVERVIEW ── */}
          {tab==='overview'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:3}}>Platform Overview</h1>
              <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:20}}>Super Admin — Full administrative access</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:20}}>
                {[
                  {label:'Total Users',    val:'25,430',icon:'👥',delta:'+12%',up:true},
                  {label:'Candidates',     val:stats?stats.totalCandidates:'12,842',icon:'👤',delta:'+8%',up:true},
                  {label:'Employees',      val:'672',    icon:'💼',delta:'+3%',up:true},
                  {label:'Constituencies', val:stats?stats.totalConstituencies:'543',icon:'📍',delta:'',up:null},
                ].map(s=>(
                  <div key={s.label} className="stat-card">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div>
                        <div style={{fontSize:'.7rem',color:'var(--muted)',fontWeight:600,marginBottom:4,textTransform:'uppercase',letterSpacing:'.04em'}}>{s.label}</div>
                        <div className="stat-val">{s.val}</div>
                      </div>
                      <span style={{fontSize:'1.3rem'}}>{s.icon}</span>
                    </div>
                    {s.up!==null&&<div style={{marginTop:6,fontSize:'.72rem',fontWeight:600,color:s.up?'var(--done-c)':'var(--att-c)'}}>
                      {s.up?'↑':'↓'} {s.delta} this month
                    </div>}
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}}>
                <Section title="User Growth">
                  <div style={{display:'flex',alignItems:'flex-end',gap:6,height:100,marginBottom:8}}>
                    {GROWTH.map((v,i)=>(
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                        <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===GROWTH.length-1?'var(--sage)':'var(--mint)',height:`${(v/90)*100}px`}}/>
                        <span style={{fontSize:'.6rem',color:'var(--light)'}}>{MONTHS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:'.75rem',color:'var(--muted)'}}>Total registered users growing at <strong style={{color:'var(--done-c)'}}>+12% MoM</strong></div>
                </Section>
                <Section title="Users by Role">
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{display:'block',margin:'0 auto 12px'}}>
                    {(()=>{let o=0;const c=2*Math.PI*36;return ROLE_DATA.map((r,i)=>{const d=(r.pct/100)*c;const el=<circle key={i} cx="50" cy="50" r="36" fill="none" stroke={r.color} strokeWidth="14" strokeDasharray={`${d} ${c-d}`} strokeDashoffset={-o} transform="rotate(-90 50 50)"/>;o+=d;return el;})})()}
                    <text x="50" y="55" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--ink-2)">Users</text>
                  </svg>
                  {ROLE_DATA.map(r=>(
                    <div key={r.label} style={{display:'flex',alignItems:'center',gap:7,fontSize:'.78rem',marginBottom:4}}>
                      <div style={{width:8,height:8,borderRadius:2,background:r.color,flexShrink:0}}/>
                      <span style={{color:'var(--muted)',flex:1}}>{r.label}</span>
                      <span style={{fontWeight:600}}>{r.pct}%</span>
                    </div>
                  ))}
                </Section>
              </div>
              <Section title="Recent Platform Activity">
                {ACTIVITY.map((a,i)=>{
                  const iconMap={user:'👤',verify:'✅',flag:'🚨',data:'📊'};
                  return(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<ACTIVITY.length-1?'1px solid var(--border)':'none'}}>
                      <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:a.type==='flag'?'var(--coral-lt)':a.type==='verify'?'var(--mint-bg)':'var(--beige)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem'}}>{iconMap[a.type]}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'.83rem',color:'var(--ink)'}}>{a.action}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.who}</div>
                      </div>
                      <span style={{fontSize:'.72rem',color:'var(--light)',flexShrink:0}}>{a.time}</span>
                    </div>
                  );
                })}
              </Section>
            </>
          )}

          {/* ── USER MANAGEMENT ── */}
          {tab==='users'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>User Management</h1>
              <Section title={`${USERS.length} Registered Users`} action={<button className="btn btn-coral btn-sm">+ Invite User</button>}>
                <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                  <table>
                    <thead><tr><th>Name</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {USERS.map((u,i)=>(
                        <tr key={i}>
                          <td style={{fontWeight:500}}>{u.name}</td>
                          <td><span className="badge badge-gray" style={{fontSize:'.7rem',textTransform:'capitalize'}}>{u.role}</span></td>
                          <td style={{color:'var(--muted)',fontSize:'.82rem'}}>{u.joined}</td>
                          <td><span className={`badge ${u.status==='Active'?'badge-sage':u.status==='Pending Approval'?'badge-gold':'badge-coral'}`} style={{fontSize:'.7rem'}}>{u.status}</span></td>
                          <td>
                            <div style={{display:'flex',gap:6}}>
                              <button className="btn btn-card btn-sm" style={{padding:'4px 10px',fontSize:'.72rem'}}>View</button>
                              <button className="btn btn-card btn-sm" style={{padding:'4px 10px',fontSize:'.72rem',color:'var(--att-c)'}}>Suspend</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </>
          )}

          {/* ── CANDIDATE APPROVALS ── */}
          {tab==='candidates'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Candidate Approvals</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
                {[
                  {l:'Pending Review', v:PENDING_CANDIDATES.filter(c=>candStatus[c.id]==='Pending').length,       c:'var(--prog-c)',bg:'#FFF8E6'},
                  {l:'Under Review',   v:PENDING_CANDIDATES.filter(c=>candStatus[c.id]==='Under Review').length,  c:'var(--blue-c)',bg:'#EFF6FF'},
                  {l:'Approved',       v:PENDING_CANDIDATES.filter(c=>candStatus[c.id]==='Approved'||candStatus[c.id]==='Verified').length, c:'var(--done-c)',bg:'var(--mint-bg)'},
                ].map(s=>(
                  <div key={s.l} style={{background:s.bg,borderRadius:'var(--r-lg)',padding:'18px 20px',boxShadow:'var(--sh-xs)'}}>
                    <div style={{fontSize:'1.6rem',fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:'.78rem',color:s.c,opacity:.8,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {PENDING_CANDIDATES.map((c,i)=>{
                const st=candStatus[c.id];
                const stCfg={
                  'Pending':    {cls:'badge-gold',  label:'Pending'},
                  'Under Review':{cls:'badge-blue', label:'Under Review'},
                  'Verified':   {cls:'badge-sage',  label:'Verified'},
                  'Approved':   {cls:'badge-sage',  label:'Approved'},
                  'Rejected':   {cls:'badge-coral', label:'Rejected'},
                }[st]||{cls:'badge-gray',label:st};
                return(
                  <Section key={i} title={`${c.name} — ${c.party} · ${c.con}`}
                    action={<span className={`badge ${stCfg.cls}`} style={{fontSize:'.72rem'}}>{stCfg.label}</span>}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,marginBottom:14}}>
                      <div style={{fontSize:'.83rem',color:'var(--muted)'}}>
                        Submitted: {c.submitted} · Employee: <strong style={{color:'var(--ink)'}}>{c.employee}</strong>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                      <Link to={`/candidates/${c.id}`} className="btn btn-dark btn-sm">View Full Profile</Link>
                      {st!=='Approved'&&st!=='Rejected'&&(
                        <>
                          <button className="btn btn-sage btn-sm" onClick={()=>approve(c.id)}>✅ Approve</button>
                          <button className="btn btn-sm" style={{background:'var(--coral-lt)',color:'var(--att-c)',border:'1px solid rgba(232,116,97,.2)'}} onClick={()=>reject(c.id)}>✕ Reject</button>
                          {c.employee==='Unassigned'&&(
                            <button className="btn btn-card btn-sm" onClick={()=>setCandStatus(p=>({...p,[c.id]:'Under Review'}))}>Assign to Employee</button>
                          )}
                        </>
                      )}
                    </div>
                  </Section>
                );
              })}
            </>
          )}

          {/* ── EMPLOYEES ── */}
          {tab==='employees'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Employee Management</h1>
              <Section title="Active Employees" action={<button className="btn btn-coral btn-sm">+ Add Employee</button>}>
                <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                  <table>
                    <thead><tr><th>Employee</th><th>Total Tasks</th><th>Completed</th><th>Pending</th><th>Efficiency</th><th>Actions</th></tr></thead>
                    <tbody>
                      {EMPLOYEES.map((e,i)=>{
                        const eff=Math.round((e.completed/Math.max(e.tasks,1))*100);
                        return(
                          <tr key={i}>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <div style={{width:30,height:30,borderRadius:'50%',background:'var(--sage)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.8rem'}}>{e.name.charAt(0)}</div>
                                <span style={{fontWeight:500}}>{e.name}</span>
                              </div>
                            </td>
                            <td style={{fontWeight:600}}>{e.tasks}</td>
                            <td style={{color:'var(--done-c)',fontWeight:600}}>{e.completed}</td>
                            <td style={{color:e.pending>0?'var(--prog-c)':'var(--muted)',fontWeight:600}}>{e.pending}</td>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <div className="prog" style={{width:60,height:5}}><div className="prog-bar" style={{width:`${eff}%`,background:eff>=80?'var(--sage)':'var(--saffron)'}}/></div>
                                <span style={{fontSize:'.78rem',fontWeight:600,color:eff>=80?'var(--done-c)':'var(--prog-c)'}}>{eff}%</span>
                              </div>
                            </td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                <button className="btn btn-card btn-sm" style={{padding:'4px 10px',fontSize:'.72rem'}}>Assign Task</button>
                                <button className="btn btn-card btn-sm" style={{padding:'4px 10px',fontSize:'.72rem'}}>View</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            </>
          )}

          {/* ── TASKS MANAGEMENT ── */}
          {tab==='tasks'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Tasks Management</h1>
              <Section title="All Platform Tasks" action={<button className="btn btn-coral btn-sm">+ Create Task</button>}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
                  {[
                    {l:'Total Tasks',  v:15, c:'var(--ink)'},
                    {l:'In Progress',  v:4,  c:'var(--blue-c)'},
                    {l:'Overdue',      v:3,  c:'var(--att-c)'},
                  ].map(s=>(
                    <div key={s.l} style={{padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',textAlign:'center'}}>
                      <div style={{fontSize:'1.4rem',fontWeight:800,color:s.c}}>{s.v}</div>
                      <div style={{fontSize:'.78rem',color:'var(--muted)',marginTop:3}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:'.875rem',color:'var(--muted)',lineHeight:1.6}}>
                  Assign tasks to employees from the <strong>Candidate Approvals</strong> section or directly via the Employee Management tab.
                  All verification tasks flow: Admin assigns → Employee completes → Admin reviews → Candidate approved.
                </p>
              </Section>
            </>
          )}

          {/* ── ELECTION MANAGEMENT ── */}
          {tab==='elections'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Election Management</h1>
              <Section title="Upcoming Elections">
                {[
                  {election:'Lok Sabha General Election',date:'April–May 2024',phase:'Phase 3 of 7',status:'Ongoing'},
                  {election:'Maharashtra Assembly',       date:'October 2024',  phase:'—',           status:'Scheduled'},
                  {election:'Jharkhand Assembly',         date:'November 2024', phase:'—',           status:'Scheduled'},
                ].map((e,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10}}>
                    <span style={{fontSize:'1.3rem'}}>🗳️</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'.875rem'}}>{e.election}</div>
                      <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:2}}>{e.date} · {e.phase}</div>
                    </div>
                    <span className={`badge ${e.status==='Ongoing'?'badge-coral':'badge-gold'}`} style={{fontSize:'.7rem'}}>{e.status}</span>
                  </div>
                ))}
              </Section>
              <Section title="Constituency Status">
                <p style={{fontSize:'.875rem',color:'var(--muted)',marginBottom:14}}>
                  <strong>{stats?.totalConstituencies||543}</strong> constituencies tracked. All data sourced from ECI official records.
                </p>
                <Link to="/constituency" className="btn btn-dark btn-sm">View Constituency Explorer</Link>
              </Section>
            </>
          )}

          {/* ── REPORTS & ANALYTICS ── */}
          {tab==='reports'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Reports & Analytics</h1>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <Section title="Platform Usage">
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {[
                      {l:'Total page visits this month', v:'84,210'},
                      {l:'AI queries processed',         v:'12,840'},
                      {l:'Candidate profiles viewed',    v:'38,900'},
                      {l:'Promise tracker clicks',       v:'9,320'},
                    ].map(x=>(
                      <div key={x.l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                        <span style={{fontSize:'.83rem',color:'var(--muted)'}}>{x.l}</span>
                        <span style={{fontWeight:700,fontSize:'.875rem'}}>{x.v}</span>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="System Health">
                  {[
                    {label:'API Response',    val:'98.4%', status:'healthy', detail:'Avg 142ms'},
                    {label:'Data Accuracy',   val:'96.1%', status:'healthy', detail:'ECI verified'},
                    {label:'AI Uptime',        val:'99.2%', status:'healthy', detail:'Last 30 days'},
                    {label:'Pending Reports',  val:'7',     status:'warn',    detail:'Flags open'},
                  ].map(s=>(
                    <div key={s.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                      <div>
                        <div style={{fontSize:'.83rem',fontWeight:500}}>{s.label}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{s.detail}</div>
                      </div>
                      <span style={{fontWeight:700,color:s.status==='healthy'?'var(--done-c)':'var(--prog-c)'}}>{s.val}</span>
                    </div>
                  ))}
                </Section>
              </div>
              <Section title="Quick Exports" action={<span style={{fontSize:'.78rem',color:'var(--muted)'}}>All exports are in CSV format</span>}>
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {['📊 User Report','👤 Candidate Report','✅ Verification Report','📰 News Audit','🚨 Misinformation Log'].map(l=>(
                    <button key={l} className="btn btn-card" style={{fontSize:'.8rem',padding:'9px 14px'}}>{l}</button>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ── MISINFORMATION ── */}
          {tab==='misinfo'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Misinformation Reports</h1>
              <Section title="Flagged Content" action={<span className="badge badge-coral" style={{fontSize:'.72rem'}}>{MISINFO.filter(m=>m.status!=='Resolved').length} Open</span>}>
                {MISINFO.map((m,i)=>(
                  <div key={i} style={{padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10,borderLeft:'3px solid var(--coral)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6,flexWrap:'wrap',gap:8}}>
                      <div style={{fontWeight:600,fontSize:'.875rem'}}>{m.report}</div>
                      <span className={`badge ${m.status==='Resolved'?'badge-sage':m.status==='Pending'?'badge-gold':'badge-blue'}`} style={{fontSize:'.7rem'}}>{m.status}</span>
                    </div>
                    <div style={{fontSize:'.75rem',color:'var(--muted)',marginBottom:10}}>Filed by: {m.filed} · {m.date}</div>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-card btn-sm" style={{fontSize:'.75rem'}}>Investigate</button>
                      {m.status!=='Resolved'&&<button className="btn btn-sage btn-sm" style={{fontSize:'.75rem'}}>Mark Resolved</button>}
                    </div>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* ── NEWS MANAGEMENT ── */}
          {tab==='news'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>News Management</h1>
              <Section title="Manage News Articles" action={<Link to="/news" className="btn btn-coral btn-sm">View Live News</Link>}>
                <p style={{fontSize:'.875rem',color:'var(--muted)',marginBottom:16}}>Publish, verify, or remove news articles from the platform.</p>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button className="btn btn-dark btn-sm">+ Add Article</button>
                  <button className="btn btn-card btn-sm">📋 Pending Review (2)</button>
                  <button className="btn btn-card btn-sm">🚨 Flagged (1)</button>
                </div>
              </Section>
            </>
          )}

          {/* ── SETTINGS ── */}
          {tab==='settings'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Platform Settings</h1>
              <Section title="General Configuration">
                {[
                  {l:'Require admin approval for new candidates', c:true},
                  {l:'Require employee verification before approval',c:true},
                  {l:'Allow citizens to report misinformation',   c:true},
                  {l:'AI responses enabled for all users',         c:true},
                  {l:'Public candidate profiles visible without login',c:false},
                ].map((s,i)=>(
                  <label key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
                    <span style={{fontSize:'.875rem',color:'var(--ink)'}}>{s.l}</span>
                    <div style={{width:44,height:24,borderRadius:12,background:s.c?'var(--sage)':'var(--border)',position:'relative',flexShrink:0}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:s.c?23:3,boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
                    </div>
                  </label>
                ))}
                <button className="btn btn-coral" style={{marginTop:14}}>Save Platform Settings</button>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
