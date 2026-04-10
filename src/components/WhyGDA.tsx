import React from 'react';

export function WhyGDA({ editMode }: { editMode?: boolean }) {
  return (
    <section id="why" className="bg-bg2 border-t border-border-custom">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-16 items-start">
          <div>
            <div className="section-label">Why GDA Academy</div>
            <h2 className="section-title animate-fadeUp">Elite rigour.<br /><em className="italic font-light font-dm-sans text-gold">African</em> by design.</h2>
            <p className="section-sub animate-fadeUp delay-100">
              We didn't copy a Western curriculum. We built ours from the ground up — mapped to Africa's cloud adoption curve, SETA standards, and real employer demand.
            </p>
          </div>
          <div className="bg-white/3 border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              Institutional Profile
            </div>
            <ul className="space-y-4">
              {[
                { t: 'Our Mission & Vision', d: 'Empowering the continent' },
                { t: 'Academic Leadership', d: 'Industry veterans' },
                { t: 'Governance & Values', d: 'Operational excellence' }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-custom border border-border-custom rounded-lg overflow-hidden">
          <div className="col-span-1 md:col-span-2 bg-[linear-gradient(135deg,#131a30_0%,#0f1320_100%)] border-t border-gold/15 p-6 sm:p-10.5 px-6 sm:px-9.5 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center animate-fadeUp">
            <div>
              <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Placement Programme</div>
              <h3 className="font-syne font-bold text-[20px] mb-3">We don't stop at the certificate</h3>
              <p className="text-[13px] text-text-soft leading-[1.7]">GDA operates Africa's most active tech placement programme. From the moment you enrol, our Placement Officers are matching your profile with our network of 48+ employer partners. We prep your CV, LinkedIn, GitHub, and coach you through every interview.</p>
              
              <div className="mt-6 flex flex-col gap-0">
                {[
                  { n: 1, t: 'Profile Building', d: 'Week 1 — CV, LinkedIn optimisation, GitHub portfolio setup' },
                  { n: 2, t: 'Technical Interview Prep', d: 'Weeks 4–8 — Mock technical interviews, systems design walkthroughs' },
                  { n: 3, t: 'Employer Matching', d: 'Final 2 weeks — Direct introductions to 48+ partner companies' },
                  { n: 4, t: '90-Day Guarantee', d: 'If you don\'t land a role in 90 days, we retrain you — free of charge' }
                ].map((step) => (
                  <div key={step.n} className="flex gap-4 py-4 border-b border-white/4 last:border-none">
                    <div className="w-7 h-7 rounded-full bg-gold text-[#080b12] font-syne font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.25">{step.n}</div>
                    <div className="ps-info">
                      <div className="font-syne font-semibold text-[13px]">{step.t}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-gold/4 border border-gold/15 rounded-md p-6">
                <h4 className="font-syne font-bold text-[13px] text-gold mb-4.5">📊 GDA Performance Metrics</h4>
                {[
                  { l: 'Placement Rate', v: '94%', p: 94 },
                  { l: 'Certification Pass Rate', v: '91%', p: 91 },
                  { l: 'Learner Satisfaction', v: '97%', p: 97 },
                  { l: 'Avg Salary Uplift', v: '+62%', p: 62, c: 'var(--color-emerald)' },
                  { l: 'Net Promoter Score', v: '84 NPS', p: 84, c: 'var(--color-sky)' }
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-none">
                    <span className="text-[12px] text-text-soft">{m.l}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-0.75 bg-white/7 rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${m.p}%`, background: m.c || 'var(--color-gold)' }}></div>
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
                    { n: 'Cloud Launchpad C12', f: 88, c: 'var(--color-gold)' },
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
            <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Accreditation</div>
            <h3 className="font-syne font-bold text-[20px] mb-3">Internationally recognised, locally relevant</h3>
            <p className="text-[13px] text-text-soft leading-[1.7]">GDA curricula are aligned to MICT SETA unit standards, enabling WSP/ATR claims and NSFAS-adjacent funding options. Cloud content maps directly to AWS, Azure, and GCP official learning paths.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="chip chip-gold">MICT SETA Accredited</span>
              <span className="chip chip-sky">DHET Aligned</span>
              <span className="chip chip-em">NQF Levels 4–7</span>
              <span className="chip">B-BBEE Compliant</span>
              <span className="chip chip-vio">IASA Partner</span>
              <span className="chip">POPIA Certified</span>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-10.5 px-6 sm:px-9.5 relative overflow-hidden transition-colors hover:bg-card2 animate-fadeUp delay-100">
            <div className="flex items-center gap-3 font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4.5 before:content-[''] before:w-5 before:h-px before:bg-text-dim">Live Infrastructure</div>
            <h3 className="font-syne font-bold text-[20px] mb-3">Train on real cloud, not simulators</h3>
            <p className="text-[13px] text-text-soft leading-[1.7]">Every learner gets a dedicated AWS / Azure / GCP sandbox account from Day 1. You build, break, and fix real infrastructure. No toy environments, no theoretical exercises — just production-grade practice.</p>
            <div className="mt-5 p-4 bg-surface border border-border-custom rounded-sm font-dm-mono text-[11px] text-emerald leading-[1.8]">
              $ aws ec2 describe-instances --region af-south-1<br />
              <span className="text-text-dim">→ Provisioning 3 instances... <span className="text-gold">✓ ready</span></span><br />
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
                <div className="font-syne font-extrabold text-[28px] text-gold leading-none">7</div>
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.1em] uppercase">Countries</div>
              </div>
              <div>
                <div className="font-syne font-extrabold text-[28px] text-sky leading-none">3</div>
                <div className="font-dm-mono text-[9px] text-text-dim tracking-[0.1em] uppercase">Languages</div>
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
          <div className="section-label">Graduate Outcomes</div>
          <h2 className="section-title animate-fadeUp">Our graduates are<br />changing Africa.</h2>
          <p className="section-sub animate-fadeUp delay-100">From Johannesburg to Nairobi, GDA graduates are leading cloud migrations, building AI products, and founding their own startups.</p>
        </div>

        <div className="bg-[linear-gradient(135deg,rgba(244,162,26,0.08)_0%,transparent_60%)] border border-gold/15 rounded-3xl p-6 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center mb-12 animate-fadeUp">
          <div>
            <div className="font-syne italic font-normal text-[clamp(18px,2.2vw,26px)] leading-[1.4] text-text-custom tracking-[-0.01em] before:content-['\22'] before:text-gold before:text-[60px] before:leading-[0.5] before:block before:mb-3 before:not-italic">
              "GDA didn't just give me a certificate. They gave me the skills, the network, and the confidence to build Africa's first AI-powered agricultural marketplace."
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,var(--color-gold),#c67d10)] flex items-center justify-center font-syne font-extrabold text-[14px] text-[#080b12]">AM</div>
              <div>
                <div className="font-syne font-bold text-[13px]">Amara Mensah</div>
                <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] uppercase">GDA Cohort 4 · 2023 · Founder, AgroAI Ghana</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4.5">
            {[
              { i: '🎯', n: '94', l: 'Placed within 90 days of graduation' },
              { i: '💰', n: '+62', l: 'Average salary increase post-graduation' },
              { i: '🌍', n: '7', l: 'GDA alumni working across Africa' },
              { i: '🚀', n: '23', l: 'Founded by GDA alumni' }
            ].map((o, i) => (
              <div key={i} className="flex items-center gap-3.5 bg-white/2 border border-border-custom rounded-md p-4 px-4.5">
                <div className="w-10 h-10 rounded-sm bg-gold-dim text-gold text-[18px] flex items-center justify-center shrink-0">{o.i}</div>
                <div>
                  <div className="font-syne font-extrabold text-[22px] text-gold leading-none">{o.n}{o.n === '94' ? '%' : o.n === '+62' ? '%' : o.n === '7' ? ' countries' : ' startups'}</div>
                  <div className="text-[12px] text-text-soft">{o.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            { n: 'Thembi Nkosi', r: 'Cloud Architect', c: 'Standard Bank Group', i: 'TN', g: 'linear-gradient(135deg,#f4a21a,#c67d10)' },
            { n: 'Kwame Mensah', r: 'ML Engineer', c: 'Safaricom · Nairobi', i: 'KM', g: 'linear-gradient(135deg,#4fc3f7,#0288d1)' },
            { n: 'Nomsa Achebe', r: 'Data Engineer', c: 'MTN Group', i: 'NA', g: 'linear-gradient(135deg,#56cfac,#2e9e7a)' },
            { n: 'Bongani Sithole', r: 'DevSecOps Lead', c: 'Discovery · JHB', i: 'BS', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
            { n: 'Fatima Osei', r: 'AI Product Manager', c: 'Flutterwave · Lagos', i: 'FO', g: 'linear-gradient(135deg,#f4664a,#c04030)' },
            { n: 'Rudo Dube', r: 'Cloud Solutions Architect', c: 'Microsoft · Harare', i: 'RD', g: 'linear-gradient(135deg,#f4a21a,#56cfac)' }
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
