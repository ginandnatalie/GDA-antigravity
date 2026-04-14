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
        label="Institutional Curriculum"
        title={<>World-Class Technical Rigour,<br />African by Design.</>}
        subtitle="Explore the 28-course matrix powering the next generation of African digital leaders. Real-time data, industry-aligned pathways."
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
