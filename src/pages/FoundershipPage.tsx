import React from 'react';
import { Rocket, Zap, Target, Briefcase, Globe, Shield, Code, Layout, MessageSquare, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';

export default function FoundershipPage({ onOpenModal }: { onOpenModal: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-bg">
      {/* High-Fidelity Page Hero */}
      <PageHero
        label="Sovereign Execution"
        title={<>Forge Your Own<br /><span className="text-brand">Technical Destiny.</span></>}
        subtitle="We don't just train employees. We architect founders and high-value freelancers capable of delivering production-grade systems at global velocity."
        image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
        imageAlt="Founder Empowerment"
      />

      {/* Empowerment Framework Section */}
      <section id="pillars" className="bg-bg2 border-b border-border-custom">
        <div className="section-inner">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="section-label">Empowerment Framework</div>
              <h2 className="section-title text-white mb-6 animate-fadeUp">The Foundership <br /><span className="text-brand">Pivot Protocol.</span></h2>
              <p className="section-sub !max-w-none mb-10 animate-fadeUp delay-100">
                Traditional education prepares you for a cubicle. GDA prepares you for the boardroom and the cloud. Our Foundership track is engineered for those who refuse to wait for permission to build.
              </p>
              
              <div className="space-y-4 mt-8">
                {[
                  { 
                    title: 'Venture-Ready Mastery', 
                    desc: 'Build products, not just features. Architect end-to-end solutions that solve real market problems.',
                    icon: <Rocket className="w-5 h-5" />,
                    color: 'text-brand',
                    bg: 'bg-brand/10'
                  },
                  { 
                    title: 'Freelance Sovereignty', 
                    desc: 'Master technical consulting. From high-ticket pricing to global client acquisition.',
                    icon: <Briefcase className="w-5 h-5" />,
                    color: 'text-sky',
                    bg: 'bg-sky/10'
                  },
                  { 
                    title: 'Technical Authority', 
                    desc: 'Lead technical teams and make critical infrastructure decisions with practitioner confidence.',
                    icon: <Shield className="w-5 h-5" />,
                    color: 'text-emerald',
                    bg: 'bg-emerald/10'
                  }
                ].map((pillar, i) => (
                  <div key={i} className="flex gap-5 group p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all animate-fadeUp" style={{ animationDelay: `${(i+2)*100}ms` }}>
                    <div className={`w-12 h-12 rounded-xl ${pillar.bg} border border-white/10 flex items-center justify-center ${pillar.color} shrink-0 group-hover:scale-110 transition-transform`}>
                      {pillar.icon}
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-[15px] text-white mb-1.5">{pillar.title}</h4>
                      <p className="text-[12px] text-text-soft leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="relative animate-fadeUp delay-300">
              <div className="aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden border border-border-custom bg-surface p-2 relative group">
                <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/0 transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" 
                  alt="Founder Strategy Session" 
                  className="w-full h-full object-cover rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                
                {/* Institutional Performance Stats */}
                <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
                  <div className="p-4 rounded-xl bg-[#0b0e14]/90 backdrop-blur-md border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
                      <Target size={18} />
                    </div>
                    <div>
                      <div className="text-[9px] font-dm-mono text-text-dim uppercase tracking-widest leading-none mb-1">Venture Launch Rate</div>
                      <div className="text-[16px] font-syne font-black text-white">32% of Alumni</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0b0e14]/90 backdrop-blur-md border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <Globe size={18} />
                    </div>
                    <div>
                      <div className="text-[9px] font-dm-mono text-text-dim uppercase tracking-widest leading-none mb-1">Global Market Reach</div>
                      <div className="text-[16px] font-syne font-black text-white">14+ Countries</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Technical Aura */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand/10 blur-[100px] rounded-full animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky/10 blur-[100px] rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Freelance Hub Section */}
      <section className="bg-bg border-b border-border-custom">
        <div className="section-inner">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-label mx-auto">The Freelance Hub</div>
            <h2 className="section-title text-white animate-fadeUp">High-Value <br /><span className="text-emerald">Technical Consulting.</span></h2>
            <p className="text-text-soft text-[15px] mt-4 animate-fadeUp delay-100">Master the art of the high-ticket gig. We provide the technical backbone and business intelligence to help you transition from worker to high-impact consultant.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-custom border border-border-custom rounded-lg overflow-hidden animate-fadeUp delay-200">
            {[
              { 
                icon: <Code className="w-5 h-5" />, 
                title: 'Stack Specialization', 
                desc: 'Focus on high-demand technical specializations (Cloud Ops, AI Integration) that command premium rates in global markets.' 
              },
              { 
                icon: <Layout className="w-5 h-5" />, 
                title: 'Portfolio Architecture', 
                desc: 'Build a production-grade portfolio that speaks louder than any CV. Verified by GDA practitioners.' 
              },
              { 
                icon: <MessageSquare className="w-5 h-5" />, 
                title: 'Consulting Protocols', 
                desc: 'Master the negotiation, scoping, and delivery systems used by top-tier technical agencies.' 
              }
            ].map((card, i) => (
              <div key={i} className="p-8 md:p-10 bg-card hover:bg-card2 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand mb-8 group-hover:bg-brand group-hover:text-navy transition-all">
                  {card.icon}
                </div>
                <h3 className="font-syne font-bold text-[18px] text-white mb-4">{card.title}</h3>
                <p className="text-[13px] text-text-soft leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Call to Action */}
      <section className="bg-bg2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,var(--cyan-dim)_0%,transparent_70%)] opacity-50" />
        <div className="section-inner relative z-10">
          <div className="bg-[#0b0e14] border border-brand/20 rounded-[40px] p-8 md:p-16 text-center shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto mb-8 animate-float1">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="font-syne font-black text-[32px] md:text-[48px] text-white leading-tight mb-6 animate-fadeUp">
                Claim Your <br />
                <span className="text-brand">Technical Sovereignty.</span>
              </h2>
              <p className="text-text-soft text-[16px] mb-10 animate-fadeUp delay-100">
                The next intake for the Foundership Track is now open. Join an elite collective of African disruptors building the future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeUp delay-200">
                <button 
                  onClick={() => onOpenModal('apply_direct')}
                  className="btn btn-brand px-12 py-5 h-auto w-full sm:w-auto"
                >
                  Start Application →
                </button>
                <button 
                  onClick={() => onOpenModal('foundership_advice')}
                  className="btn btn-outline px-12 py-5 h-auto w-full sm:w-auto"
                >
                  Consult an Advisor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
