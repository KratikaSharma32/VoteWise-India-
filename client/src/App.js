import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicNav from './components/PublicNav';
import Footer from './components/Footer';
import AIPopup from './components/AIPopup';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Candidates from './pages/Candidates';
import CandidateProfile from './pages/CandidateProfile';
import Parties from './pages/Parties';
import Performance from './pages/Performance';
import Constituency from './pages/Constituency';
import News from './pages/News';
import About from './pages/About';
import CitizenDash from './pages/dashboards/CitizenDash';
import CandidateDash from './pages/dashboards/CandidateDash';
import EmployeeDash from './pages/dashboards/EmployeeDash';
import AdminDash from './pages/dashboards/AdminDash';
import OAuthCallback from './pages/OAuthCallback';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--ivory)'}}>
      <div className="spinner"/>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

const Public = ({ children }) => (
  <><PublicNav/>{children}<Footer/><AIPopup/></>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                  element={<Public><Home/></Public>} />
      <Route path="/login"             element={<Login/>} />
      <Route path="/register"          element={<Register/>} />
      <Route path="/forgot-password"   element={<ForgotPassword/>} />
      <Route path="/auth/google/callback"    element={<OAuthCallback provider="google"/>} />
      <Route path="/auth/microsoft/callback" element={<OAuthCallback provider="microsoft"/>} />
      <Route path="/candidates"        element={<Public><Candidates/></Public>} />
      <Route path="/candidates/:id"    element={<Public><CandidateProfile/></Public>} />
      <Route path="/parties"           element={<Public><Parties/></Public>} />
      <Route path="/performance"       element={<Public><Performance/></Public>} />
      <Route path="/constituency"      element={<Public><Constituency/></Public>} />
      <Route path="/news"              element={<Public><News/></Public>} />
      <Route path="/about"             element={<Public><About/></Public>} />
      <Route path="/dashboard/citizen"   element={<ProtectedRoute roles={['citizen']}><CitizenDash/></ProtectedRoute>} />
      <Route path="/dashboard/candidate" element={<ProtectedRoute roles={['candidate']}><CandidateDash/></ProtectedRoute>} />
      <Route path="/dashboard/employee"  element={<ProtectedRoute roles={['employee']}><EmployeeDash/></ProtectedRoute>} />
      <Route path="/dashboard/admin"     element={<ProtectedRoute roles={['admin']}><AdminDash/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes/>
      </Router>
    </AuthProvider>
  );
}
