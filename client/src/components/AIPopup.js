import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const QUICK = [
  'Which candidate has best education?',
  'Who has zero criminal cases?',
  'Show women candidates',
  'Explain NOTA in simple words',
  'How to register as a voter?',
  'Compare BJP and Congress',
];

function fmt(t) {
  return t.split(/(\*\*[^*]+\*\*|\n)/g).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2,-2)}</strong>;
    if (p === '\n') return <br key={i}/>;
    return p;
  });
}

export default function AIPopup() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([{
    role:'ai',
    text:'Hello! I\'m **VoteWise AI** — your civic research assistant.\n\nI can help you research candidates, compare parties, understand promises, and answer election questions with evidence and sources.',
    confidence: null, sources: null,
  }]);
  const [val, setVal]       = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  const send = async (msg) => {
    const text = msg || val.trim();
    if (!text || loading) return;
    setVal('');
    setMsgs(p => [...p, {role:'user', text}]);
    setLoading(true);
    try {
      const r = await api.post('/api/ai/chat', {message: text});
      const d = r.data.data;
      setMsgs(p => [...p, {
        role:'ai',
        text: d.message,
        confidence: d.confidence,
        sources: d.sources,
      }]);
    } catch {
      setMsgs(p => [...p, {role:'ai', text:'Sorry, something went wrong. Please try again.', confidence:null, sources:null}]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button id="ai-toggle-btn" onClick={() => setOpen(o => !o)} style={{
        position:'fixed', bottom:24, right:24, zIndex:1100,
        width:54, height:54, borderRadius:'50%', border:'none', cursor:'pointer',
        background: open ? 'var(--ink)' : 'var(--coral)',
        color:'#fff', fontSize:'1.3rem',
        boxShadow:'0 4px 20px rgba(232,116,97,.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all .25s ease',
        transform: open ? 'rotate(45deg) scale(1.05)' : 'scale(1)',
      }}
        onMouseEnter={e => { if(!open) e.currentTarget.style.transform='scale(1.1)'; }}
        onMouseLeave={e => { if(!open) e.currentTarget.style.transform='scale(1)'; }}
        title="VoteWise AI Assistant"
      >{open ? '✕' : '🤖'}</button>

      {/* Tooltip label */}
      {!open && (
        <div style={{
          position:'fixed', bottom:30, right:88, zIndex:1099,
          background:'var(--ink)', color:'var(--ivory)',
          padding:'6px 12px', borderRadius:20,
          fontSize:'.75rem', fontWeight:600, whiteSpace:'nowrap',
          boxShadow:'var(--sh-md)', pointerEvents:'none',
        }}>
          AI Assistant
          <div style={{
            position:'absolute', right:-5, top:'50%', transform:'translateY(-50%)',
            borderTop:'5px solid transparent', borderBottom:'5px solid transparent',
            borderLeft:'5px solid var(--ink)',
          }}/>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:90, right:24, zIndex:1100,
          width: Math.min(380, window.innerWidth - 32),
          maxHeight: Math.min(580, window.innerHeight - 120),
          background:'var(--card)',
          borderRadius:16,
          boxShadow:'var(--sh-xl)',
          border:'1px solid var(--border)',
          display:'flex', flexDirection:'column',
          overflow:'hidden',
          animation:'slideIn .25s ease',
        }}>
          {/* Header */}
          <div style={{
            background:'linear-gradient(135deg, var(--ink), var(--ink-2))',
            padding:'14px 16px',
            display:'flex', alignItems:'center', gap:10, flexShrink:0,
          }}>
            <div style={{
              width:34, height:34, borderRadius:10, flexShrink:0,
              background:'var(--coral)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem',
            }}>🤖</div>
            <div style={{flex:1}}>
              <div style={{color:'#fff', fontWeight:700, fontSize:'.88rem'}}>VoteWise AI Assistant</div>
              <div style={{color:'rgba(255,255,255,.5)', fontSize:'.7rem'}}>Civic Research Intelligence</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:5}}>
              <div style={{width:7, height:7, borderRadius:'50%', background:'#4ade80'}}/>
              <span style={{fontSize:'.7rem', color:'rgba(255,255,255,.5)'}}>Online</span>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background:'none', border:'none', color:'rgba(255,255,255,.5)',
              cursor:'pointer', fontSize:'1rem', marginLeft:4,
            }}>—</button>
          </div>

          {/* Quick chips */}
          {msgs.length <= 1 && (
            <div style={{padding:'10px 12px', borderBottom:'1px solid var(--border)', flexShrink:0, background:'var(--ivory)'}}>
              <div style={{fontSize:'.66rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:7}}>
                Try asking
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap:5}}>
                {QUICK.map(q => (
                  <button key={q} onClick={() => send(q)} style={{
                    padding:'4px 10px', borderRadius:20,
                    border:'1px solid var(--border)', background:'var(--card)',
                    color:'var(--muted)', fontSize:'.72rem', cursor:'pointer',
                    fontFamily:'inherit', transition:'all .15s',
                  }}
                    onMouseEnter={e => {e.target.style.background='var(--mint-bg)';e.target.style.borderColor='var(--sage)';e.target.style.color='var(--done-c)';}}
                    onMouseLeave={e => {e.target.style.background='var(--card)';e.target.style.borderColor='var(--border)';e.target.style.color='var(--muted)';}}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:12}}>
            {msgs.map((m, i) => (
              <div key={i} style={{display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', animation:'fadeUp .25s ease'}}>
                {m.role === 'ai' && (
                  <div style={{
                    width:26, height:26, borderRadius:8, flexShrink:0, marginRight:8, marginTop:2,
                    background:'var(--coral)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem',
                  }}>🤖</div>
                )}
                <div style={{maxWidth:'82%'}}>
                  <div style={{
                    padding:'10px 13px',
                    borderRadius: m.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role==='user' ? 'var(--ink)' : 'var(--ivory)',
                    color: m.role==='user' ? 'var(--ivory)' : 'var(--ink)',
                    fontSize:'.82rem', lineHeight:1.65,
                    border: m.role==='ai' ? '1px solid var(--border)' : 'none',
                  }}>
                    {fmt(m.text)}
                  </div>
                  {/* Confidence + Sources for AI messages */}
                  {m.role==='ai' && m.confidence && m.confidence !== 'N/A' && (
                    <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, flexWrap:'wrap'}}>
                      <span className="badge badge-sage" style={{fontSize:'.62rem'}}>
                        Confidence: {m.confidence}
                      </span>
                      {m.sources && m.sources.slice(0,2).map((s,si) => (
                        <span key={si} className="badge badge-gold" style={{fontSize:'.62rem'}}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display:'flex', gap:8}}>
                <div style={{width:26,height:26,borderRadius:8,background:'var(--coral)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem'}}>🤖</div>
                <div style={{padding:'10px 14px',background:'var(--ivory)',borderRadius:'14px 14px 14px 4px',border:'1px solid var(--border)',display:'flex',gap:4,alignItems:'center'}}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{width:5,height:5,borderRadius:'50%',background:'var(--sage)',animation:`pulse 1.2s ${i*.2}s infinite`}}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Disclaimer */}
          <div style={{padding:'5px 12px',background:'var(--beige)',borderTop:'1px solid var(--border)',fontSize:'.67rem',color:'var(--muted)',textAlign:'center',flexShrink:0}}>
            Educational only · Cite sources at{' '}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" style={{color:'var(--sage)',fontWeight:600}}>eci.gov.in</a>
          </div>

          {/* Input */}
          <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)',display:'flex',gap:8,flexShrink:0,background:'var(--card)'}}>
            <input value={val} disabled={loading}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
              placeholder="Ask about elections, candidates..."
              style={{
                flex:1, padding:'9px 14px', borderRadius:24,
                border:'1.5px solid var(--border-mid)', outline:'none',
                fontSize:'.82rem', background:'var(--ivory)', transition:'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor='var(--sage)'}
              onBlur={e => e.target.style.borderColor='var(--border-mid)'}
            />
            <button onClick={() => send()} disabled={!val.trim()||loading} style={{
              width:38, height:38, borderRadius:'50%', border:'none',
              background: val.trim()&&!loading ? 'var(--coral)' : 'var(--beige)',
              color: val.trim()&&!loading ? '#fff' : 'var(--muted)',
              cursor: val.trim()&&!loading ? 'pointer':'default',
              fontSize:'1rem', flexShrink:0, transition:'all .2s',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
