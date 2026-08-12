import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{background:'var(--ink)', color:'rgba(250,247,242,.55)'}}>
      <div className="container" style={{padding:'52px 24px 28px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:40, marginBottom:40}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:14}}>
              <div style={{
                width:30, height:30, borderRadius:8,
                background:'linear-gradient(135deg,var(--sage),#7A9E62)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem',
              }}>🗳️</div>
              <span style={{fontWeight:700, color:'rgba(250,247,242,.9)', fontSize:'.95rem'}}>VoteWise India</span>
            </div>
            <p style={{fontSize:'.82rem', lineHeight:1.75, maxWidth:220, marginBottom:14}}>
              India's civic intelligence platform for transparent, evidence-based voting decisions.
            </p>
            <div style={{
              display:'inline-flex', padding:'6px 12px',
              background:'rgba(232,116,97,.15)', border:'1px solid rgba(232,116,97,.25)',
              borderRadius:8, fontSize:'.72rem', color:'rgba(232,116,97,.85)', fontWeight:600,
            }}>
              ⚠️ Not an official ECI system
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{color:'rgba(250,247,242,.85)', fontSize:'.875rem', fontWeight:700, marginBottom:14}}>Platform</h4>
            {[
              {to:'/candidates',   l:'Explore Candidates'},
              {to:'/parties',      l:'Political Parties'},
              {to:'/performance',  l:'Promise Tracker'},
              {to:'/constituency', l:'Constituency Explorer'},
              {to:'/news',         l:'News Intelligence'},
            ].map(x => (
              <Link key={x.to} to={x.to} style={{display:'block', marginBottom:9, fontSize:'.82rem', transition:'color .2s'}}
                onMouseEnter={e=>e.target.style.color='rgba(250,247,242,.9)'}
                onMouseLeave={e=>e.target.style.color='rgba(250,247,242,.55)'}
              >{x.l}</Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{color:'rgba(250,247,242,.85)', fontSize:'.875rem', fontWeight:700, marginBottom:14}}>Account</h4>
            {[
              {to:'/login',    l:'Login'},
              {to:'/register', l:'Register'},
              {to:'/about',    l:'About Us'},
            ].map(x => (
              <Link key={x.l} to={x.to} style={{display:'block', marginBottom:9, fontSize:'.82rem', transition:'color .2s'}}
                onMouseEnter={e=>e.target.style.color='rgba(250,247,242,.9)'}
                onMouseLeave={e=>e.target.style.color='rgba(250,247,242,.55)'}
              >{x.l}</Link>
            ))}
          </div>

          {/* Official */}
          <div>
            <h4 style={{color:'rgba(250,247,242,.85)', fontSize:'.875rem', fontWeight:700, marginBottom:14}}>Official Links</h4>
            {[
              {h:'https://eci.gov.in',                   l:'Election Commission of India'},
              {h:'https://voters.eci.gov.in',            l:'Voter Registration'},
              {h:'https://electoralsearch.eci.gov.in',   l:'Electoral Roll Search'},
              {h:'https://nvsp.in',                       l:'National Voter Service'},
              {h:'https://prsindia.org',                  l:'PRS Legislative Research'},
            ].map(x => (
              <a key={x.h} href={x.h} target="_blank" rel="noopener noreferrer"
                style={{display:'block', marginBottom:9, fontSize:'.82rem', transition:'color .2s'}}
                onMouseEnter={e=>e.target.style.color='rgba(168,184,138,.9)'}
                onMouseLeave={e=>e.target.style.color='rgba(250,247,242,.55)'}
              >{x.l} ↗</a>
            ))}
          </div>
        </div>

        <div style={{borderTop:'1px solid rgba(250,247,242,.08)', paddingTop:22, display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:10}}>
          <p style={{fontSize:'.76rem'}}>
            © 2024 VoteWise India · MIT License · For official voting visit{' '}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
              style={{color:'rgba(168,184,138,.8)', fontWeight:600}}>eci.gov.in</a>
          </p>
          <p style={{fontSize:'.76rem'}}>Built for Indian Democracy 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
