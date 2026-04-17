import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ApplyPage from './pages/ApplyPage';
import DecisionDetailPage from './pages/DecisionDetailPage';
import ConsentPage from './pages/ConsentPage';
import MyDecisionsPage from './pages/MyDecisionsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminDecisionsPage from './pages/AdminDecisionsPage';
import AuditLogPage from './pages/AuditLogPage';
import ProfilePage from './pages/ProfilePage';

// Custom cursor component
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };
    const onDown = () => ringRef.current?.classList.add('clicking');
    const onUp = () => ringRef.current?.classList.remove('clicking');
    const onEnter = (e) => { if (e.target.closest('a,button,.btn,[role="button"]')) ringRef.current?.classList.add('hovering'); };
    const onLeave = (e) => { if (e.target.closest('a,button,.btn,[role="button"]')) ringRef.current?.classList.remove('hovering'); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor cursor-dot" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99999 }} />
      <div ref={ringRef} className="cursor cursor-ring" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99998 }} />
    </>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center" style={{ height: '100vh' }}><div style={{ width: 40, height: 40, border: '3px solid var(--gray-100)', borderTopColor: 'var(--royal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/apply" element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />
      <Route path="/decisions" element={<ProtectedRoute><MyDecisionsPage /></ProtectedRoute>} />
      <Route path="/decisions/:id" element={<ProtectedRoute><DecisionDetailPage /></ProtectedRoute>} />
      <Route path="/consent" element={<ProtectedRoute><ConsentPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/decisions" element={<ProtectedRoute adminOnly><AdminDecisionsPage /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AuditLogPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-body)', fontSize: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-md)' },
            success: { iconTheme: { primary: 'var(--mint)', secondary: 'white' } },
            error: { iconTheme: { primary: 'var(--coral)', secondary: 'white' } }
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
