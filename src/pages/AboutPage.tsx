import React from 'react';
import PageHero from '../components/PageHero';
import { WhyGDA, Alumni } from '../components/WhyGDA';
import { Ecosystem } from '../components/Cohorts';
import { AcademyStaff } from '../components/Staff';

interface AboutPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function AboutPage({ onOpenModal, editMode }: AboutPageProps) {
  return (
    <>
      <PageHero
        label="About Ginashe Digital Academy"
        title={<>Master the Future of<br />Digital Innovation.</>}
        subtitle="Join Africa's premier academy for Cloud Engineering, AI, and Digital Transformation — headquartered in Sandton, Johannesburg."
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Modern tech campus and innovation workspace"
      />
      <WhyGDA editMode={editMode} />
      <AcademyStaff />
      <Alumni editMode={editMode} />
      <Ecosystem onOpenModal={onOpenModal} editMode={editMode} />
    </>
  );
}
