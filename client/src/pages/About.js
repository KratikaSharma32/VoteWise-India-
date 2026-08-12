import React from 'react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name:'Data & Research', desc:'Sourcing and verifying data from ECI, PRS India, ADR, and government portals.' },
  { name:'AI Intelligence', desc:'Building civic-focused AI that explains, compares, and cites sources transparently.' },
  { name:'Product & Design', desc:'Creating a premium platform that feels like a research tool, not a political campaign site.' },
];

const VALUES = [
  { icon:'⚖️', title:'Neutrality', desc:'We do not endorse any party, candidate, or ideology. All information is presented factually.' },
  { icon:'📋', title:'Evidence-Based', desc:'Every metric, score, and classification is backed by cited, verifiable sources.' },
  { icon:'🔍', title:'Transparency', desc:'Our methodologies are open. We show confidence levels and source attribution on every data point.' },
  { icon:'🤝', title:'Civic Duty', desc:'We exist to bridge the gap between citizens and democratic information.' },
];

export default function About() {
  return (
    <div style={{paddingTop:62,minHeight:'100vh',background:'var(--ivory)'}}>
      {/* Hero */}
      <div style={{background:'var(--cream)',borderBottom:'1px solid var(--border)',padding:'56px 0',textAlign:'center'}}>
        <div className="container">
          <div style={{
            width:64,height:64,borderRadius:16,
            background:'linear-gradient(135deg,var(--sage),#7A9E62)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1.8rem',margin:'0 auto 20px',
            boxShadow:'0 4px 16px rgba(168,184,138,.35)',
          }}>🗳️</div>
          <h1 style={{fontSize:'clamp(1.8rem,4vw,2.6rem)',fontWeight:800,marginBottom:14}}>About VoteWise India</h1>
          <p style={{fontSize:'1.05rem',color:'var(--muted)',maxWidth:560,margin:'0 auto 20px',lineHeight:1.75}}>
            An independent civic intelligence platform built to help Indian citizens make informed, evidence-based voting decisions.
          </p>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'var(--saffron-lt)',border:'1px solid rgba(213,161,91,.3)',borderRadius:20,fontSize:'.82rem',color:'#6B4A12',fontWeight:600}}>
            ⚠️ Educational Platform — Not an official Election Commission system
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'56px 24px'}}>

        {/* Mission */}
        <div style={{textAlign:'center',marginBottom:56}}>
          <h2 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:14}}>Our Mission</h2>
          <p style={{color:'var(--muted)',fontSize:'1rem',maxWidth:620,margin:'0 auto',lineHeight:1.8}}>
            India has 970 million registered voters. Yet most citizens vote with limited information about their candidates' background, legislative performance, or manifesto delivery. VoteWise India bridges this gap through transparent, AI-powered civic research.
          </p>
        </div>

        {/* Values */}
        <div style={{marginBottom:56}}>
          <h2 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:24,textAlign:'center'}}>Our Values</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
            {VALUES.map((v,i) => (
              <div key={i} className="card" style={{padding:24,borderTop:'3px solid var(--sage)'}}>
                <div style={{fontSize:'1.6rem',marginBottom:12}}>{v.icon}</div>
                <h4 style={{fontWeight:700,fontSize:'1rem',marginBottom:8}}>{v.title}</h4>
                <p style={{fontSize:'.875rem',color:'var(--muted)',lineHeight:1.7}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div style={{background:'var(--cream)',border:'1px solid var(--border)',borderRadius:16,padding:32,marginBottom:40}}>
          <h2 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:16}}>Data Sources</h2>
          <p style={{color:'var(--muted)',fontSize:'.9rem',marginBottom:20}}>All data on VoteWise India is sourced from authoritative, publicly available databases:</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
            {[
              {n:'Election Commission of India', u:'eci.gov.in'},
              {n:'PRS Legislative Research', u:'prsindia.org'},
              {n:'Association for Democratic Reforms', u:'adrindia.org'},
              {n:'National Election Watch', u:'myneta.info'},
              {n:'Lok Sabha Secretariat', u:'loksabha.nic.in'},
              {n:'NITI Aayog Data Portal', u:'data.gov.in'},
              {n:'Census of India', u:'censusindia.gov.in'},
              {n:'Press Information Bureau', u:'pib.gov.in'},
            ].map((s,i) => (
              <div key={i} style={{padding:'10px 14px',background:'var(--card)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{fontWeight:600,fontSize:'.83rem',color:'var(--ink)',marginBottom:2}}>{s.n}</div>
                <div style={{fontSize:'.72rem',color:'var(--sage)'}}>{s.u}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{background:'var(--saffron-lt)',border:'1px solid rgba(213,161,91,.35)',borderRadius:16,padding:28,marginBottom:40}}>
          <h3 style={{fontWeight:700,fontSize:'1rem',color:'#6B4A12',marginBottom:12}}>⚠️ Important Disclaimer</h3>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
            {[
              'This platform does NOT conduct real voting.',
              'This is NOT an official Election Commission system.',
              'All data is for awareness and education purposes only.',
              'Sample data is used for demonstration — not real electoral outcomes.',
              'For official voting, visit the Election Commission of India at eci.gov.in.',
            ].map((d,i) => (
              <li key={i} style={{display:'flex',gap:8,fontSize:'.875rem',color:'#6B4A12'}}>
                <span style={{flexShrink:0}}>•</span>{d}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center'}}>
          <h2 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:10}}>Start Researching</h2>
          <p style={{color:'var(--muted)',fontSize:'.9rem',marginBottom:24}}>Explore candidates, track promises, and use AI to make an informed vote.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/candidates" className="btn btn-dark btn-lg">Explore Candidates</Link>
            <Link to="/performance" className="btn btn-outline btn-lg">Track Promises</Link>
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{background:'var(--saffron)',color:'#fff'}}>Official ECI ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}
