import React from 'react';
import PageHero from '../components/PageHero';
import { Cohorts } from '../components/Cohorts';
import { Funding, FAQ } from '../components/Funding';

interface AdmissionsPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function AdmissionsPage({ onOpenModal, editMode }: AdmissionsPageProps) {
  return (
    <>
      <PageHero
        label="Admissions"
        title={<>Join the Next Cohort of<br />African Tech Leaders.</>}
        subtitle="Applications are open for our 2025 programmes. Explore funding options, upcoming start dates, and apply below."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Graduates celebrating achievement"
      />
      <Cohorts onOpenModal={onOpenModal} editMode={editMode} />
      <Funding onOpenModal={onOpenModal} editMode={editMode} />
      <FAQ editMode={editMode} />
    </>
  );
}
