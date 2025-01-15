import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import MainApp from './MainApp';
import LandingPage from './components/landing/LandingPage';
import { authAPI } from './api/auth';
import { useEffect } from 'react';
import webSocketService from './websockets/WebSocketService';

function App() {
  const isAuthenticated = authAPI.isAuthenticated();


  const handleLogin = () => {
    authAPI.login();
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Inicjalizacja WebSocket w App...');
      webSocketService.connect();
      webSocketService.debug()
    }
    return () => {
      webSocketService.disconnect();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPage />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        <Route
          path="/app/*"
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <MainApp onLogout={handleLogout} />
            )
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;