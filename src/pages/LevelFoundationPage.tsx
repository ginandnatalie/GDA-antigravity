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

export default function LevelFoundationPage({ onOpenModal, editMode }: LevelPageProps) {
  return (
    <>
      <PageHero
        label="Level: Foundation"
        title={<>Start Your Digital Journey.<br />No Prior Tech Experience Required.</>}
        subtitle="The Foundation Level is designed for school leavers, non-technical professionals, and career changers. Master the fundamentals of Cloud, Networking, and Software."
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Foundation learners collaborating"
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
                  <span className="text-xl">🎓</span>
                  <span>School leavers (Grade 12 / Matric) looking to enter the ICT sector.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">💼</span>
                  <span>Working adults seeking a stable career transition into tech.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🏢</span>
                  <span>Small enterprise staff requiring foundational digital literacy.</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-surface/30 border border-border-custom rounded mt-4 italic text-[14px]">
                  * No prior IT or programming knowledge is required to begin.
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
                  <span className="text-xl">☁️</span>
                  <span>Understand core concepts of IaaS, PaaS, SaaS, and cloud economics.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">💻</span>
                  <span>Administer remote systems using Linux Command Line Interfaces.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🚀</span>
                  <span>Deploy functional secure workloads to leading cloud providers.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">📁</span>
                  <span>Build an industry-grade Portfolio of Evidence (PoE) for job applications.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Filtered Modules */}
      <Programs onOpenModal={onOpenModal} editMode={editMode} initialFilterLevel="Foundation" />

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
