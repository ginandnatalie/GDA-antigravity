import React from 'react';
import PageHero from '../components/PageHero';
import { WhyGDA, Alumni } from '../components/WhyGDA';
import { Ecosystem } from '../components/Cohorts';
import { AcademyStaff } from '../components/Staff';
import InstitutionalHeroVisual from '../components/InstitutionalHeroVisual';

interface AboutPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function AboutPage({ onOpenModal, editMode }: AboutPageProps) {
  return (
    <>
      <PageHero
        label="Institutional Authority"
        title={<>The Sovereign Authority on<br />Cloud & AI Engineering.</>}
        subtitle="Africa's definitive practitioner-led academy for high-fidelity technical mastery — headquartered in Sandton, Johannesburg."
        visual={<InstitutionalHeroVisual />}
      />
      <WhyGDA editMode={editMode} />
      <AcademyStaff />
      <Alumni editMode={editMode} />
      <Ecosystem onOpenModal={onOpenModal} editMode={editMode} />
    </>
  );
}
