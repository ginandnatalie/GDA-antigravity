import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sanitizeAccreditation } from '../utils/governance';
import { 
  Cloud, Layers, Shield, Globe, Cpu, Zap, Code, BarChart3, 
  Lock, Terminal, Database, Activity, Briefcase, GraduationCap, 
  Star, Search, Server, FileText, MessageSquare, Layout, Network, 
  Container, Binary, ShieldAlert, Cpu as CpuIcon, ArrowRight,
  PieChart, TrendingUp, Compass, Repeat, Users, Rocket, ShoppingBag, Key, Award,
  LayoutGrid, TableProperties, ListOrdered
} from 'lucide-react';
import { motion } from 'motion/react';

const LucideIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons: { [key: string]: any } = {
    'Cloud': Cloud,
    'Layers': Layers,
    'Shield': Shield,
    'Globe': Globe,
    'Cpu': Cpu,
    'Zap': Zap,
    'Code': Code,
    'BarChart': BarChart3,
    'Lock': Lock,
    'Terminal': Terminal,
    'Database': Database,
    'Activity': Activity,
    'Briefcase': Briefcase,
    'GraduationCap': GraduationCap,
    'Star': Star,
    'Search': Search,
    'Server': Server,
    'FileText': FileText,
    'MessageSquare': MessageSquare,
    'Layout': Layout,
    'Network': Network,
    'Container': Container,
    'Binary': Binary,
    'ShieldAlert': ShieldAlert,
    'PieChart': PieChart,
    'TrendingUp': TrendingUp,
    'Compass': Compass,
    'Repeat': Repeat,
    'Users': Users,
    'Rocket': Rocket,
    'ShoppingBag': ShoppingBag,
    'Key': Key,
    'Award': Award,
    'LayoutGrid': LayoutGrid,
    'TableProperties': TableProperties,
    'ListOrdered': ListOrdered
  };
  const Icon = icons[name] || Cloud;
  return <Icon className={className} />;
};

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
            { name: 'Oracle Cloud', color: '#F80000', label: 'OCI', size: 7 },
            { name: 'CompTIA Aligned', color: '#00aeef', label: 'TIA', size: 6 },
            { name: 'IASA Global', color: '#7c3aed', label: 'IASA', size: 6 }
          ].map((logo) => (
            <span key={logo.name} className="flex items-center gap-1.5 sm:gap-2 opacity-40 hover:opacity-75 transition-opacity font-syne font-bold text-[11px] sm:text-[13px] text-text-custom whitespace-nowrap">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <rect width="20" height="20" rx="4" fill={logo.color} opacity="0.8"/>
                <text x="4" y="15" fontSize={logo.size} fill="white" fontWeight="bold">{logo.label}</text>
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
  price_sub: string;
  icon: string;
  accent: string;
  num: string;
  track?: string;
  level?: string;
  nqf_level?: string;
}

export function Programs({ onOpenModal, editMode, isHomePage, initialFilterLevel }: { onOpenModal: (id: string) => void, editMode?: boolean, isHomePage?: boolean, initialFilterLevel?: string }) {
  const navigate = useNavigate();
  const isCurrentLevelPage = !!initialFilterLevel;
  const [viewMode, setViewMode] = useState<'grid' | 'matrix' | 'accordion'>(initialFilterLevel ? 'accordion' : 'accordion');
  const [activeLevel, setActiveLevel] = useState(initialFilterLevel?.toLowerCase() || 'all');
  const [activeTrack, setActiveTrack] = useState('all');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'loading'>('loading');
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
    async function fetchData() {
      try {
        const { data: pData, error: pError } = await supabase
          .from('programs')
          .select('*')
          .order('id', { ascending: true });

        if (pError) throw pError;
        
        const { data: mData, error: mError } = await supabase
          .from('modules')
          .select('*, lessons (*), courses (title)')
          .order('order_index', { ascending: true });

        if (pData && pData.length > 0) {
          setPrograms(pData);
          setDbStatus('connected');
        } else {
          setPrograms(defaultPrograms);
          setDbStatus('error');
        }

        if (mData) {
          setModules(mData);
        }
      } catch (err) {
        console.error('Error fetching curriculum data:', err);
        setPrograms(defaultPrograms);
        setDbStatus('error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
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
      id: '1', cat: 'foundation', title: 'Cloud Engineering & Infrastructure', accent: 'var(--emerald)', num: '01', icon: '🚀',
      description: 'The foundation of modern business. Master AWS, Azure, and Linux infrastructure to build, scale, and manage global cloud systems.',
      duration: '6 Months', meta: 'Foundation Track', mode: 'Blended / In-person', certs: 'AWS CCP · Azure AZ-900', price: 'Enquire', price_sub: '/ Scholarship Available'
    },
    {
      id: '2', cat: 'professional', title: 'Cyber Security & Digital Trust', accent: 'var(--sky)', num: '02', icon: '🛡️',
      description: 'Defend the digital frontier. Learn ethical hacking, security operations, and digital forensics to protect enterprise assets.',
      duration: '4 Months', meta: 'Professional Track', mode: 'Hybrid', certs: 'Security+ · CEH · AZ-500', price: 'Enquire', price_sub: '/ Professional'
    },
    {
      id: '3', cat: 'professional', title: 'Data Science & Artificial Intelligence', accent: 'var(--violet)', num: '03', icon: '🧠',
      description: 'Harness the power of data. From Python essentials to deploying production-grade AI models and generative intelligence.',
      duration: '5 Months', meta: 'Professional Track', mode: 'Online / Cohort', certs: 'TensorFlow · SageMaker', price: 'Enquire', price_sub: '/ Professional'
    },
    {
      id: '4', cat: 'professional', title: 'Software Engineering & Full Stack Dev', accent: 'var(--gold)', num: '04', icon: '💻',
      description: 'Build the applications of tomorrow. Master React, Node.js, and modern DevOps practices to deliver high-performance software.',
      duration: '6 Months', meta: 'Professional Track', mode: 'In-person / Hybrid', certs: 'Full Stack Diploma', price: 'Enquire', price_sub: '/ Professional'
    },
    {
      id: '5', cat: 'executive', title: 'Digital Leadership & Strategy', accent: 'var(--coral)', num: '05', icon: '📊',
      description: 'Lead the digital transformation. Strategy, ROI frameworks, and ethical governance for senior professionals and executives.',
      duration: '8 Weeks', meta: 'Executive Track', mode: 'In-person / Weekend', certs: 'GDA Executive Cert', price: 'Enquire', price_sub: '/ Executive'
    },
    {
      id: '6', cat: 'foundation', title: 'Advanced Networking & Connectivity', accent: 'var(--sky)', num: '06', icon: '🌐',
      description: 'The backbone of the internet. Master enterprise networking, 5G architectures, and software-defined WAN systems.',
      duration: '4 Months', meta: 'Foundation Track', mode: 'In-person', certs: 'CCNA · Network+', price: 'Enquire', price_sub: '/ ZAR'
    },
    {
      id: '7', cat: 'foundation', title: 'Creative Media & UI/UX Design', accent: 'var(--gold)', num: '07', icon: '🎨',
      description: 'Design with purpose. From visual identity to user experience and interface design for global digital products.',
      duration: '3 Months', meta: 'Foundation Track', mode: 'Blended', certs: 'UI/UX Portfolio Cert', price: 'Enquire', price_sub: '/ ZAR'
    }
  ];

  const tracks = isHomePage 
    ? ['Cloud Computing'] 
    : [
    'Cloud Computing', 
    'AI & Machine Learning', 
    'Cybersecurity', 
    'Data & Analytics', 
    'Digital Transformation', 
    'Software & DevOps', 
    'Digital Business'
  ];
  const levels = ['Foundation', 'Associate', 'Professional', 'Enterprise'];

  const filteredPrograms = programs.filter(p => {
    const matchesLevel = activeLevel === 'all' || p.level?.toLowerCase() === activeLevel.toLowerCase() || p.cat?.toLowerCase() === activeLevel.toLowerCase();
    const matchesTrack = activeTrack === 'all' || p.track === activeTrack;
    return matchesLevel && matchesTrack;
  });

  // Intelligence Metrics for HUD
  const stats = {
    total: programs.length,
    activeTracks: tracks.length,
    byLevel: levels.reduce((acc, lvl) => {
      acc[lvl] = programs.filter(p => p.level?.toLowerCase() === lvl.toLowerCase() || p.cat?.toLowerCase() === lvl.toLowerCase()).length;
      return acc;
    }, {} as Record<string, number>),
    byTrack: tracks.reduce((acc, tr) => {
      acc[tr] = programs.filter(p => p.track === tr).length;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <section id="programs" className="bg-bg relative">
      {isHomePage ? (
        <div className="relative w-[100vw] ml-[calc(-50vw+50%)] py-20 bg-surface/10 border-y border-border-custom overflow-hidden">
          {/* Ambient Background Accents */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-14 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="font-dm-mono text-[10px] text-gold uppercase tracking-[0.2em] mb-4 block">The Flagship Pathway</span>
              <h3 className="text-4xl md:text-5xl font-syne font-bold text-text-custom mb-6 tracking-tight">Journey from Novice to Architect</h3>
              <p className="text-text-soft text-sm md:text-base leading-relaxed">
                Experience the {tracks[0]} track. Follow the progression line to see how your career will evolve at every step of the Ginashe curriculum—designed with precision for true industry impact.
              </p>
            </div>

            {/* The Timeline Visualization */}
            <div className="relative mt-20 mb-16">
              {/* Connecting Line */}
              <div className="absolute top-[80px] left-0 w-full h-[2px] bg-gradient-to-r from-surface via-gold/50 to-emerald/50 hidden lg:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { 
                    lvl: 'Foundation', 
                    title: 'Digital Core Pathway', 
                    icon: 'Rocket', 
                    tag: 'Institutional Gateway',
                    desc: 'The official entry point to the Ginashe matrix. Master the fundamental architecture of infrastructure, networking, and digital trust to anchor your global career.'
                  },
                  { 
                    lvl: 'Associate', 
                    title: 'Practitioner Specialisation', 
                    icon: 'Layers', 
                    tag: 'Mid-Level Professional',
                    desc: 'Mid-career evolution. Transition from fundamentals to specialist implementation, mastering technical integration and advanced system paradigms.'
                  },
                  { 
                    lvl: 'Professional', 
                    title: 'Solutions Architecture Residency', 
                    icon: 'Award', 
                    tag: 'Expert Practitioner',
                    desc: 'High-performance mastery. Command the full stack with architectural precision and strategic infrastructure design, co-led by industry practitioners.'
                  },
                  { 
                    lvl: 'Enterprise', 
                    title: 'Global Architecture Fellowship', 
                    icon: 'Globe', 
                    tag: 'Strategic Executive',
                    desc: 'Strategic world-class leadership. Design and govern global-scale digital transformation with multi-cloud strategy and enterprise-grade resilience.'
                  }
                ].map((item, index) => {
                  return (
                    <div 
                      key={item.lvl} 
                      className="relative group cursor-pointer h-full"
                      onClick={() => navigate(`/levels/${item.lvl.toLowerCase()}`)}
                    >
                      {/* Timeline Node (Dot) */}
                      <div className="absolute top-[80px] left-1/2 w-4 h-4 rounded-full bg-bg border-2 border-gold -translate-x-1/2 -translate-y-1/2 hidden lg:block group-hover:bg-gold group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all z-20 duration-300" />
                      
                      {/* Card */}
                      <div className="bg-card/40 backdrop-blur-xl border border-border-custom rounded-2xl p-6 lg:mt-6 hover:bg-card hover:border-gold/30 transition-all duration-300 transform group-hover:-translate-y-2 h-[380px] flex flex-col justify-between shadow-lg hover:shadow-gold/5 relative overflow-hidden group">
                        {/* Inner Gradient Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex-1 flex flex-col items-center">
                          <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-surface/50 border border-border-custom flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-300 relative">
                              <LucideIcon name={item.icon} className="w-8 h-8" />
                              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center font-bold text-[10px] font-dm-mono">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <span className="font-dm-mono text-[9px] text-gold uppercase tracking-[0.2em] mb-2 block">{item.lvl} Level</span>
                            <h4 className="text-xl font-syne font-extrabold text-text-custom leading-tight group-hover:text-gold transition-colors">{item.title}</h4>
                          </div>

                          <p className="text-[11px] text-text-soft leading-relaxed line-clamp-4 mb-6 text-center flex-1">
                            {item.desc}
                          </p>
                        </div>
                        
                        <div className="relative z-10 pt-4 border-t border-border-custom/50 flex flex-col gap-2 mt-auto text-center">
                          <div className="font-dm-mono text-[8px] uppercase tracking-wider text-emerald font-bold">
                            {item.tag}
                          </div>
                          <span className="text-[10px] text-gold flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-all duration-300 font-bold tracking-widest mt-1">
                            EXPLORE PATHWAY →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 text-center">
              <button
                onClick={() => navigate('/curriculum')}
                className="bg-gold text-black font-syne font-bold px-8 py-4 rounded hover:bg-white transition-all uppercase tracking-widest text-xs inline-flex items-center gap-3 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              >
                View Full 28-Course Matrix
                <LucideIcon name="ArrowRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto pt-12 pb-8">
        {/* Header: Title and Horizontal Institutional Command Center */}
        <div className="flex flex-col gap-8 mb-6 px-4">
          <div className="max-w-4xl px-4 md:px-0">
            <span className="font-dm-mono text-[10px] text-gold uppercase tracking-widest mb-2 block">Institutional Curriculum {initialFilterLevel ? 'Pathway' : 'Matrix'}</span>
            <h2 className="font-syne font-extrabold text-4xl mb-3 text-white leading-tight">
              {initialFilterLevel ? `${initialFilterLevel} Specialisation.` : 'Rigorous pathways.'}<br />
              <span className="text-gold">{initialFilterLevel ? 'Command the stack.' : 'Real-world outcomes.'}</span>
            </h2>
            <p className="text-text-soft text-base md:text-lg leading-relaxed opacity-80">
              {initialFilterLevel 
                ? `Focusing strictly on the ${initialFilterLevel} modules. These pathways are designed for specific institutional resonance and high-performance outcomes.`
                : 'Every programme is co-designed with industry, built on cloud-vendor curricula, and delivered by practitioners who have solved the problems you’ll face.'
              }
            </p>
          </div>
          
          {/* Unified Horizontal Control Deck */}
          {!initialFilterLevel && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 border-t border-white/5 pt-4">
              {/* Box 1: Level Filters */}
              <div className="flex flex-col gap-2">
                <span className="font-dm-mono text-[8px] text-white/40 uppercase tracking-[0.4em]">Intelligence Matrix Filters — Institutional Level</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveLevel('all')}
                    className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${activeLevel === 'all' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'}`}
                  >
                    All
                  </button>
                  {levels.map(lvl => {
                    const emoji = lvl === 'Foundation' ? '🚀' : lvl === 'Associate' ? '⚡' : lvl === 'Professional' ? '🛡️' : lvl === 'Enterprise' ? '🌍' : '';
                    return (
                      <button 
                        key={lvl}
                        onClick={() => setActiveLevel(lvl.toLowerCase())}
                        className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeLevel === lvl.toLowerCase() ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'}`}
                      >
                        <span>{emoji}</span>
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: View Toggles */}
              <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'text-gold' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'grid' ? 'border-gold bg-gold/10' : 'border-white/10'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Grid</span>
                </button>

                <button 
                  onClick={() => setViewMode('matrix')}
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'matrix' ? 'text-gold' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'matrix' ? 'border-gold bg-gold/10' : 'border-white/10'}`}>
                    <TableProperties className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Matrix</span>
                </button>

                <button 
                  onClick={() => setViewMode('accordion')}
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'accordion' ? 'text-gold' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'accordion' ? 'border-gold bg-gold/10' : 'border-white/10'}`}>
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Syllabus</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Track Filters Row */}
        {!initialFilterLevel && (
          <div className="px-4 mt-2 pb-4 border-b border-white/5 transition-opacity opacity-100">
             <div className="flex items-center gap-4 mb-2">
               <span className="font-dm-mono text-[7px] text-white/20 uppercase tracking-[0.4em] whitespace-nowrap">Specialisation Track Matrix</span>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
             </div>
             <div className="flex flex-wrap gap-2 lg:gap-3">
               <button 
                 onClick={() => setActiveTrack('all')}
                 className={`px-4 py-2 rounded-md border font-dm-mono text-[9px] uppercase tracking-wider transition-all ${activeTrack === 'all' ? 'bg-gold/10 text-gold border-gold/40 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'bg-white/[0.02] border-white/5 text-text-dim hover:border-white/10'}`}
               >
                 Universal
               </button>
               {tracks.map(track => (
                 <button 
                   key={track}
                   onClick={() => setActiveTrack(track)}
                   className={`px-4 py-2 rounded-md border font-dm-mono text-[9px] uppercase tracking-wider transition-all ${activeTrack === track ? 'bg-gold/10 text-gold border-gold/40 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'bg-white/[0.02] border-white/5 text-text-dim hover:border-white/10'}`}
                 >
                   {track}
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Edit Button for Admin */}
        {!initialFilterLevel && editMode && (
          <div className="flex justify-end mb-6 px-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-gold text-black font-syne font-bold px-8 py-4 rounded-lg hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              <LucideIcon name="Rocket" className="w-5 h-5" />
              <span>Inject New Curriculum Module</span>
            </button>
          </div>
        )}

        {(viewMode === 'accordion') ? (
          /* High-Fidelity Accordion Syllabus View with Independent Levels Overhaul */
          <div className="mt-8 space-y-6 px-4 max-w-7xl mx-auto">
             {tracks.filter(t => activeTrack === 'all' || activeTrack === t).map(trackName => {
               const trackPrograms = programs.filter(p => p.track === trackName);
               if (trackPrograms.length === 0) return null;

               return (
                 <div key={trackName} className="space-y-6 animate-fadeIn">
                   {/* Track Header */}
                   <div className="flex items-center gap-6 py-6 border-b border-white/5">
                     <div className="flex flex-col">
                       <span className="font-dm-mono text-[9px] text-gold uppercase tracking-[0.4em] mb-1">Track Dimension</span>
                       <h3 className="font-syne font-extrabold text-2xl text-white uppercase tracking-tight">{trackName}</h3>
                     </div>
                     <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                   </div>

                   <div className={isCurrentLevelPage ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" : "grid gap-4"}>
                     {trackPrograms.map(program => {
                        const isCurrentProgram = isCurrentLevelPage && program.level?.toLowerCase() === initialFilterLevel?.toLowerCase();
                        const isFaint = isCurrentLevelPage && !isCurrentProgram;
                        
                        const handleFaintClick = () => {
                          if (isFaint) {
                            navigate(`/levels/${program.level?.toLowerCase()}`);
                          }
                        };

                        return (
                        <div 
                          key={program.id} 
                          onClick={() => isFaint ? handleFaintClick() : isCurrentLevelPage ? onOpenModal(program.id) : setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                          className={`
                            group rounded-3xl border transition-all duration-700 overflow-hidden relative
                            ${expandedProgram === program.id ? 'bg-[#0A0C10] border-gold/40 shadow-[0_30px_100px_rgba(0,0,0,0.8)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}
                            ${isCurrentLevelPage && isCurrentProgram ? 'scale-[1.03] border-gold/40 bg-gold/[0.03] shadow-[0_0_50px_rgba(255,215,0,0.15)] ring-1 ring-gold/20' : ''}
                            ${isCurrentLevelPage && isFaint ? 'opacity-25 grayscale blur-[1.2px] hover:opacity-100 hover:grayscale-0 hover:blur-0 hover:scale-[1.02] hover:z-20 transition-all cursor-pointer' : 'cursor-pointer'}
                          `}
                        >
                          {/* Intelligent Hover Warning (Only for Fainted Cards on Levels Page) */}
                          {isCurrentLevelPage && isFaint && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              className="absolute inset-x-4 top-4 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <div className="bg-gold p-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                                  <LucideIcon name="ShieldAlert" className="text-black w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-syne font-black uppercase text-black leading-none mb-1">Pathway Switch</span>
                                  <span className="text-[9px] text-black/70 font-medium leading-tight">Clicking will shift your focus to the dedicated {program.level} syllabus.</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          {/* Animated Intelligence Metrics (Repositioned for 4-Column Grid) */}
                          {isCurrentLevelPage && isCurrentProgram && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute inset-x-4 bottom-4 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 p-4 bg-black/95 border border-gold/30 rounded-xl backdrop-blur-xl shadow-2xl"
                            >
                              <div className="font-dm-mono text-[8px] text-gold uppercase tracking-widest border-b border-gold/20 pb-1 mb-1">Intelligence Insights</div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <span className="text-[7px] text-white/40 uppercase">Avg. Entry</span>
                                  <span className="text-[10px] font-bold text-white">R18k - R25k</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[7px] text-white/40 uppercase">Demand</span>
                                  <span className="text-[9px] text-emerald font-bold uppercase tracking-tighter">High Tier</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Header: Core Info */}
                          <div 
                            className={`p-4 md:p-6 flex flex-col justify-between gap-6 relative ${isCurrentLevelPage ? 'min-h-[280px] text-center items-center' : 'md:flex-row items-start md:items-center'}`}
                          >
                            {/* Hover Glow Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 to-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className={`flex items-center gap-6 relative z-10 ${isCurrentLevelPage ? 'flex-col' : 'flex-1'}`}>
                              <div className={`w-16 h-16 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500 shadow-2xl relative overflow-hidden ${isCurrentLevelPage ? 'mx-auto' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                                <LucideIcon name={program.icon} className="w-8 h-8 relative z-10" />
                              </div>
                              <div className={isCurrentLevelPage ? 'mt-2' : ''}>
                                <div className={`flex items-center gap-3 mb-2 ${isCurrentLevelPage ? 'justify-center' : ''}`}>
                                  <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/20 font-dm-mono text-[8px] text-gold uppercase tracking-widest">{program.level || 'Professional'} Level</span>
                                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                  <span className="font-dm-mono text-[9px] text-text-soft uppercase tracking-[0.2em]">{program.duration} intensive</span>
                                </div>
                                <h4 className={`font-syne font-extrabold text-xl text-white group-hover:text-gold transition-colors tracking-tight ${isCurrentLevelPage ? 'text-2xl' : 'md:text-2xl'}`}>{program.title}</h4>
                              </div>
                            </div>

                            <div className={`flex items-center gap-6 relative z-10 ${isCurrentLevelPage ? 'w-full justify-center border-t border-white/5 pt-4' : ''}`}>
                              <div className={`${isCurrentLevelPage ? 'hidden' : 'hidden sm:flex'} flex-col items-end`}>
                                <span className="font-dm-mono text-[8px] text-white/20 uppercase tracking-[0.4em] mb-1">Primary Credential</span>
                                <span className="text-[10px] text-white font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{program.certs?.split('·')[0] || 'GDA Cert'}</span>
                              </div>
                              <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${expandedProgram === program.id ? 'rotate-180 bg-gold border-transparent shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'border-white/10 group-hover:border-white/30 group-hover:bg-white/5'} ${isCurrentLevelPage ? 'mx-auto' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={expandedProgram === program.id ? 'text-black' : 'text-white'}>
                                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Body: Syllabus and Phases */}
                          {expandedProgram === program.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="border-t border-white/5 p-4 md:p-8 bg-black/60"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left: Program Overview */}
                                <div className="lg:col-span-4 space-y-6">
                                  <div>
                                    <span className="font-dm-mono text-[9px] text-gold uppercase tracking-[0.4em] mb-2 block">Institutional Resonance</span>
                                    <p className="text-text-soft text-sm leading-relaxed opacity-90">{program.description}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                       <div className="flex flex-col">
                                         <span className="font-dm-mono text-[8px] text-white/20 uppercase tracking-widest mb-1">Tuition / Investment</span>
                                         <span className="text-base font-bold text-white tracking-tight">{program.price}</span>
                                       </div>
                                       <div className="flex flex-col items-end">
                                         <span className="font-dm-mono text-[8px] text-white/20 uppercase tracking-widest mb-1">Mapping</span>
                                         <span className="text-xs font-bold text-gold">{program.nqf_level || 'Credit-Ready'}</span>
                                       </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-3 pt-4">
                                    <button 
                                      onClick={() => onOpenModal('apply')}
                                      className="w-full py-4 bg-gold text-black font-syne font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(255,215,0,0.15)] active:scale-95"
                                    >
                                      Secure My Admission
                                    </button>
                                    <p className="text-center font-dm-mono text-[8px] text-white/20 uppercase tracking-widest">Limited Cohort Intake Cycle</p>
                                  </div>
                                </div>

                                {/* Right: The Phases (Syllabus) */}
                                 <div className="lg:col-span-8 space-y-6">
                                   {(() => {
                                     const programModules = modules.filter(m => {
                                       const courseTitle = m.courses?.title;
                                       return m.course_id === program.id || (courseTitle && courseTitle === program.title);
                                     });
                                     return (
                                       <>
                                         <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                           <div className="flex items-center gap-3">
                                              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                              <span className="font-dm-mono text-[9px] text-white uppercase tracking-[0.5em]">Advanced Syllabus Matrix</span>
                                           </div>
                                           <span className="font-dm-mono text-[9px] text-white/40 uppercase tracking-widest">{programModules.length || 8} Logical Modules</span>
                                         </div>
                                         
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                           {programModules.length > 0 ? (
                                              programModules.map((mod, idx) => (
                                                <div key={mod.id} className="group/mod p-2.5 rounded-lg bg-white/[0.01] border border-white/5 hover:border-gold/30 hover:bg-white/[0.03] transition-all flex flex-col gap-1.5">
                                                  <div className="flex items-center justify-between">
                                                    <div className="w-6 h-6 rounded-md bg-black/60 border border-white/10 flex items-center justify-center font-dm-mono text-[9px] text-gold/60 group-hover/mod:text-gold transition-colors">
                                                      {idx + 1}
                                                    </div>
                                                    <div className="px-1.5 py-0.5 rounded-full bg-emerald/10 border border-emerald/20 font-dm-mono text-[6px] text-emerald uppercase tracking-widest">
                                                      WK {idx * 2 + 1}-{idx * 2 + 2}
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h5 className="font-syne font-bold text-white text-[13px] tracking-tight leading-tight group-hover/mod:text-gold transition-colors">{mod.title}</h5>
                                                  </div>
                                                </div>
                                              ))
                                           ) : (
                                             /* Placeholder modules if data hasn't been injected for this course yet */
                                             [1,2,3,4].map((i) => (
                                               <div key={i} className="group/mod p-4 rounded-xl bg-white/[0.01] border border-white/5 border-dashed flex flex-col gap-3 opacity-40">
                                                 <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5" />
                                                 <div className="space-y-2">
                                                   <div className="h-1.5 w-16 bg-white/5 rounded" />
                                                   <div className="h-3 w-32 bg-white/10 rounded" />
                                                 </div>
                                               </div>
                                             ))
                                           )}
                                         </div>
                                       </>
                                     );
                                   })()}

                                  {/* Curriculum Meta */}
                                  <div className="p-4 rounded-xl bg-gold/[0.02] border border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                     <div className="flex items-center gap-3">
                                       <LucideIcon name="Shield" className="text-gold w-4 h-4" />
                                       <span className="text-[10px] text-text-soft uppercase tracking-[0.2em] font-bold">Institutional Quality Framework Integrated</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                       <span className="text-[9px] text-text-muted font-dm-mono uppercase tracking-widest">System Ready</span>
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        );
                     })}
                   </div>
                 </div>
               );
             })}
           </div>
        ) : (viewMode === 'matrix') ? (
          /* High-Fidelity Legacy Matrix View - Restored for All Pages */
          <div className="relative w-[100vw] ml-[calc(-50vw+50%)] pb-12 overflow-x-auto scrollbar-hide bg-black/20 border-t border-b border-white/10 px-4 md:px-0">
            <div className="min-w-[1240px] max-w-7xl mx-auto bg-navy border-x border-white/10 shadow-2xl relative">
              <div className="grid grid-cols-[220px_repeat(4,1fr)] border-b border-white/10 bg-black/40 sticky top-0 z-30">
                <div className="pl-8 p-3 font-dm-mono text-[9px] uppercase text-gold/60 tracking-[0.3em] border-r border-white/10 flex items-center bg-navy sticky left-0 z-40 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">Tracks</div>
                {levels.map(lvl => (
                  <div key={lvl} className="p-3 text-center border-r border-border-custom last:border-r-0 flex items-center justify-center">
                    <button 
                      onClick={() => navigate(`/levels/${lvl.toLowerCase()}`)}
                      className="font-syne font-bold text-[11px] text-text-custom hover:text-gold hover:scale-110 transition-all cursor-pointer inline-block"
                    >
                      {lvl} Level
                    </button>
                  </div>
                ))}
              </div>
              
              {tracks.map(track => (
                <div key={track} className="grid grid-cols-[220px_repeat(4,1fr)] border-b border-border-custom last:border-b-0 hover:bg-white/[0.02] transition-colors relative group/row">
                  <div className="pl-8 p-3 border-r border-border-custom bg-black/10 flex items-center sticky left-0 z-20 bg-card/95 backdrop-blur-sm shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                    <span className="font-syne font-bold text-[10px] text-text-soft uppercase tracking-wide">{track}</span>
                  </div>
                  {levels.map(lvl => {
                    const prog = programs.find(p => p.track === track && p.level === lvl);
                    return (
                      <div 
                        key={`${track}-${lvl}`} 
                        className={`p-3 last:pr-8 border-r border-white/10 last:border-r-0 min-h-[140px] flex flex-col justify-between group cursor-pointer transition-all ${
                          prog ? 'hover:bg-white/[0.02]' : 'bg-black/40'
                        }`}
                        onClick={() => prog && (isHomePage ? navigate('/curriculum') : onOpenModal(prog.id))}
                      >
                        {prog ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-dm-mono text-[7px] text-gold uppercase tracking-tighter">
                                  {sanitizeAccreditation(prog.nqf_level || 'Institutional Credit')}
                                </div>
                                {prog.nqf_level && (
                                  <div className="w-1 h-1 rounded-full bg-gold/20 border border-gold/40" />
                                )}
                              </div>
                              <div className="font-syne font-bold text-[12px] text-text-custom leading-tight group-hover:text-gold transition-colors">{prog.title}</div>
                              <div className="text-[9px] text-text-dim mt-1.5 line-clamp-2 leading-relaxed opacity-60">
                                {sanitizeAccreditation(prog.description)}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-gold opacity-60 group-hover:opacity-100 transition-opacity">
                                <LucideIcon name={prog.icon} className="w-4 h-4" />
                              </span>
                              <span className="font-dm-mono text-[8px] text-text-muted group-hover:text-text-soft transition-colors tracking-widest">VIEW →</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-1.5 opacity-20">
                            <span className="font-dm-mono text-[7px] uppercase tracking-widest text-text-muted">Specialisation</span>
                            <div className="w-6 h-px bg-border-custom" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : !initialFilterLevel && viewMode === 'grid' ? (
          /* Grid View - Large Portfolio Cards */
          <div className="relative w-[100vw] ml-[calc(-50vw+50%)] border-t border-b border-border-custom bg-border-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px animate-fadeUp overflow-hidden">
              {filteredPrograms.map((prog) => (
                <div 
                  key={prog.id} 
                  className="bg-bg p-8 flex flex-col min-h-[480px] group relative hover:bg-card transition-all duration-500"
                >
                  <div className="absolute top-8 right-8 font-syne font-black text-[80px] leading-none pointer-events-none tracking-tighter text-white/[0.03] group-hover:text-gold/[0.05] transition-colors">{prog.num}</div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/20 transition-all">
                      <LucideIcon name={prog.icon} className="w-6 h-6" />
                    </div>
                    <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-gold/60">{prog.cat}</div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="font-dm-mono text-[8px] text-gold uppercase tracking-[0.2em]">
                        {sanitizeAccreditation(prog.nqf_level || 'Institutional Credit')}
                      </div>
                      {prog.nqf_level && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gold/20 border border-gold/30" title="Governance Logged" />
                      )}
                    </div>
                    <h3 className="font-syne font-bold text-2xl mb-4 group-hover:text-gold transition-colors">{prog.title}</h3>
                    <p className="text-[14px] text-text-soft leading-relaxed line-clamp-4">{sanitizeAccreditation(prog.description)}</p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border-custom">
                      <div>
                        <div className="font-dm-mono text-[8px] text-text-muted uppercase tracking-widest mb-1">Duration</div>
                        <div className="font-dm-mono text-[10px] text-text-soft">{prog.duration || '12-24 Weeks'}</div>
                      </div>
                      <div>
                        <div className="font-dm-mono text-[8px] text-text-muted uppercase tracking-widest mb-1">Track</div>
                        <div className="font-dm-mono text-[10px] text-text-soft">{prog.track}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                       <div className="font-syne font-bold text-sm">Apply for 2026</div>
                       <button 
                        onClick={() => onOpenModal(prog.id)}
                        className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all group/btn"
                      >
                         <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto px-4 md:px-0">
            {/* Roadmap View - Clean Integrated Grid */}
            <div className="space-y-24">
              {tracks
                .filter(t => activeTrack === 'all' || t === activeTrack)
                .map((track) => {
                  const trackPrograms = programs.filter(p => {
                    const trackMatch = p.track === track;
                    if (!trackMatch) return false;
                    
                    if (!initialFilterLevel) {
                      return activeLevel === 'all' || p.level.toLowerCase() === activeLevel;
                    }
                    return true;
                  });

                  if (trackPrograms.length === 0) return null;

                  return (
                    <div key={track} className="relative">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] w-12 bg-gold/30" />
                        <h3 className="font-syne font-bold text-xl uppercase tracking-tighter text-white">
                          {track} <span className="text-gold/40 ml-2 font-dm-mono text-sm tracking-widest">({trackPrograms.length})</span>
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trackPrograms.map((prog) => {
                          const isCurrentLevel = initialFilterLevel && prog.level.toLowerCase() === initialFilterLevel.toLowerCase();
                          const isFaint = initialFilterLevel && !isCurrentLevel;
                          
                          return (
                          <motion.div
                            key={prog.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onClick={() => onOpenModal(prog.id)}
                            className={`
                              border rounded-2xl p-6 transition-all duration-500 group cursor-pointer relative overflow-hidden
                              ${isCurrentLevel 
                                ? 'bg-gold/10 border-gold/60 scale-105 shadow-[0_0_30px_rgba(255,215,0,0.1)] z-10' 
                                : 'bg-white/3 border-white/10 shadow-none'
                              }
                              ${isFaint 
                                ? 'opacity-20 grayscale scale-95 hover:opacity-100 hover:grayscale-0 hover:scale-100 hover:z-20 hover:border-white/30' 
                                : 'opacity-100 grayscale-0'
                              }
                            `}
                          >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                               <LucideIcon name={prog.icon} className="w-12 h-12" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4">
                              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">{prog.num}</span>
                              <span className="font-dm-mono text-[9px] text-gold/60 uppercase tracking-[0.2em]">{prog.level}</span>
                            </div>

                            <h4 className="font-syne font-bold text-lg mb-3 text-white group-hover:text-gold transition-colors leading-tight">{prog.title}</h4>
                            <p className="text-text-dim text-[12px] leading-relaxed line-clamp-3 mb-6">
                              {sanitizeAccreditation(prog.description)}
                            </p>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                               <span className="font-dm-mono text-[9px] text-text-dim uppercase tracking-widest">{prog.duration || '12-24 Weeks'}</span>
                               <span className="font-syne font-bold text-[9px] text-gold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Explore Intel →</span>
                            </div>
                          </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      )}
    </section>
  );
}
