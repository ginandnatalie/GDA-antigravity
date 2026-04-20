import React, { useState } from 'react';

export function Funding({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  return (
    <section id="funding" className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-14 items-center">
          <div className="max-w-[540px]">
            <div className="section-label">Financial Aid & Funding</div>
            <h2 className="section-title animate-fadeUp">Cost should never be<br />the barrier to <em className="italic font-light font-dm-sans text-brand">greatness.</em></h2>
            <p className="section-sub animate-fadeUp delay-100">GDA programmes can be fully funded through SETA skills levies, employer training budgets, or our flexible payment plans. Every option, explained clearly.</p>
          </div>
          <div className="bg-card border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Top Resources
            </div>
            <ul className="space-y-3">
              {[
                { t: '2026 Prospectus', d: 'Full fee breakdown' },
                { t: 'SETA Funding Guide', d: 'Step-by-step PDF' },
                { t: 'ISA Agreement Template', d: 'Terms & conditions' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
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
            <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-emerald mb-2">Government / SETA Funded</div>
            <div className="font-syne font-extrabold text-[18px] mb-2.5">MICT SETA Skills Levy Funding</div>
            <div className="text-[13px] text-text-soft leading-[1.65] mb-5 flex-1">Companies with annual payroll over R500,000 pay a 1% Skills Development Levy. GDA is an accredited MICT SETA provider — your employer can claim this back to fund your training at zero net cost to the business.</div>
            <ul className="list-none flex flex-col gap-2.25 mb-5.5">
              {['Available to learners employed at levy-paying companies', 'Covers up to 100% of programme fees for qualifying learners', 'GDA handles all WSP/ATR reporting and SETA paperwork', 'Available for youth (18–35) AND working professionals'].map((li, i) => (
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
            <button className="btn btn-sm bg-emerald-dim text-emerald border border-emerald/25 hover:bg-emerald/20" onClick={() => onOpenModal('apply')}>Check SETA Eligibility →</button>
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
            <button className="btn btn-sm bg-sky-dim text-sky border border-sky/25 hover:bg-sky/20" onClick={() => onOpenModal('apply')}>Request Corporate Package →</button>
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
            <button className="btn btn-brand btn-sm" onClick={() => onOpenModal('apply')}>Discuss Payment Options →</button>
          </div>
        </div>

        <div className="bg-surface border border-border-custom rounded-3xl p-6 sm:p-10 animate-fadeUp">
          <div className="font-syne font-extrabold text-[20px] mb-1.5">How to access SETA funding — step by step</div>
          <div className="text-[13px] text-text-soft mb-8">Most learners leave this money on the table. GDA's admissions team guides you through every step at no cost.</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            <div className="hidden lg:block absolute top-[22px] left-[22px] right-[22px] h-0.5 bg-[linear-gradient(90deg,var(--color-emerald),var(--color-sky),var(--color-brand))] opacity-30 z-0"></div>
            {[
              { n: 1, t: 'Confirm your employer\'s levy status', d: 'Check if your company pays the Skills Development Levy (payroll > R500k/year). GDA can verify this with your HR in under 10 minutes.' },
              { n: 2, t: 'Get a Letter of Support from HR', d: 'Your HR/L&D manager signs a one-page letter confirming the company supports your training. GDA provides the template — you just need a signature.' },
              { n: 3, t: 'GDA submits the discretionary grant application', d: 'Our SETA Compliance Officer handles the entire MICT SETA submission on your behalf. No admin burden on you. Typical approval: 10–15 business days.' },
              { n: 4, t: 'Enrol & start at no personal cost', d: 'Once approved, GDA invoices SETA directly. You start your programme — zero out-of-pocket cost for qualifying applicants.' }
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

export function FAQ({ editMode }: { editMode?: boolean }) {
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
    { cat: 'admissions', q: 'Do I need prior IT or coding experience to apply?', a: 'It depends on the programme. The Cloud Launchpad is designed for absolute beginners — zero IT background needed. Professional-track programmes require some comfort with command-line tools and basic programming. AI for Business Leaders requires no technical background at all — just senior management experience.' },
    { cat: 'admissions', q: 'How long does the application process take?', a: 'Submit online in about 5 minutes. Our admissions team responds within 2 business days. If accepted, you receive a formal acceptance letter and payment options within 24 hours. For SETA-funded applications, allow 10–15 additional business days for grant approval — our team handles all of that.' }
    // ... more FAQs would go here
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
                { t: 'WhatsApp Admissions', d: 'Instant chat' },
                { t: 'Schedule a Call', d: '15-min discovery' },
                { t: 'Student Handbook', d: 'Policy & rules' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
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
            placeholder="Search — e.g. 'SETA funding', 'remote learning', 'prerequisites'…" 
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
