import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import InstitutionalHeroVisual from './InstitutionalHeroVisual';

interface HeroProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function Hero({ onOpenModal, editMode }: HeroProps) {
  const [counters, setCounters] = useState({ graduates: 0, employers: 0, programmes: 0, placement: 0, uplift: 0, countries: 0 });
  const [isExplorer, setIsExplorer] = useState(false);
  const [isHighDemand, setIsHighDemand] = useState(true); // Marketing signal

  const [heroContent, setHeroContent] = useState({
    title: "Africa's Future Technologists Built Here",
    subtitle: "Africa's premier institution for Cloud Engineering, AI, and Digital Transformation. Ginashe Digital Academy delivers world-class technical rigour through practitioner-led programmes engineered for the continental digital economy — from Johannesburg to the world.",
    intakeStatus: 'OPEN'
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') return;
          if (error.message?.includes('Could not find the table')) return;
          throw error;
        }

        if (data) {
          setHeroContent({
            title: data.herotitle,
            subtitle: data.herosubtitle,
            intakeStatus: data.intakestatus || 'OPEN'
          });
        }
      } catch (err) {
        console.error('Error fetching hero settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      try {
        const { error } = await supabase
          .from('site_settings')
          .update({
            herotitle: heroContent.title,
            herosubtitle: heroContent.subtitle
          })
          .eq('id', 1);
        
        if (error) throw error;
      } catch (err) {
        console.error('Error saving hero content:', err);
      }
    };

