import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
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
      <div className="min-h-screen bg-agri-gradient dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-field-texture flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <span className="absolute inset-0 rounded-full border-4 border-agri-200 dark:border-agri-800 border-t-agri-600 dark:border-t-agri-400 animate-spin"></span>
            <span className="absolute inset-2 rounded-full border-4 border-crop-100 dark:border-crop-800 border-t-crop-500 dark:border-t-crop-400 animate-spin [animation-duration:1.2s]"></span>
          </div>
          <p className="text-soil-700 dark:text-gray-300">Loading...</p>
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
    <div className="min-h-screen bg-agri-gradient dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-field-texture">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        {renderPage()}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '2px solid var(--toast-border)',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
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