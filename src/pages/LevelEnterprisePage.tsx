import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Programs } from '../components/Programs';
import { CTA } from '../components/Footer';

interface LevelPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function LevelEnterprisePage({ onOpenModal, editMode }: LevelPageProps) {
  return (
    <>
      <PageHero
        label="Level: Enterprise"
        title={<>Enterprise Scalability.<br />Executive Digital Strategy.</>}
        subtitle="The highest tier of technical study. Tailored for enterprise architects, CTOs, and digital transformation leaders overseeing multi-cloud governance and financial operations."
        image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Enterprise architecture abstract"
      />
      
      <section className="bg-bg py-20 border-b border-border-custom">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-dm-mono text-[10px] text-brand uppercase tracking-widest px-3 py-1 border border-brand/20 rounded-full bg-brand/5">Learner Profile</span>
              </div>
              <h2 className="text-3xl font-syne font-bold mb-6">Who is this for?</h2>
              <ul className="space-y-4 text-text-soft">
                <li className="flex items-start gap-4">
                  <span className="text-xl">🌍</span>
                  <span>Senior IT Architects managing multi-cloud or hybrid environments.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">👑</span>
                  <span>Chief Information Officers (CIOs) and established CTOs.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">💼</span>
                  <span>Engineers tasked with designing cloud landing zones and governance.</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-dm-mono text-[10px] text-emerald uppercase tracking-widest px-3 py-1 border border-emerald/20 rounded-full bg-emerald/5">Skill Acquisition</span>
              </div>
              <h2 className="text-3xl font-syne font-bold mb-6">Key Outcomes</h2>
              <ul className="space-y-4 text-text-soft">
                <li className="flex items-start gap-4">
                  <span className="text-xl">🏟️</span>
                  <span>Deploy and govern secure cloud landing zones across AWS, Google, and Azure.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">💰</span>
                  <span>Implement FinOps practices for rigorous cloud cost forecasting and control.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🎯</span>
                  <span>Command compliance, sovereign data handling, and regulatory architecture.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Filtered Modules */}
      <Programs onOpenModal={onOpenModal} editMode={editMode} initialFilterLevel="Enterprise" />

      {/* Back Navigation Bar */}
      <div className="bg-card border-t border-b border-border-custom px-5 py-6 flex justify-center">
        <Link 
          to="/curriculum" 
          className="flex items-center gap-3 text-text-soft hover:text-brand transition-colors font-syne font-bold text-sm tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Full Curriculum Matrix
        </Link>
      </div>

      <CTA onOpenModal={onOpenModal} editMode={editMode} />
    </>
  );
}
