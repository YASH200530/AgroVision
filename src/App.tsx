import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Upload from './components/Upload';
import ProblemStatement from './components/ProblemStatement';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Close mobile menu when page changes
    setMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    // Redirect to home if trying to access auth pages while logged in
    if (user && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('home');
    }
  }, [user, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-agri-gradient bg-field-texture flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <span className="absolute inset-0 rounded-full border-4 border-agri-200 border-t-agri-600 animate-spin"></span>
            <span className="absolute inset-2 rounded-full border-4 border-crop-100 border-t-crop-500 animate-spin [animation-duration:1.2s]"></span>
          </div>
          <p className="text-soil-700">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return user ? <Home setCurrentPage={setCurrentPage} /> : <SignUp setCurrentPage={setCurrentPage} />;
      case 'login':
        return user ? <Home setCurrentPage={setCurrentPage} /> : <Login setCurrentPage={setCurrentPage} />;
      case 'upload':
        return user ? <Upload setCurrentPage={setCurrentPage} /> : <Login setCurrentPage={setCurrentPage} />;
      case 'problem':
        return <ProblemStatement setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-agri-gradient bg-field-texture dark:bg-gray-950 dark:text-gray-100">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;