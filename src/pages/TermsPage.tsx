import React from 'react';
import PageHero from '../components/PageHero';
import { Shield, BookOpen, CreditCard, Scale, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Institutional Governance",
      icon: <Scale className="w-6 h-6 text-brand" />,
      content: "Ginashe Digital Academy (GDA) is a premier digital institution dedicated to technical excellence. By enrolling, students agree to adhere to our high-performance culture and institutional standards. GDA reserves the right to modify curriculum pathways to ensure alignment with global tech industry shifts."
    },
    {
      title: "2. Enrollment & Eligibility",
      icon: <CheckCircle className="w-6 h-6 text-emerald" />,
      content: "Admission is based on merit and technical potential. Students must provide accurate documentation during the application process. Any falsification of records will result in immediate termination of enrollment without refund."
    },
    {
      title: "3. Academic Integrity",
      icon: <Shield className="w-6 h-6 text-sky" />,
      content: "GDA maintains a zero-tolerance policy for plagiarism and academic dishonesty. Our practitioner-led model requires original synthesis of technical concepts. Violation of these standards leads to institutional disciplinary action."
    },
    {
      title: "4. Financial Obligations",
      icon: <CreditCard className="w-6 h-6 text-violet" />,
      content: "Tuition fees are due as per the agreed instalment plan. Access to the GDA Student Hub and proprietary course materials is contingent upon maintaining a good financial standing with the Academy."
    },
    {
      title: "5. Intellectual Property",
      icon: <BookOpen className="w-6 h-6 text-brand" />,
      content: "All course materials, frameworks, and methodologies provided by GDA are the exclusive intellectual property of the Academy. Students are granted a non-transferable licence for personal educational use only."
    },
    {
      title: "6. Certification Criteria",
      icon: <AlertCircle className="w-6 h-6 text-coral" />,
      content: "Certification is awarded based on technical mastery and attendance. Students must complete all matrix assessments and capstone projects to be eligible for institutional graduation."
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Institutional Governance"
        title={<>Terms of<br /><span className="text-brand">Enrollment</span>.</>}
        subtitle="The formal framework governing your residency and academic journey at Ginashe Digital Academy."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Formal institutional documentation"
      />

      <section className="section-inner py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <p className="text-text-soft leading-relaxed italic border-l-2 border-brand/30 pl-6 text-lg">
              "Excellence is not an act, but a habit. Our terms ensure that every resident of GDA is held to the highest standard of technical and professional conduct."
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

          <div className="mt-16 p-8 rounded-2xl bg-brand/5 border border-brand/10 text-center">
            <p className="font-dm-sans text-sm text-text-muted leading-relaxed">
              Last Updated: April 2026. For questions regarding these terms, please contact the <span className="text-brand font-bold">Office of the Registrar</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
