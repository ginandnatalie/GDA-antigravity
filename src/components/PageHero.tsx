import React from 'react';

interface PageHeroProps {
  label: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt?: string;
}

export default function PageHero({ label, title, subtitle, image, imageAlt = '' }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg pt-[72px]">
      {/* Background image — pushed far right, clearly visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src={image} 
          alt={imageAlt}
          loading="eager"
          decoding="async"
          className="absolute right-0 top-0 h-full w-[90%] sm:w-[80%] md:w-[65%] lg:w-[55%] object-cover object-center opacity-35 sm:opacity-40 md:opacity-50 lg:opacity-55"
        />
        {/* Multi-layer fade: hard left → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg from-20% via-bg/80 via-40% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50"></div>
        {/* Extra mobile text protection */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent md:hidden"></div>
      </div>

      {/* Accent orbs */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,242,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(79,195,247,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-[1] max-w-[var(--max-w)] mx-auto px-5 sm:px-6 md:px-14 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[720px]">
          <div className="section-label mb-3">{label}</div>
          <h1 className="font-syne font-extrabold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] mb-4 md:mb-5">{title}</h1>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-text-soft leading-[1.7] max-w-[540px]">{subtitle}</p>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
    </section>
  );
}
