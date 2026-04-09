import React from 'react';
import PageHero from '../components/PageHero';
import { Curriculum } from '../components/Curriculum';
import { Pathways } from '../components/Pathways';

interface CurriculumPageProps {
  editMode?: boolean;
}

export default function CurriculumPage({ editMode }: CurriculumPageProps) {
  return (
    <>
      <PageHero
        label="Our Curriculum"
        title={<>World-Class Technical Rigour,<br />African by Design.</>}
        subtitle="Every module, every week, every topic — laid out before you commit. No surprises, no vague syllabi."
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Students collaborating in a modern learning environment"
      />
      <Curriculum editMode={editMode} />
      <Pathways editMode={editMode} />
    </>
  );
}
