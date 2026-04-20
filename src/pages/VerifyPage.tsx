import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCcw,
  Loader2
} from 'lucide-react';

type VerifyStep = 'email' | 'otp' | 'password' | 'success';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // State
  const [step, setStep] = useState<VerifyStep>('otp');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Effect: Determine initial step
  useEffect(() => {
    if (!email) {
      setStep('email');
    } else {
      setStep('otp');
    }
  }, [email]);

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    setError(null);
    try {
      // Calls the same application processing logic which generates a new manual OTP
      const response = await fetch('/api/process-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: "GDA Student",
          program: "Ginashe Digital Academy",
          type: 'individual'
        })
      });

      if (!response.ok) throw new Error("Failed to resend code");

      setResendCooldown(60);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to resend activation code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpStep = (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) return;
    
    // Simply move to password step (Verification happens on final submit)
    setStep('password');
  };

  const handleFinalActivation = async (e: React.FormEvent) => {
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
      // Call the Manual OTP Verification API
      const response = await fetch('/api/verify-manual-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.join(''),
          password
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Verification failed");

      // SUCCESS!
      await signOut();
      setStep('success');
    } catch (err: any) {
      setError(err.message || "Failed to activate account. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep('otp');
  };

  // Helper UI Components
  const ErrorBox = () => error ? (
    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[12px] rounded-xl animate-fadeUp mb-6">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-sky/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-panelIn">
        <div className="bg-card border border-border-custom rounded-[32px] p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand/20 shadow-[0_0_20px_rgba(0,242,255,0.1)]">
              <ShieldCheck className="text-brand" size={32} />
            </div>
            <h1 className="font-syne font-extrabold text-[26px] text-text-custom mb-2">
              {step === 'email' && "Find Your Account"}
              {step === 'otp' && "Verify Your Email"}
              {step === 'password' && "Secure Your Account"}
              {step === 'success' && "Account Secured"}
            </h1>
            <p className="text-text-soft text-[14px] leading-relaxed">
              {step === 'email' && "Enter the email you used for your application to receive a verification code."}
              {step === 'otp' && <>Check <span className="text-brand font-medium">{email}</span> for your 6-digit activation code.</>}
              {step === 'password' && "Code accepted for verification. Now choose a strong password to complete your setup."}
              {step === 'success' && "Your Ginashe Digital Academy account is now active and ready for use."}
            </p>
          </div>

          <ErrorBox />

          {/* Step 1: Email Entry (Fallback) */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block font-dm-mono text-[10px] tracking-widest uppercase text-text-muted mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-brand transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-5 py-4 text-[14px] text-text-custom focus:border-brand/50 outline-none transition-all shadow-inner"
                    placeholder="student@email.com"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-brand w-full py-4 font-syne font-bold text-[14px]">
                Continue to Verification <ArrowRight size={16} className="ml-2" />
              </button>
            </form>
          )}

          {/* Step 2: OTP Entry */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtpStep} className="space-y-8">
              <div className="flex justify-between gap-2 md:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-full h-14 md:h-16 bg-surface border border-border-custom rounded-xl text-center text-[20px] font-bold text-text-custom focus:border-brand outline-none transition-all shadow-inner"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={loading || otp.join('').length < 6}
                  className="btn btn-brand w-full py-4 font-syne font-bold text-[14px]"
                >
                  Verify Code →
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="w-full text-center text-[12px] text-text-dim hover:text-brand transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive a code? Resend"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password Setup & Final Verify */}
          {step === 'password' && (
            <form onSubmit={handleFinalActivation} className="space-y-5">
              <div>
                <label className="block font-dm-mono text-[10px] tracking-widest uppercase text-text-muted mb-2 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-brand transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-12 py-4 text-[14px] text-text-custom focus:border-brand/50 outline-none transition-all shadow-inner"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-brand transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-dm-mono text-[10px] tracking-widest uppercase text-text-muted mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-5 py-4 text-[14px] text-text-custom focus:border-brand/50 outline-none transition-all shadow-inner"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn btn-brand w-full py-4 font-syne font-bold text-[14px] shadow-[0_12px_24px_rgba(0,242,255,0.15)]">
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 className="animate-spin" size={18} />
                      Activating Account...
                    </span>
                  ) : (
                    "Authorize & Finish →"
                  )}
                </button>
              </div>

              <button 
                type="button"
                onClick={() => setStep('otp')}
                className="w-full text-center text-[11px] text-text-muted hover:text-brand transition-colors pt-2"
              >
                ← Back to code entry
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center animate-fadeUp">
              <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-emerald" size={40} />
              </div>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-brand w-full py-4 font-syne font-bold text-[14px]"
              >
                Go to Student Portal <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Support */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-text-dim text-[10px] font-dm-mono uppercase tracking-[0.2em]">Student Admissions Hub</p>
          <a href="mailto:admissions@ginashe.co.za" className="text-brand text-[11px] font-dm-mono uppercase tracking-[0.1em] hover:text-white transition-colors border-b border-brand/20 pb-0.5">admissions@ginashe.co.za</a>
        </div>
      </div>
    </div>
  );
}
