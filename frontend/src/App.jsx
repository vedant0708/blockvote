import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Help from './pages/Help';

// Voter Pages
import Dashboard from './pages/Dashboard';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AddVoter from './pages/AddVoter';
import BiometricEnrollment from './pages/BiometricEnrollment';
import ViewVoters from './pages/ViewVoters';
import ViewLogs from './pages/ViewLogs';
import ElectionControl from './pages/ElectionControl';

function App() {
  const [auth, setAuth] = React.useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  const syncAuthFromStorage = React.useCallback(() => {
    setAuth({
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role')
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener('storage', syncAuthFromStorage);
    window.addEventListener('auth-change', syncAuthFromStorage);
    return () => {
      window.removeEventListener('storage', syncAuthFromStorage);
      window.removeEventListener('auth-change', syncAuthFromStorage);
    };
  }, [syncAuthFromStorage]);

  const isAuthenticated = !!auth.token;
  const userRole = auth.role;

  return (
    <Router>
      <Navbar auth={auth} />
      <div className="mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/help" element={<Help />} />

          {/* Voter Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated && userRole === 'voter' ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vote" 
            element={isAuthenticated && userRole === 'voter' ? <VotePage /> : <Navigate to="/login" />} 
          />
          <Route path="/results" element={<ResultsPage />} />
          <Route 
            path="/profile" 
            element={isAuthenticated && userRole === 'voter' ? <Profile /> : <Navigate to="/login" />} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />
          <Route 
            path="/admin/add-voter" 
            element={isAuthenticated && userRole === 'admin' ? <AddVoter /> : <Navigate to="/admin/login" />} 
          />
          <Route 
            path="/admin/enroll-biometric" 
            element={isAuthenticated && userRole === 'admin' ? <BiometricEnrollment /> : <Navigate to="/admin/login" />} 
          />
          <Route 
            path="/admin/voters" 
            element={isAuthenticated && userRole === 'admin' ? <ViewVoters /> : <Navigate to="/admin/login" />} 
          />
          <Route 
            path="/admin/logs" 
            element={isAuthenticated && userRole === 'admin' ? <ViewLogs /> : <Navigate to="/admin/login" />} 
          />
          <Route 
            path="/admin/election-control" 
            element={isAuthenticated && userRole === 'admin' ? <ElectionControl /> : <Navigate to="/admin/login" />} 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
