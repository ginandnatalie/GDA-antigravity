import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, uploadFile } from '../lib/supabase';
import { getNextStudentNumber, validateStudentIdentity } from '../lib/students';
import { 
  PROGRAMMES, 
  QUALIFICATIONS, 
  GENDERS, 
  COUNTRIES, 
  NATIONALITIES, 
  PROVINCES_SA,
  LEVELS,
  INTAKE_SCHEDULE,
  INSTITUTIONAL_TRACKS,
  TRACK_PROGRAMMES,
  COURSE_MODULES,
  ENTERPRISE_SOLUTIONS,
  INSTITUTIONAL_CODES
} from '../lib/constants';

const PORTAL_URL = 'https://gda-student-portal.pages.dev/';

// ─── STYLES (Based on GDA Design System) ────────────────────────
const INPUT_CLASS = "w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-brand/40 focus:shadow-[0_0_0_3px_rgba(0,242,255,0.07)] transition-all";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9`;
const LABEL_CLASS = "block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75";

interface SharedAdmissionFormProps {
  onOpenModal?: (id: string) => void;
  onSuccess?: () => void;
  initialProgram?: string;
  initialPaymentMode?: string;
  isModal?: boolean;
}

export default function SharedAdmissionForm({ onOpenModal, onSuccess, initialProgram = '', initialPaymentMode = '', isModal = false }: SharedAdmissionFormProps) {
  const navigate = useNavigate();
  // ─── STEP STATE ──────────────────
  const [step, setStep] = useState<'check' | 'form' | 'existing' | 'success'>('check');
  const [hasAccount, setHasAccount] = useState<string>('');
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [showEnterpriseSelector, setShowEnterpriseSelector] = useState(false);
  const [selectedCourseForModule, setSelectedCourseForModule] = useState<string>('');
  const [accessCode, setAccessCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // ─── DATE-AWARE ADMISSION LOGIC ───
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const isIntakePast = (year: string, intakeName: string) => {
    const y = parseInt(year);
    if (y < currentYear) return true;
    if (y > currentYear) return false;
    const intake = INTAKE_SCHEDULE.find(i => i.name === intakeName);
    if (!intake) return false; // Enterprise/Rolling is always available
    
    // Calculate closing date
    const startDate = new Date(y, intake.monthIdx, intake.day);
    const closingDate = new Date(startDate);
    closingDate.setDate(startDate.getDate() - intake.closingDaysBefore);
    
    // If today is past the closing date, the intake is closed
    return now >= closingDate;
  };

  // Determine initial intake
  const getInitialIntake = (year: string) => {
    for (const window of INTAKE_SCHEDULE) {
      if (!isIntakePast(year, window.name)) return window.name;
    }
    return 'Enterprise/Rolling';
  };

  // ─── FORM STATE ──────────────────
  const [selectionType, setSelectionType] = useState<'level' | 'program'>(initialProgram ? 'program' : 'level');
  const [form, setForm] = useState({
    first: '', last: '', email: '', phone: '', prog: initialProgram, level: '', msg: '',
    dob: '', idNumber: '', gender: '', nationality: 'South African',
    country: 'South Africa', address_line1: '', city: '', province: '', postal_code: '',
    payment_mode: initialPaymentMode || '',
    study_year: currentYear.toString(),
    study_intake: getInitialIntake(currentYear.toString())
  });
  
  // File States
  const [idFile, setIdFile] = useState<File | null>(null);
  const [matricFile, setMatricFile] = useState<File | null>(null);
  const [residenceFile, setResidenceFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);
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
        const result = await validateStudentIdentity(studentNumberInput.trim());

        if (result) {
          const { data } = result;
          setStep('existing');
          const statusText = result.type === 'profile' ? 'Active Enrolled' : (data.status || 'pending');
          setDuplicateMessage(`Institutional Record Found: Welcome back, ${data.first_name || 'student'}! We found your ${result.type} (${data.email}). Status: ${statusText}. Redirecting to Student Portal...`);
          
          // Redirect after a short delay to allow the user to see the message
          setTimeout(() => {
            window.location.href = PORTAL_URL;
          }, 2500);
        } else {
          setDuplicateMessage('No institutional record found. Please double-check your student number or email, or select "No" to start a fresh application.');
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

  // ─── PRE-SUBMIT DUPLICATE CHECK (Intelligent Scan) ──
  const checkForDuplicates = async (): Promise<boolean> => {
    setIsScanning(true);
    try {
      const emailClean = form.email.trim().toLowerCase();
      const phoneClean = form.phone.trim();
      const idClean = form.idNumber.trim();

      // 1. Check Profiles (Registered Students)
      let { data: profileMatch } = await supabase
        .from('profiles')
        .select('id, email, first_name, student_number')
        .or(`email.ilike.${emailClean}${phoneClean ? `,phone.eq.${phoneClean}` : ''}${idClean ? `,id_number.eq.${idClean}` : ''}`)
        .limit(1)
        .maybeSingle();

      if (profileMatch) {
        setDuplicateMessage(`Institutional Record Detected: You are already registered as a student (${profileMatch.student_number}). Please select 'Forgot Password' on the Student Portal to regain access and apply for further programmes from your dashboard.`);
        setStep('existing');
        setIsScanning(false);
        return true;
      }

      // 2. Check Applications (Pending/Historical)
      let { data: appMatch } = await supabase
        .from('applications')
        .select('id, email, first_name, status, program')
        .or(`email.ilike.${emailClean}${phoneClean ? `,phone.eq.${phoneClean}` : ''}${idClean ? `,id_number.eq.${idClean}` : ''}`)
        .limit(1)
        .maybeSingle();

      if (appMatch) {
        setDuplicateMessage(`Existing Application Found: You have a previous record for ${appMatch.program || 'a programme'} (Status: ${appMatch.status}). To maintain your academic history, please sign in to your Student Portal. If you cannot access your account, use the 'Forgot Password' option.`);
        setStep('existing');
        setIsScanning(false);
        return true;
      }

      setIsScanning(false);
      return false;
    } catch (err) {
      console.error('Intelligent Scan Error:', err);
      setIsScanning(false);
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

      // Generate institutional ID
      const studentNumber = await getNextStudentNumber();

      // Parallel file uploads for institutional record-keeping
      const [idUrl, matricUrl, residenceUrl, motivationUrl, cvUrl] = await Promise.all([
        idFile ? uploadFile(idFile, 'documents', 'id_docs') : Promise.resolve(''),
        matricFile ? uploadFile(matricFile, 'documents', 'matric_docs') : Promise.resolve(''),
        residenceFile ? uploadFile(residenceFile, 'documents', 'residence_docs') : Promise.resolve(''),
        motivationFile ? uploadFile(motivationFile, 'documents', 'motivation_docs') : Promise.resolve(''),
        cvFile ? uploadFile(cvFile, 'documents', 'cvs') : Promise.resolve('')
      ]);

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
          program: selectionType === 'level' ? form.level : form.prog,
          qualification: form.qual,
          payment_mode: form.payment_mode,
          message: form.msg,
          // Individual Document URLs
          id_url: idUrl,
          matric_url: matricUrl,
          residence_url: residenceUrl,
          motivation_url: motivationUrl,
          cv_url: cvUrl,
          // Academic Period
          study_year: form.study_year,
          study_intake: form.study_intake,
          student_number: studentNumber,
          type: 'individual',
          history: JSON.stringify([{
            event: 'Application Submitted',
            timestamp: new Date().toISOString(),
            details: `Initial application submitted for ${selectionType === 'level' ? form.level : form.prog}. Intake: ${form.study_intake} ${form.study_year}. Payment Mode: ${form.payment_mode}`
          }])
        }]);

      if (error) throw error;

      // Process emails via backend
      try {
        await fetch('https://ffgypwmrmdosaihgpkuw.supabase.co/functions/v1/process-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: `${form.first} ${form.last}`,
            program: selectionType === 'level' ? form.level : form.prog,
            details: form
          })
        });
      } catch (processErr) {
        console.error('Email process error:', processErr);
      }

      if (onSuccess) onSuccess();
      
      // Set to success step instead of immediate redirect
      setStep('success');
    } catch (error: any) {
      toast.error('Admission Portal Error', {
        description: error.message || 'The application registry encountered an issue. Please try again.'
      });
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
                  <input type="text" className={INPUT_CLASS} placeholder="ST-XXXX or your@email.com" value={studentNumberInput} onChange={e => setStudentNumberInput(e.target.value)} />
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
            <button 
              onClick={() => window.location.href = PORTAL_URL} 
              className="w-full p-3.5 bg-brand text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm hover:bg-brand-light transition-all"
            >
              Sign In to My Portal →
            </button>
            <button 
              onClick={() => window.location.href = `${PORTAL_URL}forgot-password`} 
              className="w-full p-3.5 bg-sky/10 text-sky font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm border border-sky/20 hover:bg-sky/20 transition-all"
            >
              Forgot Password / Reset Access
            </button>
            <button onClick={() => { setStep('form'); setDuplicateCheckDone(false); }} className="w-full p-3 bg-transparent text-text-muted font-dm-mono text-[11px] tracking-wider uppercase border border-border-custom rounded-sm hover:text-brand transition-all">Apply for a different programme</button>
          </div>
        </div>
      )}

      {/* ─── STEP: SUCCESS ─── */}
      {step === 'success' && (
        <div className="space-y-6 text-center py-8 animate-fadeUp">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,242,255,0.15)] animate-pulse">📧</div>
          <div>
            <h3 className="font-syne font-black text-[24px] mb-2 text-brand">Check Your Email</h3>
            <p className="text-[14px] text-text-soft leading-relaxed max-w-sm mx-auto">
              Institutional application submitted successfully. We have sent a <span className="text-brand font-bold">Confirmation & Activation Link</span> to <span className="text-white font-medium underline decoration-brand/30 underline-offset-4">{form.email}</span>.
            </p>
          </div>
          
          <div className="bg-surface/50 border border-border-custom rounded-2xl p-5 text-left space-y-3 max-w-[360px] mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[10px] mt-0.5">1</div>
              <p className="text-[11px] text-text-muted">Open your inbox and find the email from <span className="text-text-custom">Ginashe Digital Academy</span>.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[10px] mt-0.5">2</div>
              <p className="text-[11px] text-text-muted">Click the <span className="text-text-custom">Secure My Account</span> button inside the email.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[10px] mt-0.5">3</div>
              <p className="text-[11px] text-text-muted">Once verified, you will receive your <span className="text-brand font-bold">Official Student Number</span> and portal access credentials.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={() => navigate(`/verify?email=${encodeURIComponent(form.email)}`)} 
              className="w-full p-3.5 bg-brand text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase rounded-sm hover:bg-brand-light transition-all shadow-[0_10px_20px_rgba(0,242,255,0.1)]"
            >
              I have verified my email →
            </button>
            <p className="text-[10px] text-text-dim">Didn&apos;t receive the email? Check your spam folder or contact admissions@ginashe.academy</p>
          </div>
        </div>
      )}
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
            <div className="mb-4">
              <label className={LABEL_CLASS}>Nationality <span className="text-coral">*</span></label>
              <select className={SELECT_CLASS} value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} required>
                <option value="">Select…</option>
                {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>{form.nationality === 'South African' ? 'SA ID Number' : 'Passport Number'} <span className="text-coral">*</span></label>
                <input 
                  type="text" 
                  className={INPUT_CLASS} 
                  placeholder="ID/Passport Number" 
                  value={form.idNumber} 
                  onChange={e => setForm({...form, idNumber: e.target.value})} 
                  onBlur={() => form.idNumber && checkForDuplicates()}
                  required 
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Email Address <span className="text-coral">*</span></label>
                <input 
                  type="email" 
                  className={INPUT_CLASS} 
                  placeholder="amara@email.com" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  onBlur={() => form.email && checkForDuplicates()}
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={LABEL_CLASS}>Mobile Number <span className="text-coral">*</span></label>
                <input 
                  type="tel" 
                  className={INPUT_CLASS} 
                  placeholder="+27 XX XXX XXXX" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  onBlur={() => form.phone && checkForDuplicates()}
                  required
                />
                {isScanning && <div className="text-[10px] text-brand mt-1 animate-pulse">Running institutional scan...</div>}
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
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-emerald mb-5">Step 3 — Path Selection & Quals</div>

            {/* DUAL SELECTION INTERFACE */}
            <div className="mb-5">
              <label className={LABEL_CLASS}>Define Your Admission Path <span className="text-coral">*</span></label>
              <div className="text-[11.5px] leading-relaxed text-coral font-dm-sans mb-4 italic tracking-tight bg-coral/5 p-3 rounded-lg border border-coral/10">
                <span className="font-bold uppercase tracking-[0.05em] not-italic mr-2">Institutional Protocol:</span>
                Please select only one primary academic pathway. 
                <div className="mt-1 font-bold opacity-100 text-[10.5px]">
                  Note: The &apos;Bespoke&apos; option is strictly for students whose organisations have pre-authorised a custom institutional learning framework.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CAREER TRACK SELECTION CARD (LEFT - DEFAULT) */}
                <div 
                  onClick={() => setSelectionType('level')}
                  className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
                    selectionType === 'level' 
                      ? 'bg-brand/5 border-brand shadow-[0_0_20px_rgba(0,242,255,0.05)]' 
                      : 'bg-surface/20 border-border-custom opacity-50 grayscale scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${selectionType === 'level' ? 'bg-brand text-[#080b12]' : 'bg-surface/50 text-brand'}`}>🏛️</div>
                    <div className="font-syne font-bold text-[13px]">Career Track Selection</div>
                  </div>
                  
                  {/* TRACK SELECTOR */}
                  <select 
                    className={`${SELECT_CLASS} !bg-none px-2 mb-2`} 
                    value={selectedTrack} 
                    onChange={e => {
                      const track = e.target.value;
                      setSelectedTrack(track);
                      setSelectionType('level');
                      if (track) setShowCourseSelector(true);
                      setForm({...form, level: '', prog: ''});
                    }}
                    required={selectionType === 'level'}
                  >
                    <option value="">Select Track...</option>
                    {INSTITUTIONAL_TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>

                  {/* SELECTED COURSE DISPLAY */}
                  {form.level && (
                    <div className="flex items-center gap-2 p-2 px-2.5 bg-brand/10 border border-brand/20 rounded-md mb-2 animate-fadeUp">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                      <div className="font-dm-mono text-[10px] text-brand uppercase tracking-wider">{form.level}</div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setShowCourseSelector(true); }}
                        className="ml-auto text-[9px] text-text-muted hover:text-brand underline decoration-dotted"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  <div className="text-[9px] text-text-muted leading-tight opacity-70">Enrol in a full practitioner-led career track (e.g. Associate, Professional).</div>

                  {/* POP-UP COURSE SELECTOR */}
                  {showCourseSelector && selectedTrack && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#080b12]/90 backdrop-blur-md animate-fadeIn">
                      <div className="bg-bg2 border border-border-custom rounded-2xl w-full max-w-[440px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-sky"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="text-[10px] font-dm-mono text-brand uppercase tracking-widest mb-1">{selectedTrack}</div>
                            <h3 className="font-syne font-extrabold text-[18px]">Select Your Level</h3>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setShowCourseSelector(false)}
                            className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-muted"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>

                        <div className="grid gap-2.5">
                          {TRACK_PROGRAMMES[selectedTrack]?.map(course => (
                            <button
                              key={course}
                              type="button"
                              onClick={() => {
                                setForm({
                                  ...form, 
                                  level: course,
                                  // Auto-nudge for Level 4 / Enterprise
                                  study_intake: course.includes('Enterprise') ? 'Enterprise/Rolling' : form.study_intake
                                });
                                setShowCourseSelector(false);
                              }}
                              className={`p-4 rounded-xl border text-left transition-all group ${
                                form.level === course 
                                  ? 'bg-brand/5 border-brand ring-1 ring-brand/30' 
                                  : 'bg-surface/30 border-border-custom hover:border-brand/40'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full transition-colors ${form.level === course ? 'bg-brand' : 'bg-border-custom group-hover:bg-brand/40'}`}></div>
                                <div className="font-dm-sans text-[13px] font-medium">{course}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-custom flex justify-center">
                           <div className="font-dm-mono text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">Ginashe Institutional Matrix</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BESPOKE ENTERPRISE SELECTION CARD (RIGHT) */}
                <div 
                  onClick={() => setSelectionType('program')}
                  className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
                    selectionType === 'program' 
                      ? 'bg-sky/5 border-sky shadow-[0_0_20px_rgba(0,242,255,0.05)]' 
                      : 'bg-surface/20 border-border-custom opacity-50 grayscale scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${selectionType === 'program' ? 'bg-sky text-[#080b12]' : 'bg-surface/50 text-sky'}`}>🏢</div>
                    <div className="font-syne font-bold text-[13px]">Bespoke Enterprise Selection</div>
                  </div>

                  {/* ACCESS CODE GATEWAY */}
                  {!isCodeVerified ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="ENTER ACCESS CODE..." 
                          className={`${INPUT_CLASS} !bg-sky/10 border-sky/40 focus:border-sky text-center tracking-[0.25em] uppercase font-dm-mono text-[13px] font-bold !text-white placeholder:text-sky/40 placeholder:font-normal placeholder:tracking-normal`}
                          value={accessCode}
                          onChange={e => {
                            setAccessCode(e.target.value.toUpperCase());
                            setCodeError('');
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const solution = INSTITUTIONAL_CODES[accessCode];
                          if (solution) {
                            setIsCodeVerified(true);
                            setSelectionType('program');
                            setForm({...form, prog: solution, level: '', study_intake: 'Enterprise/Rolling'});
                            setCodeError('');
                          } else {
                            setCodeError('Invalid Access Code');
                          }
                        }}
                        className="w-full py-2 bg-sky/20 hover:bg-sky/30 text-sky font-syne font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all border border-sky/30"
                      >
                        Verify Institutional Access
                      </button>
                      {codeError && <div className="text-[9px] text-coral font-medium text-center animate-pulse">{codeError}</div>}
                    </div>
                  ) : (
                    <div className="animate-fadeUp">
                      <div className="flex items-center gap-2 p-2.5 bg-emerald/10 border border-emerald/20 rounded-xl mb-3">
                         <div className="w-5 h-5 rounded-full bg-emerald flex items-center justify-center text-[#080b12] text-[10px]">✓</div>
                         <div className="font-dm-mono text-[9px] text-emerald uppercase tracking-wider font-bold">Access Authorized</div>
                         <button 
                           type="button" 
                           onClick={() => { setIsCodeVerified(false); setAccessCode(''); setForm({...form, prog: ''}); }}
                           className="ml-auto text-[9px] text-text-muted hover:text-emerald underline decoration-dotted"
                         >
                           Reset
                         </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEnterpriseSelector(true)}
                        className={`${SELECT_CLASS} !text-left flex items-center justify-between !bg-sky/5 border-sky/40`}
                      >
                        <span className="text-text-main font-bold">
                          {form.prog}
                        </span>
                        <svg className="w-4 h-4 text-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  )}

                  <div className="mt-3 text-[9px] text-text-muted leading-tight opacity-70">Bespoke institutional training solutions or corporate digital transformation advisory.</div>

                  {/* POP-UP ENTERPRISE SELECTOR */}
                  {showEnterpriseSelector && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#080b12]/95 backdrop-blur-xl animate-fadeIn">
                      <div className="bg-bg2 border border-border-custom rounded-3xl w-full max-w-[600px] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky via-brand to-sky"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <div className="text-[11px] font-dm-mono text-sky uppercase tracking-[0.3em] mb-2">Institutional Advisory</div>
                            <h3 className="font-syne font-extrabold text-[24px] leading-tight">Bespoke Enterprise Framework</h3>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setShowEnterpriseSelector(false)}
                            className="p-2 hover:bg-surface rounded-full transition-colors text-text-muted"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>

                        <div className="grid gap-3.5">
                          {ENTERPRISE_SOLUTIONS.map(sol => (
                            <button
                              key={sol.name}
                              type="button"
                              onClick={() => {
                                setForm({
                                  ...form, 
                                  prog: sol.name,
                                  study_intake: 'Enterprise/Rolling'
                                });
                                setShowEnterpriseSelector(false);
                              }}
                              className={`p-5 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                                form.prog === sol.name 
                                  ? 'bg-sky/5 border-sky ring-1 ring-sky/30' 
                                  : 'bg-surface/30 border-border-custom hover:border-sky/40'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 transition-colors ${form.prog === sol.name ? 'bg-sky' : 'bg-border-custom group-hover:bg-sky/40'}`}></div>
                                <div>
                                  <div className="font-syne text-[15px] font-bold mb-1">{sol.name}</div>
                                  <div className="font-dm-sans text-[11px] text-text-muted leading-relaxed">{sol.desc}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-10 pt-6 border-t border-border-custom flex justify-between items-center">
                           <div className="font-dm-mono text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">Ginashe Corporate Strategy</div>
                           <div className="text-[10px] text-sky font-medium italic opacity-60">* Custom solutions require initial institutional audit</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* STUDY PERIOD (YEAR & COHORT) */}
            <div className="grid grid-cols-2 gap-3 mb-6 pb-5 border-b border-border-custom">
              <div>
                <label className={LABEL_CLASS}>Intended Study Year <span className="text-coral">*</span></label>
                <select 
                  className={SELECT_CLASS} 
                  value={form.study_year} 
                  onChange={e => {
                    const newYear = e.target.value;
                    setForm({
                      ...form, 
                      study_year: newYear,
                      study_intake: getInitialIntake(newYear)
                    });
                  }} 
                  required
                >
                  <option value={currentYear.toString()}>{currentYear} Academic Year</option>
                  <option value={(currentYear + 1).toString()}>{currentYear + 1} Academic Year</option>
                  <option value={(currentYear + 2).toString()}>{currentYear + 2} Academic Year</option>
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>Preferred Intake <span className="text-coral">*</span></label>
                <select 
                  className={SELECT_CLASS} 
                  value={form.study_intake} 
                  onChange={e => setForm({...form, study_intake: e.target.value})} 
                  required
                >
                  {INTAKE_SCHEDULE.map(window => {
                    const isPast = isIntakePast(form.study_year, window.name);
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const startDate = new Date(parseInt(form.study_year), window.monthIdx, window.day);
                    const deadlineDate = new Date(startDate);
                    deadlineDate.setDate(startDate.getDate() - window.closingDaysBefore);

                    return (
                      <option key={window.name} value={window.name} disabled={isPast}>
                        {window.name} Intake {isPast ? '(Closed)' : `— Starts ${monthNames[window.monthIdx]} ${window.day} (Deadline: ${monthNames[deadlineDate.getMonth()]} ${deadlineDate.getDate()})`}
                      </option>
                    );
                  })}
                  {selectionType === 'program' && (
                    <option value="Enterprise/Rolling">Enterprise (Rolling Enrolment)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLASS}>Highest Qualification</label>
                <select className={SELECT_CLASS} value={form.qual} onChange={e => setForm({...form, qual: e.target.value})}>
                  <option value="">Select…</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>Proposed Payment Model <span className="text-coral">*</span></label>
                <select className={SELECT_CLASS} value={form.payment_mode} onChange={e => setForm({...form, payment_mode: e.target.value})} required>
                  <option value="">Select Model…</option>
                  <option value="Upfront Investment">Upfront Investment (15% Discount)</option>
                  <option value="Standard Installment">Standard Installment (Monthly)</option>
                  <option value="Income Share (ISA)">Income Share Agreement (ISA)</option>
                  <option value="Organisation Funded">Organisation Funded (Corporate)</option>
                  <option value="Bursary/Scholarship">Bursary / Scholarship</option>
                  <option value="Other/Mix">Other / Hybrid Model</option>
                </select>
              </div>
            </div>
            
            {/* INSTITUTIONAL DOCUMENT SYSTEM */}
            <div className="mb-6">
              <label className={LABEL_CLASS}>Institutional Document Portfolio (PDF Only) <span className="text-coral">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-lg border border-border-custom bg-surface/50">
                  <label className="block text-[8px] font-dm-mono uppercase text-text-muted mb-1.5">1. Certified ID / Passport</label>
                  <input type="file" accept=".pdf" className="w-full text-[11px] text-text-soft file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-dm-mono file:uppercase file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" onChange={e => setIdFile(e.target.files?.[0] || null)} required />
                </div>
                <div className="p-3 rounded-lg border border-border-custom bg-surface/50">
                  <label className="block text-[8px] font-dm-mono uppercase text-text-muted mb-1.5">2. Matric / Highest Qualification</label>
                  <input type="file" accept=".pdf" className="w-full text-[11px] text-text-soft file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-dm-mono file:uppercase file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" onChange={e => setMatricFile(e.target.files?.[0] || null)} required />
                </div>
                <div className="p-3 rounded-lg border border-border-custom bg-surface/50">
                  <label className="block text-[8px] font-dm-mono uppercase text-text-muted mb-1.5">3. Proof of Residence</label>
                  <input type="file" accept=".pdf" className="w-full text-[11px] text-text-soft file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-dm-mono file:uppercase file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" onChange={e => setResidenceFile(e.target.files?.[0] || null)} required />
                </div>
                <div className="p-3 rounded-lg border border-border-custom bg-surface/50">
                  <label className="block text-[8px] font-dm-mono uppercase text-text-muted mb-1.5">4. Motivation Letter</label>
                  <input type="file" accept=".pdf" className="w-full text-[11px] text-text-soft file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-dm-mono file:uppercase file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" onChange={e => setMotivationFile(e.target.files?.[0] || null)} required />
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg border border-border-custom bg-surface/20">
                <label className="block text-[8px] font-dm-mono uppercase text-text-muted mb-1.5">Optional: Professional CV / Resume</label>
                <input type="file" accept=".pdf" className="w-full text-[11px] text-text-soft file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-dm-mono file:uppercase file:bg-surface/50 file:text-text-muted hover:file:bg-surface cursor-pointer" onChange={e => setCvFile(e.target.files?.[0] || null)} />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>Additional Enquiries & Comments</label>
              <textarea 
                className={`${INPUT_CLASS} resize-y min-h-[100px] bg-surface/30`} 
                placeholder="Tell us about your background, career goals, or ask any pre-admission questions..." 
                value={form.msg} 
                onChange={e => setForm({...form, msg: e.target.value})}
              ></textarea>
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
