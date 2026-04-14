import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Zap, Globe, ArrowRight, CheckCircle, GraduationCap, Briefcase, Award, Landmark } from 'lucide-react';
import PageHero from '../components/PageHero';
import { CTA } from '../components/Footer';

interface PathwaysPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function PathwaysPage({ onOpenModal, editMode }: PathwaysPageProps) {
  const levels = [
    {
      id: 'foundation',
      label: 'Level 1: Digital Core',
      title: 'Foundation Pathway',
      desc: 'The essential entry point for all aspiring digital practitioners. Master the bedrock of infrastructure, networking, and the command line.',
      outcome: 'Technical Readiness & Literacy',
      icon: <Cpu className="w-8 h-8" />,
      color: 'gold',
      path: '/levels/foundation',
      features: ['Cloud Fundamentals', 'Linux Mastery', 'Network Architecture', 'Digital PoE Creation']
    },
    {
      id: 'associate',
      label: 'Level 2: Specialisation',
      title: 'Practitioner Specialisation',
      desc: 'Transition from fundamentals to specialized implementation. Deep dive into Cloud Engineering, AI, or Web Architecture.',
      outcome: 'Professional Implementation Mastery',
      icon: <Zap className="w-8 h-8" />,
      color: 'emerald',
      path: '/levels/associate',
      features: ['Advanced Workload Deployment', 'CI/CD Automation', 'Data Science Essentials', 'Security Guardrails']
    },
    {
      id: 'professional',
      label: 'Level 3: Mastery',
      title: 'Solutions Architecture Residency',
      desc: 'High-performance mastery for seasoned practitioners. Command the full stack with architectural precision and strategic design.',
      outcome: 'Expert Solutions Architect',
      icon: <Shield className="w-8 h-8" />,
      color: 'sky',
      path: '/levels/professional',
      features: ['Enterprise Design Patterns', 'Hybrid-Cloud Strategy', 'Performance Optimization', 'Governance & Compliance']
    },
    {
      id: 'enterprise',
      label: 'Level 4: Leadership',
      title: 'Global Architecture Fellowship',
      desc: 'Strategic world-class leadership. Design and govern global-scale digital transformation with resilience and multi-cloud strategy.',
      outcome: 'Strategic Executive Engineer',
      icon: <Globe className="w-8 h-8" />,
      color: 'violet',
      path: '/levels/enterprise',
      features: ['Global Infrastructure Governance', 'Financial Engineering', 'Crisis Architecture', 'Institutional Strategy']
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Academy Roadmap"
        title={<>Your Journey to <span className="text-gold">Digital Mastery</span> Starts Here.</>}
        subtitle="Explore the Ginashe institutional matrix. We've structured our curriculum into four progressive levels of expertise, moving from fundamental literacy to global strategic leadership."
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072"
        imageAlt="Digital matrix and networking"
      />

      {/* Progression Strategy Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gold/5 border border-gold/20">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-dm-mono text-[10px] text-gold uppercase tracking-[0.2em]">Institutional Philosophy</span>
              </div>
              <h2 className="font-syne font-bold text-4xl md:text-5xl leading-tight">Structured Growth for <br /><span className="text-white/40">Unstructured Times.</span></h2>
              <p className="text-text-soft text-lg leading-relaxed">
                Our "Academy Pathways" are designed to create predictable career outcomes in an unpredictable tech landscape. We don't just teach modules; we build **Experts** through a rigorous, high-fidelity progression matrix.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span className="font-bold text-sm uppercase tracking-wide">Competency Based</span>
                  </div>
                  <p className="text-[12px] text-text-muted">Mastery is the only requirement for progression.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span className="font-bold text-sm uppercase tracking-wide">Industry Aligned</span>
                  </div>
                  <p className="text-[12px] text-text-muted">Directly mapped to global employer demand.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="aspect-square rounded-3xl bg-surface/50 border border-white/5 relative overflow-hidden p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
                <div className="relative z-10 space-y-12">
                   {[
                     { icon: <GraduationCap className="w-6 h-6 text-gold" />, title: 'Foundation', status: 'Entry Gateway' },
                     { icon: <Briefcase className="w-6 h-6 text-emerald" />, title: 'Associate', status: 'Career Speciality' },
                     { icon: <Award className="w-6 h-6 text-sky" />, title: 'Professional', status: 'Mastery Phase' },
                     { icon: <Landmark className="w-6 h-6 text-violet" />, title: 'Enterprise', status: 'Strategic Leader' }
                   ].map((step, i) => (
                     <div key={i} className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                          {step.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-syne font-bold text-white text-lg">{step.title}</span>
                          <span className="font-dm-mono text-[9px] text-text-muted uppercase tracking-widest">{step.status}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Levels Grid */}
      <section className="py-24 bg-surface/30 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="font-dm-mono text-[11px] text-gold uppercase tracking-[0.4em]">The Ginashe Matrix v1.5</span>
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white tracking-tighter">Academic Levels</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {levels.map((lvl, i) => (
              <motion.div
                key={lvl.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-full flex flex-col"
              >
                 <div className="flex-1 bg-navy/80 border border-white/10 rounded-2xl p-8 flex flex-col hover:border-gold/40 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      {lvl.icon}
                    </div>
                    
                    <div className="font-dm-mono text-[9px] text-gold uppercase tracking-[0.3em] mb-2">{lvl.label}</div>
                    <h3 className="font-syne font-bold text-2xl text-white mb-4 group-hover:text-gold transition-colors">{lvl.title}</h3>
                    <p className="text-text-soft text-sm leading-relaxed mb-8 flex-1">{lvl.desc}</p>
                    
                    <div className="space-y-3 mb-12">
                      {lvl.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full bg-${lvl.color}`} />
                           <span className="text-[11px] text-text-muted uppercase tracking-wider font-dm-mono">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto border-t border-white/5 pt-6">
                       <span className="block font-dm-mono text-[8px] text-text-muted uppercase tracking-widest mb-1">Target Outcome</span>
                       <div className="font-syne font-bold text-white text-sm tracking-tight mb-6">{lvl.outcome}</div>
                       
                       <Link
                         to={lvl.path}
                         className="inline-flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[0.2em] no-underline hover:translate-x-1 transition-transform"
                       >
                         Explore Level <ArrowRight className="w-4 h-4" />
                       </Link>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
           <h2 className="font-syne font-bold text-4xl">Ready to specialize?</h2>
           <p className="text-text-soft text-lg leading-relaxed">
             While these pathways define your **depth**, our specialized tracks (Cloud, AI, Data, Cyber) define your **breadth**. You can view how these intersect in our interactive Matrix.
           </p>
           <button 
             onClick={() => window.location.href = '/curriculum'}
             className="px-10 py-5 bg-navy border border-gold text-gold font-syne font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-gold hover:text-black transition-all shadow-[0_20px_40px_rgba(244,162,26,0.1)]"
           >
             View Full Institutional Matrix
           </button>
        </div>
      </section>

      <CTA onOpenModal={onOpenModal} editMode={editMode} />
    </div>
  );
}
