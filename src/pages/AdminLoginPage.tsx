import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, User, Eye, EyeOff, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../config';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in as admin, redirect directly
  useEffect(() => {
    const adminToken = localStorage.getItem('flyora_admin_token');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Authentication failed');
      }

      // Store admin token
      localStorage.setItem('flyora_admin_token', resData.data.token);
      localStorage.setItem('flyora_admin_username', resData.data.username);
      
      // Also set standard user role so rest of application knows it is admin
      localStorage.setItem('flyora_user_role', 'admin');
      localStorage.setItem('flyora_user_email', 'admin@flyorago.com');
      localStorage.setItem('flyora_user_name', 'Super Admin');

      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setErrorMsg('Failed to connect to the backend database API. Ensure the backend is active.');
      } else {
        setErrorMsg(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Dotted backing */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none world-map-bg" />

      {/* Floating Plane */}
      <div className="absolute top-[10%] left-[5%] opacity-20 pointer-events-none float-animation">
        <Plane className="text-teal-400 transform -rotate-45" size={40} />
      </div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-[32px] p-8 shadow-2xl relative z-10 animate-fade-in glow-card-teal">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group">
            <Plane size={22} className="text-white transform -rotate-45" />
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight mt-3">
            Flyora<span className="text-flyora-teal">Go</span> Admin Panel
          </h2>
          <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
            Please enter your management credentials to access stats and moderation queues.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 mb-6 animate-shake">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleAdminLogin}>
          
          {/* Username (Admin ID) */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Admin ID / Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800/60 rounded-xl text-xs font-semibold focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <User size={15} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Secret Passkey</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-slate-950 border border-slate-800/60 rounded-xl text-xs font-semibold focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={15} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button
              variant="teal"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 shadow-teal font-black text-xs transition-all active:scale-98"
            >
              {isLoading ? (
                <span>Unlocking Panel...</span>
              ) : (
                <>
                  <span>Unlock Admin Panel</span>
                  <ArrowRight size={13} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-6 text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
        <Sparkles size={11} className="text-teal-400" />
        <span>Secure Core v1.4 • Powered by Flyora Security</span>
      </div>
    </div>
  );
};

export default AdminLoginPage;
