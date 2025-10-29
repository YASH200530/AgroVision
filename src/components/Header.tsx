import React from 'react';
import { Menu, X, Globe, LogOut, User, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigation = user ? [
    { name: t('nav.home'), id: 'home' },
    { name: t('nav.upload'), id: 'upload' },
    { name: t('nav.problem'), id: 'problem' },
  ] : [
    { name: t('nav.home'), id: 'home' },
    { name: t('nav.problem'), id: 'problem' },
  ];

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-agri-100 dark:border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-agri-500 to-agri-600 rounded-xl flex items-center justify-center shadow-leaf">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C16 6 19 9 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9 8 6 12 3Z" fill="currentColor"/>
                  <path d="M12 3C9.5 8 9.5 12 12 16C14.5 12 14.5 8 12 3Z" fill="#E09F3E"/>
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">AgroVision</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 text-base font-semibold rounded-lg ${
                  currentPage === item.id
                    ? 'text-agri-700 dark:text-agri-300 bg-agri-50 dark:bg-gray-800 border-2 border-agri-200 dark:border-gray-700'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 text-base font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'en' ? 'हिं' : 'EN'}</span>
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-base font-medium text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-base font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="text-base font-semibold text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => setCurrentPage('signup')}
                    className="bg-agri-600 text-white px-5 py-2 rounded-xl text-base font-bold shadow-leaf"
                  >
                    {t('nav.signup')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-2 text-base font-semibold text-gray-600 dark:text-gray-300 p-2 rounded-lg"
            >
              <Globe className="w-5 h-5" />
              <span>{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t-2 border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-lg font-semibold rounded-lg ${
                    currentPage === item.id
                      ? 'text-agri-700 dark:text-agri-300 bg-agri-100 dark:bg-gray-800 border-2 border-agri-200 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {user ? (
                <div className="border-t-2 border-gray-100 pt-2">
                  <div className="flex items-center space-x-2 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-3 text-lg font-semibold text-gray-600 dark:text-gray-300 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="border-t-2 border-gray-100 pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setCurrentPage('login');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-lg font-semibold text-gray-600 dark:text-gray-300 rounded-lg"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-lg font-bold bg-agri-600 text-white rounded-xl shadow-leaf"
                  >
                    {t('nav.signup')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}