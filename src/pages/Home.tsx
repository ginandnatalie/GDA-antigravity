import React from 'react';
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
    { icon: '🏆', title: '94% Placement Rate', desc: 'Our Career Services team doesn\'t stop at graduation. We place you into roles at partner companies within 90 days or extend support at no extra cost.' },
    { icon: '🌍', title: 'Built for Africa', desc: 'From cloud engineering to digital transformation, everything is contextualised for the African digital economy.' },
    { icon: '💰', title: 'Flexible Funding', desc: 'Instalment plans, employer-sponsored, or self-funded — we have a path for every budget. No one is turned away for financial reasons alone.' },
    { icon: '🔄', title: 'Lifetime Alumni Access', desc: 'Graduate once, belong forever. Access updated coursework, alumni networking, job boards, and mentorship for life.' },
  ];

  return (
    <section className="bg-bg2 border-t border-b border-border-custom">
      <div className="section-inner">
        <div className="text-center mb-10 md:mb-12">
          <div className="section-label justify-center">Why Ginashe Digital Academy</div>
          <h2 className="section-title mx-auto">Not just another bootcamp.</h2>
          <p className="section-sub mx-auto text-center mt-3">We're a premier digital institution with a 94% placement rate, practitioner-led teaching, and curricula built specifically for the African market.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reasons.map((r, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-xl p-5 md:p-6 hover:border-gold/20 transition-all group">
              <div className="text-2xl mb-3">{r.icon}</div>
              <h3 className="font-syne font-bold text-[15px] mb-2 group-hover:text-gold transition-colors">{r.title}</h3>
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
    { name: 'Thabo Mokoena', role: 'Cloud Solutions Architect, FNB', programme: 'Cloud Architecture Residency', quote: 'GDA didn\'t just teach me cloud — they taught me to think like an architect. Within 60 days of graduating, I had three offers on the table.' },
    { name: 'Naledi Dlamini', role: 'ML Engineer, Standard Bank', programme: 'AI & Machine Learning', quote: 'The hands-on approach was game-changing. By week 3, we were deploying real models. My manager says I outperform engineers with twice my experience.' },
    { name: 'Sipho Nkosi', role: 'DevOps Lead, Vodacom', programme: 'Cloud Launchpad', quote: 'I came in with no tech background — just matric and determination. The practitioner-led programme gave me everything I needed. My salary has increased significantly.' },
  ];

  return (
    <section className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="mb-8 md:mb-10">
          <div className="section-label">Graduate Voices</div>
          <h2 className="section-title">Hear from our alumni.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-xl p-5 md:p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-dim border border-gold/20 flex items-center justify-center font-syne font-bold text-gold text-sm">{t.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div className="font-syne font-bold text-[13px]">{t.name}</div>
                  <div className="font-dm-mono text-[9px] text-text-muted uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
              <blockquote className="text-[13px] text-text-soft leading-relaxed flex-1 italic">"{t.quote}"</blockquote>
              <div className="mt-4 pt-3 border-t border-border-custom">
                <span className="font-dm-mono text-[8px] text-gold uppercase tracking-widest">{t.programme}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home({ onOpenModal, editMode, siteSettings }: HomeProps) {
  return (
    <>
      {(!siteSettings || siteSettings.showHero !== false) && (
        <Hero onOpenModal={onOpenModal} editMode={editMode} />
      )}
      {(!siteSettings || siteSettings.showTrustBar !== false) && (
        <TrustBar editMode={editMode} />
      )}
      {(!siteSettings || siteSettings.showPrograms !== false) && (
        <Programs onOpenModal={onOpenModal} editMode={editMode} isHomePage={true} />
      )}
      <WhySection />
      <Testimonials />
      {(!siteSettings || siteSettings.showCTA !== false) && (
        <CTA onOpenModal={onOpenModal} editMode={editMode} />
      )}
    </>
  );
}
