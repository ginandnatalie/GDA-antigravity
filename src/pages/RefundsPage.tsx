import React from 'react';
import PageHero from '../components/PageHero';
import { CreditCard, Calendar, AlertCircle, CheckCircle, RefreshCcw, Shield } from 'lucide-react';

export default function RefundsPage() {
  const sections = [
    {
      title: "1. Cooling-Off Period",
      icon: <Calendar className="w-6 h-6 text-brand" />,
      content: "Students are entitled to a 14-day institutional cooling-off period from the date of initial enrolment. During this window, a full refund of tuition fees (excluding non-refundable registration fees) can be requested if no course materials have been accessed."
    },
    {
      title: "2. Withdrawal Protocol",
      icon: <AlertCircle className="w-6 h-6 text-coral" />,
      content: "Official withdrawal requests must be submitted through the GDA Student Portal. Refunds are calculated based on the date of the formal request and the extent of curriculum engagement recorded on the LMS."
    },
    {
      title: "3. Pro-Rata Modular Credits",
      icon: <RefreshCcw className="w-6 h-6 text-sky" />,
      content: "For withdrawals after the cooling-off period, GDA operates on a modular credit basis. Fees for completed or 'in-progress' modules are non-refundable. Remaining tuition may be credited toward future residency or partially refunded at the discretion of the Financial Directorate."
    },
    {
      title: "4. Technical Engagement Rule",
      icon: <Shield className="w-6 h-6 text-emerald" />,
      content: "Once a student has accessed proprietary technical frameworks or laboratory environments within a module, that module is considered 'delivered' and the associated fees become non-refundable to protect the Academy's intellectual property."
    },
    {
      title: "5. Refund Disbursement",
      icon: <CheckCircle className="w-6 h-6 text-brand" />,
      content: "Approved refunds are processed within 30 business days and are disbursed exclusively to the original payment source or the sponsoring entity (Employer/Sponsor) to ensure financial compliance."
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageHero
        label="Financial Governance"
        title={<>Tuition & Refund<br /><span className="text-brand">Protocol</span>.</>}
        subtitle="The rigorous framework governing tuition sovereignty, withdrawals, and modular credit logic."
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2072"
        imageAlt="Financial documentation and academic governance"
      />

      <section className="section-inner py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <p className="text-text-soft leading-relaxed italic border-l-2 border-brand/30 pl-6 text-lg">
              "Financial transparency is a pillar of our institutional integrity. Our refund protocols ensure a fair balance between student flexibility and the protection of academic resources."
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
              Standard Finance Protocol v1.8 — April 2026. For enquiries, contact the <span className="text-brand font-bold">Financial Directorate</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
