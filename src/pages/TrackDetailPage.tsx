import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Shield, Zap, Cpu, 
  Globe, GraduationCap, Briefcase, Award, Terminal 
} from 'lucide-react';
import { TRACKS, TrackData } from '../data/tracks';
import PageHero from '../components/PageHero';
import { CTA } from '../components/Footer';

interface TrackDetailPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function TrackDetailPage({ onOpenModal, editMode }: TrackDetailPageProps) {
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<TrackData | null>(null);

  useEffect(() => {
    if (trackId && TRACKS[trackId]) {
      setTrack(TRACKS[trackId]);
    }
  }, [trackId]);

  if (!trackId || !TRACKS[trackId]) {
    return <Navigate to="/" replace />;
  }

  const data = TRACKS[trackId];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Career Pathway"
        title={<>Master the <span style={{ color: data.color }}>{data.shortTitle}</span> Infrastructure.</>}
        subtitle={data.description}
        image={data.heroImage}
        imageAlt={`${data.title} background`}
      />

      {/* Institutional Mission Section */}
      <section className="py-20 border-b border-border-custom px-6 sm:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fadeUp">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/3 border border-white/10">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: data.color }} />
                <span className="font-dm-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">Institutional Mission</span>
              </div>
              <h2 className="font-syne font-black text-4xl md:text-5xl leading-tight text-white">
                Engineering <br />
                <span className="text-white/30">Institutional Sovereignty.</span>
              </h2>
              <p className="text-text-soft text-lg leading-relaxed max-w-xl">
                {data.mission}
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => onOpenModal('apply_direct')}
                  className="btn btn-brand"
                >
                  Apply for this Pathway
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border-custom rounded-3xl p-10 relative overflow-hidden group animate-fadeUp delay-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="font-dm-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">Key Outcomes</div>
                <div className="grid grid-cols-1 gap-4">
                  {data.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-brand/40 transition-colors">
                        <CheckCircle2 size={18} className="text-brand" />
                      </div>
                      <span className="font-syne font-bold text-white text-sm group-hover/item:text-brand transition-colors">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Roadmap Section */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          <div className="text-center mb-20">
            <span className="font-dm-mono text-[11px] uppercase tracking-[0.4em] text-text-dim">The Career Climb</span>
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white mt-4">Module progression.</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[22px] md:left-1/2 md:-translate-x-1/2 top-10 bottom-10 w-px bg-white/10" />

            <div className="space-y-20">
              {data.roadmap.map((step, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Step content */}
                  <div className="flex-1 w-full md:w-auto">
                    <motion.div 
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={`bg-card border border-border-custom p-8 rounded-2xl hover:border-white/20 transition-all ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                    >
                      <div className="font-dm-mono text-[10px] text-text-dim uppercase tracking-[0.2em] mb-2">{step.level}</div>
                      <h3 className="font-syne font-extrabold text-2xl text-white mb-4">{step.title}</h3>
                      <p className="text-text-soft text-[13px] leading-relaxed mb-6">{step.description}</p>
                      
                      <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        {step.modules.map((mod, j) => (
                          <span key={j} className="px-3 py-1 bg-white/3 border border-white/10 rounded-md text-[10px] font-dm-mono text-white/50 uppercase tracking-widest">{mod}</span>
                        ))}
                      </div>

                      <div className={`mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-3 ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                         {step.vendor_alignment.map((va, k) => (
                           <div key={k} className="flex items-center gap-1.5 opacity-60">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                             <span className="text-[9px] font-bold text-white uppercase tracking-widest">{va}</span>
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Icon/Diamond indicator */}
                  <div className="relative z-10 w-11 h-11 bg-navy border-2 border-white/10 rounded-full flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-sm rotate-45" style={{ background: data.color }} />
                  </div>

                  {/* Empty spacer for grid alignment */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Guidance / CTA Alternative */}
      <section className="py-24 border-t border-border-custom relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,242,255,0.03)_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="font-syne font-black text-6xl md:text-7xl opacity-5 absolute -top-8 left-1/2 -translate-x-1/2 w-full uppercase select-none pointer-events-none">
            Guidance
          </div>
          <h3 className="font-syne font-bold text-4xl text-white">Not sure if {data.shortTitle} is right for you?</h3>
          <p className="text-text-soft text-lg leading-relaxed">
            Our practitioner review board can help align your aptitude with the right institutional pathway. Speak to a lead faculty member today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onOpenModal('apply_direct')}
              className="px-10 py-5 bg-brand text-navy font-syne font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-white transition-all"
            >
              Start Admission Process
            </button>
            <Link 
              to="/curriculum"
              className="px-10 py-5 bg-transparent border border-white/20 text-white font-syne font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all no-underline"
            >
              View Full Matrix
            </Link>
          </div>
        </div>
      </section>

      <CTA onOpenModal={onOpenModal} editMode={editMode} />
    </div>
  );
}
