import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Leaf, Phone, Mail, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import OTPVerification from './OTPVerification';

interface SignUpProps {
  setCurrentPage: (page: string) => void;
}

export default function SignUp({ setCurrentPage }: SignUpProps) {
  const { t, language, setLanguage } = useLanguage();
  const { signup, verifyPhone, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneForVerification, setPhoneForVerification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    language: language
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    const success = await signup(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.language as 'en' | 'hi'
    );
    
    if (success) {
      setPhoneForVerification(formData.phone);
      setShowOTPVerification(true);
    } else {
      setError('Failed to create account. User may already exist.');
    }
  };

  const handleVerificationSuccess = (user: any) => {
    setLanguage(formData.language as 'en' | 'hi');
    setCurrentPage('home');
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setPhoneForVerification('');
  };

  if (showOTPVerification) {
    return (
      <OTPVerification
        phone={phoneForVerification}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToSignup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 hover:py-12 transition-all duration-500">
      <div className="max-w-lg w-full space-y-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-10 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-agri-300 dark:hover:border-agri-600 transform hover:scale-105 transition-all duration-500">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-agri-500 to-agri-600 rounded-3xl flex items-center justify-center shadow-leaf hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
            {t('auth.signup.title')}
          </h2>
          <p className="mt-4 text-lg text-soil-600 dark:text-gray-300 font-medium hover:text-soil-700 dark:hover:text-gray-200 transition-colors duration-300">
            {t('auth.signup.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-base font-medium animate-pulse hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg font-bold text-soil-700 dark:text-gray-300 mb-3 font-display hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
                {t('auth.name')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil-400 dark:text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="appearance-none relative block w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-gray-600 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-medium bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-soil-700 dark:text-gray-300 mb-3 font-display hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil-400 dark:text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none relative block w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-gray-600 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-medium bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-lg font-bold text-soil-700 dark:text-gray-300 mb-3 font-display hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil-400 dark:text-gray-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="appearance-none relative block w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-gray-600 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-medium bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-soil-700 dark:text-gray-300 mb-3 font-display hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-6 py-4 pr-14 border-2 border-gray-200 dark:border-gray-600 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-medium bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center hover:text-agri-600 hover:scale-110 transition-all duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-soil-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-6 w-6 text-soil-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-lg font-bold text-soil-700 dark:text-gray-300 mb-3 font-display hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
                {t('auth.language')}
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 text-lg text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-medium bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm cursor-pointer shadow-sm hover:shadow-md"
              >
                <option value="en">{t('auth.english')}</option>
                <option value="hi">{t('auth.hindi')}</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-5 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 focus:outline-none focus:ring-4 focus:ring-agri-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-display shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                t('auth.signup.button')
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="text-lg font-bold text-agri-600 dark:text-agri-400 hover:text-agri-700 dark:hover:text-agri-300 transition-all duration-300 hover:underline decoration-2 underline-offset-4 font-display hover:scale-105 transform"
            >
              {t('auth.login.link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}