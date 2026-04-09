import React, { useState } from 'react';

export function Pathways({ editMode }: { editMode?: boolean }) {
  const [activePath, setActivePath] = useState('cloud');

  const paths = [
    { id: 'cloud', name: 'Cloud Engineer', icon: '☁️', sub: '12–18 months · AWS / Azure / GCP', title: 'Cloud Engineer Pathway', desc: 'From zero to multi-cloud certified architect in 18 months.', steps: [
      { num: '✓', title: 'Cloud Launchpad (Foundations)', detail: '12 weeks · Linux, Networking, Cloud fundamentals', certs: [{ label: 'AWS CCP', type: 'em' }, { label: 'AZ-900', type: 'sky' }], done: true },
      { num: '2', title: 'Cloud Architecture Residency', detail: '6 months · Solutions Architecture, IaC, Containers', certs: [{ label: 'AWS SAA', type: 'gold' }, { label: 'AZ-104', type: 'sky' }], current: true },
      { num: '3', title: 'Capstone: Industry Live Project', detail: '8 weeks · Real client, real infrastructure', certs: [{ label: 'GDA Capstone', type: '' }] },
      { num: '4', title: 'Micro-Credential: DevSecOps', detail: '4 weeks · GitHub Actions, Snyk, Kubernetes', certs: [{ label: 'Kubernetes CKA', type: 'vio' }] },
      { num: '5', title: 'GDA Placement Programme', detail: 'CV, LinkedIn, interviews, partner matching', certs: [{ label: 'GDA Certified Cloud Engineer', type: 'gold' }] }
    ]},
    { id: 'ai', name: 'AI/ML Engineer', icon: '🤖', sub: '10–14 months · Python · LLMOps', title: 'AI/ML Engineer Pathway', desc: 'Build production-grade AI systems from data to deployment.', steps: [
      { num: '✓', title: 'Python for Data & AI (Foundations)', detail: '6 weeks · Python, NumPy, Pandas, APIs', done: true },
      { num: '2', title: 'AI & Machine Learning Engineering', detail: '4 months · Classical ML, Deep Learning, NLP', certs: [{ label: 'TensorFlow Cert', type: 'vio' }], current: true },
      { num: '3', title: 'LLMOps & Generative AI', detail: '6 weeks · Prompt engineering, RAG, fine-tuning' },
      { num: '4', title: 'Capstone: AI Product Build', detail: '8 weeks · Full product: data → model → API → UI', certs: [{ label: 'GDA AI Engineer Cert', type: 'gold' }] }
    ]},
    { id: 'data', name: 'Data Engineer', icon: '📊', sub: '8–12 months · Spark · dbt', title: 'Data Engineer Pathway', desc: 'Design and operate enterprise-grade data infrastructure.', steps: [
      { num: '✓', title: 'SQL & Database Fundamentals', detail: '4 weeks · PostgreSQL, BigQuery, data modelling', done: true },
      { num: '2', title: 'Data Engineering & Analytics', detail: '5 months · dbt, Spark, orchestration, warehousing', certs: [{ label: 'GCP DE Cert', type: 'sky' }], current: true },
      { num: '3', title: 'DataOps & Real-Time Streaming', detail: '4 weeks · Kafka, Flink, CDC pipelines' },
      { num: '4', title: 'Capstone & Placement', detail: 'End-to-end data platform build + employer matching', certs: [{ label: 'GDA Data Engineer Cert', type: 'gold' }] }
    ]},
    { id: 'devsec', name: 'DevSecOps', icon: '🔐', sub: '6–10 months · K8s · CI/CD', title: 'DevSecOps Pathway', desc: 'Automate delivery pipelines with security built in from the start.', steps: [
      { num: '✓', title: 'Linux & Cloud Fundamentals', detail: '6 weeks · Shell scripting, networking, IAM', done: true },
      { num: '2', title: 'CI/CD & Container Orchestration', detail: '8 weeks · Docker, Kubernetes, GitHub Actions, ArgoCD', certs: [{ label: 'CKA', type: 'vio' }], current: true },
      { num: '3', title: 'Infrastructure as Code & Security', detail: 'Terraform, Vault, Snyk, SAST/DAST, compliance' },
      { num: '4', title: 'Capstone & Certification', detail: 'Platform engineering capstone + employer matching', certs: [{ label: 'GDA DevSecOps Cert', type: 'gold' }] }
    ]},
    { id: 'leader', name: 'Tech Executive', icon: '💼', sub: '4–6 months · AI Strategy', title: 'Tech Executive Pathway', desc: 'Strategic AI literacy and digital transformation leadership.', steps: [
      { num: '✓', title: 'Digital Economy Foundations', detail: '2 weeks · Cloud economics, AI landscape, POPIA', done: true },
      { num: '2', title: 'AI for Business Leaders', detail: '8 weeks · Strategy, ROI frameworks, vendor mgmt', certs: [{ label: '24 CPD Points', type: 'cor' }], current: true },
      { num: '3', title: 'GDA Leadership Roundtable', detail: 'Peer network, CIO/CTO mentorship, exec placement', certs: [{ label: 'GDA Executive Cert', type: 'gold' }] }
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
              <button 
                key={path.id}
                className={`flex items-center gap-3.5 p-4 py-4.5 rounded-md cursor-pointer border border-transparent transition-all text-left ${activePath === path.id ? 'bg-card border-gold/20' : 'bg-transparent hover:bg-white/3 hover:border-border-custom'}`}
                onClick={() => setActivePath(path.id)}
              >
                <div className={`w-9.5 h-9.5 rounded-sm flex items-center justify-center text-[16px] shrink-0 border border-border-custom bg-white/3 ${activePath === path.id ? 'bg-gold-dim border-gold/30' : ''}`}>
                  {path.icon}
                </div>
                <div className="flex-1">
                  <div className="font-syne font-semibold text-[13px]">{path.name}</div>
                  <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] mt-0.5">{path.sub}</div>
                </div>
                <span className={`text-[10px] text-text-dim transition-all ${activePath === path.id ? 'translate-x-1 text-gold' : ''}`}>→</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="animate-panelIn">
              <div className="font-syne font-extrabold text-[22px] mb-2">{currentPath.title}</div>
              <div className="text-[13px] text-text-soft mb-7">{currentPath.desc}</div>
              <div className="flex flex-col gap-0 relative">
                <div className="absolute left-[21px] top-11 bottom-11 w-0.5 bg-[linear-gradient(var(--color-gold),var(--color-sky))] opacity-30 z-0" />
                {currentPath.steps.map((step, i) => (
                  <div key={i} className={`flex gap-4.5 items-start py-4 relative z-[1] ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-syne font-extrabold text-[14px] shrink-0 border-2 border-border-custom bg-card text-text-muted transition-all ${step.done ? 'bg-gold-dim border-gold/40 text-gold' : ''} ${step.current ? 'bg-gold text-[#080b12] border-gold shadow-[0_0_20px_rgba(244,162,26,0.3)]' : ''}`}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faculty({ editMode }: { editMode?: boolean }) {
  const faculty = [
    { name: 'Munashe Ndoro', role: 'Lead Instructor · Cloud Architecture', init: 'MN', color: 'linear-gradient(135deg,#f4a21a,#c67d10)', banner: 'linear-gradient(90deg, #f4a21a, #c67d10)', spec: '15 years in cloud infrastructure. Former AWS Solutions Architect at Nedbank. Designed multi-region disaster recovery platforms for JSE-listed companies.', certs: [{ l: 'AWS SAP', t: 'gold' }, { l: 'Azure Expert', t: 'sky' }, { l: 'GCP Pro', t: 'em' }], students: '342', rating: '4.9★', online: true },
    { name: 'Thandeka Mokoena', role: 'Senior Instructor · AI & ML', init: 'TM', color: 'linear-gradient(135deg,#4fc3f7,#0288d1)', banner: 'linear-gradient(90deg, #4fc3f7, #0288d1)', spec: 'PhD candidate, Computer Science (UCT). Built fraud detection models at Standard Bank processing 2M+ transactions daily. Specialises in applied NLP for African languages.', certs: [{ l: 'TensorFlow Cert', t: 'vio' }, { l: 'Azure AI', t: 'sky' }, { l: 'AWS ML', t: 'em' }], students: '218', rating: '4.8★', online: true },
    { name: 'Sipho Khumalo', role: 'Instructor · Data Engineering', init: 'SK', color: 'linear-gradient(135deg,#56cfac,#2e9e7a)', banner: 'linear-gradient(90deg, #56cfac, #2e9e7a)', spec: 'Former Lead Data Engineer at Woolworths Holdings. Built a real-time supply chain analytics platform ingesting 50TB/day. Expert in dbt, Databricks, and Google BigQuery.', certs: [{ l: 'GCP DE Pro', t: 'sky' }, { l: 'Databricks', t: '' }, { l: 'dbt Labs', t: 'gold' }], students: '187', rating: '4.9★' },
    { name: 'Zintle Dlamini', role: 'Instructor · DevSecOps', init: 'ZD', color: 'linear-gradient(135deg,#f4664a,#c04030)', banner: 'linear-gradient(90deg, #f4664a, #c04030)', spec: 'Platform engineer with 9 years in fintech security. Former Head of Cloud Security at a JSE top-40 company. Built zero-trust architectures protecting R200Bn+ in daily transactions.', certs: [{ l: 'CKA', t: 'vio' }, { l: 'CISSP', t: 'cor' }, { l: 'Terraform Pro', t: 'sky' }], students: '156', rating: '4.7★' },
    { name: 'Priya Naidoo', role: 'Instructor · Executive AI', init: 'PN', color: 'linear-gradient(135deg,#a78bfa,#7c3aed)', banner: 'linear-gradient(90deg, #a78bfa, #7c3aed)', spec: 'MBA (Wits), formerly Chief Digital Officer at a Big 4 bank. Leads the AI for Business Leaders track. Specialises in digital transformation strategy and responsible AI governance.', certs: [{ l: 'MBA (Wits)', t: 'vio' }, { l: 'AI Strategy', t: 'gold' }, { l: 'IASA Fellow', t: '' }], students: '203', rating: '4.9★', online: true },
    { name: 'Lungelo Mthembu', role: 'Curriculum Director', init: 'LM', color: 'linear-gradient(135deg,#f4a21a,#56cfac)', banner: 'linear-gradient(90deg, #f4a21a, #56cfac)', spec: 'Former AWS Education Lead for Sub-Saharan Africa. Designed SETA-accredited curricula for 14,000+ learners across the continent. Architect of the GDA global-standard framework.', certs: [{ l: 'AWS Educator', t: 'gold' }, { l: 'SETA Expert', t: 'em' }, { l: 'NQF Assessor', t: 'sky' }], students: '14k+', rating: '5.0★' }
  ];

  return (
    <section id="faculty" className="bg-bg">
      <div className="section-inner">
        <div className="max-w-[540px] mb-14">
          <div className="section-label">Faculty & Instructors</div>
          <h2 className="section-title animate-fadeUp">Taught by practitioners,<br />not professors.</h2>
          <p className="section-sub animate-fadeUp delay-100">Every GDA instructor is an active industry professional with hands-on cloud, AI, or engineering experience — bringing real problems into the classroom.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculty.map((fac, i) => (
            <div key={i} className="bg-card border border-border-custom rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] relative group">
              <div className="h-1.5" style={{ background: fac.banner }}></div>
              <div className="p-7 px-6 pb-5.5">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-syne font-extrabold text-[18px] text-[#080b12] shrink-0 relative" style={{ background: fac.color }}>
                    {fac.init}
                    {fac.online && <span className="absolute bottom-0.25 right-0.25 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-card"></span>}
                  </div>
                  <div className="fac-info">
                    <div className="font-syne font-bold text-[14px] mb-0.5">{fac.name}</div>
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
                    <div className="text-[15px] font-medium text-gold">{fac.students}</div>
                    <div className="text-[8px] tracking-[0.12em] uppercase text-text-dim">{fac.name.includes('Priya') ? 'Executives' : 'Students'}</div>
                  </div>
                  <div className="bg-card py-3 font-dm-mono text-right">
                    <div className="text-[15px] font-medium text-gold">{fac.rating}</div>
                    <div className="text-[8px] tracking-[0.12em] uppercase text-text-dim">Rating</div>
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
