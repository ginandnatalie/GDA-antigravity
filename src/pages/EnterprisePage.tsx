import React from 'react';
import PageHero from '../components/PageHero';
import { Shield, Users, Target, Rocket } from 'lucide-react';
import InstitutionalHeroVisual from '../components/InstitutionalHeroVisual';

interface EnterprisePageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function EnterprisePage({ onOpenModal, editMode }: EnterprisePageProps) {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-brand" />,
      title: "Bespoke Curriculum Design",
      description: "We don't sell off-the-shelf courses. We analyze your tech stack, your team's skills gaps, and your strategic objectives to architect a custom training pathway."
    },
    {
      icon: <Users className="w-6 h-6 text-brand" />,
      title: "Dedicated Cohorts",
      description: "Train your team in a private, secure environment where discussions can center around your proprietary architecture and confidential roadmaps."
    },
    {
      icon: <Shield className="w-6 h-6 text-brand" />,
      title: "Enterprise-Grade Security Training",
      description: "Live fire labs configured to mirror your exact infrastructure, allowing your staff to train on defense strategies without risking production environments."
    },
    {
      icon: <Rocket className="w-6 h-6 text-brand" />,
      title: "Accelerated Onboarding",
      description: "Custom bootcamps designed specifically for your new hires, ensuring they are production-ready in weeks, not months."
    }
  ];

  return (
    <>
      <PageHero
        label="Institutional Strategic Design"
        title={<>Custom Enterprise<br />Training Pathways.</>}
        subtitle="Empower your workforce with high-fidelity, practitioner-led technical training perfectly aligned to your organization's architectural goals."
        visual={<InstitutionalHeroVisual />}
      />
      
      <section className="bg-bg py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mb-6">Built for the Global Enterprise</h2>
            <p className="text-text-soft text-lg leading-relaxed">
              Whether you are migrating to the cloud, building a new AI division, or upskilling your entire engineering department, Ginashe Digital Academy delivers the technical rigour required for true transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-3xl hover:border-brand/30 hover:bg-white/[0.02] transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-syne font-bold text-xl text-white mb-3">{benefit.title}</h3>
                <p className="text-text-soft leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-brand/10 to-transparent border border-brand/20 p-12 rounded-[2rem] text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="font-syne font-bold text-3xl text-white mb-6">Initialize a Strategic Consultation</h2>
              <p className="text-text-soft mb-8 max-w-2xl mx-auto">
                Speak directly with our Lead Faculty and Enterprise Architects to design a training matrix that fits your organization's exact technical requirements.
              </p>
              <button 
                onClick={() => onOpenModal('organisation')}
                className="btn btn-brand btn-lg"
              >
                Contact Enterprise Solutions
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
