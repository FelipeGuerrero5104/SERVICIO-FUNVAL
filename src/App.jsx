import React, { useState, useEffect } from 'react';
import StudentRegistrationForm from './StudentRegistrationForm.jsx';
import LoginPage from './LoginPage.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    setLoadingAuth(false); 
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
        <StudentRegistrationForm onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;