import React, { useState, useEffect } from 'react';
import { supabase, uploadFile } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import SharedAdmissionForm from './SharedAdmissionForm';
import { Eye, EyeOff, FileText, CheckCircle2, Target, Info, ShieldCheck, HelpCircle, Send, Briefcase, CreditCard, GraduationCap, Building2, Users, ArrowRight } from 'lucide-react';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onSwitchModal?: (id: string) => void;
  onLoginSuccess?: (role: string) => void;
}

export function Modals({ activeModal, onClose, onSwitchModal, onLoginSuccess }: ModalsProps) {
  const { user, signOut } = useAuth();
  const [studentTab, setStudentTab] = useState('login');
  const [adminTab, setAdminTab] = useState('login');
  const [applyTab, setApplyTab] = useState('ind');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orgForm, setOrgForm] = useState({ org: '', contact: '', email: '', phone: '', size: '', msg: '' });
  const [orgFile, setOrgFile] = useState<File | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: '', type: '', email: '', phone: '', msg: '' });
  const [guidanceForm, setGuidanceForm] = useState({ name: '', email: '', track: '', background: '' });
  const [scholarshipForm, setScholarshipForm] = useState({ name: '', email: '', track: '', background: '', motivation: '' });
  const [corporateForm, setCorporateForm] = useState({ name: '', company: '', email: '', learners: '', msg: '' });
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '', plan: '', msg: '' });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  if (!activeModal) return null;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSubmitting(true);
    try {
      // 1. Check if user exists in profiles or applications
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', forgotEmail.trim().toLowerCase())
        .maybeSingle();

      if (!profile) {
        // Fallback check in applications just in case profile isn't created yet
        const { data: app } = await supabase
          .from('applications')
          .select('id')
          .eq('email', forgotEmail.trim().toLowerCase())
          .limit(1)
          .maybeSingle();
        
        if (!app) {
          throw new Error('No account found for this email address. Please apply first.');
        }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      toast.success('Protocol Initiated', {
        description: 'A branded password reset link has been sent to your email!'
      });
      setStudentTab('login');
      setAdminTab('login');
    } catch (err: any) {
      toast.error('System Breach', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetForm.password !== resetForm.confirm) {
      toast.error('Protocol Violation', { description: 'Passwords do not match' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: resetForm.password
      });
      if (error) throw error;
      toast.success('Security Update Successful', {
        description: 'Your institutional password has been updated.'
      });
      onClose();
      // Ensure they enter the portal if they are on a recovery link
      if (window.location.pathname === '/' || window.location.pathname === '/portal') {
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        if (updatedUser) {
           onLoginSuccess?.(updatedUser.email?.includes('ginashe.co.za') ? 'admin' : 'student');
        } else {
           window.location.href = '/portal';
        }
      }
    } catch (err: any) {
      toast.error('Governance Error', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) throw error;
      toast.success('Access Granted', {
        description: 'Welcome back to the Academy portal.'
      });
      if (onLoginSuccess) {
        onLoginSuccess(loginForm.email.includes('ginashe.co.za') ? 'admin' : 'student');
      }
      onClose();
    } catch (err: any) {
      toast.error('Authorization Failed', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent, type: string, formData: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('inquiries').insert({
        type,
        name: formData.name,
        email: formData.email,
        details: formData
      });
      if (error) throw error;
      toast.success('Protocol Initiated', {
        description: 'Your inquiry has been logged. Our admissions team will reach out within 24 hours.'
      });
      onClose();
    } catch (err: any) {
      toast.error('System Error', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.org || !orgForm.contact || !orgForm.size || !orgForm.email) return;
    setIsSubmitting(true);
    console.log('Submitting organisation enquiry...', orgForm);
    try {
      let cv_url = null;
      if (orgFile) {
        cv_url = await uploadFile(orgFile, 'documents', 'enterprise');
      }

      const { error } = await supabase.from('applications').insert([{
        organization_name: orgForm.org,
        contact_person: orgForm.contact,
        email: orgForm.email,
        phone: orgForm.phone,
        org_size: orgForm.size,
        message: orgForm.msg,
        cv_url: cv_url,
        type: 'organisation'
      }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Insert successful');
      
      // 2. Call the backend to process emails
      try {
        await fetch('https://ffgypwmrmdosaihgpkuw.supabase.co/functions/v1/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: orgForm.email,
            name: orgForm.org,
            type: 'organisation',
            target_department: 'academy@ginashe.co.za',
            details: orgForm
          })
        });
      } catch (processErr) {
        console.error('Error processing organisation enquiry emails:', processErr);
      }

      toast.success('Enquiry Logged', {
        description: `Institutional enquiry for ${orgForm.org} submitted successfully.`
      });
      setOrgForm({ org: '', contact: '', email: '', phone: '', size: '', msg: '' });
      setOrgFile(null);
      onClose();
    } catch (err: any) {
      console.error('Organisation submission error:', err);
      let errorMsg = 'Unknown error occurred';
      if (err && typeof err === 'object') {
        errorMsg = err.message || err.details || JSON.stringify(err);
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      toast.error('Transmission Failure', { description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuidanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceForm.name || !guidanceForm.email || !guidanceForm.track) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert([{
        first_name: guidanceForm.name.split(' ')[0] || guidanceForm.name,
        last_name: guidanceForm.name.split(' ').slice(1).join(' ') || 'N/A',
        email: guidanceForm.email,
        program: guidanceForm.track,
        message: guidanceForm.background,
        type: 'guidance',
        status: 'pending'
      }]);

      if (error) throw error;
      toast.success('Guidance Request Received', {
        description: `Request for ${guidanceForm.name} is now in the academic queue.`
      });
      setGuidanceForm({ name: '', email: '', track: '', background: '' });
      onClose();
    } catch (err: any) {
      console.error('Guidance submission error:', err);
      toast.error('Request Denied', { description: 'Please verify your details and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.email) return;
    setIsSubmitting(true);
    console.log('Submitting partner enquiry...', partnerForm);
    try {
      const { error } = await supabase.from('applications').insert([{
        organization_name: partnerForm.name,
        partner_type: partnerForm.type,
        email: partnerForm.email,
        phone: partnerForm.phone,
        message: partnerForm.msg,
        type: 'partner'
      }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Insert successful');

      // 2. Call the backend to process emails
      try {
        await fetch('https://ffgypwmrmdosaihgpkuw.supabase.co/functions/v1/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: partnerForm.email,
            name: partnerForm.name,
            type: 'partner',
            target_department: 'academy@ginashe.co.za',
            details: partnerForm
          })
        });
      } catch (processErr) {
        console.error('Error processing partner enquiry emails:', processErr);
      }

      toast.success('Alliance Proposal Sent', {
        description: `Partnership enquiry for ${partnerForm.name} has been dispatched.`
      });
      setPartnerForm({ name: '', type: '', email: '', phone: '', msg: '' });
      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('System Error', { description: err.message || 'An unknown error occurred during dispatch.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCourseId = activeModal && (activeModal.length > 20 || !isNaN(Number(activeModal))); // Supports UUIDs and Integer IDs

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className={`fixed inset-0 z-[2000] bg-bg/88 backdrop-blur-md flex items-center justify-center p-6 transition-opacity duration-250 ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`bg-card border border-border-custom rounded-3xl w-full ${isCourseId && window.location.pathname.includes('/levels/') ? 'max-w-5xl' : 'max-w-[480px]'} max-h-[90vh] overflow-y-auto transform transition-transform duration-300 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--color-brand),transparent)]`}
        onClick={stopPropagation}
      >
        {activeModal === 'apply_direct' && (
          <>
             <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">🚀</div>
                <div className="font-syne font-extrabold text-[20px]">Institutional Application</div>
                <div className="text-[12px] text-text-muted mt-1">Applying for the 2026 Academic Cycle</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <SharedAdmissionForm isModal={true} onSuccess={onClose} />
            </div>
          </>
        )}

        {activeModal === 'student' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">🎓</div>
                <div className="font-syne font-extrabold text-[20px]">Student Portal</div>
                <div className="text-[12px] text-text-muted mt-1">Access your courses, assignments, and certificates</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="flex gap-0.5 px-7 md:px-8 pt-4 border-b border-border-custom">
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${studentTab === 'login' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setStudentTab('login')}>Sign In</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${studentTab === 'forgot' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setStudentTab('forgot')}>Reset Password</button>
            </div>
            <div className="p-6 md:p-8">
              {user ? (
                <div className="text-center">
                  <p className="mb-4">You are logged in as {user.email}</p>
                  <button className="btn btn-outline w-full" onClick={() => signOut()}>Sign Out</button>
                </div>
              ) : studentTab === 'login' ? (
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="student@email.com" 
                      value={loginForm.email}
                      onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 pr-10 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                        placeholder="Enter your password" 
                        value={loginForm.password}
                        onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-sky w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Signing In...' : 'Access My Portal →'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted">New student? <a className="text-brand no-underline cursor-pointer hover:underline" onClick={() => onSwitchModal?.('apply')}>Apply for a course</a></div>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Your Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="student@email.com" 
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-sky w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted"><a className="text-brand no-underline cursor-pointer hover:underline" onClick={() => setStudentTab('login')}>← Back to sign in</a></div>
                </form>
              )}
            </div>
          </>
        )}

        {activeModal === 'admin' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">⚙️</div>
                <div className="font-syne font-extrabold text-[20px]">Admin & Faculty Portal</div>
                <div className="text-[12px] text-text-muted mt-1">Authorised Ginashe Digital Academy staff only</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="flex gap-0.5 px-7 md:px-8 pt-4 border-b border-border-custom">
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${adminTab === 'login' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setAdminTab('login')}>Staff Login</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${adminTab === 'forgot' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setAdminTab('forgot')}>Reset Password</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${adminTab === 'twofa' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setAdminTab('twofa')}>2FA Verify</button>
            </div>
            <div className="p-6 md:p-8">
              {user ? (
                <div className="text-center">
                  <p className="mb-4">You are logged in as {user.email}</p>
                  <button className="btn btn-outline w-full" onClick={() => signOut()}>Sign Out</button>
                </div>
              ) : adminTab === 'login' ? (
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Staff Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="name@ginashe.co.za" 
                      value={loginForm.email}
                      onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Staff password" 
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Access Role</label>
                    <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9">
                      <option value="">Select your role…</option>
                      <option>Academy Administrator</option>
                      <option>Instructor / Faculty</option>
                      <option>Curriculum Designer</option>
                      <option>Placement Officer</option>
                      <option>Institutional Registrar</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Signing In...' : 'Continue to 2FA →'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted">Unauthorised access attempts are logged and reported to Ginashe Digital.</div>
                </form>
              ) : adminTab === 'forgot' ? (
                <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Institutional Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="name@ginashe.co.za" 
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted"><a className="text-brand no-underline cursor-pointer hover:underline" onClick={() => setAdminTab('login')}>← Back to sign in</a></div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-[13px] text-text-soft mb-4.5">Enter the 6-digit code from your authenticator app or SMS.</p>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Two-Factor Code</label>
                    <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-mono text-[22px] text-text-custom text-center tracking-[0.4em] outline-none focus:border-brand/40 transition-all" placeholder="000 000" maxLength={7} />
                  </div>
                  <button className="btn btn-brand w-full py-3.5 justify-center mt-2" onClick={onClose}>Verify & Enter Portal →</button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted"><a className="text-brand no-underline cursor-pointer hover:underline" onClick={() => setAdminTab('login')}>← Back</a></div>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeModal === 'partner' && (
          <>
             <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">🤝</div>
                <div className="font-syne font-extrabold text-[20px]">Partner Enquiry</div>
                <div className="text-[12px] text-text-muted mt-1">Join the Ginashe Talent Ecosystem</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={handlePartnerSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Organisation Name</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Company Ltd" 
                      value={partnerForm.name}
                      onChange={e => setPartnerForm({...partnerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Partner Type</label>
                    <select 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all appearance-none"
                      value={partnerForm.type}
                      onChange={e => setPartnerForm({...partnerForm, type: e.target.value})}
                      required
                    >
                      <option value="">Select...</option>
                      <option>Hiring Partner</option>
                      <option>Academic / Accreditation</option>
                      <option>Technology / Vendor</option>
                      <option>Government / NGO</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Contact Email</label>
                  <input 
                    type="email"
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                    placeholder="contact@company.com" 
                    value={partnerForm.email}
                    onChange={e => setPartnerForm({...partnerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Message / Intent</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all min-h-[80px]" 
                    placeholder="Tell us about your objectives..." 
                    value={partnerForm.msg}
                    onChange={e => setPartnerForm({...partnerForm, msg: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2 shadow-[0_15px_40px_rgba(0,242,255,0.15)]">
                  {isSubmitting ? 'Submitting...' : 'Submit Partnership Enquiry'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'organisation' && (
          <>
             <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-sky/10 border border-sky/20 flex items-center justify-center text-[22px] mb-3.5">🏢</div>
                <div className="font-syne font-extrabold text-[20px]">Enterprise Training</div>
                <div className="text-[12px] text-text-muted mt-1">Upskill your engineering workforce</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={handleOrgSubmit}>
                 <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Organisation Name</label>
                  <input 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                    placeholder="Enterprise Corp" 
                    value={orgForm.org}
                    onChange={e => setOrgForm({...orgForm, org: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Primary Contact</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Full Name" 
                      value={orgForm.contact}
                      onChange={e => setOrgForm({...orgForm, contact: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Fleet Size</label>
                    <select 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all appearance-none"
                      value={orgForm.size}
                      onChange={e => setOrgForm({...orgForm, size: e.target.value})}
                      required
                    >
                      <option value="">Select size...</option>
                      <option>1-10 staff</option>
                      <option>11-50 staff</option>
                      <option>51-200 staff</option>
                      <option>200+ staff</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Work Email</label>
                  <input 
                    type="email"
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                    placeholder="hr@enterprise.com" 
                    value={orgForm.email}
                    onChange={e => setOrgForm({...orgForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Additional Comments / Context (Optional)</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all min-h-[80px]" 
                    placeholder="Tell us about your strategic objectives..." 
                    value={orgForm.msg}
                    onChange={e => setOrgForm({...orgForm, msg: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Attach Brief / Requirements (Optional)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="org-file"
                      className="hidden"
                      onChange={e => e.target.files && setOrgFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                    />
                    <label 
                      htmlFor="org-file"
                      className="w-full flex items-center justify-between bg-surface border border-border-custom border-dashed rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-muted cursor-pointer hover:border-brand/40 transition-all"
                    >
                      <span className="truncate">{orgFile ? orgFile.name : 'Upload PDF or Word document...'}</span>
                      <div className="bg-brand/10 text-brand px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Browse</div>
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-sky w-full py-3.5 justify-center mt-2 shadow-[0_15px_40px_rgba(0,242,255,0.1)]">
                  {isSubmitting ? 'Submitting...' : 'Request Enterprise Briefing'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'guidance' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">🧭</div>
                <h2 className="font-syne font-black text-2xl text-white mb-1.5 tracking-tight">Career Guidance</h2>
                <p className="text-text-muted text-[13px] leading-relaxed max-w-sm">Schedule a discovery call with an Academy Practitioner.</p>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom z-10" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={handleGuidanceSubmit}>
                 <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Full Name</label>
                  <input 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                    placeholder="Amara Dlamini" 
                    value={guidanceForm.name}
                    onChange={e => setGuidanceForm({...guidanceForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Email Address</label>
                  <input 
                    type="email"
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                    placeholder="amara@email.com" 
                    value={guidanceForm.email}
                    onChange={e => setGuidanceForm({...guidanceForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Track of Interest</label>
                  <select 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all appearance-none"
                    value={guidanceForm.track}
                    onChange={e => setGuidanceForm({...guidanceForm, track: e.target.value})}
                    required
                  >
                    <option value="">Select an area...</option>
                    <option value="Cloud Engineering">Cloud Engineering</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Software Architecture">Software Architecture</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="I have no idea">I have no idea</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Current Background (Optional)</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all min-h-[80px]" 
                    placeholder="Tell us what you currently do..." 
                    value={guidanceForm.background}
                    onChange={e => setGuidanceForm({...guidanceForm, background: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2 shadow-[0_15px_40px_rgba(0,242,255,0.1)]">
                  {isSubmitting ? 'Submitting...' : 'Request Guidance Call'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'scholarship' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-emerald-dim border border-emerald/20 flex items-center justify-center text-[22px] mb-3.5"><GraduationCap className="w-6 h-6 text-emerald" /></div>
                <div className="font-syne font-extrabold text-[20px]">Scholarship Application</div>
                <div className="text-[12px] text-text-muted mt-1">Apply for the GDA Excellence Scholarship</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={(e) => handleInquirySubmit(e, 'scholarship', scholarshipForm)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Full Name</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-emerald/40 transition-all" 
                      placeholder="Your Name" 
                      value={scholarshipForm.name}
                      onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Email Address</label>
                    <input 
                      type="email"
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-emerald/40 transition-all" 
                      placeholder="name@example.com" 
                      value={scholarshipForm.email}
                      onChange={e => setScholarshipForm({...scholarshipForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Curriculum Track of Interest</label>
                  <select 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-emerald/40 transition-all appearance-none"
                    value={scholarshipForm.track}
                    onChange={e => setScholarshipForm({...scholarshipForm, track: e.target.value})}
                    required
                  >
                    <option value="">Select track...</option>
                    <option>Cloud Infrastructure & Ops</option>
                    <option>Data Engineering & AI</option>
                    <option>Full-Stack Application Development</option>
                    <option>Cybersecurity & SecOps</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Brief Background / Why you?</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-emerald/40 transition-all min-h-[100px]" 
                    placeholder="Tell us about your technical journey and why you deserve this scholarship..." 
                    value={scholarshipForm.motivation}
                    onChange={e => setScholarshipForm({...scholarshipForm, motivation: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn bg-emerald-dim text-emerald border border-emerald/25 hover:bg-emerald/20 w-full py-3.5 justify-center mt-2">
                  {isSubmitting ? 'Transmitting...' : 'Submit Application →'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'corporate' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-sky-dim border border-sky/20 flex items-center justify-center text-[22px] mb-3.5"><Building2 className="w-6 h-6 text-sky" /></div>
                <div className="font-syne font-extrabold text-[20px]">Corporate Package Enquiry</div>
                <div className="text-[12px] text-text-muted mt-1">Institutional Training & Cohort Solutions</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={(e) => handleInquirySubmit(e, 'corporate', corporateForm)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Contact Name</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-sky/40 transition-all" 
                      placeholder="Name" 
                      value={corporateForm.name}
                      onChange={e => setCorporateForm({...corporateForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Company Email</label>
                    <input 
                      type="email"
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-sky/40 transition-all" 
                      placeholder="hr@company.com" 
                      value={corporateForm.email}
                      onChange={e => setCorporateForm({...corporateForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Company Name</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-sky/40 transition-all" 
                      placeholder="Company Ltd" 
                      value={corporateForm.company}
                      onChange={e => setCorporateForm({...corporateForm, company: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Est. Learners</label>
                    <input 
                      type="number"
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-mono text-[13px] text-text-custom outline-none focus:border-sky/40 transition-all" 
                      placeholder="5" 
                      value={corporateForm.learners}
                      onChange={e => setCorporateForm({...corporateForm, learners: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Training Objectives</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-sky/40 transition-all min-h-[80px]" 
                    placeholder="Tell us about your team's training needs..." 
                    value={corporateForm.msg}
                    onChange={e => setCorporateForm({...corporateForm, msg: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn bg-sky-dim text-sky border border-sky/25 hover:bg-sky/20 w-full py-3.5 justify-center mt-2">
                  {isSubmitting ? 'Transmitting...' : 'Request Package →'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'payment_plan' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><CreditCard className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">Payment Plan Discussion</div>
                <div className="text-[12px] text-text-muted mt-1">Structure your tuition for the 2026 cohort</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={(e) => handleInquirySubmit(e, 'payment_plan', paymentForm)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Full Name</label>
                    <input 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Name" 
                      value={paymentForm.name}
                      onChange={e => setPaymentForm({...paymentForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Email Address</label>
                    <input 
                      type="email"
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="name@example.com" 
                      value={paymentForm.email}
                      onChange={e => setPaymentForm({...paymentForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Preferred Plan</label>
                  <select 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all appearance-none"
                    value={paymentForm.plan}
                    onChange={e => setPaymentForm({...paymentForm, plan: e.target.value})}
                    required
                  >
                    <option value="">Select plan...</option>
                    <option>3-Month (0% Interest)</option>
                    <option>6-Month (Finance Charge applies)</option>
                    <option>Income Share Agreement (ISA)</option>
                    <option>Full Upfront (Early Bird Discount)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Additional Notes</label>
                  <textarea 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all min-h-[80px]" 
                    placeholder="Any specific questions about our financial models?" 
                    value={paymentForm.msg}
                    onChange={e => setPaymentForm({...paymentForm, msg: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2">
                  {isSubmitting ? 'Transmitting...' : 'Discuss Options →'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'required_docs' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><FileText className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">Required Documents</div>
                <div className="text-[12px] text-text-muted mt-1">Institutional Admission Checklist</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <p className="text-[13px] text-text-soft leading-relaxed">To maintain our high-fidelity standards, all applicants must submit the following digital assets during the formal application phase:</p>
                <div className="space-y-4">
                  {[
                    { t: 'Certified ID / Passport', d: 'Clear digital scan (PDF/JPG)' },
                    { t: 'Matric Certificate / Highest Qual', d: 'Grade 12 or equivalent technical certification' },
                    { t: 'Proof of Residence', d: 'Not older than 3 months' },
                    { t: 'Motivation Letter', d: '300-500 words on your tech aspirations' }
                  ].map((doc, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/3 border border-border-custom">
                      <div className="mt-1 text-brand"><CheckCircle2 className="w-4 h-4" /></div>
                      <div>
                        <div className="font-syne font-bold text-[13px] text-white">{doc.t}</div>
                        <div className="text-[11px] text-text-muted">{doc.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 flex gap-3 items-start">
                  <Info className="w-4 h-4 text-brand mt-0.5" />
                  <p className="text-[11px] text-text-soft leading-relaxed">Documents are verified via our Academic Registry. Ensure all scans are legible and professionally captured.</p>
                </div>
                <button className="btn btn-brand w-full py-3 justify-center mt-2" onClick={() => { onClose(); window.location.href='/apply'; }}>Proceed to Upload →</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'interview_tips' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><Target className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">Interview Protocol</div>
                <div className="text-[12px] text-text-muted mt-1">Succeeding in the GDA Admission Process</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/3 border border-border-custom">
                    <h4 className="font-syne font-bold text-[14px] text-brand mb-2">Technical Potential</h4>
                    <p className="text-[11px] text-text-soft leading-relaxed">We don't expect you to be a master, but we look for logical reasoning, problem-solving speed, and a high degree of digital curiosity.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/3 border border-border-custom">
                    <h4 className="font-syne font-bold text-[14px] text-brand mb-2">Cultural Alignment</h4>
                    <p className="text-[11px] text-text-soft leading-relaxed">GDA is for disruptors. Be ready to discuss how you plan to use tech to solve specific African challenges.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-dm-mono text-[9px] uppercase tracking-widest text-text-muted">Common Discussion Points</h4>
                  <ul className="space-y-2">
                    {['Your journey into technology so far', 'A complex problem you solved recently', 'Why Ginashe over traditional university?', 'Your 5-year vision in the global tech ecosystem'].map((tip, i) => (
                      <li key={i} className="flex items-center gap-3 text-[12px] text-text-soft">
                        <span className="text-brand">▹</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-brand w-full py-3 justify-center mt-2" onClick={onClose}>Acknowledge Protocol</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'apply_direct' && (
          <>
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-8 h-8 text-brand" />
              </div>
              <h2 className="font-syne font-black text-2xl text-white mb-2">Initiating Admission</h2>
              <p className="text-text-muted text-[13px] mb-8">Redirecting to the secure GDA Application Console...</p>
              <div className="flex gap-4 justify-center">
                <button className="btn btn-brand px-8" onClick={() => { onClose(); window.location.href='/apply'; }}>Proceed →</button>
                <button className="btn btn-outline px-8" onClick={onClose}>Cancel</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'prospectus' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><FileText className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">2026 Institutional Prospectus</div>
                <div className="text-[12px] text-text-muted mt-1">Full Academic & Fee Breakdown</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-8">
                <div>
                  <h4 className="font-syne font-bold text-[14px] text-brand mb-3 uppercase tracking-wider">Tuition Matrix</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/3 border border-border-custom">
                      <div className="text-[10px] text-text-muted uppercase mb-1">Cloud Launchpad</div>
                      <div className="font-bold text-white">R 12,500</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3 border border-border-custom">
                      <div className="text-[10px] text-text-muted uppercase mb-1">Associate Track</div>
                      <div className="font-bold text-white">R 36,000</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3 border border-border-custom">
                      <div className="text-[10px] text-text-muted uppercase mb-1">Professional Track</div>
                      <div className="font-bold text-white">R 58,000</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3 border border-border-custom">
                      <div className="text-[10px] text-text-muted uppercase mb-1">Dual Specialisation</div>
                      <div className="font-bold text-white">R 85,000</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-syne font-bold text-[14px] text-brand mb-3 uppercase tracking-wider">Key Institutional Milestones</h4>
                  <ul className="space-y-3">
                    {[
                      { d: 'Week 01-04', t: 'Core Systems & Logic immersion' },
                      { d: 'Week 05-12', t: 'Track-specific engineering (Cloud/AI/Dev)' },
                      { d: 'Week 13-16', t: 'Real-world deployment & Client Projects' },
                      { d: 'Post-Grad', t: 'Career Placement & Talent Ecosystem' }
                    ].map((m, i) => (
                      <li key={i} className="flex gap-4 text-[12px]">
                        <span className="text-brand font-dm-mono shrink-0">{m.d}</span>
                        <span className="text-text-soft">{m.t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-brand w-full py-3.5 justify-center mt-2 shadow-[0_15px_40px_rgba(0,242,255,0.15)]" onClick={() => { onClose(); window.location.href='/apply'; }}>Start Admission Process →</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'bursary_guide' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-emerald-dim border border-emerald/20 flex items-center justify-center text-[22px] mb-3.5"><GraduationCap className="w-6 h-6 text-emerald" /></div>
                <div className="font-syne font-extrabold text-[20px]">Bursary Application Guide</div>
                <div className="text-[12px] text-text-muted mt-1">GDA Excellence Scholarship Protocol</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <p className="text-[13px] text-text-soft leading-relaxed">The GDA Excellence Scholarship is designed for individuals who demonstrate exceptional potential but require financial support. Follow these steps to apply:</p>
                <div className="space-y-4">
                  {[
                    { s: '01', t: 'Formal Admission', d: 'Apply and receive a provisional acceptance letter for any GDA track.' },
                    { s: '02', t: 'Financial Disclosure', d: 'Submit proof of income or a declaration of financial need.' },
                    { s: '03', t: 'Technical Assessment', d: 'Achieve a "High Distinction" (85%+) in the GDA baseline assessment.' },
                    { s: '04', t: 'Motivation Video', d: 'Submit a 90-second video explaining how you will disrupt your industry.' }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/3 border border-border-custom hover:bg-white/5 transition-colors">
                      <div className="font-dm-mono text-emerald font-bold">{step.s}</div>
                      <div>
                        <div className="font-syne font-bold text-[13px] text-white">{step.t}</div>
                        <div className="text-[11px] text-text-muted">{step.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn bg-emerald-dim text-emerald border border-emerald/25 hover:bg-emerald/20 w-full py-3.5 justify-center mt-2" onClick={() => { onClose(); onSwitchModal('scholarship'); }}>Apply for Bursary Now →</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'isa_template' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><CreditCard className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">ISA Agreement Mechanics</div>
                <div className="text-[12px] text-text-muted mt-1">Income Share Agreement (ISA) Structure</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-brand/5 border border-brand/20">
                    <h4 className="font-syne font-bold text-[14px] text-brand mb-2">Upfront Commitment</h4>
                    <p className="font-black text-2xl text-white">R 0.00</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">Start learning for zero cost</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/3 border border-border-custom">
                    <h4 className="font-syne font-bold text-[14px] text-white mb-2">Income Share %</h4>
                    <p className="font-black text-2xl text-brand">15%</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">Only once earning &gt;R15k/mo</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/3 border border-border-custom space-y-4">
                  <h4 className="font-dm-mono text-[9px] uppercase tracking-widest text-text-muted">Agreement Highlights</h4>
                  <ul className="space-y-3">
                    {[
                      { t: 'Payment Cap', d: 'You never pay more than 2x the original tuition fee total.' },
                      { t: 'Minimum Threshold', d: 'No payments required if your salary drops below the threshold.' },
                      { t: 'Duration', d: 'The agreement ends after the total sum is paid or after 48 months.' },
                      { t: 'Placement Support', d: 'Full career coaching included to ensure rapid employment.' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-brand mt-1 text-[8px]">▹</span>
                        <div>
                          <span className="text-[12px] font-bold text-white block">{item.t}</span>
                          <span className="text-[11px] text-text-muted">{item.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-brand w-full py-3.5 justify-center mt-2" onClick={() => { onClose(); onSwitchModal('payment_plan'); }}>Discuss ISA Option →</button>
              </div>
            </div>
          </>
        )}

        {activeModal === 'student_handbook' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5"><ShieldCheck className="w-6 h-6 text-brand" /></div>
                <div className="font-syne font-extrabold text-[20px]">Student Handbook</div>
                <div className="text-[12px] text-text-muted mt-1">Institutional Policies & Governance</div>
              </div>
              <button className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center text-text-muted hover:text-text-custom transition-all" onClick={onClose}>✕</button>
            </div>
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-8">
                <div>
                  <h4 className="font-syne font-bold text-[14px] text-brand mb-3 uppercase tracking-wider">Academic Integrity</h4>
                  <p className="text-[12px] text-text-soft leading-relaxed">Ginashe Digital Academy maintains a zero-tolerance policy for plagiarism and AI-assisted dishonesty in core assessments. All code must be original or appropriately attributed to its source.</p>
                </div>
                <div>
                  <h4 className="font-syne font-bold text-[14px] text-brand mb-3 uppercase tracking-wider">Code of Conduct</h4>
                  <ul className="space-y-3">
                    {[
                      { t: 'Professionalism', d: 'Engage with faculty and peers with institutional respect.' },
                      { t: 'Technical Curiosity', d: 'Exhaust all documentation before requesting faculty intervention.' },
                      { t: 'Community Growth', d: 'Contribute to the GDA talent ecosystem through knowledge sharing.' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-brand mt-1 text-[8px]">▹</span>
                        <div>
                          <span className="text-[12px] font-bold text-white block">{item.t}</span>
                          <span className="text-[11px] text-text-muted">{item.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-syne font-bold text-[14px] text-brand mb-3 uppercase tracking-wider">Graduation Requirements</h4>
                  <p className="text-[12px] text-text-soft leading-relaxed">Institutional Certification is awarded upon successful completion of all track modules, a 75% aggregate in technical assessments, and the final Capstone deployment.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-border-custom flex justify-between items-center">
                  <span className="text-[11px] text-text-muted">Full Policy Document v2026.1</span>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline">Download PDF</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeModal === 'reset-password' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">🔐</div>
                <div className="font-syne font-extrabold text-[20px]">Set New Password</div>
                <div className="text-[12px] text-text-muted mt-1">Please enter your new password below</div>
              </div>
              <button 
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[14px] text-text-muted cursor-pointer transition-all hover:text-text-custom" 
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-custom)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 pr-10 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Min 6 characters" 
                      value={resetForm.password}
                      onChange={e => setResetForm({...resetForm, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 pr-10 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all" 
                      placeholder="Repeat new password" 
                      value={resetForm.confirm}
                      onChange={e => setResetForm({...resetForm, confirm: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-brand w-full py-3.5 justify-center mt-2">
                  {isSubmitting ? 'Updating...' : 'Set Password & Enter Portal →'}
                </button>
              </form>
            </div>
          </>
        )}

        {isCourseId && (
          <CourseDetailsModal courseId={activeModal!} onClose={onClose} />
        )}

        {activeModal === 'required_docs' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">📋</div>
                <h2 className="font-syne font-black text-2xl tracking-tighter text-white uppercase">Required Documents</h2>
                <p className="text-[11px] text-text-dim font-dm-mono uppercase tracking-widest mt-1">Institutional Admission Checklist</p>
              </div>
              <button onClick={onClose} className="text-text-dim hover:text-white transition-colors p-2 -mr-2">✕</button>
            </div>
            <div className="p-7 md:p-8 space-y-6">
              <div className="space-y-4">
                {[
                  { t: 'Certified ID/Passport', d: 'Clear scan of your South African ID or valid Passport.' },
                  { t: 'Academic Records', d: 'Grade 12 certificate or equivalent industry-standard prerequisite.' },
                  { t: 'Curriculum Vitae', d: 'Updated resume highlighting any technical or creative projects.' },
                  { t: 'Proof of Residence', d: 'Required for FICA and regional bursary allocation.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/3 border border-border-custom hover:border-brand/20 transition-all group">
                    <div className="mt-0.5 text-brand group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="font-syne font-bold text-sm text-white">{item.t}</h3>
                      <p className="text-[11px] text-text-muted mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex gap-3 items-center">
                <Info size={16} className="text-brand flex-shrink-0" />
                <p className="text-[10px] text-brand leading-relaxed font-bold italic">Documents must be in PDF format and less than 5MB per file.</p>
              </div>
              <button onClick={onClose} className="w-full btn btn-brand py-4 text-[10px] font-black tracking-widest uppercase">Understood, I'm Ready →</button>
            </div>
          </>
        )}

        {activeModal === 'interview_tips' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between bg-surface/50">
              <div>
                <div className="w-12 h-12 rounded-md bg-brand-dim border border-brand/20 flex items-center justify-center text-[22px] mb-3.5">💡</div>
                <h2 className="font-syne font-black text-2xl tracking-tighter text-white uppercase">Interview Tips</h2>
                <p className="text-[11px] text-text-dim font-dm-mono uppercase tracking-widest mt-1">GDA Technical Preparation Guide</p>
              </div>
              <button onClick={onClose} className="text-text-dim hover:text-white transition-colors p-2 -mr-2">✕</button>
            </div>
            <div className="p-7 md:p-8 space-y-6">
              <div className="space-y-4">
                {[
                  { t: 'Technical Curiosity', d: 'We value your drive to learn. Be ready to discuss tech trends you follow.' },
                  { t: 'Problem Solving', d: 'We might walk through a logic puzzle. Focus on your thought process.' },
                  { t: 'Communication', d: 'Technical skills are half the battle. We look for clear, professional communicators.' },
                  { t: 'The "Ginashe" Mindset', d: 'We want disruptors. Show us how you plan to solve African problems with tech.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#0a0d14] border border-border-custom hover:border-brand/20 transition-all group">
                    <div className="mt-0.5 text-brand group-hover:scale-110 transition-transform">
                      <Target size={18} />
                    </div>
                    <div>
                      <h3 className="font-syne font-bold text-sm text-white">{item.t}</h3>
                      <p className="text-[11px] text-text-muted mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 p-4 rounded-xl bg-surface border border-border-custom">
                <HelpCircle size={16} className="text-brand flex-shrink-0" />
                <p className="text-[10px] text-text-soft leading-relaxed italic">"Preparation is the prerequisite for performance. Walk in as a practitioner, not just a student."</p>
              </div>
              <button 
                onClick={() => { onClose(); onSwitchModal?.('apply_direct'); }} 
                className="w-full btn btn-brand py-4 text-[10px] font-black tracking-widest uppercase"
              >
                Schedule My Interview →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CourseDetailsModal({ courseId, onClose }: { courseId: string, onClose: () => void }) {
  const [course, setCourse] = React.useState<any>(null);
  const [modules, setModules] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDetails() {
      try {
        const { data: courseData, error: pErr } = await supabase
          .from('courses')
          .select('*, track:curriculum_tracks(name)')
          .eq('id', courseId)
          .single();
        
        if (pErr) throw pErr;
        setCourse(courseData);

        const { data: mods, error: mErr } = await supabase
          .from('modules')
          .select(`
            *,
            lessons(*)
          `)
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        if (mErr) throw mErr;
        setModules(mods);
      } catch (err) {
        console.error('Error fetching course details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [courseId]);

  if (isLoading) return (
    <div className="p-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  if (!course) return null;

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="p-7 md:p-8 pb-5 border-b border-border-custom bg-surface/50 flex justify-between items-start">
        <div className="flex items-center gap-12">
          <div>
            <div className="font-dm-mono text-[9px] text-brand uppercase tracking-widest mb-1.5">
              {course.track?.name || course.track} • {course.level}
              {course.status === 'coming_soon' && (
                <span className="ml-3 px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-brand font-bold">COMING SOON</span>
              )}
            </div>
            <h2 className={`font-syne font-extrabold text-white mb-1.5 ${window.location.pathname.includes('/levels/') ? 'text-4xl' : 'text-2xl'}`}>{course.title}</h2>
            <p className="text-text-soft text-[11px] max-w-2xl leading-relaxed">{course.short_description || course.description}</p>
          </div>
          {window.location.pathname.includes('/levels/') && (
            <div className="hidden lg:flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.03] border border-white/5 min-w-[280px]">
              <span className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.3em] font-bold">Institutional Logic</span>
              <p className="text-[10px] text-text-soft leading-tight">Completing the full <strong>{course.level} Pathway</strong> provides integrated credit mapping and architectural mastery across the entire track dimensions.</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1 h-1 rounded-full bg-emerald" />
                <span className="text-[8px] text-emerald uppercase font-bold tracking-widest">Recommended for Career Shifts</span>
              </div>
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-brand/10 hover:text-brand hover:border-brand transition-all duration-300">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-7 md:p-8 bg-black/10">
        {course.status === 'coming_soon' ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-brand/5 border border-brand/20 flex items-center justify-center text-3xl mb-6 animate-pulse">⏳</div>
            <h3 className="font-syne font-black text-2xl text-white mb-3 uppercase tracking-tighter">Registration Pending</h3>
            <p className="text-text-soft text-sm max-w-md leading-relaxed">
              This course is currently in the final stages of institutional digitisation. <br/>
              <span className="text-brand font-bold">Enrolments opening soon.</span>
            </p>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-syne font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
              >
                Return to Matrix
              </button>
            </div>
          </div>
        ) : modules.length > 0 ? (
          <div className="space-y-6">
            {modules.map((mod, mi) => (
              <div key={mod.id} className="animate-fadeUp">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center font-syne font-bold text-brand text-sm shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                    {mi + 1}
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-[16px] text-text-custom">{mod.title}</h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5 font-dm-mono">{mod.duration || '2 Weeks'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.lessons?.map((lesson: any, li: number) => (
                    <div key={lesson.id} className="bg-surface/40 border border-border-custom rounded-lg p-3 hover:border-brand/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-brand/5 blur-2xl group-hover:bg-brand/10 transition-colors" />
                      <div className="font-dm-mono text-[7px] text-text-muted mb-1 uppercase tracking-tighter">Session 0{li + 1}</div>
                      <h4 className="font-syne font-bold text-[13px] mb-1.5 group-hover:text-brand transition-colors leading-tight">{lesson.title}</h4>
                      <div className="space-y-2.5">
                        <div className="text-[10px] text-text-soft flex items-start gap-1.5 leading-relaxed">
                          <span className="text-brand mt-1 text-[7px]">▹</span>
                          {lesson.objective || 'Primary learning objective'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="text-3xl mb-3 opacity-50">📚</div>
            <h3 className="font-syne font-bold text-lg text-text-custom mb-1.5">Curriculum Loading</h3>
            <p className="text-text-soft text-[11px] max-w-sm opacity-70">Injecting high-fidelity session plans for this course. Please wait.</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border-custom bg-surface/80 flex flex-col sm:flex-row justify-between items-center gap-6">
         <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] text-text-muted uppercase tracking-widest font-dm-mono">Curriculum Track</span>
              <span className="text-[13px] font-bold text-brand py-0.5">{course.track || 'Institutional'}</span>
            </div>
            <div className="w-px h-8 bg-border-custom" />
            <div className="flex flex-col">
              <span className="text-[8px] text-text-muted uppercase tracking-widest font-dm-mono">Certification Level</span>
              <span className="text-[13px] font-bold text-brand py-0.5">{(course.nqf_level || 'Institutional Credit').replace(/NQF\s*Level\s*\d+/gi, 'Institutional Credit')}</span>
            </div>
            {window.location.pathname.includes('/levels/') && (
              <>
                <div className="w-px h-8 bg-border-custom" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-emerald uppercase tracking-widest font-dm-mono">Specialisation Status</span>
                  <span className="text-[13px] font-bold text-white py-0.5">Dual Path Enabled</span>
                </div>
              </>
            )}
         </div>
         
         {window.location.pathname.includes('/levels/') ? (
           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <button 
               onClick={() => {
                 onClose();
                 const url = `/apply?program=${encodeURIComponent(course.title)}`;
                 // Use window.location as we are outside of the main Router context sometimes or for safety
                 window.location.href = url;
               }}
               className="btn btn-outline btn-sm px-6 font-syne font-black uppercase text-[9px] tracking-widest"
             >
               Apply for {course.title} Only
             </button>
             <button 
               onClick={() => {
                 onClose();
                 window.location.href = `/apply?level=${encodeURIComponent(course.level)}`;
               }}
               className="btn btn-brand btn-sm px-8 font-syne font-black uppercase text-[10px] tracking-widest shadow-[0_10px_30px_rgba(0,242,255,0.15)]"
             >
               Apply for Full {course.level} Pathway →
             </button>
           </div>
         ) : (
            <button 
              onClick={() => {
                onClose();
                window.location.href = `/apply?program=${encodeURIComponent(course.title)}`;
              }}
              className="btn btn-brand btn-sm px-8"
            >
              Apply Now →
            </button>
          )}
      </div>
    </div>
  );
}
