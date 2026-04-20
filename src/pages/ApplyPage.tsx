import React from 'react';
import SharedAdmissionForm from '../components/SharedAdmissionForm';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden py-12 md:py-20 px-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sky/5 rounded-full blur-[150px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-[700px] mx-auto relative">
        <div className="text-center mb-12 animate-fadeUp">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.2em] font-bold">Official Application 2026</span>
          </div>
          <h1 className="font-syne font-extrabold text-4xl md:text-5xl mb-4 leading-tight">
            The Journey to <span className="text-brand">Mastery</span> Starts Here.
          </h1>
          <p className="text-text-soft text-[14px] md:text-[16px] max-w-xl mx-auto leading-relaxed">
            Complete your admission requirements to join Africa's premier institutional academy for cloud and AI engineering.
          </p>
        </div>

        <div className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.3)] animate-fadeUp delay-100">
          <SharedAdmissionForm />
        </div>

        <div className="mt-12 text-center animate-fadeUp delay-200">
           <p className="text-[12px] text-text-muted">
            By submitting this application, you agree to our <a href="#" className="text-brand hover:underline">Institutional Terms of Enrollment</a> and <a href="#" className="text-brand hover:underline">Data Privacy Protocol</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
