import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
  const { user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<'detecting' | 'ready' | 'invalid'>('detecting');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for explicit error in URL (Supabase often puts it there if token is bad)
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const errorDesc = hashParams.get('error_description') || hashParams.get('error');
    
    if (errorDesc) {
      setError(errorDesc.replace(/\+/g, ' '));
      setStatus('invalid');
      return;
    }

    // 2. Listen for Auth State Changes (This is how we catch recovery/invite tokens)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`VerifyPage: Auth Event - ${event}`);
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY' || session?.user) {
        setStatus('ready');
      }
    });

    // 3. Fallback: If after 8 seconds we still have no user and no event, check parameters
    const timeout = setTimeout(() => {
      if (status === 'detecting' && !user) {
        // One last check of the raw URL
        const hasToken = window.location.hash.includes('access_token=') || 
                         window.location.search.includes('token_hash=');
        if (!hasToken) {
          setError("No activation token found in the link.");
          setStatus('invalid');
        }
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [user, status]);

  // If AuthProvider finds a user, we are ready
  useEffect(() => {
    if (user && status === 'detecting') {
      setStatus('ready');
    }
  }, [user, status]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // SUCCESS!
      // Requirement: Users must login again manually
      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mb-8 animate-fadeUp">
          <CheckCircle2 className="text-emerald" size={40} />
        </div>
        <h1 className="font-syne font-extrabold text-[28px] text-text-custom mb-3 animate-fadeUp delay-100">Account Secured</h1>
        <p className="text-text-soft text-[14px] max-w-[340px] mb-10 animate-fadeUp delay-200 leading-relaxed">
          Your new password has been set successfully. For security, please return to the main site to log in manually.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-gold w-full max-w-[280px] animate-fadeUp delay-300 py-4"
        >
          Go to Login <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h1 className="font-syne font-bold text-[20px] text-text-custom mb-3">Invalid or Expired Link</h1>
        <p className="text-text-dim text-[13px] max-w-[300px] mb-8 leading-relaxed">
          {error || "The activation link is no longer valid. Please request a new invitation or contact student support."}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="text-gold font-dm-mono text-[10px] uppercase tracking-widest hover:underline"
        >
          ← Back to Ginashe Digital Academy
        </button>
      </div>
    );
  }

  if (status === 'detecting') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gold mx-auto"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/30" size={24} />
        </div>
        <h1 className="font-syne font-bold text-[18px] text-text-custom mb-2">Establishing Secure Connection...</h1>
        <p className="text-text-dim text-[11px] font-dm-mono uppercase tracking-widest animate-pulse">Checking Activation Token</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[420px] bg-card border border-border-custom rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] animate-panelIn">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck className="text-gold" size={28} />
          </div>

          <h1 className="font-syne font-extrabold text-[24px] text-text-custom mb-2">Secure Your Account</h1>
          <p className="text-text-soft text-[13px] mb-8 leading-relaxed">
            Choose a strong password to activate your Ginashe Digital Academy student portal access.
          </p>

          <form onSubmit={handleSetPassword} className="space-y-5">
            <div>
              <label className="block font-dm-mono text-[10px] tracking-widest uppercase text-text-muted mb-2 ml-1">New Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border-custom rounded-xl px-5 py-4 text-[14px] text-text-custom focus:border-gold/50 outline-none transition-all pr-12 group-hover:border-border-custom/80 shadow-inner"
                  placeholder="At least 6 characters"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-dm-mono text-[10px] tracking-widest uppercase text-text-muted mb-2 ml-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface border border-border-custom rounded-xl px-5 py-4 text-[14px] text-text-custom focus:border-gold/50 outline-none transition-all group-hover:border-border-custom/80 shadow-inner"
                placeholder="Repeat password"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[12px] rounded-xl animate-fadeUp">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-gold w-full py-4 mt-2 font-syne font-bold text-[14px]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-[#080b12]/30 border-t-[#080b12] rounded-full animate-spin"></span>
                  Securing Account...
                </span>
              ) : (
                "Set Password & Activate →"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 animate-fadeUp delay-500 text-center">
        <p className="text-text-dim text-[10px] font-dm-mono uppercase tracking-[0.2em]">Student Support Hub</p>
        <a href="mailto:support@ginashe.co.za" className="text-gold text-[11px] font-dm-mono uppercase tracking-[0.1em] hover:text-white transition-colors border-b border-gold/20 pb-0.5">support@ginashe.co.za</a>
      </div>
    </div>
  );
}
