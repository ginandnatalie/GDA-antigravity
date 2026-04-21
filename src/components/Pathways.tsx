import React, { useState } from 'react';
import { ArrowRight, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pathways({ editMode }: { editMode?: boolean }) {
  const [activePath, setActivePath] = useState('cloud-computing');

  const paths = [
    { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️', sub: '12–18 months · Multi-Cloud', title: 'Cloud Computing Pathway', desc: 'Master the design and governance of high-availability infrastructure across AWS and Azure.', steps: [
      { num: '✓', title: 'Cloud Launchpad', detail: '12 weeks · Linux, Networking, Fundamentals', done: true },
      { num: '2', title: 'Cloud Practitioner Pro', detail: '6 months · Specialised Resource Management', current: true },
      { num: '3', title: 'Cloud Architect', detail: 'Capstone: Production Design Pattern' },
      { num: '4', title: 'Enterprise Mastery', detail: 'FinOps, Landing Zones & Governance' }
    ]},
    { id: 'ai-machine-learning', name: 'AI & Machine Learning', icon: '🤖', sub: '10–14 months · LLMs · MLOps', title: 'AI & Machine Learning Pathway', desc: 'Engineering intelligence from data literacy to production-grade LLM applications.', steps: [
      { num: '✓', title: 'AI Fundamentals', detail: '6 weeks · Logic, Ethics, Prompt Engineering', done: true },
      { num: '2', title: 'ML Essentials', detail: '4 months · Python, Scikit-learn, Tuning', current: true },
      { num: '3', title: 'Applied AI Engineering', detail: 'RAG, APIs, and MLOps Orchestration' },
      { num: '4', title: 'Enterprise Strategy', detail: 'Strategic ROI and Responsible AI Leadership' }
    ]},
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️', sub: '8–12 months · Zero Trust', title: 'Cybersecurity Pathway', desc: 'Defending institutional borders through offensive and defensive technical rigs.', steps: [
      { num: '✓', title: 'Cyber Essentials', detail: '4 weeks · Threat Detection & Identity Basics', done: true },
      { num: '2', title: 'Ethical Hacking', detail: '5 months · Kali Linux, Pen Testing, Vulnerability', current: true },
      { num: '3', title: 'Security Operations', detail: 'SOC, SIEM, and Incident Response' },
      { num: '4', title: 'CISO Programme', detail: 'Risk Management, POPIA & ISO 27001' }
    ]},
    { id: 'data-analytics', name: 'Data & Analytics', icon: '📊', sub: '8–12 months · dbt · Spark', title: 'Data & Analytics Pathway', desc: 'Building high-performance data pipelines and AI-driven business intelligence.', steps: [
      { num: '✓', title: 'Data Literacy', detail: '6 weeks · SQL Logic, Visualization', done: true },
      { num: '2', title: 'Data Analysis & BI', detail: '8 weeks · Power BI, Statistics, Insights', current: true },
      { num: '3', title: 'Data Engineering', detail: 'Pipelines, Spark, and Distributed Data' },
      { num: '4', title: 'Institutional CDO', detail: 'Data Mesh & AI-Driven Analytics Strategy' }
    ]},
    { id: 'software-devops', name: 'Software & DevOps', icon: '💻', sub: '12–16 months · React · K8s', title: 'Software & DevOps Pathway', desc: 'Mastering the full delivery lifecycle from code launchpad to platform engineering.', steps: [
      { num: '✓', title: 'Code Launchpad', detail: '2 months · HTML/CSS, Python, Git', done: true },
      { num: '2', title: 'Full-Stack Development', detail: '6 months · React, Node.js, Databases', current: true },
      { num: '3', title: 'DevOps & Cloud-Native', detail: 'Docker, Kubernetes, CI/CD, Terraform' },
      { num: '4', title: 'Platform Engineering', detail: 'SRE and Internal Platform Design' }
    ]},
    { id: 'digital-transformation', name: 'Digital Transformation', icon: '⚡', sub: '6–10 months · DX Strategy', title: 'Digital Transformation Pathway', desc: 'Leading institutional change through process digitisation and strategic performance.', steps: [
      { num: '✓', title: 'Digital Literacy for Work', detail: '4 weeks · M365 & Digital Ecosystems', done: true },
      { num: '2', title: 'Process Digitisation', detail: '3 months · Low-Code/Automation/BPM', current: true },
      { num: '3', title: 'DX Leadership', detail: 'Change Mgmt, Milestone Planning' },
      { num: '4', title: 'Executive CDO', detail: 'Innovation Governance & performance KPIs' }
    ]},
    { id: 'digital-business', name: 'Digital Business', icon: '🚀', sub: '6–10 months · E-Commerce', title: 'Digital Business Pathway', desc: 'Designing and scaling digital ventures for the African and global markets.', steps: [
      { num: '✓', title: 'Entrepreneurship 101', detail: '6 weeks · Business Models & SEO Foundations', done: true },
      { num: '2', title: 'E-Commerce & Marketing', detail: '2 months · Shopify, Ads, Conversion Logic', current: true },
      { num: '3', title: 'Product Strategy', detail: 'Monetisation Design & Growth Hacking' },
      { num: '4', title: 'Innovation & Scaling', detail: 'Funding Architecture & Venture Governance' }
    ]}
  ];

  const currentPath = paths.find(p => p.id === activePath)!;

  return (
    <section id="pathways" className="bg-bg2 border-t border-b border-border-custom">
      <div className="section-inner">
        <div className="max-w-[540px] mb-14">
          <div className="section-label">Learning Pathways</div>
          <h2 className="section-title animate-fadeUp">Your roadmap,<br />your pace.</h2>
          <p className="section-sub animate-fadeUp delay-100">Choose a career track and follow a structured sequence of programmes, micro-credentials, and capstone projects — all industry-verified and stackable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div className="flex flex-col gap-1">
            {paths.map((path) => (
              <Link 
                to={`/tracks/${path.id}`}
                key={path.id}
                className={`flex items-center gap-3.5 p-4 py-4.5 rounded-md cursor-pointer border border-transparent transition-all text-left ${activePath === path.id ? 'bg-card border-brand/20' : 'bg-transparent hover:bg-white/3 hover:border-border-custom'}`}
                onClick={() => setActivePath(path.id)}
              >
                <div className={`w-9.5 h-9.5 rounded-sm flex items-center justify-center text-[16px] shrink-0 border border-border-custom bg-white/3 ${activePath === path.id ? 'bg-brand/10 border-brand/30' : ''}`}>
                  {path.icon}
                </div>
                <div className="flex-1">
                  <div className="font-syne font-semibold text-[13px]">{path.name}</div>
                  <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] mt-0.5">{path.sub}</div>
                </div>
                <span className={`text-[10px] text-text-dim transition-all ${activePath === path.id ? 'translate-x-1 text-brand' : ''}`}>→</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="animate-panelIn">
              <div className="font-syne font-extrabold text-[22px] mb-2">{currentPath.title}</div>
              <div className="text-[13px] text-text-soft mb-7">{currentPath.desc}</div>
              <div className="flex flex-col gap-0 relative">
                <div className="absolute left-[21px] top-11 bottom-11 w-0.5 bg-[linear-gradient(var(--color-brand),var(--color-sky))] opacity-30 z-0" />
                {currentPath.steps.map((step, i) => (
                  <div key={i} className={`flex gap-4.5 items-start py-4 relative z-[1] ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-syne font-extrabold text-[14px] shrink-0 border-2 border-border-custom bg-card text-text-muted transition-all ${step.done ? 'bg-brand/10 border-brand/40 text-brand' : ''} ${step.current ? 'bg-brand text-[#080b12] border-brand shadow-[0_0_20px_rgba(0,242,255,0.3)]' : ''}`}>
                      {step.num}
                    </div>
                    <div className="pt-2.5">
                      <div className="font-syne font-semibold text-[14px]">{step.title}</div>
                      <div className="text-[12px] text-text-muted mt-0.75">{step.detail}</div>
                      {step.certs && (
                        <div className="flex gap-1.25 mt-2">
                          {step.certs.map((cert, ci) => (
                            <span key={ci} className={`chip ${cert.type ? `chip-${cert.type}` : ''}`}>{cert.label}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-start">
                <Link 
                  to={`/tracks/${currentPath.id}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand text-navy font-syne font-black uppercase text-[11px] tracking-[0.25em] rounded-xl hover:bg-white transition-all no-underline shadow-[0_15px_40px_rgba(0,242,255,0.2)]"
                >
                  Explore Full {currentPath.name} Track
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faculty({ editMode }: { editMode?: boolean }) {
  const faculty = [
    { 
      name: 'George K', 
      role: 'Executive Director', 
      init: 'GK', 
      color: 'linear-gradient(135deg,#00f2ff,#009eb3)', 
      banner: 'linear-gradient(90deg, #00f2ff, #009eb3)', 
      spec: 'Digital Strategy Lead & Executive Director. MBA (JBS - Digital Transformation) with a focus on institutional sovereignty. Expert in Google Cloud Platform (GCP) and Popular BaaS computing.', 
      certs: [{ l: 'MBA (JBS)', t: 'vio' }, { l: 'GCP PRO', t: 'brand' }, { l: 'POSTGRES', t: 'sky' }], 
      experience: '20+ Yrs', 
      projects: '100+ Strategic', 
      online: true,
      image: '/images/faculty/george.jpg',
      linkedin: 'https://www.linkedin.com/in/george-kapendeka/'
    },
    { 
      name: 'Talent K', 
      role: 'Lead Faculty · Cloud Architecture', 
      init: 'TK', 
      color: 'linear-gradient(135deg,#4fc3f7,#0288d1)', 
      banner: 'linear-gradient(90deg, #4fc3f7, #0288d1)', 
      spec: 'Multi-cloud architect with 12+ years experience. Specializes in mission-critical infrastructure for the African digital economy. Lead of GDA\'s flagship Residency programs.', 
      certs: [{ l: 'AWS SAA', t: 'brand' }, { l: 'AZ-104', t: 'sky' }, { l: 'GCP Pro', t: 'em' }], 
      experience: '12+ Yrs', 
      projects: '50+ Enterprise', 
      online: true 
    },
    { 
      name: 'Eddie M', 
      role: 'Lead · Database Engineering', 
      init: 'EM', 
      color: 'linear-gradient(135deg,#56cfac,#2e9e7a)', 
      banner: 'linear-gradient(90deg, #56cfac, #2e9e7a)', 
      spec: 'Specialist in distributed data systems and high-availability clusters. Core contributor to the Ginashe Data Systems Mastery curriculum and enterprise engineering tracks.', 
      certs: [{ l: 'Oracle OCP', t: 'cor' }, { l: 'Azure Data', t: 'sky' }, { l: 'Postgres', t: 'brand' }], 
      experience: '10+ Yrs', 
      projects: '30+ Systems' 
    },
    { 
      name: 'Falakhe', 
      role: 'Lead · Database Administration', 
      init: 'FL', 
      color: 'linear-gradient(135deg,#f4664a,#c04030)', 
      banner: 'linear-gradient(90deg, #f4664a, #c04030)', 
      spec: 'Focused on institutional data governance and operational uptime. Expert in cloud-native database management, security protocols, and high-fidelity recovery systems.', 
      certs: [{ l: 'MSSQL', t: 'sky' }, { l: 'AWS DBA', t: 'brand' }, { l: 'MongoDB', t: 'em' }], 
      experience: '15+ Yrs', 
      projects: '40+ DBA Ops' 
    },
    { 
      name: 'Tumelo M', 
      role: 'Cloud Engineer/Developer', 
      init: 'TM', 
      color: 'linear-gradient(135deg,#a78bfa,#7c3aed)', 
      banner: 'linear-gradient(90deg, #a78bfa, #7c3aed)', 
      spec: 'DevOps and automation lead with a focus on cost-optimization and resilient CI/CD pipelines. Practitioner-led instructor driving the GDA Associate and Developer tracks.', 
      certs: [{ l: 'CKA', t: 'vio' }, { l: 'Terraform', t: 'sky' }, { l: 'AWS Dev', t: 'brand' }], 
      experience: '8+ Yrs', 
      projects: '25+ DevOps', 
      online: true 
    }
  ];

  return (
    <section id="faculty" className="bg-bg">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mb-14 items-center">
          <div className="max-w-[540px]">
            <div className="section-label">Faculty & Instructors</div>
            <h2 className="section-title animate-fadeUp">Taught by practitioners,<br />not professors.</h2>
            <p className="section-sub animate-fadeUp delay-100">Every GDA instructor is an active industry professional with hands-on cloud, AI, or engineering experience — bringing real problems into the classroom.</p>
          </div>
          <div className="bg-card border border-border-custom rounded-2xl p-6 animate-fadeUp delay-200">
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-sky mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky"></span>
              Faculty Engagement
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted">Avg. Experience</span>
                <span className="font-dm-mono text-[13px] text-sky">12+ Years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted">Student-Teacher Ratio</span>
                <span className="font-dm-mono text-[13px] text-sky">15:1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted">Industry Partners</span>
                <span className="font-dm-mono text-[13px] text-sky">40+ Corps</span>
              </div>
              <button className="btn btn-sm bg-sky-dim text-sky border border-sky/20 w-full mt-2">View Faculty Handbook →</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculty.map((fac, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-lg overflow-hidden transition-all duration-300 hover:border-brand/20 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] relative group">
              <div className="h-1.5" style={{ background: fac.banner }}></div>
              <div className="p-7 px-6 pb-5.5">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-syne font-extrabold text-[18px] text-[#080b12] shrink-0 relative overflow-hidden" style={{ background: fac.color }}>
                    {fac.image ? (
                      <img src={fac.image} alt={fac.name} className="w-full h-full object-cover" />
                    ) : (
                      fac.init
                    )}
                    {fac.online && <span className="absolute bottom-0.25 right-0.25 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-card"></span>}
                  </div>
                  <div className="fac-info flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-syne font-bold text-[14px] mb-0.5">{fac.name}</div>
                      {fac.linkedin && (
                        <a href={fac.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand transition-colors">
                          <Linkedin size={14} />
                        </a>
                      )}
                    </div>
                    <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.1em] uppercase">{fac.role}</div>
                  </div>
                </div>
                <div className="text-[12px] text-text-soft leading-[1.55] mb-4">{fac.spec}</div>
                <div className="flex flex-wrap gap-1.25 mb-4">
                  {fac.certs.map((cert, ci) => (
                    <span key={ci} className={`chip ${cert.t ? `chip-${cert.t}` : ''}`}>{cert.l}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-px bg-border-custom border-t border-border-custom -mx-6 px-6">
                  <div className="bg-card py-3 font-dm-mono">
                    <div className="text-[13px] font-medium text-brand">{fac.experience}</div>
                    <div className="text-[8px] tracking-[0.12em] uppercase text-text-dim">Experience</div>
                  </div>
                  <div className="bg-card py-3 font-dm-mono text-right">
                    <div className="text-[13px] font-medium text-brand">{fac.projects}</div>
                    <div className="text-[8px] tracking-[0.12em] uppercase text-text-dim">Strategic Projects</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
