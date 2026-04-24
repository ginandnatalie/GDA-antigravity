import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Info, Landmark, CreditCard, Clock } from 'lucide-react';

export function Requirements({ onOpenModal }: { onOpenModal: (id: string) => void }) {
  const navigate = useNavigate();
  const criteria = [
    { title: 'Academic Qualification', desc: 'Grade 12 (Matric) certificate or equivalent industry-standard prerequisite.', mandatory: true },
    { title: 'English Proficiency', desc: 'Ability to read, write and communicate effectively in English for technical documentation.', mandatory: true },
    { title: 'Digital Literacy', desc: 'Basic computer skills (email, web browsing, file management). Coding experience is NOT required for Launchpad.', mandatory: false },
    { title: 'Hardware Requirements', desc: 'A modern laptop (i5 processor, 8GB RAM minimum) and stable internet connection.', mandatory: true }
  ];

  const handleLinkClick = (title: string) => {
    switch (title) {
      case 'Application Portal':
        onOpenModal('apply_direct');
        break;
      case 'Required Documents':
        onOpenModal('required_docs');
        break;
      case 'Interview Tips':
        onOpenModal('interview_tips');
        break;
      default:
        break;
    }
  };

  return (
    <section id="entry" className="bg-bg py-24 border-t border-border-custom px-6 sm:px-14">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-16 items-start">
          <div>
            <div className="text-brand font-dm-mono text-[10px] uppercase tracking-widest mb-4">Prerequisites</div>
            <h2 className="font-syne font-extrabold text-4xl mb-6 text-white">Who can apply to<br />the Academy?</h2>
            <p className="text-text-muted leading-relaxed max-w-lg">
              We look for passion over pedigree. Our admissions process is designed to find individuals with high potential and a drive to solve African problems using global tech.
            </p>
          </div>
          <div className="bg-white/3 border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Admission Links
            </div>
            <ul className="space-y-4">
              {[
                { t: 'Application Portal', d: 'Submit online' },
                { t: 'Required Documents', d: 'Checklist PDF' },
                { t: 'Interview Tips', d: 'GDA Prep Guide' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer" onClick={() => handleLinkClick(res.t)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-brand transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                    <span className="text-text-dim text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
              {criteria.map((c, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/3 border border-border-custom">
                  <div className={`mt-0.5 ${c.mandatory ? 'text-emerald' : 'text-brand'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{c.title}</h3>
                    <p className="text-[12px] text-text-muted mt-1">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-border-custom bg-navy relative">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                alt="Student collaborating"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-brand text-2xl font-black mb-1">98%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/60">Employment Rate Post-Placement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TuitionFees() {
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState('Associate Track');

  const tracks = [
    { 
      name: 'Cloud Launchpad', 
      upfront: 'R 12,500', 
      installment: 'R 2,250 /mo', 
      install_desc: '6 Month Term',
      isa: 'Available'
    },
    { 
      name: 'Associate Track', 
      upfront: 'R 36,000', 
      installment: 'R 6,500 /mo', 
      install_desc: '6 Month Term',
      isa: 'Standard'
    },
    { 
      name: 'Professional Track', 
      upfront: 'R 58,000', 
      installment: 'R 10,500 /mo', 
      install_desc: '6 Month Term',
      isa: 'Elite'
    },
    { 
      name: 'Dual Specialisation', 
      upfront: 'R 85,000', 
      installment: 'R 15,500 /mo', 
      install_desc: '6 Month Term',
      isa: 'Premium'
    }
  ];

  const currentTrack = tracks.find(t => t.name === activeTrack) || tracks[1];

  const plans = [
    { title: 'Upfront Investment', price: currentTrack.upfront, benefit: '15% Discount included', popular: false },
    { title: 'Standard Installment', price: currentTrack.installment, benefit: currentTrack.install_desc, popular: true },
    { title: 'Income Share (ISA)', price: '0 Upfront', benefit: 'Pay only once employed', popular: false }
  ];

  return (
    <section id="tuition" className="bg-navy py-24 border-t border-border-custom px-6 sm:px-14 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="font-syne font-extrabold text-4xl mb-4 text-white">Tuition & Investment</h2>
        <p className="text-text-muted mb-10 max-w-2xl mx-auto">Select your specialized engineering track to view specific investment models.</p>
        
        {/* Track Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tracks.map((track) => (
            <button
              key={track.name}
              onClick={() => setActiveTrack(track.name)}
              className={`px-6 py-3 rounded-full font-dm-mono text-[10px] uppercase tracking-widest border transition-all ${activeTrack === track.name ? 'bg-brand border-brand text-navy' : 'bg-white/5 border-border-custom text-text-muted hover:border-brand/30'}`}
            >
              {track.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border transition-all flex flex-col ${plan.popular ? 'bg-brand border-brand scale-105 z-20 shadow-2xl' : 'bg-white/3 border-border-custom hover:border-brand/30'}`}>
              <h3 className={`font-syne font-bold text-lg mb-4 ${plan.popular ? 'text-navy' : 'text-white'}`}>{plan.title}</h3>
              <div className={`text-3xl font-black mb-2 ${plan.popular ? 'text-navy' : 'text-brand'}`}>{plan.price}</div>
              <p className={`text-[11px] mb-8 uppercase tracking-widest ${plan.popular ? 'text-navy/70' : 'text-text-dim'}`}>{plan.benefit}</p>
              <div className="flex-1" />
              <button 
                onClick={() => navigate('/apply')}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-navy text-white hover:bg-navy/80' : 'bg-brand text-navy hover:bg-brand-dim'}`}
              >
                Apply for {activeTrack}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="flex items-center gap-3">
            <Landmark className="text-brand w-5 h-5" />
            <span className="text-[12px] text-text-soft">Institutional Mastery Provider</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="text-brand w-5 h-5" />
            <span className="text-[12px] text-text-soft">Paystack Secure Payments</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-brand w-5 h-5" />
            <span className="text-[12px] text-text-soft">Flexible Net Monthly Terms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
