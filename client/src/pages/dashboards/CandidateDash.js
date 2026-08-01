import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DashNav from '../../components/DashNav';
import { useAuth } from '../../context/AuthContext';

const ENG = [20,35,28,50,42,65];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];

const REQUESTS = [
  {id:'r1', type:'Profile Update',    date:'19 May 2024', status:'Pending',  note:'Update to constituency section'},
  {id:'r2', type:'Manifesto Update',  date:'15 May 2024', status:'Approved', note:'Added infrastructure promise'},
  {id:'r3', type:'Achievement Added', date:'10 May 2024', status:'Approved', note:'Smart city project milestone'},
  {id:'r4', type:'Asset Declaration', date:'02 May 2024', status:'Rejected', note:'Document unclear — resubmit'},
];

const MESSAGES = [
  {from:'Admin Office',  msg:'Your verification is under review. Expected completion: 3 business days.', time:'2 hrs ago',  unread:true},
  {from:'Employee Priya',msg:'Education certificates verified. Assets check pending.', time:'1 day ago',  unread:true},
  {from:'System',        msg:'Your manifesto update was approved and is now live.', time:'3 days ago', unread:false},
];

const WORKFLOW_TIMELINE = [
  {step:'Registration Submitted',        status:'done',    date:'01 May 2024', by:'Arjun Patel'},
  {step:'Admin Review Started',          status:'done',    date:'02 May 2024', by:'Admin Office'},
  {step:'Verification Assigned',         status:'done',    date:'03 May 2024', by:'Employee Priya Nair'},
  {step:'Education Verified',            status:'done',    date:'05 May 2024', by:'Employee Priya Nair'},
  {step:'Assets Verification',           status:'active',  date:'In Progress', by:'Employee Priya Nair'},
  {step:'Criminal Records Check',        status:'pending', date:'Pending',     by:'Assigned to Employee'},
  {step:'Admin Final Approval',          status:'pending', date:'Pending',     by:'Admin Office'},
  {step:'Profile Published to Citizens', status:'pending', date:'Pending',     by:'System'},
];

const TABS = [
  {id:'overview',   label:'Dashboard'},
  {id:'profile',    label:'My Profile'},
  {id:'manifesto',  label:'My Manifesto'},
  {id:'achievements',label:'Achievements'},
  {id:'analytics',  label:'Engagement Analytics'},
  {id:'requests',   label:'Update Requests'},
  {id:'messages',   label:'Messages'},
  {id:'settings',   label:'Settings'},
];

