import { useState } from 'react';
import { supabase } from '../lib/supabase';
import SharedAdmissionForm from './SharedAdmissionForm';

export function Cohorts({ onOpenModal }: { onOpenModal: (id: string) => void }) {
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
              {[
                { m: 'APR', d: '07', n: 'Cloud Launchpad — Cohort 12', det: '12 weeks · In-person · Sandton Campus', b: 'Filling Fast', bt: 'filling' },
                { m: 'APR', d: '14', n: 'Cloud Architecture Residency — Cohort 7', det: '6 months · Hybrid', b: 'Open', bt: 'open' },
                { m: 'MAY', d: '05', n: 'AI & Machine Learning — Cohort 3', det: '16 weeks · Online', b: 'Open', bt: 'open' },
                { m: 'JUN', d: '02', n: 'Data Engineering — Cohort 5', det: '12 weeks · Hybrid', b: 'Pre-Enrolling', bt: 'open' },
              ].map((c, i) => (
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

            <SharedAdmissionForm 
              onOpenModal={onOpenModal}
              onSuccess={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            
            <div className="text-center mt-6 pt-4 border-t border-border-custom">
               <span className="text-[11px] text-text-muted">
                Enterprise enquiry? <a className="text-gold no-underline cursor-pointer hover:underline" onClick={() => onOpenModal('apply')}>Apply as an organisation</a>
              </span>
            </div>
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
