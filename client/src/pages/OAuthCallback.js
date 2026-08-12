import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback({ provider }) {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing | error
  const [error, setError]   = useState('');
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const code = params.get('code');
    if (!code) { setStatus('error'); setError('No authorization code received.'); return; }

    api.post(`/api/auth/oauth/${provider}/callback`, { code })
      .then(r => {
        const { token, user } = r.data;
        setSession(token, user);
        navigate(`/dashboard/${user.role}`);
      })
      .catch(err => {
        setStatus('error');
        setError(err.response?.data?.error || 'OAuth sign-in failed.');
      });
  }, [params, provider, navigate, setSession]);

  return (
    <div style={{minHeight:'100vh', background:'var(--ivory)', display:'flex', alignItems:'center', justifyContent:'center', padding:24}}>
      <div style={{textAlign:'center', maxWidth:400}}>
        {status === 'processing' ? (
          <>
            <div className="spinner" style={{margin:'0 auto 20px'}}/>
            <p style={{color:'var(--muted)', fontSize:'.9rem'}}>Signing you in with {provider}...</p>
          </>
        ) : (
          <>
            <div style={{fontSize:'2.5rem', marginBottom:16}}>⚠️</div>
            <h2 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:8, color:'var(--ink)'}}>Sign-in Failed</h2>
            <p style={{color:'var(--muted)', fontSize:'.875rem', marginBottom:20}}>{error}</p>
            <a href="/login" className="btn btn-coral">Back to Login</a>
          </>
        )}
      </div>
    </div>
  );
}
