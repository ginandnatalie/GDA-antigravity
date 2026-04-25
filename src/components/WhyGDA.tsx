import React from 'react';

export function WhyGDA({ editMode }: { editMode?: boolean }) {
  return (
    <section id="why" className="bg-bg2 border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-16 items-start">
          <div>
            <div className="section-label">Why GDA Academy</div>
            <h2 className="section-title animate-fadeUp">Elite rigour.<br /><em className="italic font-light font-dm-sans text-brand">African</em> by design.</h2>
            <p className="section-sub animate-fadeUp delay-100">
              We deliver uncompromised technical instruction built by practitioners. Our curriculum is mapped to global adoption curves and real employer demand, prioritizing execution over academic theory.
            </p>
          </div>
          <div className="bg-white/3 border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Institutional Profile
            </div>
            <ul className="space-y-4">
              {[
                { t: 'Mission & Mastery', d: 'High-fidelity instruction' },
                { t: 'Technical Sovereignty', d: 'Execution-first learning' },
                { t: 'Practitioner Accountability', d: 'Led by industry veterans' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-brand transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                    <span className="text-text-dim text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-custom border border-border-custom rounded-lg overflow-hidden">
          <div className="col-span-1 md:col-span-2 bg-[linear-gradient(135deg,#0B0C10_0%,#0f1117_100%)] border-t border-brand/15 p-6 sm:p-10.5 px-6 sm:px-9.5 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center animate-fadeUp">
            <div>
              <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Institutional Outcomes</div>
              <h3 className="font-syne font-bold text-[20px] mb-3">Engineered for the industry</h3>
              <p className="text-[13px] text-text-soft leading-[1.7]">GDA focuses on building job-ready technical resilience. From Day 1, we focus on portfolio development, mock technical interviews, and systems design walkthroughs to ensure every member can execute at a production-grade level.</p>
              
              <div className="mt-6 flex flex-col gap-0">
                {[
                  { n: 1, t: 'Skill Assessment', d: 'Week 1 — Technical baseline evaluation and roadmap setup' },
                  { n: 2, t: 'Intensive Lab Work', d: 'Weeks 4–8 — Real-world cloud builds and systems architecture' },
                  { n: 3, t: 'Mastery Review', d: 'Final weeks — Cold-eye peer reviews and project sign-offs' },
                  { n: 4, t: 'Career Resilience', d: 'Continuous support through our practitioner network' }
                ].map((step) => (
                  <div key={step.n} className="flex gap-4 py-4 border-b border-white/4 last:border-none">
                    <div className="w-7 h-7 rounded-full bg-brand text-[#080b12] font-syne font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.25">{step.n}</div>
                    <div className="ps-info">
                      <div className="font-syne font-semibold text-[13px]">{step.t}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-brand/4 border border-brand/15 rounded-md p-6">
                <h4 className="font-syne font-bold text-[13px] text-brand mb-4.5">📊 Institutional Performance</h4>
                {[
                  { l: 'Mastery Completion Rate', v: '94%', p: 94 },
                  { l: 'Project Success Rate', v: '91%', p: 91 },
                  { l: 'Learner Satisfaction', v: '97%', p: 97 },
                  { l: 'Technical Skill Uplift', v: '+62%', p: 62, c: 'var(--color-emerald)' },
                  { l: 'Academic Rigour Score', v: '84/100', p: 84, c: 'var(--color-sky)' }
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-none">
                    <span className="text-[12px] text-text-soft">{m.l}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-0.75 bg-white/7 rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${m.p}%`, background: m.c || 'var(--color-brand)' }}></div>
                      </div>
                      <span className="font-dm-mono text-[12px] text-text-custom" style={m.c ? { color: m.c } : {}}>{m.v}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4.5 bg-surface border border-border-custom rounded-md">
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.15em] uppercase mb-3">Live Cohort Progress</div>
                <div className="flex flex-col gap-2">
                  {[
                    { n: 'Cloud Launchpad C12', f: 88, c: 'var(--color-brand)' },
                    { n: 'AI/ML Engineering C5', f: 60, c: 'var(--color-sky)' },
                    { n: 'Data Engineering C6', f: 45, c: 'var(--color-emerald)' }
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.25">
                        <span className="text-[11px] text-text-soft">{c.n}</span>
                        <span className="font-dm-mono text-[10px]" style={{ color: c.c }}>{c.f}% full</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${c.f}%`, background: c.c }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-10.5 px-6 sm:px-9.5 relative overflow-hidden transition-colors hover:bg-card2 animate-fadeUp">
            <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Standards Alignment</div>
            <h3 className="font-syne font-bold text-[20px] mb-3">High-fidelity engineering standards</h3>
            <p className="text-[13px] text-text-soft leading-[1.7]">GDA curriculum is independently designed to align with global industry standards. We prioritize mastery of vendor frameworks (AWS, Azure, GCP) to ensure our members can solve the problems enterprises actually face.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="chip chip-brand">Practitioner Led</span>
              <span className="chip chip-sky">Industry Aligned</span>
              <span className="chip chip-em">Credential Focused</span>
              <span className="chip chip-vio">IASA Aligned</span>
              <span className="chip">POPIA Compliant</span>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-10.5 px-6 sm:px-9.5 relative overflow-hidden transition-colors hover:bg-card2 animate-fadeUp delay-100">
            <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Live Infrastructure</div>
            <h3 className="font-syne font-bold text-[20px] mb-3">Train on real cloud, not simulators</h3>
            <p className="text-[13px] text-text-soft leading-[1.7]">Every learner gets a dedicated AWS / Azure / GCP sandbox account from Day 1. You build, break, and fix real infrastructure. No toy environments, no theoretical exercises — just production-grade practice.</p>
            <div className="mt-5 p-4 bg-surface border border-border-custom rounded-sm font-dm-mono text-[11px] text-emerald leading-[1.8]">
              $ aws ec2 describe-instances --region af-south-1<br />
              <span className="text-text-dim">→ Provisioning 3 instances... <span className="text-brand">✓ ready</span></span><br />
              $ kubectl get pods -n gda-labs<br />
              <span className="text-text-dim">→ 12/12 pods running <span className="text-emerald">✓ healthy</span></span>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-10.5 px-6 sm:px-9.5 relative overflow-hidden transition-colors hover:bg-card2 animate-fadeUp delay-200">
            <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">African Identity</div>
            <h3 className="font-syne font-bold text-[20px] mb-3">Built for Africa's digital economy</h3>
            <p className="text-[13px] text-text-soft leading-[1.7]">Case studies from Safaricom, MTN, Standard Bank, and Shoprite. POPIA compliance labs. Content on pan-African fintech, agritech, and healthtech. Languages: English, isiZulu, Shona learning support.</p>
            <div className="mt-5 flex gap-6">
              <div>
                <div className="font-syne font-extrabold text-[28px] text-brand leading-none">Pan-African</div>
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.1em] uppercase">Deployment</div>
              </div>
              <div>
                <div className="font-syne font-extrabold text-[28px] text-sky leading-none">Global</div>
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.1em] uppercase">Vendor Standards</div>
              </div>
              <div>
                <div className="font-syne font-extrabold text-[28px] text-emerald leading-none">100%</div>
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.1em] uppercase">Africa-focused</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Alumni({ editMode }: { editMode?: boolean }) {
  return (
    <section id="alumni" className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="max-w-[540px] mb-14">
          <div className="section-label">Founder & Freelance Empowerment</div>
          <h2 className="section-title animate-fadeUp text-white">The Foundation of<br /><span className="text-brand">African Foundership.</span></h2>
          <p className="section-sub animate-fadeUp delay-100">We don't just build employees; we forge the technical architects and entrepreneurs building Africa's new digital infrastructure. Our alumni are currently delivering high-impact systems at the continent's most significant institutional players.</p>
        </div>

        <div className="bg-[linear-gradient(135deg,var(--cyan-dim)_0%,transparent_60%)] border border-brand/15 rounded-3xl p-6 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center mb-12 animate-fadeUp">
          <div>
            <div className="font-syne italic font-normal text-[clamp(18px,2.2vw,26px)] leading-[1.4] text-text-custom tracking-[-0.01em] before:content-['\22'] before:text-brand before:text-[60px] before:leading-[0.5] before:block before:mb-3 before:not-italic">
              "GDA gave me the technical sovereignty to build my own venture. I'm not just navigating the industry; I'm disrupting it from the ground up with production-grade authority."
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,var(--color-brand),#008b8b)] flex items-center justify-center font-syne font-extrabold text-[14px] text-[#080b12]">KM</div>
              <div>
                <div className="font-syne font-bold text-[13px]">Technical Co-Founder</div>
                <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] uppercase">Cloud Architecture Residency · Sovereign FinTech Disruptor</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4.5">
            {[
              { i: '🛡️', n: '94', l: 'Venture-Ready Mastery' },
              { i: '⚡', n: '6.2x', l: 'Technical Execution ROI' },
              { i: '🌍', n: 'Sovereign', l: 'Market Disruption Tracked' },
              { i: '🚀', n: 'Elite', l: 'Institutional Influence Velocity' }
            ].map((o, i) => (
              <div key={i} className="flex items-center gap-3.5 bg-white/2 border border-border-custom rounded-md p-4 px-4.5">
                <div className="w-10 h-10 rounded-sm bg-brand-dim text-brand text-[18px] flex items-center justify-center shrink-0">{o.i}</div>
                <div>
                  <div className="font-syne font-extrabold text-[22px] text-brand leading-none">{o.n}{o.n === '94' ? '%' : ''}</div>
                  <div className="text-[12px] text-text-soft">{o.l}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => window.location.href = '/foundership'}
              className="btn btn-brand btn-sm px-10 font-syne font-black uppercase text-[10px] tracking-widest shadow-[0_10px_30px_rgba(0,242,255,0.15)]"
            >
              Explore Empowerment Matrix →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            { n: 'Vanguard Alumni', r: 'Technical Co-Founder', c: 'Sovereign FinTech', i: 'VA', g: 'linear-gradient(135deg,#00f2ff,#008b8b)' },
            { n: 'Vanguard Alumni', r: 'CEO & Architect', c: 'Logistics AI Startup', i: 'VA', g: 'linear-gradient(135deg,#4fc3f7,#0288d1)' },
            { n: 'Vanguard Alumni', r: 'Head of Intelligence', c: 'Institutional Data', i: 'VA', g: 'linear-gradient(135deg,#56cfac,#2e9e7a)' },
            { n: 'Vanguard Alumni', r: 'CTO / Founder', c: 'Security Infrastructure', i: 'VA', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
            { n: 'Vanguard Alumni', r: 'Disruption Lead', c: 'Market Intelligence', i: 'VA', g: 'linear-gradient(135deg,#f4664a,#c04030)' },
            { n: 'Vanguard Alumni', r: 'Founding Engineer', c: 'Platform Engineering', i: 'VA', g: 'linear-gradient(135deg,#00f2ff,#56cfac)' }
          ].map((a, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-md p-5.5 px-4.5 flex gap-3.5 items-start transition-all hover:border-border2 hover:-translate-y-0.75 animate-fadeUp">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-extrabold text-[13px] text-[#080b12] shrink-0" style={{ background: a.g }}>{a.i}</div>
              <div>
                <div className="font-syne font-semibold text-[13px]">{a.n}</div>
                <div className="text-[11px] text-text-soft mt-0.25">{a.r}</div>
                <div className="inline-flex items-center gap-1 mt-2 font-dm-mono text-[9px] text-text-muted tracking-[0.08em]">🏢 {a.c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
