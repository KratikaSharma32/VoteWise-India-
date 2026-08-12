import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DashNav from '../../components/DashNav';
import { useAuth } from '../../context/AuthContext';

const TASKS=[
  {id:'t1',task:'Verify Candidate: Arjun Patel',   type:'Candidate Verification',assignedBy:'Admin',due:'25 May 2024',status:'Pending',    priority:'High',   cid:'c001'},
  {id:'t2',task:'Update Delhi Constituency Data',   type:'Data Update',           assignedBy:'Admin',due:'28 May 2024',status:'In Progress',priority:'Medium', cid:null},
  {id:'t3',task:'Review Profile Update Request',    type:'Profile Review',        assignedBy:'Admin',due:'30 May 2024',status:'Pending',    priority:'Low',    cid:'c003'},
  {id:'t4',task:'Verify Candidate: Meera Iyer',     type:'Candidate Verification',assignedBy:'Admin',due:'31 May 2024',status:'Pending',    priority:'High',   cid:'c006'},
  {id:'t5',task:'Fact-check News Article #N008',    type:'Content Verification',  assignedBy:'Senior',due:'02 Jun 2024',status:'Completed', priority:'Medium', cid:null},
];
const VERIFICATION_QUEUE=[
  {name:'Arjun Patel',     party:'INC',con:'Bangalore Central',steps:{identity:true,education:true,assets:false,criminal:false},submitted:'01 May 2024'},
  {name:'Priya Nair Menon',party:'INC',con:'New Delhi',        steps:{identity:true,education:false,assets:false,criminal:false},submitted:'05 May 2024'},
];
const REPORTS=[
  {title:'Verification Report — Arjun Patel',date:'18 May 2024',status:'Submitted'},
  {title:'Constituency Data Report — Delhi',  date:'12 May 2024',status:'Approved'},
];

const P_STYLE={
  High:  {bg:'var(--coral-lt)',c:'var(--att-c)'},
  Medium:{bg:'#FFF8E6',        c:'var(--prog-c)'},
  Low:   {bg:'var(--mint-bg)', c:'var(--done-c)'},
};
const S_STYLE={
  'Pending':    {cls:'badge-gold', label:'Pending'},
  'In Progress':{cls:'badge-blue', label:'In Progress'},
  'Completed':  {cls:'badge-sage', label:'Completed'},
};

