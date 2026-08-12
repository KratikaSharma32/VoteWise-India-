import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENUS = {
  citizen: [
    { icon:'📊', label:'Dashboard',            path:'/dashboard/citizen' },
    { icon:'🔍', label:'Explore Candidates',   path:'/candidates' },
    { icon:'⚖️', label:'Compare Candidates',   path:'/candidates' },
    { icon:'📍', label:'Constituencies',        path:'/constituency' },
    { icon:'🏛️', label:'Parties',              path:'/parties' },
    { icon:'✅', label:'Promise Tracker',       path:'/performance' },
    { icon:'📰', label:'News & Updates',        path:'/news' },
    { icon:'🤖', label:'AI Assistant',          path:'/dashboard/citizen?tab=ai' },
    { icon:'⚙️', label:'Settings',             path:'/dashboard/citizen?tab=settings' },
  ],
  candidate: [
    { icon:'📊', label:'Dashboard',            path:'/dashboard/candidate' },
    { icon:'👤', label:'My Profile',           path:'/dashboard/candidate?tab=profile' },
    { icon:'📋', label:'My Manifesto',         path:'/dashboard/candidate?tab=manifesto' },
    { icon:'🏆', label:'Achievements',         path:'/dashboard/candidate?tab=achievements' },
    { icon:'📈', label:'Engagement Analytics', path:'/dashboard/candidate?tab=analytics' },
    { icon:'📝', label:'Update Requests',      path:'/dashboard/candidate?tab=requests' },
    { icon:'💬', label:'Messages',             path:'/dashboard/candidate?tab=messages' },
    { icon:'⚙️', label:'Settings',            path:'/dashboard/candidate?tab=settings' },
  ],
  employee: [
    { icon:'📋', label:'My Tasks',             path:'/dashboard/employee' },
    { icon:'✅', label:'Verify Candidates',    path:'/dashboard/employee?tab=verify' },
    { icon:'📍', label:'Constituency Data',    path:'/constituency' },
    { icon:'📤', label:'Submissions',          path:'/dashboard/employee?tab=submissions' },
    { icon:'📊', label:'Reports',              path:'/dashboard/employee?tab=reports' },
    { icon:'💬', label:'Messages',             path:'/dashboard/employee?tab=messages' },
    { icon:'⚙️', label:'Settings',            path:'/dashboard/employee?tab=settings' },
  ],
  admin: [
    { icon:'📊', label:'Dashboard',            path:'/dashboard/admin' },
    { icon:'👥', label:'User Management',      path:'/dashboard/admin?tab=users' },
    { icon:'👤', label:'Candidates',           path:'/dashboard/admin?tab=candidates' },
    { icon:'💼', label:'Employees',            path:'/dashboard/admin?tab=employees' },
    { icon:'📋', label:'Tasks Management',     path:'/dashboard/admin?tab=tasks' },
    { icon:'🗳️', label:'Election Management', path:'/dashboard/admin?tab=elections' },
    { icon:'📈', label:'Reports & Analytics',  path:'/dashboard/admin?tab=reports' },
    { icon:'🚨', label:'Misinformation',       path:'/dashboard/admin?tab=misinfo' },
    { icon:'📰', label:'News Management',      path:'/news' },
    { icon:'⚙️', label:'Settings',            path:'/dashboard/admin?tab=settings' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menu = MENUS[user?.role] || [];
  const basePath = `/dashboard/${user?.role}`;

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div style={{
          width:30, height:30, borderRadius:8,
          background:'linear-gradient(135deg,var(--sage),#7A9E62)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem',
        }}>🗳️</div>
        <span style={{fontWeight:700, fontSize:'.92rem', color:'var(--ink)'}}>VoteWise India</span>
      </div>

      {/* User chip */}
      <div style={{padding:'10px 12px', borderBottom:'1px solid var(--border)'}}>
        <div className="sb-chip">
          <div style={{
            width:30, height:30, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg,var(--sage),#7A9E62)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:700, fontSize:'.82rem',
          }}>{user?.fullName?.charAt(0) || 'U'}</div>
          <div style={{overflow:'hidden', minWidth:0}}>
            <div className="sb-name" style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{user?.fullName}</div>
            <span className="badge badge-sage" style={{fontSize:'.62rem', textTransform:'capitalize'}}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {menu.map(item => {
          const active = location.pathname + location.search === item.path
            || (item.path === basePath && location.pathname === basePath && !location.search);
          return (
            <Link key={item.label} to={item.path}
              className={`nav-item${active ? ' active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{padding:'10px 12px', borderTop:'1px solid var(--border)'}}>
        <Link to="/" className="nav-item" style={{display:'flex', marginBottom:2}}>
          <span className="nav-icon">🏠</span>Back to Home
        </Link>
        <button onClick={logout} className="nav-item" style={{
          display:'flex', width:'100%', background:'none', border:'none',
          color:'var(--att-c)', cursor:'pointer', textAlign:'left', fontFamily:'inherit',
        }}>
          <span className="nav-icon">🚪</span>Logout
        </button>
      </div>
    </div>
  );
}
