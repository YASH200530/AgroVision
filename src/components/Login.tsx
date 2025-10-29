import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Leaf, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import OTPVerification from './OTPVerification';

interface LoginProps {
  setCurrentPage: (page: string) => void;
}

export default function Login({ setCurrentPage }: LoginProps) {
  const { t } = useLanguage();
  const { login, verifyPhone, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneForVerification, setPhoneForVerification] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    const result = await login(formData.phone, formData.password);
    
    if (result.success) {
      setCurrentPage('home');
    } else if (result.needsVerification) {
      setPhoneForVerification(formData.phone);
      setShowOTPVerification(true);
    } else {
      setError('Invalid phone number or password');
    }
  };

  const handleVerificationSuccess = (user: any) => {
    setCurrentPage('home');
  };

  const handleBackToLogin = () => {
    setShowOTPVerification(false);
    setPhoneForVerification('');
  };

  if (showOTPVerification) {
    return (
      <OTPVerification
        phone={phoneForVerification}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-10 bg-gray-800/90 backdrop-blur-md rounded-3xl p-10 border-2 border-gray-700/50 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-agri-500 to-agri-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-white font-display tracking-tight">
            {t('auth.login.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-300 font-medium">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 backdrop-blur-sm border-2 border-red-800 text-red-400 px-6 py-4 rounded-2xl text-base font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-lg font-bold text-gray-300 mb-3 font-display">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="appearance-none relative block w-full pl-12 pr-6 py-4 border-2 border-gray-600 placeholder-gray-500 text-lg text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-gray-700/80 backdrop-blur-sm shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-gray-300 mb-3 font-display">
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
                  className="appearance-none relative block w-full px-6 py-4 pr-14 border-2 border-gray-600 placeholder-gray-500 text-lg text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-gray-700/80 backdrop-blur-sm shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-gray-500" />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-5 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-agri-600 to-agri-700 focus:outline-none focus:ring-4 focus:ring-agri-300 disabled:opacity-50 disabled:cursor-not-allowed font-display shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                t('auth.login.button')
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('signup')}
              className="text-lg font-bold text-agri-400 font-display"
            >
              {t('auth.signup.link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}