import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Search, Rocket } from 'lucide-react';
import PageHero from '../components/PageHero';
import { CTA } from '../components/Footer';
import { TRACKS } from '../data/tracks';

interface PathwaysPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function PathwaysPage({ onOpenModal, editMode }: PathwaysPageProps) {
  const tracks = Object.values(TRACKS);

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Professional Careers"
        title={<>Choose Your <span className="text-brand">Technical Destiny</span>.</>}
        subtitle="Explore the 7 definitive Ginashe career tracks. We've structured our curriculum for practitioners seeking global mastery in the intelligence economy."
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072"
        imageAlt="Digital matrix and networking"
      />

      {/* Track Selection Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand/5 border border-brand/20">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="font-dm-mono text-[10px] text-brand uppercase tracking-[0.2em]">Institutional Catalog</span>
            </div>
            <h2 className="font-syne font-black text-4xl md:text-6xl text-white tracking-tighter">Career Tracks</h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">
              Select a specialized track to view its full educational roadmap, practitioner-led modules, and vendor certification mappings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group relative flex flex-col"
              >
                <Link 
                  to={`/tracks/${track.id}`}
                  className="flex-1 bg-navy/80 border border-white/10 rounded-2xl p-7 flex flex-col hover:border-brand/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden relative group no-underline"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10 transition-transform group-hover:scale-105 duration-500">
                    <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover:border-brand/30">
                       <span style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,255,0.4))' }}>{track.icon}</span>
                    </div>
                    <div className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.3em] font-bold">Track {String(i + 1).padStart(2, '0')}</div>
                  </div>

                  <h3 className="font-syne font-extrabold text-2xl text-white mb-3 group-hover:text-brand transition-colors tracking-tight leading-tight">{track.title}</h3>
                  <p className="text-text-muted text-[13px] leading-relaxed mb-8 flex-1 group-hover:text-text-soft transition-colors">{track.mission}</p>
                  
                  <div className="space-y-2.5 mb-10 border-t border-white/5 pt-6 relative z-10">
                    {track.outcomes.slice(0, 3).map((outcome, j) => (
                      <div key={j} className="flex items-center gap-2.5 opacity-60 group-hover:opacity-100 transition-opacity">
                         <div className="w-1 h-1 rounded-full bg-brand shrink-0" />
                         <span className="text-[11px] text-text-soft uppercase tracking-wider font-dm-mono">{outcome}</span>
                      </div>
                    ))}
                    {track.outcomes.length > 3 && (
                       <span className="text-[10px] text-text-dim italic">+ {track.outcomes.length - 3} more careers</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between relative z-10">
                     <span className="font-dm-mono text-[10px] text-brand/60 uppercase tracking-widest font-black flex items-center gap-2 group-hover:gap-4 transition-all">
                       Explore Track <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Matrix Teaser Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="group relative flex flex-col h-full"
              >
                <Link 
                  to="/curriculum"
                  className="flex-1 bg-brand/[0.03] border border-brand/20 rounded-2xl p-7 flex flex-col hover:border-brand transition-all duration-500 overflow-hidden relative group no-underline"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-30" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-3xl">
                       <Rocket className="w-8 h-8 text-brand" />
                    </div>
                  </div>

                  <h3 className="font-syne font-black text-2xl text-white mb-3 tracking-tight leading-tight">Institutional Matrix</h3>
                  <p className="text-text-soft text-[13px] leading-relaxed mb-10 flex-1">View the high-density grid of all 28 curriculum modules across the entire academy.</p>
                  
                  <div className="mt-auto">
                     <button className="w-full py-4 bg-brand text-navy font-black font-syne uppercase text-[10px] tracking-[0.2em] rounded-xl group-hover:bg-white transition-all shadow-[0_15px_30px_rgba(0,242,255,0.1)]">
                       View All Modules
                     </button>
                  </div>
                </Link>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery Tool Section */}
      <section className="py-24 bg-surface/30 border-t border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
             <Search className="w-8 h-8 text-brand" />
           </div>
           <h2 className="font-syne font-bold text-4xl md:text-5xl tracking-tight">Not sure which track to choose?</h2>
           <p className="text-text-soft text-lg max-w-2xl mx-auto leading-relaxed">
             Our practitioners can help align your aptitude with the right career outcomes. Join an upcoming discovery session or request a career guidance call.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
             <button
               onClick={() => onOpenModal('guidance')}
               className="px-10 py-5 bg-navy border border-brand/30 text-brand font-syne font-black uppercase text-[11px] tracking-[0.25em] rounded-xl hover:bg-brand/10 transition-all w-full sm:w-auto"
             >
               Request Career Guidance
             </button>
             <button
               onClick={() => window.location.href = '/contact'}
               className="px-10 py-5 bg-white/5 border border-white/10 text-white font-syne font-black uppercase text-[11px] tracking-[0.25em] rounded-xl hover:bg-white/10 transition-all w-full sm:w-auto"
             >
               Speak to an Advisor
             </button>
           </div>
        </div>
      </section>

      <CTA onOpenModal={onOpenModal} editMode={editMode} />
    </div>
  );
}
