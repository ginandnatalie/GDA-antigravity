import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Funding({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  const navigate = useNavigate();
  return (
    <section id="funding" className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-14 items-center">
          <div className="max-w-[540px]">
            <div className="section-label">Financial Aid & Funding</div>
            <h2 className="section-title animate-fadeUp">Cost should never be<br />the barrier to <em className="italic font-light font-dm-sans text-brand">greatness.</em></h2>
            <p className="section-sub animate-fadeUp delay-100">GDA programmes can be funded through merit-based scholarships, employer training budgets, or our flexible payment plans. Every option, explained clearly.</p>
          </div>
          <div className="bg-card border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Top Resources
            </div>
            <ul className="space-y-3">
              {[
                { t: '2026 Prospectus', d: 'Full fee breakdown', id: 'prospectus' },
                { t: 'Bursary Application Guide', d: 'Step-by-step PDF', id: 'bursary_guide' },
                { t: 'ISA Agreement Template', d: 'Terms & conditions', id: 'isa_template' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer" onClick={() => onOpenModal(res.id)}>
                  <div className="flex items-start gap-3">
                    <span className="font-dm-mono text-[10px] text-text-dim mt-0.5">0{i+1}</span>
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-brand transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-custom border border-border-custom rounded-3xl overflow-hidden mb-8 animate-fadeUp">
          <div className="bg-card p-6 sm:p-9 px-6 sm:px-7.5 relative overflow-hidden flex flex-col transition-colors hover:bg-card2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--color-emerald),#2e9e7a)]">
            <div className="w-12 h-12 rounded-md flex items-center justify-center text-[22px] mb-4.5 border border-border-custom bg-emerald-dim border-emerald/20 text-emerald">🏛️</div>
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-emerald mb-2">Merit / Talent Based</div>
            <div className="font-syne font-extrabold text-[18px] mb-2.5">GDA Excellence Scholarship</div>
            <div className="text-[13px] text-text-soft leading-[1.65] mb-5 flex-1">We allocate a portion of our annual revenue to fund high-potential learners who demonstrate exceptional technical aptitude but lack the financial means to enroll. These are competitive, merit-based awards.</div>
            <ul className="list-none flex flex-col gap-2.25 mb-5.5">
              {['Available to top-performing applicants across all tracks', 'Covers 25% to 100% of programme fees for qualifying learners', 'Priority given to unemployed youth (18–35) with tech potential', 'Requires a portfolio review or technical assessment pass'].map((li, i) => (
                <li key={i} className="flex gap-2 text-[12px] items-start">
                  <span className="w-1.25 h-1.25 rounded-full bg-emerald shrink-0 mt-1.25"></span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="p-3.5 rounded-md mb-4.5 bg-white/3 border border-border-custom">
              <div className="flex justify-between font-dm-mono text-[9px] tracking-[0.1em] uppercase text-text-dim mb-2">Potential coverage <span className="text-emerald text-[11px]">Up to 100%</span></div>
              <div className="h-1.25 bg-white/6 rounded-full overflow-hidden"><div className="h-full bg-[linear-gradient(90deg,var(--color-emerald),#2e9e7a)] rounded-full w-full"></div></div>
            </div>
            <button className="btn btn-sm bg-emerald-dim text-emerald border border-emerald/25 hover:bg-emerald/20" onClick={() => onOpenModal('scholarship')}>Apply for Scholarship →</button>
          </div>

          <div className="bg-card p-6 sm:p-9 px-6 sm:px-7.5 relative overflow-hidden flex flex-col transition-colors hover:bg-card2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--color-sky),#0288d1)]">
            <div className="w-12 h-12 rounded-md flex items-center justify-center text-[22px] mb-4.5 border border-border-custom bg-sky-dim border-sky/20 text-sky">🏢</div>
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-sky mb-2">Employer / Corporate Sponsored</div>
            <div className="font-syne font-extrabold text-[18px] mb-2.5">Employer Training Budget</div>
            <div className="text-[13px] text-text-soft leading-[1.65] mb-5 flex-1">Many South African companies have annual training budgets that go unspent. GDA works directly with HR and L&D teams to invoice your company, structure multi-learner cohorts, and provide all ATR reporting.</div>
            <ul className="list-none flex flex-col gap-2.25 mb-5.5">
              {['GDA issues a formal tax invoice directly to your employer', 'Net30/60 corporate payment terms available', 'Group discounts from 3+ learners enrolled simultaneously', 'Custom reporting packs for your HR and L&D team', 'Content customisable to your tech stack at no extra cost'].map((li, i) => (
                <li key={i} className="flex gap-2 text-[12px] items-start">
                  <span className="w-1.25 h-1.25 rounded-full bg-sky shrink-0 mt-1.25"></span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="p-3.5 rounded-md mb-4.5 bg-white/3 border border-border-custom">
              <div className="flex justify-between font-dm-mono text-[9px] tracking-[0.1em] uppercase text-text-dim mb-2">Potential coverage <span className="text-sky text-[11px]">Up to 100%</span></div>
              <div className="h-1.25 bg-white/6 rounded-full overflow-hidden"><div className="h-full bg-[linear-gradient(90deg,var(--color-sky),#0288d1)] rounded-full w-full"></div></div>
            </div>
            <button className="btn btn-sm bg-sky-dim text-sky border border-sky/25 hover:bg-sky/20" onClick={() => onOpenModal('corporate')}>Request Corporate Package →</button>
          </div>

          <div className="bg-card p-6 sm:p-9 px-6 sm:px-7.5 relative overflow-hidden flex flex-col transition-colors hover:bg-card2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--color-brand),#c67d10)]">
            <div className="w-12 h-12 rounded-md flex items-center justify-center text-[22px] mb-4.5 border border-border-custom bg-brand-dim border-brand/20 text-brand">💳</div>
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-brand mb-2">Self-Funded / Payment Plans</div>
            <div className="font-syne font-extrabold text-[18px] mb-2.5">Flexible Payment Options</div>
            <div className="text-[13px] text-text-soft leading-[1.65] mb-5 flex-1">Investing in yourself is the highest-ROI decision you'll ever make. Our plans make it possible to start without the full fee upfront — our ISA means you only pay more once you're earning more.</div>
            <ul className="list-none flex flex-col gap-2.25 mb-5.5">
              {['3-month plan — split fee into equal thirds, 0% interest', '6-month plan — available with 8% finance charge', 'Early-bird — 10% off when you apply 6+ weeks before cohort start', 'Sibling/referral — R2,000 off for every referred learner who enrols', 'Income Share Agreement (ISA) — pay 12% of salary for 24 months post-placement'].map((li, i) => (
                <li key={i} className="flex gap-2 text-[12px] items-start">
                  <span className="w-1.25 h-1.25 rounded-full bg-brand shrink-0 mt-1.25"></span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="p-3.5 rounded-md mb-4.5 bg-white/3 border border-border-custom">
              <div className="flex justify-between font-dm-mono text-[9px] tracking-[0.1em] uppercase text-text-dim mb-2">Upfront required (3-month plan) <span className="text-brand text-[11px]">~33%</span></div>
              <div className="h-1.25 bg-white/6 rounded-full overflow-hidden"><div className="h-full bg-[linear-gradient(90deg,var(--color-brand),#c67d10)] rounded-full w-1/3"></div></div>
            </div>
            <button className="btn btn-brand btn-sm" onClick={() => onOpenModal('payment_plan')}>Discuss Payment Options →</button>
          </div>
        </div>

        <div className="bg-surface border border-border-custom rounded-3xl p-6 sm:p-10 animate-fadeUp">
          <div className="font-syne font-extrabold text-[20px] mb-1.5">How to apply for a GDA Bursary — step by step</div>
          <div className="text-[13px] text-text-soft mb-8">Our scholarship fund is limited and competitive. Here is how to position yourself for success.</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            <div className="hidden lg:block absolute top-[22px] left-[22px] right-[22px] h-0.5 bg-[linear-gradient(90deg,var(--color-emerald),var(--color-sky),var(--color-brand))] opacity-30 z-0"></div>
            {[
              { n: 1, t: 'Submit your standard application', d: 'Apply to your program of choice first. Once accepted into the academy, you\'ll be eligible to apply for institutional funding.' },
              { n: 2, t: 'Complete the Technical Assessment', d: 'Demonstrate your logic and problem-solving skills through our practitioner-led assessment. High scores are critical for funding.' },
              { n: 3, t: 'Submit Financial Motivation', d: 'Provide a motivation explaining how this scholarship will impact your career and community. We look for disruptors.' },
              { n: 4, t: 'Wait for the Awards Committee', d: 'Our faculty reviews all applications monthly. If awarded, your tuition fees are adjusted automatically on your student portal.' }
            ].map((step) => (
              <div key={step.n} className="px-4 relative z-[1] group">
                <div className="w-11 h-11 rounded-full bg-card border-2 border-border-custom flex items-center justify-center font-syne font-extrabold text-[14px] text-text-muted mb-3.5 transition-all group-hover:bg-brand-dim group-hover:border-brand/40 group-hover:text-brand">{step.n}</div>
                <div className="font-syne font-bold text-[13px] mb-1.5">{step.t}</div>
                <div className="text-[11px] text-text-muted leading-[1.6]">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  const [activeCat, setActiveCat] = useState('admissions');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const cats = [
    { id: 'admissions', name: 'Admissions', count: 8 },
    { id: 'programmes', name: 'Programmes', count: 7 },
    { id: 'faq-funding', name: 'Funding & Fees', count: 7 },
    { id: 'learning', name: 'Learning Experience', count: 6 },
    { id: 'outcomes', name: 'Career Outcomes', count: 6 }
  ];

  const faqs = [
    // Admissions
    { cat: 'admissions', q: 'Do I need prior IT or coding experience to apply?', a: 'It depends on the programme. The Cloud Launchpad is designed for absolute beginners — zero IT background needed. Professional-track programmes require some comfort with command-line tools and basic programming. AI for Business Leaders requires no technical background at all — just senior management experience.' },
    { cat: 'admissions', q: 'How long does the application process take?', a: 'Submit online in about 5 minutes. Our admissions team responds within 2 business days. If accepted, you receive a formal acceptance letter and payment options within 24 hours. For scholarship applications, allow 5–7 additional business days for the committee review.' },
    { cat: 'admissions', q: 'Is there an age limit for GDA applicants?', a: 'Ginashe Digital Academy is open to all lifelong learners. While our Excellence Scholarship primarily targets the 18–35 demographic to address youth unemployment, we have practitioners from 18 to 65 enrolled in various tracks. We value technical curiosity over chronological age.' },
    { cat: 'admissions', q: 'Do you accept international students?', a: 'Yes. GDA is a global-first academy. As long as you have a stable internet connection and can attend sessions in the Central African Time (CAT) or Greenwich Mean Time (GMT) zones, you are eligible to join our cohorts. All instruction is in English.' },
    { cat: 'admissions', q: 'What hardware do I need to participate?', a: 'You will need a reliable laptop (minimum i5 processor, 8GB RAM) and a stable internet connection (minimum 10Mbps). For our Data Engineering and AI tracks, we provide cloud-based compute environments, so your local machine doesn\'t need to be a supercomputer.' },
    { cat: 'admissions', q: 'Are there entrance exams?', a: 'We use a Technical Aptitude Assessment (TAA) rather than traditional exams. This measures your logical reasoning, pattern recognition, and ability to follow technical instructions. It\'s designed to find your "ceiling" rather than test what you already know.' },
    { cat: 'admissions', q: 'Can I transfer credits from other institutions?', a: 'As GDA operates on an "Institutional Mastery" framework rather than traditional credit hours, we do not formally accept credit transfers. However, experienced practitioners may skip foundational modules by passing the relevant "Mastery Gate" assessments.' },
    { cat: 'admissions', q: 'What documents are required for admission?', a: 'You will need a certified copy of your ID or Passport, your highest academic qualification (Matric or degree), and a brief technical motivation. For Scholarship/Bursary applications, proof of household income is also required.' },

    // Programmes
    { cat: 'programmes', q: 'Are GDA programmes accredited by SETA or QCTO?', a: 'GDA is an independent, practitioner-led institution. We focus on "Institutional Mastery" and global industry vendor certifications (AWS, Azure, Google Cloud, NVIDIA) rather than local government accreditation. This allows us to update our curriculum weekly to match the speed of the tech industry.' },
    { cat: 'programmes', q: 'Can I study part-time while working?', a: 'Absolutely. Many of our cohorts are designed for "Working Professionals," with sessions held in the evenings and on weekends. Our Cloud Launchpad is particularly popular for those looking to pivot careers without quitting their current job.' },
    { cat: 'programmes', q: 'Who designs the GDA curriculum?', a: 'Our curriculum is built and updated by "Active Practitioners" — senior engineers, architects, and data scientists currently working in top-tier global tech firms. You learn what is being used in production today, not what was in a textbook five years ago.' },
    { cat: 'programmes', q: 'What is the ratio of theory to practice?', a: 'GDA follows an 80/20 rule: 80% hands-on laboratory work and project deployment, and 20% theoretical framework. We believe you only truly understand a system once you have broken and fixed it in a live environment.' },
    { cat: 'programmes', q: 'Is AI integrated into all curriculum tracks?', a: 'Yes. Regardless of your track — Cloud, Dev, or Cybersecurity — AI is treated as a fundamental tool. You will learn to use Large Language Models (LLMs) and AI-driven automation to accelerate your engineering output.' },
    { cat: 'programmes', q: 'Can I switch tracks once I have started?', a: 'Track switching is permitted within the first 4 weeks of a programme, provided there is space in the alternative cohort. After 4 weeks, modules become highly specialized, and switching would require restarting the technical foundation.' },
    { cat: 'programmes', q: 'Do I get a certificate upon completion?', a: 'Yes. Graduates receive a Ginashe Digital Academy "Mastery Certificate" and digital credentials (NFT-backed for verification). Additionally, we prepare you for 2–4 global vendor certifications relevant to your track.' },

    // Funding
    { cat: 'faq-funding', q: 'How does the Excellence Scholarship work?', a: 'We offer merit-based scholarships covering 25% to 100% of tuition. These are awarded based on your Technical Aptitude Assessment score and your motivation for social impact. Applications for bursaries open 2 months before each cohort start date.' },
    { cat: 'faq-funding', q: 'What is an Income Share Agreement (ISA)?', a: 'An ISA allows you to study with zero upfront tuition. In return, you agree to pay back a fixed percentage (usually 15%) of your salary once you are employed and earning above a minimum threshold. If you don\'t get a job, you don\'t pay.' },
    { cat: 'faq-funding', q: 'Is there a discount for upfront payment?', a: 'Yes. Students who pay their full tuition upfront receive a 15% Early-Bird discount. This is the most cost-effective way to enroll at GDA.' },
    { cat: 'faq-funding', q: 'Do your payment plans charge interest?', a: 'Our 3-month payment plan is 0% interest. For longer terms (6–12 months), a small institutional finance charge is applied to cover administrative and inflationary costs.' },
    { cat: 'faq-funding', q: 'What is your refund policy?', a: 'We offer a "14-Day Performance Guarantee." If you find the programme is not a fit within the first two weeks, you receive a full refund, minus a small administrative fee. Beyond 14 days, refunds are handled on a case-by-case basis.' },
    { cat: 'faq-funding', q: 'Can my employer sponsor my studies?', a: 'Yes. We work with many corporate partners. We can provide your HR or Learning & Development department with a formal quote and institutional brief to facilitate your sponsorship.' },
    { cat: 'faq-funding', q: 'Are there any hidden costs (books, software)?', a: 'No. Your tuition covers all software licenses, cloud compute credits, and digital learning materials. The only external costs are for optional vendor certification exam vouchers (e.g., AWS/NVIDIA exams).' },

    // Learning
    { cat: 'learning', q: 'Is learning 100% remote or are there campuses?', a: 'GDA is a digital-first institution. While we are 100% remote-capable, we host regular "Physical Pop-Up Labs" in major hubs (Johannesburg, Cape Town, Nairobi) for intensive hacking sessions and networking.' },
    { cat: 'learning', q: 'How large are the cohort sizes?', a: 'To ensure high-fidelity mentorship, we cap our specialized tracks at 35 learners per cohort. This ensures every student has direct access to faculty and practitioners during lab sessions.' },
    { cat: 'learning', q: 'What happens if I fall behind?', a: 'Every student has a dedicated "Success Mentor." If you miss milestones, we trigger an "Intervention Protocol" involving 1-on-1 coaching sessions to get you back on track before the next Mastery Gate.' },
    { cat: 'learning', q: 'Do I get access to a community of other students?', a: 'Yes. All GDA students are integrated into our private Discord and Ginashe Portal. You will collaborate on projects, participate in internal hackathons, and join track-specific study groups.' },
    { cat: 'learning', q: 'How many hours per week are required?', a: 'For full-time tracks, expect 35–40 hours per week. For our "Working Professional" tracks, the requirement is 12–15 hours per week, including live sessions and self-paced laboratory work.' },
    { cat: 'learning', q: 'What is the exam structure at GDA?', a: 'We do not have traditional pen-and-paper exams. Your "final" is a Capstone Project — a production-ready application or infrastructure deployment that you must present to a panel of industry practitioners.' },

    // Outcomes
    { cat: 'outcomes', q: 'Does GDA guarantee job placement?', a: 'While we do not "guarantee" jobs (no honest institution can), we have a 92% placement rate within 6 months of graduation. Our Career Services team works tirelessly to connect you with our hiring partners.' },
    { cat: 'outcomes', q: 'What are the typical salary expectations?', a: 'Our graduates typically see a 40%–120% salary increase within 12 months of completion. Junior Cloud Engineers in our network start at R25k–R35k/mo, while Senior Practitioners can earn significantly more.' },
    { cat: 'outcomes', q: 'Can I work for international companies from Africa?', a: 'Yes. A core focus of GDA is "Global Arbitrage." We train you to work remotely for firms in Europe and the US while based in Africa, allowing you to earn global-tier salaries.' },
    { cat: 'outcomes', q: 'Do you support student entrepreneurs?', a: 'Yes. Our "Foundership" track provides graduates with the infrastructure, legal frameworks, and mentor network needed to launch their own tech startups or consulting practices.' },
    { cat: 'outcomes', q: 'Is there an alumni network?', a: 'The Ginashe Alumni Network is a "Lifetime Talent Ecosystem." You retain access to our community, updated curriculum modules, and exclusive job boards for life.' },
    { cat: 'outcomes', q: 'Who are GDA\'s industry partners?', a: 'We partner with global cloud providers (AWS, Google Cloud), technical recruitment firms, and African fintech/enterprise leaders to ensure our curriculum and graduates remain in high demand.' }
  ];

  const filtered = faqs.filter(f => (search ? (f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : f.cat === activeCat));

  const toggleItem = (i: number) => {
    setOpenItems(prev => prev.includes(i) ? prev.filter(item => item !== i) : [...prev, i]);
  };

  return (
    <section id="faq" className="bg-bg2 border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-14 items-center">
          <div className="max-w-[540px]">
            <div className="section-label">Frequently Asked Questions</div>
            <h2 className="section-title animate-fadeUp">Every question,<br />answered honestly.</h2>
            <p className="section-sub animate-fadeUp delay-100">Thousands of admissions queries answered — here are the ones that matter most, with real answers, not marketing copy.</p>
          </div>
          <div className="bg-surface border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-emerald mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
              Quick Help
            </div>
            <ul className="space-y-3">
              {[
                { t: 'WhatsApp Admissions', d: 'Instant chat', id: 'whatsapp' },
                { t: 'Schedule a Call', d: '15-min discovery', id: 'guidance' },
                { t: 'Student Handbook', d: 'Policy & rules', id: 'student_handbook' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer" onClick={() => {
                  if (res.id === 'whatsapp') {
                    window.open('https://wa.me/263688526155?text=Hello%20Ginashe%20Digital%20Academy%2C%20I%20have%20a%20question%20about%20admissions.', '_blank');
                  } else {
                    onOpenModal(res.id);
                  }
                }}>
                  <div className="flex items-start gap-3">
                    <span className="font-dm-mono text-[10px] text-text-dim mt-0.5">→</span>
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-emerald transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mb-9 animate-fadeUp">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] opacity-40 pointer-events-none">🔍</span>
          <input 
            type="text" 
            className="w-full bg-card border border-border-custom rounded-md p-3.25 px-4 pl-11 font-dm-sans text-[14px] text-text-custom outline-none focus:border-brand/35 focus:shadow-[0_0_0_3px_rgba(0,242,255,0.07)] transition-all" 
            placeholder="Search — e.g. 'scholarships', 'remote learning', 'prerequisites'…" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
          <div className="flex flex-row lg:flex-col gap-0.75 lg:sticky lg:top-20 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 animate-fadeUp">
            {cats.map((cat) => (
              <button 
                key={cat.id}
                className={`flex items-center gap-2.5 p-3 px-4 rounded-md cursor-pointer border border-transparent bg-none text-left transition-all ${activeCat === cat.id && !search ? 'bg-card border-brand/20' : 'hover:bg-white/3 hover:border-border-custom'}`}
                onClick={() => { setActiveCat(cat.id); setSearch(''); }}
              >
                <span className={`w-1.75 h-1.75 rounded-full shrink-0 transition-colors ${activeCat === cat.id && !search ? 'bg-brand' : 'bg-text-dim'}`}></span>
                <span className={`font-syne font-semibold text-[13px] ${activeCat === cat.id && !search ? 'text-text-custom' : 'text-text-muted'}`}>{cat.name}</span>
                <span className="ml-auto font-dm-mono text-[9px] text-text-dim">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="animate-fadeUp delay-100">
            {filtered.length > 0 ? (
              <div className="border-t border-border-custom">
                {filtered.map((f, i) => (
                  <div key={i} className="border-b border-border-custom overflow-hidden">
                    <button 
                      className="w-full py-5 flex items-start justify-between gap-5 bg-none border-none cursor-pointer text-left group"
                      onClick={() => toggleItem(i)}
                    >
                      <span className={`font-syne font-semibold text-[15px] leading-[1.35] transition-colors ${openItems.includes(i) ? 'text-brand' : 'text-text-custom group-hover:text-brand'}`}>{f.q}</span>
                      <span className={`w-7 h-7 rounded-full bg-white/4 border border-border-custom flex items-center justify-center text-[16px] font-light text-text-muted transition-all shrink-0 mt-0.5 leading-none ${openItems.includes(i) ? 'bg-brand-dim border-brand/30 text-brand rotate-45' : ''}`}>+</span>
                    </button>
                    {openItems.includes(i) && (
                      <div className="pb-5 animate-slideDown">
                        <p className="text-[14px] text-text-soft leading-[1.75] mb-3 last:mb-0">{f.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-text-muted font-dm-mono text-[12px] tracking-[0.1em]">No questions match your search. <a href="mailto:academy@ginashe.co.za" className="text-brand no-underline hover:underline">Email us directly →</a></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