function Section({ title, children, action }) {
  return (
    <div className="card" style={{padding:22, marginBottom:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--border)'}}>
        <h3 style={{fontWeight:700, fontSize:'.95rem'}}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function CandidateDash() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [manifesto, setManifesto] = useState([
    'Lucknow industrial corridor expansion',
    'Ram Mandir tourism infrastructure',
    'Smart city Phase-2 implementation',
    'Defence manufacturing hub in UP',
  ]);
  const [newPromise, setNewPromise] = useState('');
  const completion = 85;

  return (
    <div className="dash-layout">
      <Sidebar/>
      <div className="dash-main">
        <DashNav/>
        {/* Tab bar inside main */}
        <div style={{background:'var(--card)', borderBottom:'1px solid var(--border)', overflowX:'auto'}}>
          <div style={{display:'flex', minWidth:'max-content'}}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'13px 18px', border:'none', borderBottom:`2px solid ${tab===t.id?'var(--coral)':'transparent'}`,
                background:'transparent', fontSize:'.83rem', fontWeight:tab===t.id?600:400,
                color:tab===t.id?'var(--coral)':'var(--muted)',
                cursor:'pointer', whiteSpace:'nowrap', transition:'var(--t)', fontFamily:'inherit',
              }}>{t.label}{t.id==='messages'&&<span style={{marginLeft:5,background:'var(--coral)',color:'#fff',borderRadius:10,padding:'1px 6px',fontSize:'.65rem'}}>2</span>}</button>
            ))}
          </div>
        </div>

        <div className="dash-body">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:3}}>Dashboard Overview</h1>
              <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:20}}>Welcome, {user?.fullName}</p>

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:20}}>
                {[
                  {icon:'👁️',label:'Profile Views',val:'12,540',c:'var(--done-c)'},
                  {icon:'👥',label:'Followers',    val:'3,482', c:'var(--blue-c)'},
                  {icon:'🤝',label:'Supporters',   val:'2,150', c:'var(--prog-c)'},
                  {icon:'📊',label:'Engagement',   val:'18.7%', c:'var(--sage)'},
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div><div className="stat-val" style={{color:s.c}}>{s.val}</div><div className="stat-label">{s.label}</div></div>
                      <span style={{fontSize:'1.3rem'}}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verification Timeline */}
              <Section title="Verification Workflow Status" action={<span className="badge badge-gold">In Progress</span>}>
                <div style={{position:'relative', paddingLeft:24}}>
                  <div style={{position:'absolute',left:8,top:0,bottom:0,width:2,background:'var(--border)'}}/>
                  {WORKFLOW_TIMELINE.map((w,i) => (
                    <div key={i} style={{position:'relative',paddingBottom:16,display:'flex',gap:12,alignItems:'flex-start'}}>
                      <div style={{
                        position:'absolute',left:-20,top:3,
                        width:14,height:14,borderRadius:'50%',
                        background:w.status==='done'?'var(--sage)':w.status==='active'?'var(--saffron)':'var(--border)',
                        border:`2px solid ${w.status==='done'?'var(--done-c)':w.status==='active'?'var(--prog-c)':'var(--muted)'}`,
                      }}/>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:4}}>
                          <span style={{fontWeight:w.status==='active'?700:500,fontSize:'.85rem',color:w.status==='pending'?'var(--muted)':'var(--ink)'}}>{w.step}</span>
                          <span className={`badge ${w.status==='done'?'badge-sage':w.status==='active'?'badge-saffron':'badge-gray'}`} style={{fontSize:'.65rem'}}>
                            {w.status==='done'?'✅ Done':w.status==='active'?'⏳ Active':'⏸ Pending'}
                          </span>
                        </div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)',marginTop:2}}>{w.date} · {w.by}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <Section title="Engagement Overview">
                  <div style={{display:'flex',alignItems:'flex-end',gap:5,height:80,marginBottom:8}}>
                    {ENG.map((v,i) => (
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                        <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===ENG.length-1?'var(--sage)':'var(--mint)',height:`${(v/70)*80}px`}}/>
                        <span style={{fontSize:'.58rem',color:'var(--light)'}}>{MONTHS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:'.75rem',color:'var(--muted)'}}>📈 +32% engagement growth this quarter</div>
                </Section>

                <Section title="Profile Completion">
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 0'}}>
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{marginBottom:10}}>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--sage)" strokeWidth="8"
                        strokeDasharray={`${(completion/100)*263.9} 263.9`} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                      <text x="50" y="55" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--done-c)">{completion}%</text>
                    </svg>
                    <p style={{fontSize:'.8rem',color:'var(--muted)',textAlign:'center',marginBottom:10}}>Complete profile to boost visibility</p>
                    <button className="btn btn-coral btn-sm" onClick={()=>setTab('profile')}>Update Profile →</button>
                  </div>
                </Section>
              </div>
            </>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>My Profile</h1>
              <Section title="Personal Information" action={<span style={{fontSize:'.75rem',color:'var(--muted)'}}>All changes require admin approval</span>}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  {[
                    {l:'Full Name',     v:user?.fullName||'Arjun Patel'},
                    {l:'Constituency',  v:'Bangalore Central, Karnataka'},
                    {l:'Party',         v:'Independent'},
                    {l:'Contact Email', v:user?.email||'arjun@votewise.in'},
                    {l:'Phone',         v:'+91 98765 43210'},
                    {l:'Date of Birth', v:'14 March 1978'},
                  ].map(x=>(
                    <div key={x.l} className="form-group" style={{margin:0}}>
                      <label className="form-label">{x.l}</label>
                      <input className="form-input" defaultValue={x.v} style={{fontSize:'.875rem'}}/>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:16,padding:'10px 14px',background:'var(--saffron-lt)',borderRadius:'var(--r-md)',fontSize:'.78rem',color:'#6B4A12'}}>
                  ⚠️ Changes submitted here will generate an update request and must be approved by Admin before going live.
                </div>
                <button className="btn btn-coral" style={{marginTop:14}}>Submit Update Request</button>
              </Section>

              <Section title="Education & Qualifications">
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    {d:'M.A. (Public Policy)',   i:'Jawaharlal Nehru University, Delhi', y:'2003'},
                    {d:'B.A. Political Science', i:'University of Delhi',                y:'2001'},
                  ].map((e,i)=>(
                    <div key={i} style={{display:'flex',gap:12,padding:'12px 14px',background:'var(--ivory)',borderRadius:'var(--r-md)'}}>
                      <span style={{fontSize:'1.2rem'}}>🎓</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:'.875rem'}}>{e.d}</div>
                        <div style={{fontSize:'.78rem',color:'var(--muted)'}}>{e.i} · {e.y}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-card btn-sm" style={{marginTop:12}}>+ Add Qualification</button>
              </Section>
            </>
          )}

          {/* ── MANIFESTO ── */}
          {tab === 'manifesto' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>My Manifesto</h1>
              <Section title="Election Promises" action={<span className="badge badge-sage">4 Active Promises</span>}>
                <p style={{fontSize:'.83rem',color:'var(--muted)',marginBottom:16}}>All manifesto changes require employee verification and admin approval before becoming public.</p>
                {manifesto.map((m,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:8}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:700,color:'var(--done-c)',flexShrink:0}}>{i+1}</div>
                    <span style={{flex:1,fontSize:'.875rem',color:'var(--ink-2)'}}>{m}</span>
                    <span className="badge badge-sage" style={{fontSize:'.65rem'}}>Active</span>
                    <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--att-c)',fontSize:'.8rem'}} onClick={()=>setManifesto(manifesto.filter((_,j)=>j!==i))}>✕</button>
                  </div>
                ))}
                <div style={{display:'flex',gap:10,marginTop:14}}>
                  <input className="form-input" placeholder="Add new promise..." value={newPromise} onChange={e=>setNewPromise(e.target.value)} style={{flex:1,fontSize:'.875rem'}}/>
                  <button className="btn btn-coral" onClick={()=>{if(newPromise.trim()){setManifesto([...manifesto,newPromise.trim()]);setNewPromise('');}}}>Submit</button>
                </div>
              </Section>
            </>
          )}

          {/* ── ACHIEVEMENTS ── */}
          {tab === 'achievements' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Achievements</h1>
              <Section title="Verified Achievements" action={<button className="btn btn-coral btn-sm">+ Add Achievement</button>}>
                {[
                  {title:'Smart City Infrastructure Award',  org:'NITI Aayog',         year:'2023', status:'Approved'},
                  {title:'Best Constituency Development',    org:'State Government',    year:'2022', status:'Approved'},
                  {title:'Women Empowerment Initiative',     org:'UN Women India',      year:'2021', status:'Pending'},
                ].map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10,borderLeft:'3px solid var(--sage)'}}>
                    <span style={{fontSize:'1.4rem'}}>🏆</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'.875rem'}}>{a.title}</div>
                      <div style={{fontSize:'.78rem',color:'var(--muted)',marginTop:2}}>{a.org} · {a.year}</div>
                    </div>
                    <span className={`badge ${a.status==='Approved'?'badge-sage':'badge-gold'}`} style={{fontSize:'.7rem'}}>{a.status}</span>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Engagement Analytics</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:20}}>
                {[
                  {l:'Profile Views',  v:'12,540', delta:'+18%', up:true},
                  {l:'Followers',      v:'3,482',  delta:'+6%',  up:true},
                  {l:'Supporters',     v:'2,150',  delta:'+12%', up:true},
                  {l:'Engagement Rate',v:'18.7%',  delta:'-2%',  up:false},
                ].map(s=>(
                  <div key={s.l} className="stat-card">
                    <div className="stat-val">{s.v}</div>
                    <div className="stat-label">{s.l}</div>
                    <div className={`stat-delta ${s.up?'delta-up':'delta-dn'}`}>{s.up?'↑':'↓'} {s.delta} this month</div>
                  </div>
                ))}
              </div>
              <Section title="Monthly Engagement Trend">
                <div style={{display:'flex',alignItems:'flex-end',gap:8,height:120,marginBottom:10}}>
                  {ENG.map((v,i)=>(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===ENG.length-1?'var(--sage)':'var(--mint)',height:`${(v/70)*120}px`}}/>
                      <span style={{fontSize:'.68rem',color:'var(--light)'}}>{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Top Performing Content">
                {['Education manifesto update got 1,240 views','Infrastructure project completion posted — 890 reactions','Q&A session in Bangalore — 2,100 attendees recorded'].map((x,i)=>(
                  <div key={i} style={{padding:'10px 14px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:8,fontSize:'.85rem',color:'var(--ink-2)',display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{color:'var(--sage)'}}>📈</span>{x}
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* ── UPDATE REQUESTS ── */}
          {tab === 'requests' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Update Requests</h1>
              <Section title="Submitted Requests">
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {REQUESTS.map(r=>(
                    <div key={r.id} style={{padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',gap:14}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'var(--mint-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>📝</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:'.875rem'}}>{r.type}</div>
                        <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:2}}>{r.note} · {r.date}</div>
                      </div>
                      <span className={`badge ${r.status==='Approved'?'badge-sage':r.status==='Pending'?'badge-gold':'badge-coral'}`} style={{fontSize:'.7rem'}}>{r.status}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-coral btn-sm" style={{marginTop:14}}>+ Submit New Update</button>
              </Section>
            </>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Messages</h1>
              <Section title="Inbox">
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {MESSAGES.map((m,i)=>(
                    <div key={i} style={{padding:'14px 16px',background:m.unread?'var(--mint-bg)':'var(--ivory)',borderRadius:'var(--r-md)',border:m.unread?'1px solid rgba(168,184,138,.4)':'1px solid transparent',display:'flex',gap:12,alignItems:'flex-start'}}>
                      <div style={{width:36,height:36,borderRadius:'50%',background:'var(--sage)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.82rem',flexShrink:0}}>{m.from.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontWeight:m.unread?700:500,fontSize:'.875rem'}}>{m.from}</span>
                          <span style={{fontSize:'.72rem',color:'var(--muted)'}}>{m.time}</span>
                        </div>
                        <div style={{fontSize:'.83rem',color:'var(--ink-2)',lineHeight:1.5}}>{m.msg}</div>
                      </div>
                      {m.unread && <div style={{width:8,height:8,borderRadius:'50%',background:'var(--coral)',flexShrink:0,marginTop:4}}/>}
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Settings</h1>
              <Section title="Account Settings">
                {[
                  {l:'Email Notifications',  checked:true},
                  {l:'SMS Alerts',           checked:false},
                  {l:'Public Profile Visible',checked:true},
                  {l:'Allow Citizen Feedback',checked:true},
                ].map(s=>(
                  <label key={s.l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
                    <span style={{fontSize:'.875rem',color:'var(--ink)'}}>{s.l}</span>
                    <div style={{
                      width:44,height:24,borderRadius:12,
                      background:s.checked?'var(--sage)':'var(--border)',
                      position:'relative',transition:'background .2s',
                    }}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:s.checked?23:3,transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
                    </div>
                  </label>
                ))}
                <button className="btn btn-coral" style={{marginTop:16}}>Save Settings</button>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
