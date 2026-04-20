import React, { useState } from 'react';
import { supabase, uploadFile } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import SharedAdmissionForm from './SharedAdmissionForm';
import { Eye, EyeOff } from 'lucide-react';

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
  const [partnerForm, setPartnerForm] = useState({ name: '', type: '', email: '', phone: '', msg: '' });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      alert('A branded password reset link has been sent to your email!');
      setStudentTab('login');
      setAdminTab('login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetForm.password !== resetForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: resetForm.password
      });
      if (error) throw error;
      alert('Password updated successfully!');
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
      alert('Error: ' + err.message);
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
      alert('Logged in successfully!');
      if (onLoginSuccess) {
        onLoginSuccess(loginForm.email.includes('ginashe.co.za') ? 'admin' : 'student');
      }
      onClose();
    } catch (err: any) {
      alert('Login Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.org || !orgForm.email) return;
    setIsSubmitting(true);
    console.log('Submitting organisation enquiry...', orgForm);
    try {
      const { error } = await supabase.from('applications').insert([{
        organization_name: orgForm.org,
        contact_person: orgForm.contact,
        email: orgForm.email,
        phone: orgForm.phone,
        org_size: orgForm.size,
        message: orgForm.msg,
        type: 'organisation'
      }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Insert successful');
      
      // 2. Call the backend to process emails
      try {
        await fetch('/api/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: orgForm.email,
            name: orgForm.org,
            type: 'organisation',
            details: orgForm
          })
        });
      } catch (processErr) {
        console.error('Error processing organisation enquiry emails:', processErr);
      }

      alert(`Enquiry submitted for ${orgForm.org}! Our enterprise team will reach out.`);
      setOrgForm({ org: '', contact: '', email: '', phone: '', size: '', msg: '' });
      onClose();
    } catch (err: any) {
      console.error('Organisation submission error:', err);
      let errorMsg = 'Unknown error occurred';
      if (err && typeof err === 'object') {
        errorMsg = err.message || err.details || JSON.stringify(err);
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      alert('Submission Error: ' + errorMsg);
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
        await fetch('/api/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: partnerForm.email,
            name: partnerForm.name,
            type: 'partner',
            details: partnerForm
          })
        });
      } catch (processErr) {
        console.error('Error processing partner enquiry emails:', processErr);
      }

      alert(`Partnership enquiry submitted, ${partnerForm.name}!`);
      setPartnerForm({ name: '', type: '', email: '', phone: '', msg: '' });
      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      alert('Error: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCourseId = activeModal && (activeModal.length > 20 || !isNaN(Number(activeModal))); // Supports UUIDs and Integer IDs

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className={`fixed inset-0 z-[2000] bg-bg/88 backdrop-blur-md flex items-center justify-center p-6 transition-opacity duration-250 ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-card border border-border-custom rounded-3xl w-full ${isCourseId && window.location.pathname.includes('/levels/') ? 'max-w-5xl' : 'max-w-[480px]'} max-h-[90vh] overflow-y-auto transform transition-transform duration-300 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--color-brand),transparent)]`}
        onClick={stopPropagation}
      >
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
                  <div className="text-center mt-3.5 text-[11px] text-text-muted">New student? <a className="text-brand no-underline cursor-pointer hover:underline" onClick={() => onSwitchModal?.('apply')}>Apply for a programme</a></div>
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
                      <option>SETA Compliance Officer</option>
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
        const { data: prog, error: pErr } = await supabase
          .from('programs')
          .select('*')
          .eq('id', courseId)
          .single();
        
        if (pErr) throw pErr;
        setCourse(prog);

        const { data: mods, error: mErr } = await supabase
          .from('modules')
          .select(`
            *,
            lessons(*),
            courses!inner(title)
          `)
          .or(`course_id.eq.${courseId},courses.title.eq."${prog.title}"`)
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
            <div className="font-dm-mono text-[9px] text-brand uppercase tracking-widest mb-1.5">{course.track} • {course.level}</div>
            <h2 className={`font-syne font-extrabold text-white mb-1.5 ${window.location.pathname.includes('/levels/') ? 'text-4xl' : 'text-2xl'}`}>{course.title}</h2>
            <p className="text-text-soft text-[11px] max-w-2xl leading-relaxed">{course.description}</p>
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
        {modules.length > 0 ? (
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
                        {lesson.lab_details && (
                          <div className="mt-2.5 p-2 rounded bg-black/30 border border-white/5 text-[8px] text-text-dim/80 italic font-dm-sans">
                            <strong className="text-brand/80 not-italic mr-1.5 font-dm-mono">LAB:</strong> {lesson.lab_details.split('\n')[0]}
                          </div>
                        )}
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
              <span className="text-[8px] text-text-muted uppercase tracking-widest font-dm-mono">NQF Equivalence</span>
              <span className="text-[13px] font-bold text-brand py-0.5">{course.nqf_level || 'Industry Ready'}</span>
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
               onClick={() => window.location.href = `/admissions?type=module&id=${courseId}`}
               className="btn btn-outline btn-sm px-6 font-syne font-black uppercase text-[9px] tracking-widest"
             >
               Apply for {course.title} Only
             </button>
             <button 
               onClick={() => window.location.href = `/admissions?type=level&id=${courseId}`}
               className="btn btn-brand btn-sm px-8 font-syne font-black uppercase text-[10px] tracking-widest shadow-[0_10px_30px_rgba(0,242,255,0.15)]"
             >
               Apply for Full {course.level} Pathway →
             </button>
           </div>
         ) : (
           <button 
             onClick={() => window.location.href = '/admissions'}
             className="btn btn-brand btn-sm px-8"
           >
             Apply Now →
           </button>
         )}
      </div>
    </div>
  );
}