const TABS=[
  {id:'tasks',     label:'My Tasks'},
  {id:'verify',    label:'Verification Queue'},
  {id:'submissions',label:'Submissions'},
  {id:'reports',   label:'Reports'},
  {id:'messages',  label:'Messages'},
  {id:'settings',  label:'Settings'},
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

export default function EmployeeDash(){
  const {user}=useAuth();
  const [tab,setTab]=useState('tasks');
  const [taskStatus,setTaskStatus]=useState({t1:'Pending',t2:'In Progress',t3:'Pending',t4:'Pending',t5:'Completed'});

  const pending=Object.values(taskStatus).filter(s=>s==='Pending').length;
  const inProg =Object.values(taskStatus).filter(s=>s==='In Progress').length;
  const done   =Object.values(taskStatus).filter(s=>s==='Completed').length;

  return(
    <div className="dash-layout">
      <Sidebar/>
      <div className="dash-main">
        <DashNav/>
        <div style={{background:'var(--card)',borderBottom:'1px solid var(--border)',overflowX:'auto'}}>
          <div style={{display:'flex',minWidth:'max-content'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'13px 18px',border:'none',borderBottom:`2px solid ${tab===t.id?'var(--coral)':'transparent'}`,
                background:'transparent',fontSize:'.83rem',fontWeight:tab===t.id?600:400,
                color:tab===t.id?'var(--coral)':'var(--muted)',cursor:'pointer',whiteSpace:'nowrap',
                transition:'var(--t)',fontFamily:'inherit',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="dash-body">

          {/* TASKS */}
          {tab==='tasks'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:3}}>My Tasks</h1>
              <p style={{color:'var(--muted)',fontSize:'.875rem',marginBottom:20}}>Welcome, {user?.fullName} — {pending} tasks pending action.</p>

              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
                {[
                  {l:'Pending',    v:pending, bg:'#FFF8E6',        c:'var(--prog-c)'},
                  {l:'In Progress',v:inProg,  bg:'#EFF6FF',        c:'var(--blue-c)'},
                  {l:'Completed',  v:done,    bg:'var(--mint-bg)', c:'var(--done-c)'},
                  {l:'Overdue',    v:3,       bg:'var(--coral-lt)',c:'var(--att-c)'},
                ].map(s=>(
                  <div key={s.l} style={{background:s.bg,borderRadius:'var(--r-lg)',padding:'18px 20px',boxShadow:'var(--sh-xs)'}}>
                    <div style={{fontSize:'1.75rem',fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:'.78rem',color:s.c,opacity:.8,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h3 style={{fontWeight:700,fontSize:'.92rem'}}>Task List</h3>
                </div>
                <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                  <table>
                    <thead>
                      <tr><th>Task</th><th>Type</th><th>Priority</th><th>Assigned By</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {TASKS.map(t=>{
                        const ps=P_STYLE[t.priority];
                        const st=S_STYLE[taskStatus[t.id]]||S_STYLE['Pending'];
                        return(
                          <tr key={t.id}>
                            <td style={{fontWeight:500,maxWidth:200}}>{t.task}</td>
                            <td><span className="badge badge-gray" style={{fontSize:'.7rem'}}>{t.type}</span></td>
                            <td><span style={{display:'inline-block',padding:'2px 9px',borderRadius:20,fontSize:'.7rem',fontWeight:700,background:ps.bg,color:ps.c}}>{t.priority}</span></td>
                            <td style={{color:'var(--muted)',fontSize:'.83rem'}}>{t.assignedBy}</td>
                            <td style={{color:'var(--muted)',fontSize:'.8rem'}}>{t.due}</td>
                            <td><span className={`badge ${st.cls}`} style={{fontSize:'.7rem'}}>{st.label}</span></td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                {taskStatus[t.id]==='Pending'&&(
                                  <button className="btn btn-coral btn-sm" style={{padding:'5px 10px',fontSize:'.72rem'}}
                                    onClick={()=>setTaskStatus(p=>({...p,[t.id]:'In Progress'}))}>Start</button>
                                )}
                                {taskStatus[t.id]==='In Progress'&&(
                                  <button className="btn btn-sage btn-sm" style={{padding:'5px 10px',fontSize:'.72rem'}}
                                    onClick={()=>setTaskStatus(p=>({...p,[t.id]:'Completed'}))}>Complete</button>
                                )}
                                {t.cid&&<Link to={`/candidates/${t.cid}`} className="btn btn-card btn-sm" style={{padding:'5px 10px',fontSize:'.72rem'}}>View</Link>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VERIFICATION QUEUE */}
          {tab==='verify'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Verification Queue</h1>
              {VERIFICATION_QUEUE.map((c,i)=>(
                <Section key={i} title={`${c.name} — ${c.party} · ${c.con}`}
                  action={<span style={{fontSize:'.75rem',color:'var(--muted)'}}>Submitted {c.submitted}</span>}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}}>
                    {Object.entries(c.steps).map(([step,done])=>(
                      <div key={step} style={{
                        padding:'12px 14px',borderRadius:'var(--r-md)',
                        background:done?'var(--mint-bg)':'var(--ivory)',
                        border:`1px solid ${done?'rgba(168,184,138,.3)':'var(--border)'}`,
                        display:'flex',alignItems:'center',gap:8,
                      }}>
                        <span style={{fontSize:'1rem'}}>{done?'✅':'⏳'}</span>
                        <span style={{fontSize:'.83rem',fontWeight:500,textTransform:'capitalize',color:done?'var(--done-c)':'var(--muted)'}}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <Link to={`/candidates/${['c001','c002'][i]}`} className="btn btn-dark btn-sm">View Profile</Link>
                    <button className="btn btn-coral btn-sm">Submit Verification Report</button>
                    <button className="btn btn-card btn-sm">📎 Upload Evidence</button>
                  </div>
                </Section>
              ))}
            </>
          )}

          {/* SUBMISSIONS */}
          {tab==='submissions'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>My Submissions</h1>
              <Section title="Submitted Verification Reports">
                {REPORTS.map((r,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:10}}>
                    <span style={{fontSize:'1.3rem'}}>📋</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'.875rem'}}>{r.title}</div>
                      <div style={{fontSize:'.75rem',color:'var(--muted)',marginTop:2}}>{r.date}</div>
                    </div>
                    <span className={`badge ${r.status==='Approved'?'badge-sage':'badge-gold'}`} style={{fontSize:'.7rem'}}>{r.status}</span>
                    <button className="btn btn-card btn-sm" style={{fontSize:'.75rem'}}>View</button>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* REPORTS */}
          {tab==='reports'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Reports</h1>
              <Section title="Quick Actions" action={<button className="btn btn-coral btn-sm">+ New Report</button>}>
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {[{to:'/candidates',l:'📋 Candidate Verification Report'},{to:'/constituency',l:'📍 Constituency Data Report'},{to:'/performance',l:'✅ Promise Data Update'}].map(a=>(
                    <Link key={a.l} to={a.to} className="btn btn-card" style={{fontSize:'.8rem',padding:'9px 14px'}}>{a.l}</Link>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* MESSAGES */}
          {tab==='messages'&&(
            <>
              <h1 style={{fontSize:'1.35rem',fontWeight:700,marginBottom:20}}>Messages</h1>
              <Section title="Admin Communications">
                {[
                  {from:'Admin Office',  msg:'Please prioritise verification of Arjun Patel before EOD Friday.', time:'3 hrs ago',  unread:true},
                  {from:'System',        msg:'Task #t2 (Delhi Constituency Data) is due in 2 days.',             time:'1 day ago',  unread:false},
                  {from:'Senior Employee',msg:'Check the asset declaration format guidelines before submitting.',time:'2 days ago', unread:false},
                ].map((m,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',background:m.unread?'var(--mint-bg)':'var(--ivory)',borderRadius:'var(--r-md)',marginBottom:8,border:m.unread?'1px solid rgba(168,184,138,.35)':'1px solid transparent'}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:'var(--sage)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.82rem',flexShrink:0}}>{m.from.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontWeight:m.unread?700:500,fontSize:'.875rem'}}>{m.from}</span>
                        <span style={{fontSize:'.72rem',color:'var(--muted)'}}>{m.time}</span>
                      </div>
                      <div style={{fontSize:'.83rem',color:'var(--ink-2)',lineHeight:1.5}}>{m.msg}</div>
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
              <Section title="Work Preferences">
                {[
                  {l:'Email alerts for new task assignments',c:true},
                  {l:'SMS reminders for overdue tasks',      c:true},
                  {l:'Daily task summary digest',            c:false},
                ].map((s,i)=>(
                  <label key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
                    <span style={{fontSize:'.875rem',color:'var(--ink)'}}>{s.l}</span>
                    <div style={{width:44,height:24,borderRadius:12,background:s.c?'var(--sage)':'var(--border)',position:'relative'}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:s.c?23:3,boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
                    </div>
                  </label>
                ))}
                <button className="btn btn-coral" style={{marginTop:14}}>Save Settings</button>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
