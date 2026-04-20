import React from 'react';

interface StaffMember {
  name: string;
  role: string;
  programme: string;
  quote: string;
  image?: string;
}

export const AcademyStaff = () => {
  const staff: StaffMember[] = [
    { 
      name: 'George K', 
      role: 'Executive Director', 
      programme: 'Digital Strategy & Governance', 
      quote: 'At Ginashe, we aren\'t just teaching code; we\'re architecting the future of African digital sovereignty through institutional innovation.',
      image: '/images/faculty/george.jpg'
    },
    { 
      name: 'Talent K', 
      role: 'Lead Faculty (Cloud Specialist)', 
      programme: 'Cloud Architecture Residency', 
      quote: 'Our curriculum is live fire. We prepare candidates to handle production-scale architectures from Day 1, bridging the gap between theory and technical mastery.' 
    },
    { 
      name: 'Eddie M', 
      role: 'Database Engineer/Developer', 
      programme: 'Data Systems Mastery', 
      quote: 'Data is the gravity of any cloud ecosystem. We don\'t just teach SQL; we teach distributed data architecture and high-availability engineering for the modern enterprise.' 
    },
    { 
      name: 'Falakhe', 
      role: 'Database Administrator', 
      programme: 'DBA Governance & Ops', 
      quote: 'Integrity and performance are the pillars of institutional data. At Ginashe, we ensure candidates master the governance and uptime protocols required by global firms.' 
    },
    { 
      name: 'Tumelo M', 
      role: 'Cloud Engineer/Developer', 
      programme: 'DevOps & Scalability', 
      quote: 'Automate everything. We bridge the gap between simple deployment and resilient, cost-optimized cloud operations using industry-standard principles.' 
    }
  ];

  return (
    <section className="bg-bg border-t border-border-custom">
      <div className="section-inner">
        <div className="mb-10 md:mb-12">
          <div className="section-label">Expert Practitioners</div>
          <h2 className="section-title">Lead Technical Faculty.</h2>
          <p className="section-sub mt-4">The architects behind our curriculum are not career academics — they are elite engineers and operational leaders active in the global digital economy.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staff.map((member, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-xl p-6 flex flex-col hover:border-brand/20 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center font-syne font-bold text-brand text-lg group-hover:bg-brand/10 transition-colors overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <div className="font-syne font-bold text-[15px]">{member.name}</div>
                  <div className="font-dm-mono text-[10px] text-brand/60 uppercase tracking-widest">{member.role}</div>
                </div>
              </div>
              
              <blockquote className="text-[14px] text-text-soft leading-relaxed flex-1 italic mb-6">
                "{member.quote}"
              </blockquote>
              
              <div className="pt-4 border-t border-border-custom">
                <div className="font-dm-mono text-[9px] text-text-muted uppercase tracking-[0.2em] mb-1">Portfolio Alignment</div>
                <div className="text-[11px] font-bold text-text-custom">{member.programme}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
