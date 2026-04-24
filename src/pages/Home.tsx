import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { TrustBar, Programs } from '../components/Programs';
import { CTA } from '../components/Footer';

interface HomeProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
  siteSettings?: any;
}

// ─── WHY GDA — Social Proof Section ─────────
function WhySection() {
  const reasons = [
    { icon: '🎯', title: 'Industry-Designed Curriculum', desc: 'Every module is co-built with hiring managers from leading tech firms — so you learn what the global market actually needs.' },
    { icon: '👨‍🏫', title: 'Practitioner-Led Teaching', desc: 'No career academics. Our instructors are active Cloud Architects, ML Engineers, and CTOs who bring real production problems into the classroom.' },
    { icon: '🤝', title: 'Strategic Industry Bridging', desc: 'Our Career Services team doesn\'t just wait for graduation. We align our curriculum with active technical hiring cycles across our institutional network to ensure our candidates are priority-listed.' },
    { icon: '🌍', title: 'Built for Africa', desc: 'From cloud engineering to digital transformation, everything is contextualised for the African digital economy.' },
    { icon: '💰', title: 'Flexible Funding', desc: 'Instalment plans, employer-sponsored, or self-funded — we have a path for every budget. No one is turned away for financial reasons alone.' },
    { icon: '🚀', title: 'Founder & Freelance Empowerment', desc: 'We don\'t just train employees; we build digital entrepreneurs. Our curriculum includes specialized pathways for launching your own tech consultancy, freelancing globally, or founding a startup.' },
  ];

  return (
    <section className="bg-bg2 border-t border-b border-border-custom">
      <div className="section-inner">
        <div className="text-center mb-10 md:mb-12">
          <div className="section-label justify-center">Why Ginashe Digital Academy</div>
          <h2 className="section-title mx-auto">Not just another bootcamp.</h2>
          <p className="section-sub mx-auto text-center mt-3">We're a premier digital institution built on practitioner-led teaching and curricula co-developed with industry leaders for the African market.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reasons.map((r, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-xl p-5 md:p-6 hover:border-brand/20 transition-all group">
              <div className="text-2xl mb-3">{r.icon}</div>
              <h3 className="font-syne font-bold text-[15px] mb-2 group-hover:text-brand transition-colors">{r.title}</h3>
              <p className="text-[13px] text-text-soft leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: 'George K', role: 'Executive Director', programme: 'Digital Strategy & Governance', quote: 'At Ginashe, we aren\'t just teaching code; we\'re architecting the future of African sovereignty in the global digital economy.', link: '/about', image: '/images/faculty/george.jpg' },
    { name: 'Talent K', role: 'Lead Faculty (Cloud Specialist)', programme: 'Cloud Architecture Residency', quote: 'Our curriculum is live fire. We prepare candidates to handle production-scale architectures from Day 1, bridging the gap between theory and technical mastery.', link: '/about' },
    { name: 'Lebo C', role: 'Prospective Candidate', programme: 'Software Engineering Peak', quote: 'I chose GDA because I wanted a path that was practitioner-led. The focus on real-world impact over generic accreditation is what the market is actually demanding.' },
  ];

  return (
    <section className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="mb-8 md:mb-10">
          <div className="section-label">Institutional Voices</div>
          <h2 className="section-title">Leading the Digital Frontier.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t, i) => {
            const CardContent = (
              <div key={i} className={`bg-card border border-border-custom rounded-xl p-5 md:p-6 flex flex-col h-full transition-all duration-300 ${t.link ? 'hover:border-brand/40 hover:bg-white/[0.04]' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center font-syne font-bold text-brand text-sm overflow-hidden">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <div className="font-syne font-bold text-[13px]">{t.name}</div>
                    <div className="font-dm-mono text-[9px] text-text-muted uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
                <blockquote className="text-[13px] text-text-soft leading-relaxed flex-1 italic">"{t.quote}"</blockquote>
                <div className="mt-4 pt-3 border-t border-border-custom">
                  <span className="font-dm-mono text-[8px] text-brand uppercase tracking-widest">{t.programme}</span>
                </div>
              </div>
            );

            return t.link ? (
              <Link key={i} to={t.link} className="no-underline block h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={i} className="h-full">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home({ onOpenModal, editMode, siteSettings }: HomeProps) {
  return (
    <>
      {(!siteSettings || siteSettings.showhero !== false) && (
        <Hero onOpenModal={onOpenModal} editMode={editMode} />
      )}
      {(!siteSettings || siteSettings.showprograms !== false) && (
        <Programs onOpenModal={onOpenModal} editMode={editMode} isHomePage={true} />
      )}
      <WhySection />
      {(!siteSettings || siteSettings.showtrustbar !== false) && (
        <TrustBar />
      )}
      <Testimonials />
      {(!siteSettings || siteSettings.showcta !== false) && (
        <CTA onOpenModal={onOpenModal} editMode={editMode} />
      )}
    </>
  );
}
