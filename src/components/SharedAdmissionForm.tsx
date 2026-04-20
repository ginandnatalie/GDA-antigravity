import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, uploadFile } from '../lib/supabase';
import { 
  PROGRAMMES, 
  QUALIFICATIONS, 
  GENDERS, 
  COUNTRIES, 
  NATIONALITIES, 
  PROVINCES_SA 
} from '../lib/constants';

// ─── STYLES (Based on GDA Design System) ────────────────────────
const INPUT_CLASS = "w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 focus:shadow-[0_0_0_3px_rgba(0,242,255,0.07)] transition-all";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9`;
const LABEL_CLASS = "block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75";

interface SharedAdmissionFormProps {
  onOpenModal?: (id: string) => void;
  onSuccess?: () => void;
  initialProgram?: string;
  isModal?: boolean;
}

export default function SharedAdmissionForm({ onOpenModal, onSuccess, initialProgram = '', isModal = false }: SharedAdmissionFormProps) {
  const navigate = useNavigate();
  // ─── STEP STATE ──────────────────
  const [step, setStep] = useState<'check' | 'form' | 'existing'>('check');
  const [hasAccount, setHasAccount] = useState<string>('');
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  // ─── FORM STATE ──────────────────
  const [form, setForm] = useState({
    first: '', last: '', email: '', phone: '', prog: initialProgram, qual: '', msg: '',
    dob: '', idNumber: '', gender: '', nationality: 'South African',
    country: 'South Africa', address_line1: '', city: '', province: '', postal_code: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCheckDone, setDuplicateCheckDone] = useState(false);

  // ─── CHECK EXISTING ACCOUNT ──────
  const handleAccountCheck = async () => {
    if (hasAccount === 'yes') {
      if (!studentNumberInput.trim()) {
        setDuplicateMessage('Please enter your student number or email.');
        return;
      }
      setCheckingAccount(true);
      setDuplicateMessage('');
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('id, email, first_name, last_name, status, program')
          .or(`student_number.eq.${studentNumberInput.trim()},email.ilike.${studentNumberInput.trim()}`)
          .limit(1)
          .maybeSingle();

        if (data) {
          setStep('existing');
          setDuplicateMessage(`Welcome back, ${data.first_name || 'student'}! We found your record (${data.email}). Your application for ${data.program || 'a programme'} is currently: ${data.status || 'pending'}. Please sign in to your portal to continue.`);
        } else {
          setDuplicateMessage('No record found. Please double-check your student number or email, or select "No" to create a new application.');
        }
      } catch (err: any) {
        setDuplicateMessage('Error checking records. Please try again.');
      } finally {
        setCheckingAccount(false);
      }
    } else if (hasAccount === 'no') {
      setStep('form');
      setDuplicateMessage('');
    }
  };

  // ─── PRE-SUBMIT DUPLICATE CHECK ──
  const checkForDuplicates = async (): Promise<boolean> => {
    try {
      const emailClean = form.email.trim().toLowerCase();
      const { data: emailMatch } = await supabase
        .from('applications')
        .select('id, first_name, status, program')
        .eq('email', emailClean)
        .limit(1)
        .maybeSingle();

      if (emailMatch) {
        setDuplicateMessage(`It looks like you've already applied for ${emailMatch.program || 'a programme'} (Current Status: ${emailMatch.status}). Please sign in to your Student Portal to check your status.`);
        setStep('existing');
        return true;
      }

      if (form.idNumber.trim()) {
        const { data: idMatch } = await supabase
          .from('applications')
          .select('id, email, status, program')
          .eq('id_number', form.idNumber.trim())
          .limit(1)
          .maybeSingle();

        if (idMatch) {
          setDuplicateMessage(`A record with this ID/Passport number already exists (${idMatch.email}). Please sign in to your Student Portal.`);
          setStep('existing');
          return true;
        }
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  // ─── FORM SUBMIT ─────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check: DOB cannot be in the future
    if (form.dob) {
      const selectedDate = new Date(form.dob);
      const today = new Date();
      if (selectedDate > today) {
        alert("Date of Birth cannot be a future date!");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!duplicateCheckDone) {
        const isDuplicate = await checkForDuplicates();
        if (isDuplicate) {
          setIsSubmitting(false);
          return;
        }
        setDuplicateCheckDone(true);
      }

      let cvUrl = '';
      if (cvFile) cvUrl = await uploadFile(cvFile);

      const { error } = await supabase
        .from('applications')
        .insert([{
          first_name: form.first,
          last_name: form.last,
          email: form.email.trim().toLowerCase(),
          phone: form.phone,
          date_of_birth: form.dob || null,
          id_number: form.idNumber || null,
          gender: form.gender || null,
          nationality: form.nationality,
          address_line1: form.address_line1,
          city: form.city,
          province: form.province,
          country: form.country,
          postal_code: form.postal_code,
          program: form.prog,
          qualification: form.qual,
          message: form.msg,
          cv_url: cvUrl,
          type: 'individual',
          history: JSON.stringify([{
            event: 'Application Submitted',
            timestamp: new Date().toISOString(),
            details: 'Initial application submitted.'
          }])
        }]);

      if (error) throw error;

      // Process emails via backend
      try {
        await fetch('/api/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: `${form.first} ${form.last}`,
            program: form.prog,
            details: form
          })
        });
      } catch (processErr) {
        console.error('Email process error:', processErr);
      }

      if (onSuccess) onSuccess();
      
      // Navigate to verify page with email
      navigate(`/verify?email=${encodeURIComponent(form.email)}`, { replace: true });
    } catch (error: any) {
      alert(`Submission Error: ${error.message || 'Error occurred. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={`form-container ${isModal ? 'max-w-none' : ''}`}>
      {/* ─── STEP: CHECK ─── */}
      {step === 'check' && (
        <div className="space-y-5">
          <div className="bg-surface/50 border border-brand/15 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center text-lg">🎓</div>
              <div>
                <div className="font-syne font-bold text-[14px]">Academic Application Process</div>
                <div className="text-[11px] text-text-muted">Let's get you started on the right track</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={LABEL_CLASS}><span className="text-coral mr-1">*</span> Do you have a student number or have previously applied?</label>
                <select className={SELECT_CLASS} value={hasAccount} onChange={e => { setHasAccount(e.target.value); setDuplicateMessage(''); }}>
                  <option value="">— Please select —</option>
                  <option value="yes">Yes, I have applied before / have a student number</option>
                  <option value="no">No, this is my first application</option>
                </select>
              </div>

              {hasAccount === 'yes' && (
                <div className="animate-fadeUp">
                  <label className={LABEL_CLASS}>Student Number or Email</label>
                  <input type="text" className={INPUT_CLASS} placeholder="GDA-2026-XXXX or your@email.com" value={studentNumberInput} onChange={e => setStudentNumberInput(e.target.value)} />
                </div>
              )}

              {duplicateMessage && (
                <div className={`text-[12px] p-3 rounded-lg border bg-coral/5 border-coral/20 text-coral`}>{duplicateMessage}</div>
              )}

              {hasAccount && (
                <button onClick={handleAccountCheck} disabled={checkingAccount} className={`w-full p-3 bg-brand text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm hover:bg-brand-light transition-all ${checkingAccount ? 'opacity-50' : ''}`}>
                  {checkingAccount ? 'Checking...' : hasAccount === 'yes' ? 'Look Up My Record' : 'Start New Application →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP: EXISTING ─── */}
      {step === 'existing' && (
        <div className="space-y-5 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-3xl">👋</div>
          <h3 className="font-syne font-bold text-[18px] mb-2 text-brand">Welcome Back!</h3>
          <p className="text-[13px] text-text-soft leading-relaxed max-w-sm mx-auto">{duplicateMessage}</p>
          <div className="flex flex-col gap-3 pt-2">
            <button onClick={() => onOpenModal?.('student')} className="w-full p-3.5 bg-brand text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm hover:bg-brand-light transition-all">Sign In to My Portal →</button>
            <button onClick={() => { setStep('form'); setDuplicateCheckDone(false); }} className="w-full p-3 bg-transparent text-text-muted font-dm-mono text-[11px] tracking-wider uppercase border border-border-custom rounded-sm hover:text-brand transition-all">Apply for a different programme</button>
          </div>
        </div>
      )}

      {/* ─── STEP: FULL FORM ─── */}
      {step === 'form' && (
        <form onSubmit={handleSubmit} className="animate-fadeUp">
          {/* Section 1: Personal */}
          <div className="mb-6 pb-5 border-b border-border-custom">
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-brand mb-4">Step 1 — Personal Information</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>First Name <span className="text-coral">*</span></label>
                <input type="text" className={INPUT_CLASS} placeholder="Amara" value={form.first} onChange={e => setForm({...form, first: e.target.value})} required />
              </div>
              <div>
                <label className={LABEL_CLASS}>Last Name <span className="text-coral">*</span></label>
                <input type="text" className={INPUT_CLASS} placeholder="Dlamini" value={form.last} onChange={e => setForm({...form, last: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>Date of Birth <span className="text-coral">*</span></label>
                <input type="date" className={INPUT_CLASS} max={todayStr} value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} required />
              </div>
              <div>
                <label className={LABEL_CLASS}>Gender <span className="text-coral">*</span></label>
                <select className={SELECT_CLASS} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
                  <option value="">Select…</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Nationality <span className="text-coral">*</span></label>
                <select className={SELECT_CLASS} value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} required>
                  <option value="">Select…</option>
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>{form.nationality === 'South African' ? 'SA ID Number' : 'Passport Number'} <span className="text-coral">*</span></label>
                <input type="text" className={INPUT_CLASS} placeholder="ID/Passport Number" value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} required />
              </div>
            </div>
          </div>

          {/* Section 2: Residential Address (COUNTRY FIRST) */}
          <div className="mb-6 pb-5 border-b border-border-custom">
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-sky mb-4">Step 2 — Residential Address</div>
            <div className="mb-4">
              <label className={LABEL_CLASS}>Country <span className="text-coral">*</span></label>
              <select className={SELECT_CLASS} value={form.country} onChange={e => setForm({...form, country: e.target.value})} required>
                <option value="">Select Country…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className={LABEL_CLASS}>Street Address <span className="text-coral">*</span></label>
              <input type="text" className={INPUT_CLASS} placeholder="123 Digital Square" value={form.address_line1} onChange={e => setForm({...form, address_line1: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>City <span className="text-coral">*</span></label>
                <input type="text" className={INPUT_CLASS} placeholder="Johannesburg" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
              </div>
              <div>
                <label className={LABEL_CLASS}>Postal Code {form.country === 'South Africa' && <span className="text-coral">*</span>}</label>
                <input type="text" className={INPUT_CLASS} placeholder="2001" value={form.postal_code} onChange={e => setForm({...form, postal_code: e.target.value})} required={form.country === 'South Africa'} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Province/State <span className="text-coral">*</span></label>
              {form.country === 'South Africa' ? (
                <select className={SELECT_CLASS} value={form.province} onChange={e => setForm({...form, province: e.target.value})} required>
                  <option value="">Select Province…</option>
                  {PROVINCES_SA.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : (
                <input type="text" className={INPUT_CLASS} placeholder="State/Province Name" value={form.province} onChange={e => setForm({...form, province: e.target.value})} required />
              )}
            </div>
          </div>

          {/* Section 3: Contact & Academics */}
          <div className="mb-6 pb-5 border-b border-border-custom">
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-emerald mb-4">Step 3 — Contact & Academics</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>Email Address <span className="text-coral">*</span></label>
                <input type="email" className={INPUT_CLASS} placeholder="amara@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div>
                <label className={LABEL_CLASS}>Mobile Number</label>
                <input type="tel" className={INPUT_CLASS} placeholder="+27 XX XXX XXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
            <div className="mb-4">
              <label className={LABEL_CLASS}>Programme of Interest <span className="text-coral">*</span></label>
              <select className={SELECT_CLASS} value={form.prog} onChange={e => setForm({...form, prog: e.target.value})} required>
                <option value="">Select a programme…</option>
                {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className={LABEL_CLASS}>Highest Qualification</label>
              <select className={SELECT_CLASS} value={form.qual} onChange={e => setForm({...form, qual: e.target.value})}>
                <option value="">Select…</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className={LABEL_CLASS}>Upload CV (PDF)</label>
              <input type="file" accept=".pdf" className={INPUT_CLASS} onChange={e => setCvFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Message (optional)</label>
              <textarea className={`${INPUT_CLASS} resize-y min-h-[80px]`} placeholder="Tell us about your background and goals…" value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}></textarea>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={`w-full p-3.5 bg-brand text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm hover:bg-brand-light transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? 'Submitting Application...' : 'Submit Application →'}
          </button>

          <button type="button" onClick={() => { setStep('check'); setDuplicateCheckDone(false); }} className="block w-full text-center mt-4 text-[11px] text-text-muted hover:text-brand transition-colors">← Back to account check</button>
        </form>
      )}
    </div>
  );
}
