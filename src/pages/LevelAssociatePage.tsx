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

export default function LevelAssociatePage({ onOpenModal, editMode }: LevelPageProps) {
  return (
    <>
      <PageHero
        label="Level: Associate"
        title={<>Specialise Your Skills.<br />Bridge the Gap to Production.</>}
        subtitle="The Associate Level is for learners with basic technical backgrounds looking to specialise. Move from foundational theory to deploying intermediate workloads."
        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Associate learners coding"
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
                  <span className="text-xl">🏗️</span>
                  <span>Graduates of the Foundation Level seeking specialization.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">🧑‍💻</span>
                  <span>Individuals with 6-12 months of self-taught technical experience.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">⚙️</span>
                  <span>Junior IT professionals requiring formal certification pathways.</span>
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
                  <span className="text-xl">🔧</span>
                  <span>Manage identity, access, and virtual networking at scale.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">⛓️</span>
                  <span>Implement intermediate DevOps pipelines and automation scripts.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">📊</span>
                  <span>Prepare comprehensively for vendor certifications (e.g. AZ-104, AWS Associate).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Filtered Modules */}
      <Programs onOpenModal={onOpenModal} editMode={editMode} initialFilterLevel="Associate" />

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
