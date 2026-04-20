import React from 'react';
import PageHero from '../components/PageHero';
import { Shield, Eye, Database, Lock, UserCheck, Scale, FileCheck, AlertTriangle } from 'lucide-react';

export default function PopiaPage() {
  const sections = [
    {
      title: "1. Data Sovereignty & Stewardship",
      icon: <Database className="w-6 h-6 text-brand" />,
      content: "Ginashe Digital Academy (GDA) acts as the 'Responsible Party' for your personal information. We maintain total sovereignty over student data via high-security Supabase infrastructure, ensuring it is never used for unauthorised purposes."
    },
    {
      title: "2. The 8 Core Principles",
      icon: <FileCheck className="w-6 h-6 text-emerald" />,
      content: "GDA strictly adheres to the 8 core principles of the POPI Act: Accountability, Processing Limitation, Purpose Specification, Further Processing Limitation, Information Quality, Openness, Security Safeguards, and Data Subject Participation."
    },
    {
      title: "3. Direct Consent Protocol",
      icon: <UserCheck className="w-6 h-6 text-sky" />,
      content: "Personal information is only processed with the explicit consent of the data subject (The Student) or as required for institutional governance and contract fulfillment between the student and the Academy."
    },
    {
      title: "4. Security Mandate",
      icon: <Lock className="w-6 h-6 text-violet" />,
      content: "GDA implements rigorous technical and organisational measures to prevent loss, damage, or unauthorised access to personal information. Our 'Cyber-Sovereignty' framework includes encryption, MFA, and restricted access protocols."
    },
    {
      title: "5. Student Rights (Data Subjects)",
      icon: <Eye className="w-6 h-6 text-brand" />,
      content: "Students have the right to access, rectify, or request the deletion of their personal information held by GDA. Any such request will be processed by the GDA Information Officer within 30 days of verification."
    },
    {
      title: "6. Violation Protocol",
      icon: <AlertTriangle className="w-6 h-6 text-coral" />,
      content: "In the event of a security breach involving personal information, GDA will notify affected students as soon as reasonably possible, following the mandatory disclosure guidelines set by the Regulator."
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Compliance Architecture"
        title={<>POPI Act<br /><span className="text-brand">Sovereignty Notice</span>.</>}
        subtitle="The formal legal structure protecting your personal information and technical residency within the GDA ecosystem."
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470"
        imageAlt="Advanced digital compliance and security architecture"
      />

      <section className="section-inner py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <p className="text-text-soft leading-relaxed italic border-l-2 border-brand/30 pl-6 text-lg">
              "We believe technical excellence cannot exist without data sovereignty. Our POPIA protocols ensure that every GDA student is protected by the highest standards of privacy governance."
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-surface/30 border border-white/5 hover:border-brand/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-bg border border-white/5 group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <h3 className="font-syne font-bold text-xl text-white group-hover:text-brand transition-colors">
                    {section.title}
                  </h3>
                </div>
                <p className="text-text-muted leading-relaxed text-base ml-[76px]">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-navy-accent/20 border border-border-custom text-center">
            <p className="font-dm-mono text-[10px] text-brand uppercase tracking-[0.3em]">
              OFFICIAL POPIA COMPLIANCE v2.4 — APRIL 2026. FOR THE OFFICE OF THE <strong>INFORMATION OFFICER</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
