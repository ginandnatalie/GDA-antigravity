import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function TrustBar({ editMode }: { editMode?: boolean }) {
  const [title, setTitle] = useState('Recognised by');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('trustBarTitle').eq('id', 1).single();
        if (data) setTitle(data.trustBarTitle || 'Recognised by');
      } catch (err) {
        console.error('Error fetching trust bar settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      try {
        await supabase.from('site_settings').update({ trustBarTitle: title }).eq('id', 1);
      } catch (err) {
        console.error('Error saving trust bar content:', err);
      }
    };
    window.addEventListener('save-site-content', handleSave);
    return () => window.removeEventListener('save-site-content', handleSave);
  }, [title]);

  return (
    <div id="trust" className="border-b border-border-custom bg-bg2">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-14 py-4 sm:py-5 flex items-center gap-6 sm:gap-8 md:gap-12 overflow-x-auto scrollbar-hide">
        {editMode ? (
          <input 
            className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-gold bg-transparent border-b border-gold/30 outline-none focus:border-gold shrink-0 whitespace-nowrap"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        ) : (
          <span className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-text-dim shrink-0 whitespace-nowrap">{title}</span>
        )}
        <div className="flex items-center gap-9 flex-wrap md:flex-nowrap">
          {[
            { name: 'Amazon Web Services', color: '#FF9900', label: 'AWS', size: 9 },
            { name: 'Microsoft Azure', color: '#0078D4', label: 'AZ', size: 7 },
            { name: 'Google Cloud', color: '#4285F4', label: 'GCP', size: 7 },
            { name: 'MICT SETA', color: '#56cfac', label: 'SETA', size: 6 },
            { name: 'DHET Aligned', color: '#f4a21a', label: 'DHET', size: 6, text: 'black' },
            { name: 'IASA Global', color: '#7c3aed', label: 'IASA', size: 6 }
          ].map((logo) => (
            <span key={logo.name} className="flex items-center gap-1.5 sm:gap-2 opacity-40 hover:opacity-75 transition-opacity font-syne font-bold text-[11px] sm:text-[13px] text-text-custom whitespace-nowrap">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <rect width="20" height="20" rx="4" fill={logo.color} opacity="0.8"/>
                <text x="4" y="15" fontSize={logo.size} fill={logo.text || "white"} fontWeight="bold">{logo.label}</text>
              </svg>
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Program {
  id: string;
  cat: string;
  title: string;
  description: string;
  duration: string;
  meta: string;
  mode: string;
  certs: string;
  price: string;
  priceSub: string;
  icon: string;
  accent: string;
  num: string;
}

export function Programs({ onOpenModal, editMode }: { onOpenModal: (id: string) => void, editMode?: boolean }) {
  const [activeTab, setActiveTab] = useState('all');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [sectionContent, setSectionContent] = useState({
    title: 'Rigorous pathways.\nReal-world outcomes.',
    subtitle: 'Every programme is co-designed with industry, built on cloud-vendor curricula, and delivered by practitioners who have solved the problems you\'ll face.'
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('programsTitle, programsSubtitle').eq('id', 1).single();
        
        if (error) {
          if (error.code === 'PGRST116') return;
          if (error.message?.includes('Could not find the table')) return;
          throw error;
        }

        if (data) {
          setSectionContent({
            title: data.programsTitle || sectionContent.title,
            subtitle: data.programsSubtitle || sectionContent.subtitle
          });
        }
      } catch (err) {
        console.error('Error fetching programs settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      try {
        await supabase.from('site_settings').update({
          programsTitle: sectionContent.title,
          programsSubtitle: sectionContent.subtitle
        }).eq('id', 1);
      } catch (err) {
        console.error('Error saving programs content:', err);
      }
    };
    window.addEventListener('save-site-content', handleSave);
    return () => window.removeEventListener('save-site-content', handleSave);
  }, [sectionContent]);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setPrograms(data);
        } else {
          setPrograms(defaultPrograms);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setPrograms(defaultPrograms);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  async function handleDeleteProgram(id: string) {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      setPrograms(programs.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error deleting program: ' + err.message);
    }
  }

  const defaultPrograms: Program[] = [
    {
      id: '1', cat: 'foundation', title: 'Cloud Launchpad', accent: 'var(--emerald)', num: '01', icon: '🚀',
      description: 'The gateway to cloud computing. Ideal for school leavers and early-career individuals. Covers fundamentals of cloud infrastructure, networking, security, and Linux — all mapped to SETA unit standards.',
      duration: '12 weeks', meta: '120 NQF Credits', mode: 'Blended / In-person', certs: 'AWS CCP · Azure AZ-900', price: 'Subsidised', priceSub: '/ SETA Funded'
    },
    {
      id: '2', cat: 'professional', title: 'Cloud Architecture Residency', accent: 'var(--sky)', num: '02', icon: '☁️',
      description: 'An intensive post-graduate residency for developers and engineers transitioning into cloud roles. Covers AWS Solutions Architect, Azure Administrator, Terraform, Kubernetes, and CI/CD pipelines.',
      duration: '6 months', meta: 'Diploma or equiv. exp.', mode: 'Hybrid', certs: 'AWS SAA · Azure 104', price: 'R 28,500', priceSub: '/ ZAR'
    },
    {
      id: '3', cat: 'professional', title: 'AI & Machine Learning Engineering', accent: 'var(--violet)', num: '03', icon: '🤖',
      description: 'From Python fundamentals to deploying production ML models. Covers supervised/unsupervised learning, NLP, computer vision, LLMOps, and responsible AI governance for the African context.',
      duration: '4 months', meta: 'Python basics', mode: 'Online / Cohort-based', certs: 'PyTorch · SageMaker · Azure ML', price: 'R 34,000', priceSub: '/ ZAR'
    },
    {
      id: '4', cat: 'professional', title: 'Data Engineering & Analytics', accent: 'var(--gold)', num: '04', icon: '📊',
      description: 'Build the pipelines that power modern organisations. Covers data warehousing, dbt, Apache Spark, BigQuery, Redshift, Power BI, and data governance frameworks aligned to POPIA.',
      duration: '5 months', meta: 'SQL fundamentals', mode: 'Hybrid', certs: 'GCP DE · Databricks', price: 'R 31,500', priceSub: '/ ZAR'
    },
    {
      id: '5', cat: 'executive', title: 'AI for Business Leaders', accent: 'var(--coral)', num: '05', icon: '💼',
      description: 'Equip senior professionals and executives with the strategic literacy to lead AI transformation. Covers AI strategy, ROI frameworks, ethical AI, procurement, and board-level communication.',
      duration: '8 weeks (weekends)', meta: '5+ yrs management', mode: 'In-person / Sandton', certs: '24 Verifiable CPD', price: 'R 22,000', priceSub: '/ ZAR'
    },
    {
      id: '6', cat: 'enterprise', title: 'Workforce Modernisation Sprint', accent: 'var(--emerald)', num: '06', icon: '🏢',
      description: 'A bespoke 6–12 week intensive for corporate teams. We assess your current capability, design a custom curriculum, and upskill your workforce in cloud, AI, or DevSecOps — all on-site or at the Academy.',
      duration: 'Custom (6–12 wks)', meta: '10–200 learners', mode: 'On-site / Blended', certs: 'Bespoke quote', price: 'Custom', priceSub: '/ Enterprise'
    }
  ];

  const filtered = activeTab === 'all' ? programs : programs.filter(p => p.cat === activeTab);

  return (
    <section id="programs" className="bg-bg">
      <div className="section-inner">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-6">
          <div className="max-w-[540px]">
            <div className="section-label">Academic Programmes</div>
            {editMode ? (
              <div className="space-y-4">
                <textarea 
                  className="w-full bg-surface/50 border border-gold/30 rounded p-2 text-2xl font-syne font-bold text-text-custom outline-none focus:border-gold h-24"
                  value={sectionContent.title}
                  onChange={e => setSectionContent({...sectionContent, title: e.target.value})}
                />
                <textarea 
                  className="w-full bg-surface/50 border border-gold/30 rounded p-2 text-sm text-text-soft outline-none focus:border-gold h-24"
                  value={sectionContent.subtitle}
                  onChange={e => setSectionContent({...sectionContent, subtitle: e.target.value})}
                />
              </div>
            ) : (
              <>
                <h2 className="section-title animate-fadeUp whitespace-pre-line">{sectionContent.title}</h2>
                <p className="section-sub animate-fadeUp delay-100">{sectionContent.subtitle}</p>
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-4">
            {editMode && (
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="btn btn-gold btn-sm"
              >
                {isAdding ? 'Cancel' : '+ Add Program'}
              </button>
            )}
            <div className="flex gap-0.5 bg-surface border border-border-custom rounded-md p-1 flex-wrap animate-fadeUp delay-200">
              {['all', 'foundation', 'professional', 'executive', 'enterprise'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-3 sm:px-5 py-2 rounded-md font-dm-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase cursor-pointer border-none transition-all ${activeTab === tab ? 'bg-card2 text-gold border border-gold/20' : 'text-text-muted hover:text-text-soft hover:bg-white/3'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isAdding && (
          <div className="bg-card border border-border-custom rounded-xl p-8 mb-12 animate-fadeUp">
            <h3 className="font-syne font-bold text-xl mb-6">Create New Program</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Title" className="bg-surface border border-border-custom rounded p-3 text-sm" />
              <input placeholder="Category (foundation, professional, etc)" className="bg-surface border border-border-custom rounded p-3 text-sm" />
              <textarea placeholder="Description" className="bg-surface border border-border-custom rounded p-3 text-sm md:col-span-2 h-24" />
              <input placeholder="Duration" className="bg-surface border border-border-custom rounded p-3 text-sm" />
              <input placeholder="Price" className="bg-surface border border-border-custom rounded p-3 text-sm" />
            </div>
            <button className="btn btn-gold mt-6 w-full">Save Program</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-custom border border-border-custom rounded-lg overflow-hidden animate-fadeUp">
          {filtered.map((prog) => (
            <div 
              key={prog.id} 
              className="bg-card p-5 sm:p-6 md:p-7 relative overflow-hidden transition-colors hover:bg-card2 flex flex-col group"
              style={{ '--accent-color': prog.accent } as React.CSSProperties}
            >
              {editMode && (
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button className="p-2 rounded bg-bg/80 text-gold hover:bg-bg border border-border-custom">✎</button>
                  <button 
                    onClick={() => handleDeleteProgram(prog.id)}
                    className="p-2 rounded bg-bg/80 text-coral hover:bg-bg border border-border-custom"
                  >
                    🗑
                  </button>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent-color)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              <div className="absolute top-5 right-6 font-syne font-extrabold text-[64px] leading-none pointer-events-none tracking-[-0.05em]" style={{ color: 'var(--glass-text)' }}>{prog.num}</div>
              <div className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-[var(--accent-color)] mb-3.5">{prog.cat}</div>
              <div className="w-11 h-11 rounded-md flex items-center justify-center text-[20px] mb-4.5 border" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>{prog.icon}</div>
              <div className="font-syne font-bold text-[17px] leading-[1.2] mb-2.5">{prog.title}</div>
              <div className="text-[13px] text-text-soft leading-[1.65] mb-5 flex-1">{prog.description}</div>
              <div className="flex flex-col gap-2 pt-4.5 border-t border-border-custom mt-auto">
                <div className="flex justify-between items-center">
                  <span className="font-dm-mono text-[9px] tracking-[0.1em] text-text-dim uppercase">Duration</span>
                  <span className="font-dm-mono text-[10px] text-text-soft">{prog.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-dm-mono text-[9px] tracking-[0.1em] text-text-dim uppercase">{prog.cat === 'foundation' ? 'Credits' : prog.cat === 'executive' ? 'Pre-requisite' : 'Pre-requisite'}</span>
                  <span className="font-dm-mono text-[10px] text-text-soft">{prog.meta}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-dm-mono text-[9px] tracking-[0.1em] text-text-dim uppercase">Mode</span>
                  <span className="font-dm-mono text-[10px] text-text-soft">{prog.mode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-dm-mono text-[9px] tracking-[0.1em] text-text-dim uppercase">{prog.cat === 'executive' ? 'CPD Points' : 'Outcome Certs'}</span>
                  <span className="font-dm-mono text-[10px] text-text-soft">{prog.certs}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-custom">
                <div className="font-syne font-bold text-[15px] text-text-custom">{prog.price} <small className="font-dm-mono font-normal text-[9px] text-text-dim uppercase tracking-[0.1em]">{prog.priceSub}</small></div>
                <button className="btn btn-sm btn-outline" onClick={() => onOpenModal('apply')}>Apply →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
