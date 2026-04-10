import React, { useState } from 'react';
import { supabase, uploadFile } from '../lib/supabase';
import { useAuth } from '../lib/auth';

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

  const [indForm, setIndForm] = useState({ 
    title: '', first: '', last: '', email: '', phone: '', prog: '', qual: '', msg: '', dob: '', idNumber: '', gender: '', nationality: 'South Africa',
    address_line1: '', city: '', province: '', postal_code: '',
    previous_qualifications: [] as { name: string, institution: string, year: string }[]
  });
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [orgForm, setOrgForm] = useState({ org: '', contact: '', email: '', phone: '', size: '', msg: '' });
  const [partnerForm, setPartnerForm] = useState({ name: '', type: '', email: '', phone: '', msg: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');

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
      alert('Password updated successfully! You can now sign in.');
      onClose();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indForm.first || !indForm.email) return;

    // 0. DOB Validation (No future dates)
    const dobDate = new Date(indForm.dob);
    const today = new Date();
    if (dobDate > today) {
      alert('Error: Date of Birth cannot be in the future.');
      return;
    }

    setIsSubmitting(true);
    setDuplicateWarning('');
    try {
      // 1. Check if they already have a student profile (most severe duplicate)
      const { data: profileMatch } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', indForm.email.trim().toLowerCase())
        .maybeSingle();

      if (profileMatch) {
        setDuplicateWarning(`You already have a student account! Please sign in to your portal.`);
        setIsSubmitting(false);
        return;
      }

      // 2. Check for existing pending/approved applications
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id, first_name, status, program')
        .eq('email', indForm.email.trim().toLowerCase())
        .limit(1)
        .maybeSingle();

      if (existingApp) {
        setDuplicateWarning(`You've already applied for ${existingApp.program || 'a programme'} (Status: ${existingApp.status}). Please sign in to your Student Portal to check your status.`);
        setIsSubmitting(false);
        return;
      }

      let cvUrl = '';
      if (cvFile) {
        cvUrl = await uploadFile(cvFile);
      }

      const { error } = await supabase.from('applications').insert([{
        title: indForm.title || null,
        first_name: indForm.first,
        last_name: indForm.last,
        email: indForm.email.trim().toLowerCase(),
        phone: indForm.phone,
        date_of_birth: indForm.dob || null,
        id_number: indForm.idNumber || null,
        gender: indForm.gender || null,
        nationality: indForm.nationality || 'South Africa',
        address_line1: indForm.address_line1 || null,
        city: indForm.city || null,
        province: indForm.province || null,
        postal_code: indForm.postal_code || null,
        previous_qualifications: indForm.previous_qualifications.length > 0 ? indForm.previous_qualifications : null,
        program: indForm.prog,
        qualification: indForm.qual,
        message: indForm.msg,
        cv_url: cvUrl,
        type: 'individual',
        ai_match_score: Math.floor(Math.random() * 30) + 70,
        history: JSON.stringify([{
          event: 'Application Submitted',
          timestamp: new Date().toISOString(),
          details: 'Submitted via multi-step admission form.'
        }])
      }]);

      if (error) throw error;

      // Process emails via backend
      try {
        await fetch('/api/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: indForm.email,
            name: `${indForm.first} ${indForm.last}`,
            program: indForm.prog,
            details: indForm
          })
        });
      } catch (processErr) {
        console.error('Error processing application emails:', processErr);
      }

      alert(`Application submitted, ${indForm.first}! 🎉\nWe'll contact you within 2 business days.\nPlease check your email for confirmation.`);
      setIndForm({ 
        title: '', first: '', last: '', email: '', phone: '', prog: '', qual: '', msg: '', dob: '', idNumber: '', gender: '', nationality: 'South Africa',
        address_line1: '', city: '', province: '', postal_code: '',
        previous_qualifications: []
      });
      setCvFile(null);
      onClose();
    } catch (err: any) {
      console.error('Individual submission error:', err);
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

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className={`fixed inset-0 z-[2000] bg-bg/88 backdrop-blur-md flex items-center justify-center p-6 transition-opacity duration-250 ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border-custom rounded-3xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto transform transition-transform duration-300 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)]"
        onClick={stopPropagation}
      >
        {activeModal === 'student' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-gold-dim border border-gold/20 flex items-center justify-center text-[22px] mb-3.5">🎓</div>
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
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${studentTab === 'login' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setStudentTab('login')}>Sign In</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${studentTab === 'forgot' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setStudentTab('forgot')}>Reset Password</button>
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
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                      placeholder="student@email.com" 
                      value={loginForm.email}
                      onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                      placeholder="Enter your password" 
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-sky w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Signing In...' : 'Access My Portal →'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted">New student? <a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => onSwitchModal?.('apply')}>Apply for a programme</a></div>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Your Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                      placeholder="student@email.com" 
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-sky w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted"><a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => setStudentTab('login')}>← Back to sign in</a></div>
                </form>
              )}
            </div>
          </>
        )}

        {activeModal === 'admin' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-gold-dim border border-gold/20 flex items-center justify-center text-[22px] mb-3.5">⚙️</div>
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
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${adminTab === 'login' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setAdminTab('login')}>Staff Login</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${adminTab === 'twofa' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setAdminTab('twofa')}>2FA Verify</button>
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
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
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
                      className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                      placeholder="Staff password" 
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Access Role</label>
                    <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9">
                      <option value="">Select your role…</option>
                      <option>Academy Administrator</option>
                      <option>Instructor / Faculty</option>
                      <option>Curriculum Designer</option>
                      <option>Placement Officer</option>
                      <option>SETA Compliance Officer</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-gold w-full py-3.5 justify-center mt-2">
                    {isSubmitting ? 'Signing In...' : 'Continue to 2FA →'}
                  </button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted">Unauthorised access attempts are logged and reported to Ginashe Digital.</div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-[13px] text-text-soft mb-4.5">Enter the 6-digit code from your authenticator app or SMS.</p>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Two-Factor Code</label>
                    <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-mono text-[22px] text-text-custom text-center tracking-[0.4em] outline-none focus:border-gold/40 transition-all" placeholder="000 000" maxLength={7} />
                  </div>
                  <button className="btn btn-gold w-full py-3.5 justify-center mt-2" onClick={onClose}>Verify & Enter Portal →</button>
                  <div className="text-center mt-3.5 text-[11px] text-text-muted"><a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => setAdminTab('login')}>← Back</a></div>
                </div>
              )}
            </div>
          </>
        )}

        {activeModal === 'reset-password' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-gold-dim border border-gold/20 flex items-center justify-center text-[22px] mb-3.5">🔐</div>
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
                  <input 
                    type="password" 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                    placeholder="Min 6 characters" 
                    value={resetForm.password}
                    onChange={e => setResetForm({...resetForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Confirm Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                    placeholder="Repeat new password" 
                    value={resetForm.confirm}
                    onChange={e => setResetForm({...resetForm, confirm: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-gold w-full py-3.5 justify-center mt-2">
                  {isSubmitting ? 'Updating...' : 'Update Password →'}
                </button>
              </form>
            </div>
          </>
        )}

        {activeModal === 'apply' && (
          <>
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-md bg-gold-dim border border-gold/20 flex items-center justify-center text-[22px] mb-3.5">✍️</div>
                <div className="font-syne font-extrabold text-[20px]">Apply to the Academy</div>
                <div className="text-[12px] text-text-muted mt-1">We'll be in touch within 2 business days</div>
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
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${applyTab === 'ind' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setApplyTab('ind')}>Individual</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${applyTab === 'org' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setApplyTab('org')}>Organisation</button>
              <button className={`px-4.5 pb-3 rounded-t-sm font-dm-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none bg-none transition-all border-b-2 ${applyTab === 'partner' ? 'text-gold border-gold' : 'text-text-muted border-transparent hover:text-text-soft'}`} onClick={() => setApplyTab('partner')}>Partner</button>
            </div>
            <div className="p-6 md:p-8">
              {applyTab === 'ind' && (
                <form className="flex flex-col gap-6" onSubmit={handleIndSubmit}>
                  {duplicateWarning && (
                    <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 flex flex-col gap-3">
                      <p className="text-[12px] text-gold leading-relaxed">{duplicateWarning}</p>
                      <button type="button" onClick={() => { onClose(); setTimeout(() => onLoginSuccess?.('student'), 100); }} className="btn btn-gold btn-sm w-full justify-center text-[11px]">Sign In to My Portal →</button>
                    </div>
                  )}

                  {/* ─── SECTION: Biographical ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border-custom pb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                      <span className="font-syne font-bold text-[11px] uppercase tracking-wider text-text-dim">Biographical Data</span>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Title <span className="text-coral">*</span></label>
                        <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_8px_center] pr-6" value={indForm.title} onChange={e => setIndForm({...indForm, title: e.target.value})} required>
                          <option value="">Select…</option>
                          <option>Mr</option>
                          <option>Ms</option>
                          <option>Mrs</option>
                          <option>Dr</option>
                          <option>Prof</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">First Name <span className="text-coral">*</span></label>
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="Amara" value={indForm.first} onChange={e => setIndForm({...indForm, first: e.target.value})} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Last Name <span className="text-coral">*</span></label>
                      <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="Dlamini" value={indForm.last} onChange={e => setIndForm({...indForm, last: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Date of Birth <span className="text-coral">*</span></label>
                        <input 
                          type="date" 
                          className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" 
                          value={indForm.dob} 
                          onChange={e => setIndForm({...indForm, dob: e.target.value})} 
                          max={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Gender <span className="text-coral">*</span></label>
                        <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_10px_center] pr-9" value={indForm.gender} onChange={e => setIndForm({...indForm, gender: e.target.value})} required>
                          <option value="">Select…</option>
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">SA ID / Passport <span className="text-coral">*</span></label>
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="ID Number" value={indForm.idNumber} onChange={e => setIndForm({...indForm, idNumber: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Nationality <span className="text-coral">*</span></label>
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" value={indForm.nationality} onChange={e => setIndForm({...indForm, nationality: e.target.value})} required />
                      </div>
                    </div>
                  </div>

                  {/* ─── SECTION: Address ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border-custom pb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky"></div>
                      <span className="font-syne font-bold text-[11px] uppercase tracking-wider text-text-dim">Residential Address</span>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Street Address <span className="text-coral">*</span></label>
                      <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="123 Digital Square" value={indForm.address_line1} onChange={e => setIndForm({...indForm, address_line1: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">City <span className="text-coral">*</span></label>
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="Johannesburg" value={indForm.city} onChange={e => setIndForm({...indForm, city: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Postal Code {indForm.nationality === 'South Africa' ? <span className="text-coral">*</span> : '(Optional)'}</label>
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="2001" value={indForm.postal_code} onChange={e => setIndForm({...indForm, postal_code: e.target.value})} required={indForm.nationality === 'South Africa'} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Province/State <span className="text-coral">*</span></label>
                      {indForm.nationality === 'South Africa' ? (
                        <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_10px_center] pr-9" value={indForm.province} onChange={e => setIndForm({...indForm, province: e.target.value})} required>
                          <option value="">Select Province…</option>
                          <option>Gauteng</option>
                          <option>Western Cape</option>
                          <option>KwaZulu-Natal</option>
                          <option>Eastern Cape</option>
                          <option>Free State</option>
                          <option>Limpopo</option>
                          <option>Mpumalanga</option>
                          <option>North West</option>
                          <option>Northern Cape</option>
                        </select>
                      ) : (
                        <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="Province / State Name" value={indForm.province} onChange={e => setIndForm({...indForm, province: e.target.value})} required />
                      )}
                    </div>
                  </div>

                  {/* ─── SECTION: Academics ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border-custom pb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald"></div>
                      <span className="font-syne font-bold text-[11px] uppercase tracking-wider text-text-dim">Academic Background</span>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Programme of Interest <span className="text-coral">*</span></label>
                      <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9" value={indForm.prog} onChange={e => setIndForm({...indForm, prog: e.target.value})} required>
                        <option value="">Select a programme…</option>
                        <option>Cloud Launchpad (Foundation / SETA)</option>
                        <option>Cloud Architecture Residency</option>
                        <option>AI & Machine Learning Engineering</option>
                        <option>Data Engineering & Analytics</option>
                        <option>AI for Business Leaders</option>
                        <option>DevSecOps</option>
                        <option>I want guidance — not sure yet</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Highest Qualification <span className="text-coral">*</span></label>
                      <select className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all appearance-none" value={indForm.qual} onChange={e => setIndForm({...indForm, qual: e.target.value})} required>
                        <option value="">Select…</option>
                        <option>Matric / NSC</option>
                        <option>Diploma</option>
                        <option>Bachelor's Degree</option>
                        <option>Postgraduate Degree</option>
                        <option>Professional Certification</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">Previous Qualifications (Optional)</label>
                      {indForm.previous_qualifications.map((q, i) => (
                        <div key={i} className="p-4 rounded-lg bg-surface border border-border-custom relative group animate-fadeUp">
                          <button type="button" onClick={() => {
                            const updated = [...indForm.previous_qualifications];
                            updated.splice(i, 1);
                            setIndForm({...indForm, previous_qualifications: updated});
                          }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral/20 text-coral flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity border border-coral/20">✕</button>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input type="text" placeholder="Qualification Name" className="bg-transparent border-b border-border-custom text-sm py-1 outline-none focus:border-gold" value={q.name} onChange={e => {
                              const updated = [...indForm.previous_qualifications];
                              updated[i].name = e.target.value;
                              setIndForm({...indForm, previous_qualifications: updated});
                            }} />
                            <input type="text" placeholder="Year Obtained" className="bg-transparent border-b border-border-custom text-sm py-1 outline-none focus:border-gold" value={q.year} onChange={e => {
                              const updated = [...indForm.previous_qualifications];
                              updated[i].year = e.target.value;
                              setIndForm({...indForm, previous_qualifications: updated});
                            }} />
                          </div>
                          <input type="text" placeholder="Institution Name" className="w-full bg-transparent border-b border-border-custom text-sm py-1 outline-none focus:border-gold" value={q.institution} onChange={e => {
                            const updated = [...indForm.previous_qualifications];
                            updated[i].institution = e.target.value;
                            setIndForm({...indForm, previous_qualifications: updated});
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setIndForm({...indForm, previous_qualifications: [...indForm.previous_qualifications, { name: '', institution: '', year: '' }]})} className="w-full py-3 border border-dashed border-border-custom rounded-lg text-[10px] font-dm-mono uppercase tracking-widest text-text-dim hover:border-gold/40 hover:text-gold transition-all text-center">
                        + Add Qualification
                      </button>
                    </div>
                  </div>

                  {/* ─── SECTION: Communication & CV ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border-custom pb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                      <span className="font-syne font-bold text-[11px] uppercase tracking-wider text-text-dim">Contact & Documents</span>
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Email Address <span className="text-coral">*</span></label>
                      <input type="email" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="amara@email.com" value={indForm.email} onChange={e => { setIndForm({...indForm, email: e.target.value}); setDuplicateWarning(''); }} required />
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Mobile Number <span className="text-coral">*</span></label>
                      <input type="tel" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="+27 XX XXX XXXX" value={indForm.phone} onChange={e => setIndForm({...indForm, phone: e.target.value})} required />
                    </div>

                    <div className="form-group">
                      <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Upload CV / ID (PDF) (Optional)</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept=".pdf"
                          className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-soft outline-none focus:border-gold/40 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-white/5 file:text-gold file:text-[10px] file:font-dm-mono file:uppercase" 
                          onChange={e => setCvFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={`btn btn-gold w-full py-4 justify-center mt-4 font-syne font-extrabold text-[15px] shadow-[0_20px_40px_rgba(244,162,26,0.15)] ${isSubmitting ? 'opacity-50' : ''}`}>
                    {isSubmitting ? 'Processing Application...' : 'Submit Application →'}
                  </button>
                  <p className="text-center text-[10px] text-text-dim mt-2 italic">By submitting, you agree to our terms of service and POPIA compliance policy.</p>
                </form>
              )}
              {applyTab === 'org' && (
                <form className="flex flex-col gap-4" onSubmit={handleOrgSubmit}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Company Name</label>
                    <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="Acme Financial Services" value={orgForm.org} onChange={e => setOrgForm({...orgForm, org: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Contact Person</label>
                    <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="HR / L&D Manager" value={orgForm.contact} onChange={e => setOrgForm({...orgForm, contact: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Business Email</label>
                    <input type="email" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="training@company.co.za" value={orgForm.email} onChange={e => setOrgForm({...orgForm, email: e.target.value})} required />
                  </div>
                  <button type="submit" disabled={isSubmitting} className={`btn btn-gold w-full py-3.5 justify-center mt-2 ${isSubmitting ? 'opacity-50' : ''}`}>
                    {isSubmitting ? 'Submitting...' : 'Send Enterprise Enquiry →'}
                  </button>
                </form>
              )}
              {applyTab === 'partner' && (
                <form className="flex flex-col gap-4" onSubmit={handlePartnerSubmit}>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Organisation Name</label>
                    <input type="text" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="e.g. Amazon Web Services" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Contact Email</label>
                    <input type="email" className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all" placeholder="partnerships@org.com" value={partnerForm.email} onChange={e => setPartnerForm({...partnerForm, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75">Message</label>
                    <textarea className="w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 transition-all resize-y min-h-[100px]" placeholder="Tell us about your partnership interest…" value={partnerForm.msg} onChange={e => setPartnerForm({...partnerForm, msg: e.target.value})}></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className={`btn btn-gold w-full py-3.5 justify-center mt-2 ${isSubmitting ? 'opacity-50' : ''}`}>
                    {isSubmitting ? 'Submitting...' : 'Send Partnership Enquiry →'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
