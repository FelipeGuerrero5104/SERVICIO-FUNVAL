import React, { useState, useEffect } from 'react';
import StudentRegistrationForm from './StudentRegistrationForm.jsx';
import LoginPage from './LoginPage.jsx';

const API_BASE_URL = 'https://www.hs-service.api.crealape.com/api/v1';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, { 
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setCurrentUserId(userData.id);
        console.log('Usuario autenticado:', userData);
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        console.log('No autenticado o sesión expirada:', response.status);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      setCurrentUserId(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {+
    checkAuthStatus(); 
  };

  const handleLogout = async () => {
    try {
     
      await fetch(`${API_BASE_URL}/auth/logout`, { 
          method: 'POST',
          credentials: 'include'
      });
    } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error);
    } finally {
        setIsAuthenticated(false);
        setCurrentUserId(null);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <StudentRegistrationForm onLogout={handleLogout} currentUserId={currentUserId} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;