import React, { useState } from 'react';
import { supabase, uploadFile } from '../lib/supabase';

// ─── CONSTANTS ───────────────────────────────────────────────
const INPUT_CLASS = "w-full bg-surface border border-border-custom rounded-sm p-2.75 px-3.5 font-dm-sans text-[13px] text-text-custom outline-none focus:border-gold/40 focus:shadow-[0_0_0_3px_rgba(244,162,26,0.07)] transition-all";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_12_12%22%3E%3Cpath_fill=%22%235a607c%22_d=%22M6_8L1_3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-9`;
const LABEL_CLASS = "block font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1.75";

const PROGRAMMES = [
  'Cloud Launchpad (Foundation / SETA)',
  'Cloud Architecture Residency',
  'AI & Machine Learning Engineering',
  'Data Engineering & Analytics',
  'AI for Business Leaders',
  'DevSecOps',
  'Workforce Modernisation Sprint (Enterprise)',
  "I'm not sure — I want guidance",
];

const QUALIFICATIONS = [
  'Matric / NSC',
  'Diploma',
  "Bachelor's Degree",
  'Postgraduate Degree',
  'Professional Certification',
  'Other',
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export function Cohorts({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  // ─── STEP STATE ──────────────────
  const [step, setStep] = useState<'check' | 'form' | 'existing'>('check');
  const [hasAccount, setHasAccount] = useState<string>('');
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  // ─── FORM STATE ──────────────────
  const [form, setForm] = useState({
    first: '', last: '', email: '', phone: '', prog: '', qual: '', msg: '',
    dob: '', idNumber: '', gender: '', nationality: 'South Africa'
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCheckDone, setDuplicateCheckDone] = useState(false);

  const cohorts = [
    { m: 'APR', d: '07', n: 'Cloud Launchpad — Cohort 12', det: '12 weeks · In-person · Sandton Campus', b: 'Filling Fast', bt: 'filling' },
    { m: 'APR', d: '14', n: 'Cloud Architecture Residency — Cohort 7', det: '6 months · Hybrid', b: 'Open', bt: 'open' },
    { m: 'MAY', d: '05', n: 'AI & Machine Learning Engineering — Cohort 5', det: '4 months · Online cohort', b: 'Open', bt: 'open' },
    { m: 'MAY', d: '19', n: 'AI for Business Leaders — Cohort 8', det: '8 weeks weekends · In-person Sandton', b: 'Filling Fast', bt: 'filling' },
    { m: 'JUN', d: '02', n: 'Data Engineering & Analytics — Cohort 6', det: '5 months · Hybrid', b: 'Open', bt: 'open' },
    { m: 'JUL', d: '07', n: 'Cloud Launchpad — Cohort 13', det: '12 weeks · In-person · Sandton Campus', b: 'Open', bt: 'open' }
  ];

  // ─── CHECK EXISTING ACCOUNT ──────
  const handleAccountCheck = async () => {
    if (hasAccount === 'yes') {
      // Check by student number
      if (!studentNumberInput.trim()) {
        setDuplicateMessage('Please enter your student number.');
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
        console.error('Account check error:', err);
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

      // 1. Check if they already have a student profile
      const { data: profileMatch } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', emailClean)
        .maybeSingle();

      if (profileMatch) {
        setDuplicateMessage(`You already have a student account! Please sign in to your student portal to access your courses.`);
        setStep('existing');
        return true;
      }

      // 2. Check by email in applications
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

      // 3. Check by ID number if provided
      if (form.idNumber.trim()) {
        const { data: idMatch } = await supabase
          .from('applications')
          .select('id, first_name, email, status, program')
          .eq('id_number', form.idNumber.trim())
          .limit(1)
          .maybeSingle();

        if (idMatch) {
          setDuplicateMessage(`A record with this ID/Passport number already exists (${idMatch.email}). If this is you, please sign in to your Student Portal.`);
          setStep('existing');
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('Duplicate check error:', err);
      return false;
    }
  };

  // ─── FORM SUBMIT ─────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first || !form.email) {
      alert('Please fill in at least your name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Run duplicate check first
      if (!duplicateCheckDone) {
        const isDuplicate = await checkForDuplicates();
        if (isDuplicate) {
          setIsSubmitting(false);
          return;
        }
        setDuplicateCheckDone(true);
      }

      let cvUrl = '';
      if (cvFile) {
        cvUrl = await uploadFile(cvFile);
      }

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
          nationality: form.nationality || 'South Africa',
          program: form.prog,
          qualification: form.qual,
          message: form.msg,
          cv_url: cvUrl,
          type: 'individual',
          ai_match_score: Math.floor(Math.random() * 30) + 70, // Mocked: 70-100
          history: JSON.stringify([{
            event: 'Application Submitted',
            timestamp: new Date().toISOString(),
            details: 'Initial application submitted via public admissions form.'
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
        console.error('Error processing application emails:', processErr);
      }

      alert(`Application submitted, ${form.first}! 🎉\n\nWe'll contact you within 2 business days.\nPlease check your email for a confirmation.`);
      setForm({ first: '', last: '', email: '', phone: '', prog: '', qual: '', msg: '', dob: '', idNumber: '', gender: '', nationality: 'South Africa' });
      setCvFile(null);
      setDuplicateCheckDone(false);
      setStep('check');
      setHasAccount('');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      let errorMsg = 'There was an error submitting your application. Please try again later.';
      if (error && typeof error === 'object') {
        errorMsg = error.message || error.details || JSON.stringify(error);
      }
      alert(`Submission Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cohorts" className="bg-bg2 border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          {/* ─── LEFT: INTAKE CALENDAR ─── */}
          <div>
            <div className="section-label">Intake Calendar</div>
            <h2 className="section-title mb-3.5 animate-fadeUp">Upcoming cohorts</h2>
            <p className="text-[14px] text-text-soft mb-8 leading-[1.7] animate-fadeUp delay-100">We run rolling cohorts through the year. Seats are limited to 25 per cohort to ensure intimate, high-quality instruction.</p>

            <div className="flex flex-col gap-2.5">
              {cohorts.map((c, i) => (
                <div key={i} className={`bg-card border border-border-custom rounded-md p-5 px-5.5 flex items-center gap-4 transition-all cursor-pointer hover:border-border2 animate-fadeUp ${i === 0 ? 'border-gold/30 bg-gold/4' : ''}`}>
                  <div className="text-center shrink-0 w-[50px]">
                    <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">{c.m}</div>
                    <div className="font-syne font-extrabold text-[26px] text-gold leading-none">{c.d}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-syne font-semibold text-[13px]">{c.n}</div>
                    <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] mt-0.75">{c.det}</div>
                  </div>
                  <div className={`font-dm-mono text-[8px] tracking-[0.1em] uppercase px-2.25 py-0.75 rounded-full shrink-0 ${c.bt === 'open' ? 'bg-emerald-dim text-emerald border border-emerald/20' : 'bg-gold-dim text-gold border border-gold/20'}`}>
                    {c.b}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: APPLICATION FORM ─── */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-10 sticky top-20 animate-fadeUp">
            <div className="mb-7 pb-5.5 border-b border-border-custom">
              <div className="font-syne font-extrabold text-[20px] mb-1.5">Apply to GDA</div>
              <div className="text-[12px] text-text-muted">We respond within 2 business days. No commitment required to enquire.</div>
            </div>

            {/* ─── STEP 1: ACCOUNT CHECK (Like tertiary institution) ─── */}
            {step === 'check' && (
              <div className="space-y-5">
                <div className="bg-surface/50 border border-gold/15 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                      <span className="text-gold text-lg">🎓</span>
                    </div>
                    <div>
                      <div className="font-syne font-bold text-[14px]">Academic Application Process</div>
                      <div className="text-[11px] text-text-muted">Let's get you started on the right track</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={LABEL_CLASS}>
                        <span className="text-coral mr-1">*</span>
                        Do you already have a student number or have previously applied?
                      </label>
                      <select
                        className={SELECT_CLASS}
                        value={hasAccount}
                        onChange={e => { setHasAccount(e.target.value); setDuplicateMessage(''); }}
                      >
                        <option value="">— Please select —</option>
                        <option value="yes">Yes, I have applied before / have a student number</option>
                        <option value="no">No, this is my first application</option>
                      </select>
                    </div>

                    {hasAccount === 'yes' && (
                      <div className="animate-fadeUp">
                        <label className={LABEL_CLASS}>Enter your Student Number or Email Address</label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          placeholder="GDA-2026-XXXX or your@email.com"
                          value={studentNumberInput}
                          onChange={e => setStudentNumberInput(e.target.value)}
                        />
                      </div>
                    )}

                    {duplicateMessage && step === 'check' && (
                      <div className={`text-[12px] p-3 rounded-lg border ${duplicateMessage.includes('No record') || duplicateMessage.includes('Error') || duplicateMessage.includes('Please enter')
                        ? 'bg-coral/5 border-coral/20 text-coral'
                        : 'bg-emerald/5 border-emerald/20 text-emerald'}`}>
                        {duplicateMessage}
                      </div>
                    )}

                    {hasAccount && (
                      <button
                        onClick={handleAccountCheck}
                        disabled={checkingAccount}
                        className={`w-full p-3 bg-gold text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase border-none rounded-sm cursor-pointer hover:bg-gold-light hover:-translate-y-px transition-all ${checkingAccount ? 'opacity-50' : ''}`}
                      >
                        {checkingAccount ? 'Checking...' : hasAccount === 'yes' ? 'Look Up My Record' : 'Start New Application →'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center text-[11px] text-text-muted">
                  Enterprise enquiry? <a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => onOpenModal('apply')}>Apply as an organisation</a>
                </div>
              </div>
            )}

            {/* ─── STEP: EXISTING USER (Redirect to login) ─── */}
            {step === 'existing' && (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-3xl">
                  👋
                </div>
                <div>
                  <h3 className="font-syne font-bold text-[18px] mb-2">Welcome Back!</h3>
                  <p className="text-[13px] text-text-soft leading-relaxed max-w-sm mx-auto">
                    {duplicateMessage}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => onOpenModal('student')}
                    className="w-full p-3.5 bg-gold text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase border-none rounded-sm cursor-pointer hover:bg-gold-light transition-all"
                  >
                    Sign In to My Portal →
                  </button>
                  <button
                    onClick={() => { setStep('form'); setDuplicateMessage(''); setDuplicateCheckDone(false); }}
                    className="w-full p-3 bg-transparent text-text-muted font-dm-mono text-[11px] tracking-wider uppercase border border-border-custom rounded-sm cursor-pointer hover:border-gold/30 hover:text-gold transition-all"
                  >
                    Apply for a different programme
                  </button>
                  <button
                    onClick={() => { setStep('check'); setHasAccount(''); setDuplicateMessage(''); }}
                    className="text-[11px] text-text-dim hover:text-text-muted transition-colors cursor-pointer"
                  >
                    ← Start over
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP: FULL APPLICATION FORM ─── */}
            {step === 'form' && (
              <form onSubmit={handleSubmit}>
                {/* ─── Personal Information ─── */}
                <div className="mb-5 pb-4 border-b border-border-custom">
                  <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-gold mb-3">Step 1 — Personal Information</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={LABEL_CLASS}>First Name <span className="text-coral">*</span></label>
                      <input type="text" className={INPUT_CLASS} placeholder="Amara" value={form.first} onChange={e => setForm({...form, first: e.target.value})} required />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Last Name <span className="text-coral">*</span></label>
                      <input type="text" className={INPUT_CLASS} placeholder="Dlamini" value={form.last} onChange={e => setForm({...form, last: e.target.value})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={LABEL_CLASS}>Date of Birth</label>
                      <input type="date" className={INPUT_CLASS} value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Gender</label>
                      <select className={SELECT_CLASS} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                        <option value="">Select…</option>
                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLASS}>SA ID / Passport Number</label>
                      <input type="text" className={INPUT_CLASS} placeholder="e.g. 9501015800088" value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Nationality</label>
                      <input type="text" className={INPUT_CLASS} value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* ─── Contact Details ─── */}
                <div className="mb-5 pb-4 border-b border-border-custom">
                  <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-gold mb-3">Step 2 — Contact Details</div>
                  <div className="mb-3">
                    <label className={LABEL_CLASS}>Email Address <span className="text-coral">*</span></label>
                    <input type="email" className={INPUT_CLASS} placeholder="amara@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Mobile Number</label>
                    <input type="tel" className={INPUT_CLASS} placeholder="+27 XX XXX XXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                {/* ─── Academic Information ─── */}
                <div className="mb-5 pb-4 border-b border-border-custom">
                  <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-gold mb-3">Step 3 — Academic Information</div>
                  <div className="mb-3">
                    <label className={LABEL_CLASS}>Programme of Interest <span className="text-coral">*</span></label>
                    <select className={SELECT_CLASS} value={form.prog} onChange={e => setForm({...form, prog: e.target.value})} required>
                      <option value="">Select a programme…</option>
                      {PROGRAMMES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className={LABEL_CLASS}>Highest Qualification</label>
                    <select className={SELECT_CLASS} value={form.qual} onChange={e => setForm({...form, qual: e.target.value})}>
                      <option value="">Select…</option>
                      {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className={LABEL_CLASS}>Upload CV (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className={INPUT_CLASS}
                      onChange={e => setCvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Message (optional)</label>
                    <textarea className={`${INPUT_CLASS} resize-y min-h-[80px]`} placeholder="Tell us about your background and goals…" value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-3.5 bg-gold text-[#080b12] font-syne font-extrabold text-[13px] tracking-[0.05em] uppercase border-none rounded-sm cursor-pointer hover:bg-gold-light hover:-translate-y-px transition-all mt-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application →'}
                </button>

                <div className="flex justify-between mt-3.5">
                  <button
                    type="button"
                    onClick={() => { setStep('check'); setHasAccount(''); setDuplicateCheckDone(false); }}
                    className="text-[11px] text-text-muted hover:text-gold transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <span className="text-[11px] text-text-muted">
                    Enterprise? <a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => onOpenModal('apply')}>Apply as organisation</a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ecosystem({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  return (
    <section id="ecosystem" className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-16 items-start">
          <div>
            <div className="section-label">Partner Ecosystem</div>
            <h2 className="section-title animate-fadeUp">The network that<br />gets you hired.</h2>
            <p className="section-sub animate-fadeUp delay-100">
              Our employer and technology partnerships aren't logo placements. They're active recruitment pipelines, co-created content, and sponsored learner placements.
            </p>
            <button className="btn btn-outline mt-8 animate-fadeUp" onClick={() => onOpenModal('apply')}>Become a Partner</button>
          </div>
          <div className="bg-white/3 border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              Partnership Desk
            </div>
            <ul className="space-y-4">
              {[
                { t: 'Employer Network', d: '48+ companies' },
                { t: 'Talent Showcase 2026', d: 'Hiring events' },
                { t: 'Corporate Training', d: 'Workforce modernisation' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-gold transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                    <span className="text-text-dim text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14">
          <div className="flex flex-col gap-2.5">
            {[
              { n: 'Amazon Web Services', p: 'AWS APN Partner · Training & Certification', i: '🟠', t: 'Verified', tc: 'gold' },
              { n: 'Microsoft Azure', p: 'Microsoft Learning Partner · AI + Cloud Track', i: '🔵', t: 'Verified', tc: 'sky' },
              { n: 'Google Cloud', p: 'GCP Authorized Training Partner', i: '🟢', t: 'Verified', tc: 'em' },
              { n: 'MICT SETA', p: 'Accredited Training Provider · NQF 4–7', i: '🏛️', t: 'Gov. Accredited', tc: 'gold' },
              { n: 'Standard Bank Group', p: 'Employer Partner · Cloud & AI Roles', i: '🏦', t: 'Hiring', tc: '' },
              { n: 'MTN Group', p: 'Employer Partner · DevOps & Data Roles', i: '📱', t: 'Hiring', tc: '' }
            ].map((p, i) => (
              <div key={i} className="bg-card border border-border-custom rounded-md p-4.5 px-5.5 flex items-center gap-3.5 transition-all hover:border-border2 hover:translate-x-1.25 animate-fadeUp">
                <div className="w-10.5 h-10.5 rounded-sm flex items-center justify-center text-[20px] shrink-0 border border-border-custom bg-white/3">{p.i}</div>
                <div className="flex-1">
                  <div className="font-syne font-semibold text-[14px]">{p.n}</div>
                  <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.06em] mt-0.5">{p.p}</div>
                </div>
                <div className="ml-auto shrink-0"><span className={`chip ${p.tc ? `chip-${p.tc}` : ''}`}>{p.t}</span></div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-9.5 animate-fadeUp">
            <div className="font-syne font-bold text-[18px] mb-2.5">Partner with GDA</div>
            <div className="text-[13px] text-text-soft leading-[1.65] mb-6.5">Join Africa's most active tech talent pipeline. Whether you're a cloud vendor, employer, government body, or academic institution — we have a partnership model for you.</div>
            <ul className="list-none flex flex-col gap-3.25">
              {[
                'Access pre-vetted, job-ready cloud and AI talent before they hit the open market',
                'Co-brand and co-deliver content aligned to your technology stack',
                'Leverage SETA accreditation for B-BBEE skills development spend',
                'Sponsor cohort seats and build your employer brand with Gen-Z Africa',
                'Participate in our annual GDA Tech Showcase and hiring events'
              ].map((b, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] items-start">
                  <span className="w-1.75 h-1.75 rounded-full bg-gold shrink-0 mt-1.5"></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6.5 flex gap-2.5 flex-wrap">
              <button className="btn btn-gold" onClick={() => onOpenModal('apply')}>Partner Enquiry →</button>
              <a href="mailto:partnerships@ginashe.co.za" className="btn btn-outline">partnerships@ginashe.co.za</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
