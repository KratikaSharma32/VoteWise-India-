import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashNav() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const NOTIFS = [
    {msg:'Candidate Arjun Patel profile updated', time:'5 min ago',  type:'info'},
    {msg:'New constituency data available for Delhi', time:'1 hr ago', type:'info'},
    {msg:'3 tasks pending your review', time:'2 hr ago', type:'warn'},
  ];

  return (
    <div className="dash-header">
      {/* Search */}
      <div style={{position:'relative', width:240}}>
        <span style={{position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--light)', fontSize:'.9rem'}}>🔍</span>
        <input
          placeholder="Search anything..."
          style={{
            width:'100%', border:'1px solid var(--border)', borderRadius:'var(--r-md)',
            padding:'8px 12px 8px 32px', fontSize:'.82rem', outline:'none',
            background:'var(--ivory)', color:'var(--ink)', transition:'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--sage)'}
          onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Right side */}
      <div style={{display:'flex', alignItems:'center', gap:14}}>
        {/* Notification bell */}
        <div style={{position:'relative'}}>
          <button onClick={() => setNotifOpen(o => !o)} style={{
            background:'none', border:'none', cursor:'pointer',
            fontSize:'1.15rem', color:'var(--muted)', position:'relative', lineHeight:1,
          }}>
            🔔
            <span style={{
              position:'absolute', top:-4, right:-4,
              width:16, height:16, borderRadius:'50%',
              background:'var(--coral)', color:'#fff',
              fontSize:'.58rem', fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'2px solid var(--card)',
            }}>3</span>
          </button>

          {notifOpen && (
            <div style={{
              position:'absolute', right:0, top:'calc(100% + 10px)', zIndex:200,
              width:300, background:'var(--card)',
              border:'1px solid var(--border)', borderRadius:'var(--r-lg)',
              boxShadow:'var(--sh-lg)', overflow:'hidden',
            }}>
              <div style={{padding:'12px 16px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:'.85rem'}}>
                Notifications
              </div>
              {NOTIFS.map((n,i) => (
                <div key={i} style={{
                  padding:'12px 16px', borderBottom: i<NOTIFS.length-1?'1px solid var(--border)':'none',
                  display:'flex', gap:10, alignItems:'flex-start',
                }}>
                  <span style={{fontSize:'.9rem', marginTop:1}}>{n.type==='warn' ? '⚠️' : 'ℹ️'}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'.82rem', color:'var(--ink)', lineHeight:1.5}}>{n.msg}</div>
                    <div style={{fontSize:'.7rem', color:'var(--muted)', marginTop:3}}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{padding:'10px 16px', textAlign:'center'}}>
                <button onClick={() => setNotifOpen(false)} style={{
                  background:'none', border:'none', fontSize:'.78rem',
                  color:'var(--sage)', fontWeight:600, cursor:'pointer',
                }}>Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div style={{display:'flex', alignItems:'center', gap:9}}>
          <div style={{
            width:34, height:34, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg, var(--sage), #7A9E62)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:700, fontSize:'.85rem',
          }}>{user?.fullName?.charAt(0) || 'U'}</div>
          <div style={{display:'none'}} className="user-info-desktop">
            <div style={{fontSize:'.83rem', fontWeight:600, color:'var(--ink)', lineHeight:1}}>{user?.fullName}</div>
            <div style={{fontSize:'.7rem', color:'var(--muted)', textTransform:'capitalize', marginTop:1}}>{user?.role}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:640px){ .user-info-desktop{ display:block!important } }
      `}</style>
    </div>
  );
}
