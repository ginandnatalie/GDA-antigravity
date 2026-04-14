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

export default function LevelProfessionalPage({ onOpenModal, editMode }: LevelPageProps) {
  return (
    <>
      <PageHero
        label="Level: Professional"
        title={<>Architect Complex Solutions.<br />Lead Engineering Teams.</>}
        subtitle="Designed for experienced practitioners aiming for senior roles. Master advanced architecture, high availability, and multi-AZ deployments."
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Professional tech workers"
      />
      
      <section className="bg-bg py-20 border-b border-border-custom">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-dm-mono text-[10px] text-gold uppercase tracking-widest px-3 py-1 border border-gold/20 rounded-full bg-gold/5">Learner Profile</span>
              </div>
              <h2 className="text-3xl font-syne font-bold mb-6">Who is this for?</h2>
              <ul className="space-y-4 text-text-soft">
                <li className="flex items-start gap-4">
                  <span className="text-xl">👔</span>
                  <span>Mid-level engineers with robust production experience.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🏛️</span>
                  <span>System Administrators transitioning into Cloud Architecture.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🧠</span>
                  <span>Developers scaling applications securely to millions of users.</span>
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
                  <span className="text-xl">🏗️</span>
                  <span>Design disaster recovery and highly available multi-region systems.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">⚡</span>
                  <span>Implement DevSecOps, container orchestration, and serverless logic.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">⚖️</span>
                  <span>Align technical infrastructure precisely with business KPIs and metrics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Filtered Modules */}
      <Programs onOpenModal={onOpenModal} editMode={editMode} initialFilterLevel="Professional" />

      {/* Back Navigation Bar */}
      <div className="bg-card border-t border-b border-border-custom px-5 py-6 flex justify-center">
        <Link 
          to="/curriculum" 
          className="flex items-center gap-3 text-text-soft hover:text-gold transition-colors font-syne font-bold text-sm tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Full Curriculum Matrix
        </Link>
      </div>

      <CTA onOpenModal={onOpenModal} editMode={editMode} />
    </>
  );
}
