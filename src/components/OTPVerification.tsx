import React, { useState, useEffect } from 'react';
import { Loader2, Smartphone, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  phone: string;
  onVerificationSuccess: (user: any) => void;
  onBack: () => void;
}

export default function OTPVerification({ phone, onVerificationSuccess, onBack }: OTPVerificationProps) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await apiService.verifyOTP({ phone, otp: otpString });
      
      if (result.success && result.user) {
        toast.success('Phone verified successfully!');
        onVerificationSuccess(result.user);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await apiService.resendOTP(phone);
      if (result.success) {
        toast.success('OTP sent successfully!');
        setTimeLeft(300);
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 hover:py-12 transition-all duration-500">
      <div className="max-w-lg w-full space-y-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-10 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-agri-300 dark:hover:border-agri-600 transform hover:scale-105 transition-all duration-500">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-agri-500 to-agri-600 rounded-3xl flex items-center justify-center shadow-leaf hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight hover:text-agri-700 dark:hover:text-agri-400 transition-colors duration-300">
            Verify Phone Number
          </h2>
          <p className="mt-4 text-lg text-soil-600 dark:text-gray-300 font-medium hover:text-soil-700 dark:hover:text-gray-200 transition-colors duration-300">
            Enter the 6-digit code sent to {phone}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-agri-300 focus:border-agri-500 hover:border-agri-400 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white"
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Time remaining: <span className="font-bold text-agri-600 dark:text-agri-400">{formatTime(timeLeft)}</span>
            </p>
            
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full flex justify-center py-4 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 focus:outline-none focus:ring-4 focus:ring-agri-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-display shadow-lg mb-4"
            >
              {isVerifying ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                'Verify Phone Number'
              )}
            </button>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleResendOTP}
                disabled={isResending || timeLeft > 0}
                className="flex items-center space-x-2 text-base font-semibold text-agri-600 dark:text-agri-400 hover:text-agri-700 dark:hover:text-agri-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Resend OTP</span>
              </button>

              <button
                onClick={onBack}
                className="text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 hover:scale-105"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}