    window.addEventListener('save-site-content', handleSave);
    return () => window.removeEventListener('save-site-content', handleSave);
  }, [heroContent]);

  // Removed legacy particle canvas logic to use InstitutionalHeroVisual

  useEffect(() => {
    const targets = { graduates: 1247, employers: 48, programmes: 12, placement: 94, uplift: 62, countries: 7 };
    const dur = 1400;
    const step = 16;
    const timers: any[] = [];

    Object.entries(targets).forEach(([key, target]) => {
      const inc = target / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, target);
        setCounters(prev => ({ ...prev, [key]: Math.floor(cur) }));
        if (cur >= target) clearInterval(timer);
      }, step);
      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  useEffect(() => {
    // Check if user has visited curriculum before
    const explorerState = localStorage.getItem('gda_explorer_state');
    if (explorerState === 'active') {
      setIsExplorer(true);
    }
  }, []);

  return (
    <section id="hero" className="min-h-[100svh] flex flex-col pt-[72px] overflow-hidden relative bg-bg">
      {/* Background Visual — high-fidelity video and overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <InstitutionalHeroVisual showBackground={false} className="opacity-60" />
        {/* Multi-layer fade: hard left edge → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg from-15% via-bg/90 via-35% to-transparent z-[5]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50 z-[5]"></div>
        {/* Extra protection for text area on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent md:hidden z-[5]"></div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 py-10 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-[2] flex-1">
        <div className="hero-left">
          <div className="inline-flex items-center gap-2.5 font-dm-mono text-[10px] tracking-[0.25em] uppercase text-brand mb-5 animate-fadeUp">
            <div className={`flex items-center gap-1.5 border px-3 py-1.25 rounded-full ${heroContent.intakeStatus === 'OPEN' ? 'bg-brand-dim border-brand/25' : 'bg-coral-dim border-coral/25 text-coral'}`}>
              <span className="pulse"></span>
              2026 Cohorts — {heroContent.intakeStatus === 'OPEN' ? 'Applications Open' : heroContent.intakeStatus === 'CLOSED' ? 'Applications Closed' : 'Waitlist Only'}
            </div>
          </div>

          <h1 className="font-syne font-extrabold text-[32px] sm:text-[42px] md:text-[56px] lg:text-[76px] leading-[0.92] tracking-[-0.035em] mb-5 animate-fadeUp delay-100 relative group">
            {editMode ? (
              <textarea 
                className="w-full bg-surface/50 border border-brand/30 rounded p-2 text-text-custom outline-none focus:border-brand"
                value={heroContent.title}
                onChange={e => setHeroContent({...heroContent, title: e.target.value})}
              />
            ) : (
              <>
                Africa's
                <span className="block italic font-light font-dm-sans text-brand tracking-[-0.02em]">Future</span>
                <span>Technologists</span>
                <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--text-stroke)' }}>Built Here</span>
              </>
            )}
            {editMode && <span className="absolute -top-6 left-0 text-[10px] text-brand font-dm-mono uppercase">Edit Hero Title</span>}
          </h1>

          <div className="relative group mb-6 sm:mb-8">
            {editMode ? (
              <textarea 
                className="w-full bg-surface/50 border border-brand/30 rounded p-2 text-[16px] text-text-soft leading-[1.75] h-32 outline-none focus:border-brand"
                value={heroContent.subtitle}
                onChange={e => setHeroContent({...heroContent, subtitle: e.target.value})}
              />
            ) : (
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-text-soft leading-[1.7] max-w-[480px] animate-fadeUp delay-200">
                {heroContent.subtitle}
              </p>
            )}
            {editMode && <span className="absolute -top-6 left-0 text-[10px] text-brand font-dm-mono uppercase">Edit Hero Subtitle</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-wrap mb-8 animate-fadeUp delay-300">
            <button className="btn btn-brand btn-lg w-full sm:w-auto justify-center whitespace-nowrap" onClick={() => onOpenModal('apply_direct')}>
              Apply Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
            </button>
            <a href="#programs" className="btn btn-outline btn-lg w-full sm:w-auto text-center justify-center whitespace-nowrap">Explore Tracks</a>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap animate-fadeUp delay-400">
            <span className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] text-text-dim uppercase mr-1">Curriculum Aligned To</span>
            {[
              { label: 'AWS', color: '#ff9900' },
              { label: 'Azure', color: '#0078d4' },
              { label: 'GCP', color: '#4285f4' },
              { label: 'Microsoft', color: '#a78bfa' },
            ].map(c => (
              <span key={c.label} className="flex items-center gap-1 bg-card border border-border-custom px-2 py-1 rounded-sm font-dm-mono text-[8px] sm:text-[9px] tracking-[0.06em] text-text-muted hover:border-border2 hover:text-text-custom transition-all">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }}></span>{c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center relative animate-fadeUp delay-200 min-h-[320px]">
          <div className="absolute top-0 right-0 bg-emerald-dim border border-emerald/20 rounded-lg px-5 py-4 animate-float1 shadow-lg shadow-emerald/5">
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-emerald">Industry Integration</div>
            <div className="font-syne font-extrabold text-[18px] text-text-custom leading-[1.1]">Practitioner Led</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">Taught by Active Experts</div>
          </div>

          <div className="absolute bottom-8 left-0 bg-sky-dim border border-sky/20 rounded-lg px-5 py-4 animate-float2 shadow-lg shadow-sky/5">
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-sky">Technical Rigour</div>
            <div className="font-syne font-extrabold text-[18px] text-text-custom leading-[1.1]">Live Fire Training</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">Real Production Environments</div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-dim border border-brand/20 rounded-lg px-5 py-4 animate-float1 shadow-lg shadow-brand/5" style={{ animationDelay: '0.5s' }}>
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-brand">Curriculum Depth</div>
            <div className="font-syne font-extrabold text-[18px] text-text-custom leading-[1.1]">28+ Tech Modules</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">From Foundation to Enterprise</div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] border-t border-border-custom bg-bg/70 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 py-4 sm:py-5 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
          {[
            { value: '28', suffix: '+', label: 'Curriculum Modules' },
            { value: '100', suffix: '%', label: 'Practitioner Led' },
            { value: '7', suffix: '', label: 'Career Tracks' },
            { value: 'Live', suffix: '', label: 'Fire Training' },
            { value: 'Built', suffix: '', label: 'For Africa' },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col gap-0.5 text-center md:text-left px-2 md:px-4 ${i < 4 ? 'md:border-r border-border-custom' : ''}`}>
              <div className="font-syne font-extrabold text-[20px] sm:text-[24px] md:text-[28px] tracking-[-0.04em] leading-none text-text-custom">{stat.value}<span className="text-brand">{stat.suffix}</span></div>
              <div className="font-dm-mono text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.12em] uppercase text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
