import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SignUpProps {
  setCurrentPage: (page: string) => void;
}

export default function SignUp({ setCurrentPage }: SignUpProps) {
  const { t, language, setLanguage } = useLanguage();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
      setLanguage(formData.language as 'en' | 'hi');
      setCurrentPage('home');
    } else {
      setError('Failed to create account. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-agri-50 dark:bg-gray-950">
      <div className="max-w-lg w-full space-y-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-10 border-2 border-gray-200/50 dark:border-gray-800 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-agri-500 to-agri-600 rounded-3xl flex items-center justify-center shadow-leaf">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 font-display tracking-tight">
            {t('auth.signup.title')}
          </h2>
          <p className="mt-4 text-lg text-soil-600 dark:text-gray-300 font-medium">
            {t('auth.signup.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl text-base font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg font-bold text-soil-700 dark:text-gray-200 mb-3 font-display">
                {t('auth.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-soil-700 dark:text-gray-200 mb-3 font-display">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-lg font-bold text-soil-700 dark:text-gray-200 mb-3 font-display">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-soil-700 dark:text-gray-200 mb-3 font-display">
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
                  className="appearance-none relative block w-full px-6 py-4 pr-14 border-2 border-gray-200 dark:border-gray-700 placeholder-soil-400 dark:placeholder-gray-500 text-lg text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-soil-400 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-lg font-bold text-soil-700 dark:text-gray-200 mb-3 font-display">
                {t('auth.language')}
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-lg text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 font-medium bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm cursor-pointer shadow-sm"
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
              className="group relative w-full flex justify-center py-5 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-agri-600 to-agri-700 focus:outline-none focus:ring-4 focus:ring-agri-300 disabled:opacity-50 disabled:cursor-not-allowed font-display shadow-lg"
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
              className="text-lg font-bold text-agri-600 dark:text-agri-400 font-display underline decoration-2 underline-offset-4"
            >
              {t('auth.login.link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}