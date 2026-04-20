import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeroProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function Hero({ onOpenModal, editMode }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [counters, setCounters] = useState({ graduates: 0, employers: 0, programmes: 0, placement: 0, uplift: 0, countries: 0 });
  const [isExplorer, setIsExplorer] = useState(false);
  const [isHighDemand, setIsHighDemand] = useState(true); // Marketing signal

  const [heroContent, setHeroContent] = useState({
    title: "Africa's Future Technologists Built Here",
    subtitle: "Ginashe Digital Academy delivers world-class technical rigour, practitioner-led Cloud, AI, and Data programmes engineered for Africa's digital economy — from Johannesburg to the world.",
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
            title: data.heroTitle,
            subtitle: data.heroSubtitle,
            intakeStatus: data.intakeStatus || 'OPEN'
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
            heroTitle: heroContent.title,
            heroSubtitle: heroContent.subtitle
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const n = Math.floor((W * H) / 14000);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,242,255,${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,242,255,${0.1 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    };

    resize();
    window.addEventListener('resize', resize);
    drawParticles();

    return () => window.removeEventListener('resize', resize);
  }, []);

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
      {/* Background Image — pushed far right with intelligent fade */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
          alt="" 
          loading="eager"
          decoding="async"
          className="absolute right-0 top-0 h-full w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] object-cover object-center opacity-40 sm:opacity-45 md:opacity-50"
        />
        {/* Multi-layer fade: hard left edge → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg from-25% via-bg/85 via-45% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/60"></div>
        {/* Extra protection for text area on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/50 to-transparent md:hidden"></div>
      </div>

      <canvas ref={canvasRef} id="hero-canvas" className="absolute inset-0 z-[1] opacity-40" />
      <div className="hero-orb absolute rounded-full pointer-events-none w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,242,255,0.055)_0%,transparent_65%)] -top-[200px] -right-[200px]" />
      <div className="hero-orb absolute rounded-full pointer-events-none w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(79,195,247,0.04)_0%,transparent_65%)] -bottom-[100px] -left-[150px]" />
      <div className="hero-orb absolute rounded-full pointer-events-none w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(86,207,172,0.035)_0%,transparent_65%)] top-[30%] left-1/2 -translate-x-1/2" />

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
            <button className="btn btn-brand btn-lg w-full sm:w-auto justify-center" onClick={() => onOpenModal('apply')}>
              Apply for a Programme
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
            </button>
            <a href="#programs" className="btn btn-outline btn-lg w-full sm:w-auto text-center justify-center">Explore Programmes</a>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap animate-fadeUp delay-400">
            <span className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] text-text-dim uppercase mr-1">Certified on</span>
            {[
              { label: 'AWS', color: '#ff9900' },
              { label: 'Azure', color: '#0078d4' },
              { label: 'GCP', color: '#4285f4' },
              { label: 'SETA', color: '#56cfac' },
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
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-emerald">Placement Rate</div>
            <div className="font-syne font-extrabold text-[22px] text-text-custom leading-[1.1]">94%</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">within 90 days</div>
          </div>

          <div className="absolute bottom-8 left-0 bg-sky-dim border border-sky/20 rounded-lg px-5 py-4 animate-float2 shadow-lg shadow-sky/5">
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-sky">Avg. Salary Increase</div>
            <div className="font-syne font-extrabold text-[22px] text-text-custom leading-[1.1]">+62%</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">post-graduation</div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-dim border border-brand/20 rounded-lg px-5 py-4 animate-float1 shadow-lg shadow-brand/5" style={{ animationDelay: '0.5s' }}>
            <div className="font-dm-mono text-[9px] tracking-[0.1em] uppercase text-brand">Active Learners</div>
            <div className="font-syne font-extrabold text-[22px] text-text-custom leading-[1.1]">247</div>
            <div className="font-dm-mono text-[8px] text-text-muted mt-0.5">across 7 countries</div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] border-t border-border-custom bg-bg/70 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 py-4 sm:py-5 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
          {[
            { value: counters.graduates, suffix: '+', label: 'Certified graduates' },
            { value: counters.placement, suffix: '%', label: 'Placement rate' },
            { value: counters.employers, suffix: '+', label: 'Employer partners' },
            { value: counters.uplift, suffix: '%', label: 'Avg salary uplift' },
            { value: counters.countries, suffix: '', label: 'African countries' },
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
