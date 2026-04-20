import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

export function CTA({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    title: 'Your cloud career starts today.',
    subtitle: 'Applications for the April 2026 cohort close soon. Seats are limited to 25 per cohort — secure yours now.'
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('ctaTitle, ctaSubtitle').eq('id', 1).single();
        if (data) {
          setContent({
            title: data.ctaTitle || content.title,
            subtitle: data.ctaSubtitle || content.subtitle
          });
        }
      } catch (err) {
        console.error('Error fetching CTA settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      try {
        await supabase.from('site_settings').update({
          ctaTitle: content.title,
          ctaSubtitle: content.subtitle
        }).eq('id', 1);
      } catch (err) {
        console.error('Error saving CTA content:', err);
      }
    };
    window.addEventListener('save-site-content', handleSave);
    return () => window.removeEventListener('save-site-content', handleSave);
  }, [content]);

  return (
    <section id="cta" className="bg-bg2 border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 py-12 sm:py-16 md:py-20 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,242,255,0.06)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="mb-5 t-label">Ready to begin?</div>
        {editMode ? (
          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <textarea 
              className="w-full bg-surface/50 border border-brand/30 rounded p-2 text-3xl font-syne font-bold text-text-custom text-center outline-none focus:border-brand h-24"
              value={content.title}
              onChange={e => setContent({...content, title: e.target.value})}
            />
            <textarea 
              className="w-full bg-surface/50 border border-brand/30 rounded p-2 text-sm text-text-soft text-center outline-none focus:border-brand h-24"
              value={content.subtitle}
              onChange={e => setContent({...content, subtitle: e.target.value})}
            />
          </div>
        ) : (
          <>
            <h2 className="t-display text-[clamp(28px,5vw,64px)] mb-4 animate-fadeUp whitespace-pre-line">
              {content.title}
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-text-soft max-w-[480px] mx-auto mb-8 leading-[1.7] animate-fadeUp delay-100">{content.subtitle}</p>
          </>
        )}
        <div className="flex gap-3 justify-center flex-wrap mb-10 animate-fadeUp delay-200">
          <button className="btn btn-brand btn-lg w-full sm:w-auto justify-center" onClick={() => navigate('/apply')}>
            Apply Now — April Cohort
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
          </button>
          <button className="btn btn-outline btn-lg w-full sm:w-auto justify-center" onClick={() => onOpenModal('student')}>Student Sign In</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-border-custom animate-fadeUp delay-300">
          <div className="text-center sm:text-left">
            <div className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-text-dim mb-1">Admissions</div>
            <a href="mailto:academy@ginashe.co.za" className="font-syne font-bold text-[13px] sm:text-[14px] text-brand no-underline hover:underline">academy@ginashe.co.za</a>
          </div>
          <div className="text-center sm:text-left">
            <div className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-text-dim mb-1">WhatsApp</div>
            <a href="https://wa.me/263688526155" className="font-syne font-bold text-[13px] sm:text-[14px] text-brand no-underline hover:underline">+263 68 852 6155</a>
          </div>
          <div className="text-center sm:text-left">
            <div className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-text-dim mb-1">Campus</div>
            <div className="font-syne font-bold text-[13px] sm:text-[14px] text-text-custom">Sandton, JHB</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-text-dim mb-1">Parent Company</div>
            <a href="https://digital.ginashe.co.za" target="_blank" className="font-syne font-bold text-[13px] sm:text-[14px] text-text-custom no-underline hover:underline">Ginashe Digital</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkDb = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        const { error } = await supabase.from('applications').select('id').limit(1).abortSignal(controller.signal);
        clearTimeout(timeoutId);
        if (error) {
          // If it's just "no rows", it's still online
          if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
            setDbStatus('online');
            return;
          }
          throw error;
        }
        setDbStatus('online');
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('DB Status Check Failed:', err);
        setDbStatus('offline');
      }
    };
    checkDb();
  }, []);

  return (
    <footer className="bg-bg border-t border-border-custom relative z-[1]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 sm:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="inline-block no-underline shrink-0 mb-6 group">
            <Logo />
          </Link>
          <p className="text-[12px] text-text-muted leading-[1.7] max-w-[260px]">Africa's premier institution for cloud computing, artificial intelligence, and digital transformation. MICT SETA accredited. Johannesburg, South Africa.</p>
          <div className="flex gap-2.5 mt-4.5 flex-wrap">
            <span className="chip chip-em"><span className="w-1.25 h-1.25 rounded-full bg-emerald shrink-0"></span> MICT SETA Accredited</span>
            <span className="chip chip-brand"><span className="w-1.25 h-1.25 rounded-full bg-brand shrink-0"></span> DHET Aligned</span>
          </div>
        </div>

        <div>
          <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4">Programmes</div>
          <ul className="list-none flex flex-col gap-2.25">
            {['Cloud Launchpad', 'Cloud Architecture Residency', 'AI & ML Engineering', 'Data Engineering', 'AI for Business Leaders', 'Workforce Modernisation'].map((l) => (
              <li key={l}><a href="#programs" className="text-[12px] text-text-muted no-underline transition-colors hover:text-text-custom tracking-[0.01em]">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4">Academy</div>
          <ul className="list-none flex flex-col gap-2.25">
            {['Faculty', 'Learning Pathways', 'News', 'Events', 'Intake Calendar', 'Graduate Outcomes'].map((l) => (
              <li key={l}><a href={l === 'News' ? '/news' : l === 'Events' ? '/events' : `#${l.toLowerCase().replace(' ', '')}`} className="text-[12px] text-text-muted no-underline transition-colors hover:text-text-custom tracking-[0.01em]">{l}</a></li>
            ))}
            <li><a href="#" onClick={() => onOpenModal('student')} className="text-[12px] text-text-muted no-underline transition-colors hover:text-text-custom tracking-[0.01em]">Student Portal</a></li>
          </ul>
        </div>

        <div>
          <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-4">Company</div>
          <ul className="list-none flex flex-col gap-2.25">
            {['Ginashe Digital', 'Services', 'Hosting', 'Contact', 'Terms of Use', 'Refund Policy'].map((l) => (
              <li key={l}><a href={`https://digital.ginashe.co.za/${l.toLowerCase().replace(/ /g, '-')}`} className="text-[12px] text-text-muted no-underline transition-colors hover:text-text-custom tracking-[0.01em]">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border-custom py-4 px-5 sm:px-6 md:px-14 max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <div className="font-dm-mono text-[9px] sm:text-[10px] text-text-dim tracking-[0.1em]">© 2026 Ginashe Digital Academy · Johannesburg, RSA · v2.0</div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-emerald' : dbStatus === 'offline' ? 'bg-coral' : 'bg-brand animate-pulse'}`}></div>
            <span className="font-dm-mono text-[8px] uppercase tracking-widest text-text-dim">Systems: {dbStatus}</span>
          </div>
        </div>
        <div className="flex gap-6">
          {['Terms', 'Refunds', 'POPIA Notice'].map((l) => (
            <Link key={l} to={`/${l.toLowerCase().replace(' notice', '')}`} className="font-dm-mono text-[9px] tracking-[0.1em] text-text-dim no-underline hover:text-text-muted">{l}</Link>
          ))}
          <a href="#" onClick={() => onOpenModal('admin')} className="font-dm-mono text-[9px] tracking-[0.1em] text-[#a78bfa]/35 no-underline hover:text-text-muted">Admin</a>
        </div>
      </div>
    </footer>
  );
}
