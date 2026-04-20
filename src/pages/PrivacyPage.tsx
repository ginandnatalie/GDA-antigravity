import React from 'react';
import PageHero from '../components/PageHero';
import { Lock, Eye, Database, Share2, ShieldCheck, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  const protocols = [
    {
      title: "The Ginashe Data Bridge",
      icon: <Database className="w-6 h-6 text-brand" />,
      content: "All student data is synchronised via the GDA Data Bridge, a secure, real-time pipeline between our admissions platform and the Student Hub. This ensures 100% field parity and data integrity across your institutional residency."
    },
    {
      title: "Encryption & Sovereignty",
      icon: <Lock className="w-6 h-6 text-emerald" />,
      content: "We utilise enterprise-grade encryption for all PII (Personally Identifiable Information). Data is stored in secure, regionalised Supabase clusters with strictly managed access controls, ensuring sovereignty and compliance with POPIA and GDPR standards."
    },
    {
      title: "Data Utility Protocol",
      icon: <Eye className="w-6 h-6 text-sky" />,
      content: "Your data is used exclusively for academic governance, performance tracking, and career placement services. We monitor LMS activity to provide predictive academic support and ensure curriculum engagement."
    },
    {
      title: "Third-Party Disclosure",
      icon: <Share2 className="w-6 h-6 text-violet" />,
      content: "GDA never sells student data. We only disclose records to accredited hiring partners and employer sponsors when explicit consent is provided for career placement or tuition sponsorship."
    },
    {
      title: "Institutional Audit Rights",
      icon: <ShieldCheck className="w-6 h-6 text-brand" />,
      content: "Students have the right to request a data audit to review the records held by the Academy. Requests must be submitted via the GDA Support Center for verification by the Data Compliance Officer."
    },
    {
      title: "Consent & Communication",
      icon: <UserCheck className="w-6 h-6 text-coral" />,
      content: "By applying to GDA, you consent to receive institutional notifications, academic briefings, and event invitations. You can manage your communication preferences within the Student Hub settings."
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Cyber-Sovereignty"
        title={<>Data Privacy<br /><span className="text-brand">Protocol</span>.</>}
        subtitle="The rigorous security framework protecting student identity and performance data within the Ginashe ecosystem."
        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Advanced digital security and data protection"
      />

      <section className="section-inner py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[60px] rounded-full" />
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-brand/10 border border-brand/20">
                <ShieldCheck className="w-8 h-8 text-brand" />
              </div>
              <div>
                <h2 className="font-syne font-bold text-2xl text-white mb-3">Institutional Commitment</h2>
                <p className="text-text-soft leading-relaxed">
                  "At Ginashe Digital Academy, data privacy is not just a legal requirement—it is a technical mandate. We believe that protecting your digital identity is foundational to your success as a future master of technology."
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((protocol, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-surface/30 border border-white/5 hover:border-brand/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-bg border border-white/5 flex items-center justify-center mb-6 group-hover:bg-brand/10 group-hover:scale-110 transition-all">
                  {protocol.icon}
                </div>
                <h3 className="font-syne font-bold text-lg text-white mb-3 group-hover:text-brand transition-colors">
                  {protocol.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  {protocol.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-navy-accent/20 border border-border-custom text-center">
            <p className="font-dm-mono text-[10px] text-brand uppercase tracking-[0.3em]">
              Standard Protocol v2.4 — April 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
