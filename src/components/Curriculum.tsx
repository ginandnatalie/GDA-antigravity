import React, { useState } from 'react';

export function Curriculum({ editMode }: { editMode?: boolean }) {
  const [activeProg, setActiveProg] = useState('cloud');
  const [openModules, setOpenModules] = useState<string[]>(['cloud-1']);

  const progs = [
    { id: 'cloud', name: 'Cloud Architecture Residency', icon: '☁️', dur: '6 months · 24 weeks', tag: 'Professional · Cloud Architecture Residency', desc: '24 weeks of hands-on cloud engineering — from Linux fundamentals to production-grade multi-cloud architectures. AWS, Azure, and GCP sandbox labs from Day 1.', meta: [{ l: 'Duration', v: '24 weeks' }, { l: 'Labs', v: '48 live' }, { l: 'Certs', v: 'AWS SAA + AZ-104' }], phases: [
      { label: 'Phase 1 — Foundations (Weeks 1–6)', modules: [
        { id: 'cloud-1', week: 'Wk 1–2', title: 'Linux, Networking & Cloud Fundamentals', desc: 'Master the OS and networking layer that everything in cloud runs on. Configure real Linux servers, build subnets, and set up your first cloud account on all three providers.', topics: ['Linux CLI', 'Bash Scripting', 'TCP/IP', 'DNS & DHCP', 'VPC Basics', 'IAM Fundamentals'], outcome: 'Provision a secure Linux VM, configure networking, and manage IAM users on AWS, Azure, and GCP.' },
        { id: 'cloud-2', week: 'Wk 3–4', title: 'Core Cloud Services: Compute, Storage & Databases', desc: 'Deep dive into the core building blocks — VMs, object storage, and managed databases across all three clouds. You\'ll build a three-tier application by week 4.', topics: ['EC2 / VMs', 'S3 / Blob / GCS', 'RDS / Azure SQL', 'Auto Scaling', 'Load Balancers'], outcome: 'Design and deploy a fault-tolerant three-tier app on AWS with RDS backend and S3 static frontend.' },
        { id: 'cloud-3', week: 'Wk 5–6', title: 'Cloud Networking & Security Architecture', desc: 'Build secure, multi-VPC network architectures. Transit Gateways, VPN, WAF, Shield, and compliance frameworks including CIS Benchmarks and POPIA.', topics: ['VPC Peering', 'Transit Gateway', 'WAF', 'KMS Encryption', 'CloudTrail', 'POPIA Compliance'], outcome: 'Architect a compliant, secure multi-VPC network with proper segmentation and audit logging.' }
      ]},
      { label: 'Phase 2 — Architecture & IaC (Weeks 7–14)', modules: [
        { id: 'cloud-4', week: 'Wk 7–9', title: 'Infrastructure as Code: Terraform & Ansible', desc: 'Stop clicking through consoles. Build modular, reusable Terraform configurations for AWS and Azure, and automate config management with Ansible.', topics: ['Terraform HCL', 'State Management', 'Modules', 'Ansible Playbooks', 'Remote State (S3)'], outcome: 'Deploy a complete multi-environment infrastructure on AWS using Terraform modules with remote S3 backend.' },
        { id: 'cloud-5', week: 'Wk 10–12', title: 'Containers, Docker & Kubernetes', desc: 'From Docker fundamentals to Kubernetes cluster management on EKS and AKS. Helm, ingress controllers, persistent volumes, and multi-namespace workloads.', topics: ['Docker', 'Kubernetes Architecture', 'EKS / AKS', 'Helm Charts', 'Ingress', 'RBAC'], outcome: 'Deploy a microservices application to EKS using Helm with ingress routing and auto-scaling.' },
        { id: 'cloud-6', week: 'Wk 13–14', title: 'Serverless & Event-Driven Architecture', desc: 'Design cost-efficient, infinitely scalable systems using Lambda, API Gateway, EventBridge, and SQS. Learn when NOT to use serverless and how to handle observability in production.', topics: ['AWS Lambda', 'API Gateway', 'SQS / SNS', 'EventBridge', 'Step Functions'], outcome: 'Architect and deploy a fully serverless event-driven pipeline processing real-time data streams.' }
      ]},
      { label: 'Phase 3 — Capstone & Placement (Weeks 15–24)', modules: [
        { id: 'cloud-7', week: 'Wk 15–18', title: 'CI/CD, Observability & DevSecOps', desc: 'Automate your delivery pipeline end-to-end. GitHub Actions, ArgoCD, CloudWatch, Datadog, and integrating Snyk security scanning into every stage.', topics: ['GitHub Actions', 'ArgoCD / GitOps', 'CloudWatch', 'Datadog', 'Snyk'], outcome: 'Build a full CI/CD pipeline with automated security gates, blue/green deployment, and observability dashboards.' },
        { id: 'cloud-8', week: 'Wk 19–22', title: 'Industry Capstone Project', desc: 'A real client brief from one of our employer partners. Design, build, and present a full cloud architecture addressing an actual business problem — evaluated by industry professionals.', topics: ['Solution Design', 'Cost Estimation', 'Client Presentation', 'GitHub Portfolio'], outcome: 'A portfolio-ready, industry-reviewed cloud architecture project on your GitHub — linked on your CV.' },
        { id: 'cloud-9', week: 'Wk 23–24', title: 'Certification Bootcamp & Placement Prep', desc: 'Intensive prep for AWS SAA-C03 and AZ-104. Practice exams, timed drills, weak-area targeting. Parallel: CV, LinkedIn, mock technical interviews with senior engineers.', topics: ['AWS SAA-C03 Prep', 'AZ-104 Prep', 'Mock Interviews', 'CV Workshop'], outcome: 'Sit your AWS and Azure certification exams — GDA covers the exam voucher cost.' }
      ]}
    ], footerCerts: ['AWS SAA-C03', 'AZ-104', 'GCP ACE', 'CKA', 'GDA Residency Diploma'] },
    { id: 'ai', name: 'AI & ML Engineering', icon: '🤖', dur: '4 months · 16 weeks', tag: 'Professional · AI & Machine Learning Engineering', desc: '16 weeks from Python to deploying production LLM-powered applications. Classical ML, deep learning, NLP, and LLMOps — with a final AI product capstone.', meta: [{ l: 'Duration', v: '16 weeks' }, { l: 'Labs', v: '32 live' }, { l: 'Stack', v: 'PyTorch · SageMaker' }], phases: [
      { label: 'Phase 1 — ML Foundations (Weeks 1–6)', modules: [
        { id: 'ai-1', week: 'Wk 1–2', title: 'Python for Data Science & ML Engineering', desc: 'Python from the ML engineer\'s perspective — vectorised operations, data structures, EDA with Pandas and Matplotlib on real South African financial datasets.', topics: ['Python OOP', 'NumPy', 'Pandas', 'Matplotlib', 'Jupyter', 'Git for DS'], outcome: 'Build a complete EDA pipeline on a real SA financial dataset and publish it to GitHub.' }
      ]}
    ], footerCerts: ['TensorFlow Developer', 'Azure AI Engineer', 'AWS ML Specialty', 'GDA AI Engineer Diploma'] }
  ];

  const current = progs.find(p => p.id === activeProg)!;

  const toggleModule = (id: string) => {
    setOpenModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <section id="curriculum" className="bg-bg2 border-t border-border-custom">
      <div className="section-inner">
        <div className="max-w-[540px] mb-14">
          <div className="section-label">Week-by-Week Curriculum</div>
          <h2 className="section-title animate-fadeUp">Know exactly what<br />you're signing up for.</h2>
          <p className="section-sub animate-fadeUp delay-100">Every module, every week, every topic — laid out before you commit. No surprises, no vague syllabi. This is what world-class technical rigour looks like in practice.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] border border-border-custom rounded-3xl overflow-hidden bg-card animate-fadeUp">
          <div className="border-r border-border-custom p-2 flex flex-col gap-0.5 bg-surface overflow-x-auto lg:overflow-visible flex-row lg:flex-col">
            {progs.map((p) => (
              <button 
                key={p.id}
                className={`flex items-center gap-3 p-3.5 px-4 rounded-md cursor-pointer border-none transition-all text-left shrink-0 lg:shrink-1 ${activeProg === p.id ? 'bg-gold-dim border border-gold/20' : 'bg-transparent hover:bg-white/4'}`}
                onClick={() => setActiveProg(p.id)}
              >
                <div className={`w-8.5 h-8.5 rounded-sm flex items-center justify-center text-[15px] shrink-0 border border-border-custom bg-white/3 ${activeProg === p.id ? 'bg-gold-dim border-gold/30' : ''}`}>
                  {p.icon}
                </div>
                <div>
                  <div className="font-syne font-semibold text-[12px] line-height-[1.3]">{p.name}</div>
                  <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.08em] mt-0.5">{p.dur}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            <div className="p-7 md:p-8 pb-5 border-b border-border-custom flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="max-w-[500px]">
                <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-gold mb-2">{current.tag}</div>
                <h3 className="font-syne font-extrabold text-[20px] mb-1.5">{current.name}</h3>
                <p className="text-[12px] text-text-soft leading-[1.6]">{current.desc}</p>
              </div>
              <div className="flex flex-col gap-2 text-right shrink-0">
                {current.meta.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 justify-end font-dm-mono text-[9px] tracking-[0.08em] text-text-muted">
                    {m.l} <span className="text-text-custom">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-7 md:p-8 py-5 pb-7">
              {current.phases.map((phase, pi) => (
                <div key={pi} className="mb-5 last:mb-0">
                  <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim mb-2.5 flex items-center gap-2.5 before:content-[''] before:flex-1 before:h-px before:bg-border-custom after:content-[''] after:flex-1 after:h-px after:bg-border-custom">
                    {phase.label}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {phase.modules.map((mod) => (
                      <div key={mod.id} className={`border border-border-custom rounded-md overflow-hidden transition-colors hover:border-border2 ${openModules.includes(mod.id) ? 'border-gold/25' : ''}`}>
                        <div 
                          className={`p-3.5 px-4.5 flex items-center gap-3.5 cursor-pointer bg-white/2 transition-colors hover:bg-white/4 select-none ${openModules.includes(mod.id) ? 'bg-gold/4' : ''}`}
                          onClick={() => toggleModule(mod.id)}
                        >
                          <span className={`font-dm-mono text-[8px] tracking-[0.12em] uppercase px-2 py-0.75 rounded-sm border border-border-custom text-text-dim shrink-0 ${openModules.includes(mod.id) ? 'bg-gold-dim border-gold/20 text-gold' : 'bg-surface'}`}>
                            {mod.week}
                          </span>
                          <span className="font-syne font-semibold text-[13px] flex-1">{mod.title}</span>
                          <span className={`text-[12px] text-text-dim transition-transform duration-250 shrink-0 ${openModules.includes(mod.id) ? 'rotate-90 text-gold' : ''}`}>›</span>
                        </div>
                        {openModules.includes(mod.id) && (
                          <div className="p-4.5 px-4.5 pt-0 animate-slideDown">
                            <div className="text-[12px] text-text-soft leading-[1.65] mb-3 pt-1">{mod.desc}</div>
                            <div className="flex flex-wrap gap-1.25 mb-2.5">
                              {mod.topics.map((t, ti) => (
                                <span key={ti} className="font-dm-mono text-[9px] tracking-[0.06em] px-2.25 py-0.75 rounded-sm bg-white/4 border border-border-custom text-text-soft">{t}</span>
                              ))}
                            </div>
                            <div className="flex items-start gap-1.75 text-[11px] text-text-muted p-2 px-2.5 rounded-sm bg-emerald-dim border border-emerald/15 before:content-['✓'] before:text-emerald before:text-[11px] before:shrink-0 before:mt-0.25">
                              {mod.outcome}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4.5 md:p-8 py-4.5 border-t border-border-custom bg-white/1.5 flex items-center gap-3.5 flex-wrap">
              <span className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-dim whitespace-nowrap">Outcome certifications:</span>
              {current.footerCerts.map((c, i) => (
                <span key={i} className={`chip ${i === 0 ? 'chip-gold' : i === 1 ? 'chip-sky' : i === 2 ? 'chip-em' : i === 3 ? 'chip-vio' : ''}`}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
