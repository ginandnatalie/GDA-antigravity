import React from 'react';
import PageHero from '../components/PageHero';
import { Faculty } from '../components/Pathways';

interface FacultyPageProps {
  editMode?: boolean;
}

export default function FacultyPage({ editMode }: FacultyPageProps) {
  return (
    <>
      <PageHero
        label="Our Faculty"
        title={<>Taught by Practitioners,<br />Not Professors.</>}
        subtitle="Every GDA instructor is an active industry professional with hands-on cloud, AI, or engineering experience — bringing real problems into the classroom."
        image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Professional instructor teaching in a modern classroom"
      />
      <Faculty editMode={editMode} />
    </>
  );
}
