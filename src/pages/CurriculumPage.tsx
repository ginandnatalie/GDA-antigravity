import React from 'react';
import PageHero from '../components/PageHero';
import { Programs } from '../components/Programs';
import { supabase } from '../lib/supabase';

interface CurriculumPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function CurriculumPage({ onOpenModal, editMode }: CurriculumPageProps) {
  return (
    <>
      <PageHero
        label="Career Tracks"
        title={<>World-Class Technical Rigour,<br />African by Design.</>}
        subtitle="Choose a career track and follow a structured sequence of programmes, micro-credentials, and capstone projects — all industry-verified and stackable."
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Students collaborating in a modern learning environment"
      />
      
      <div className="bg-bg">
        <Programs 
          onOpenModal={onOpenModal} 
          editMode={editMode} 
        />
      </div>

      {/* No local modal handler needed, handled by global Modals in App.tsx */}
    </>
  );
}
