import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

import { API_BASE_URL } from '../config';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Login failed');
      }

      // Store user details in localStorage
      localStorage.setItem('flyora_user_id', resData.data.userId);
      localStorage.setItem('flyora_user_name', resData.data.fullName);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setErrorMsg('Failed to connect to the backend server. Please verify if the API is running or try again later.');
      } else {
        setErrorMsg(err.message || 'Connection to backend failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-white">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-[60%] relative bg-black overflow-hidden p-12 lg:p-16">
        <img
          src="/images/login%20page.png"
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
        />
        {/* Subtle overlays to keep image prominent while making logo readable */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal group-hover:shadow-[0_8px_25px_rgba(13,148,136,0.5)] transition-all duration-300">
                <Plane size={20} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flyora-blue rounded-full border-2 border-flyora-navy" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tight text-white transition-colors duration-300">
                fly<span className="text-flyora-teal">ora</span>
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[40%] flex flex-col items-center lg:justify-center p-0 lg:p-10 xl:p-12 relative bg-gray-50 lg:bg-white overflow-y-auto">

        {/* Mobile Image Header - full width image, no text */}
        <div className="lg:hidden w-full relative overflow-hidden" style={{ height: '28vh', minHeight: '180px' }}>
          <img
            src="/images/login%20page.png"
            alt="Login"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Top nav overlay */}
          <div className="absolute inset-x-0 top-0 flex justify-between items-center px-5 pt-6 z-10">
            <Link to="/" className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <ArrowLeft size={18} className="text-flyora-navy" />
            </Link>
          </div>
        </div>

        {/* Desktop Top Nav */}
        <Link
          to="/"
          className="hidden lg:flex absolute top-8 left-8 items-center gap-2 text-sm font-bold text-gray-500 hover:text-flyora-navy transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
        <div className="hidden lg:block absolute top-8 right-8">
          <a href="#" className="text-sm font-bold text-flyora-teal hover:text-flyora-teal-dark transition-colors">Need help?</a>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] px-6 py-8 lg:p-0 bg-white lg:bg-transparent relative z-20 lg:shadow-none flex-1 lg:flex-none flex flex-col justify-center">
          <div className="text-center mb-10 hidden lg:flex flex-col items-center">
            {/* Form Logo */}
            <Link to="/" className="flex items-center gap-2.5 group mb-6 w-fit">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
                  <Plane size={18} className="text-white transform -rotate-45" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flyora-blue rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="text-2xl font-black tracking-tight text-flyora-navy">
                  fly<span className="text-flyora-teal">ora</span>
                </span>
              </div>
            </Link>

            <h2 className="text-[28px] font-bold text-flyora-navy mb-2">Welcome Back!</h2>
            <p className="text-flyora-gray-500 text-sm font-medium">Log in to continue your smart shipping journey.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-flyora-navy">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-flyora-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-[14px] focus:ring-2 focus:ring-flyora-teal/20 focus:border-flyora-teal transition-all outline-none text-flyora-navy placeholder:text-gray-400 text-sm font-medium"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-flyora-navy">Password</label>
                <a href="#" className="text-sm font-bold text-flyora-teal hover:text-flyora-teal-dark transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-flyora-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-[14px] focus:ring-2 focus:ring-flyora-teal/20 focus:border-flyora-teal transition-all outline-none text-flyora-navy placeholder:text-gray-400 text-sm font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-flyora-gray-400 hover:text-flyora-navy transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-flyora-teal focus:ring-flyora-teal/20 border-gray-300 accent-flyora-teal" defaultChecked />
                <span className="text-sm font-bold text-flyora-navy">Remember me</span>
              </label>
              <a href="#" className="flex items-center gap-1.5 text-sm font-bold text-flyora-teal hover:text-flyora-teal-dark transition-colors">
                Use biometric <Fingerprint size={16} />
              </a>
            </div>

            <div className="pt-4">
              <Button 
                variant="teal" 
                size="lg" 
                fullWidth 
                iconRight={!isLoading && <ArrowRight size={18} />} 
                className="py-3.5 rounded-[14px]"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </div>
          </form>

          <div className="mt-8 mb-6 flex items-center justify-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-500 font-semibold">or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-[14px] hover:bg-gray-50 transition-colors font-bold text-sm text-flyora-navy shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-[14px] hover:bg-gray-50 transition-colors font-bold text-sm text-flyora-navy shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5" />
              Apple
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-[14px] hover:bg-gray-50 transition-colors font-bold text-sm text-flyora-navy shadow-sm">
              <svg viewBox="0 0 23 23" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="11" height="11" fill="#F25022" />
                <rect x="12" width="11" height="11" fill="#7FBA00" />
                <rect y="12" width="11" height="11" fill="#00A4EF" />
                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
              </svg>
              Microsoft
            </button>
          </div>

          <p className="text-center mt-10 text-[13px] font-semibold text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-flyora-teal hover:text-flyora-teal-dark transition-colors">
              Sign Up
            </Link>
          </p>

          {/* Mobile Footer Logo */}
          <div className="flex lg:hidden justify-center mt-8 pb-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
                  <Plane size={14} className="text-white transform -rotate-45" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-flyora-blue rounded-full border border-flyora-navy" />
              </div>
              <span className="text-lg font-black tracking-tight text-flyora-navy">
                fly<span className="text-flyora-teal">ora</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
