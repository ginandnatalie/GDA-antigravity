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
  LayoutGrid, TableProperties, ListOrdered, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, TrackData } from '../data/tracks';

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
    'ChevronDown': ChevronDown,
    'LayoutGrid': LayoutGrid,
    'TableProperties': TableProperties,
    'ListOrdered': ListOrdered
  };
  const Icon = icons[name] || Cloud;
  return <Icon className={className} />;
};

interface BrandPartner {
  slug: string | null;
  hex: string;
  accent: string;
  short: string;
  name: string;
  initials?: string;
}

const PartnerCard = ({ brand }: { brand: BrandPartner }) => {
  const [svgData, setSvgData] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!brand.slug) return;
    
    fetch(`https://cdn.jsdelivr.net/npm/simple-icons/icons/${brand.slug}.svg`)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(svg => {
        const colored = svg
          .replace(/width="[^"]*"/, '')
          .replace(/height="[^"]*"/, '')
          .replace('<svg ', `<svg fill="#${brand.hex}" width="44" height="44" `);
        setSvgData(colored);
      })
      .catch(() => setLoadError(true));
  }, [brand.slug, brand.hex]);

  const renderContent = () => {
    if (!brand.slug || loadError) {
      return (
        <div 
          className="w-11 h-11 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider"
          style={{ 
            background: `${brand.accent}18`, 
            border: `1.5px solid ${brand.accent}44`,
            color: brand.accent 
          }}
        >
          {brand.initials || brand.short}
        </div>
      );
    }

    if (!svgData) {
      return (
        <div 
          className="w-5 h-5 rounded-full border-2 border-white/10 animate-spin"
          style={{ borderTopColor: brand.accent }}
        />
      );
    }

    return <div dangerouslySetInnerHTML={{ __html: svgData }} />;
  };

  return (
    <div className="flex-1 min-w-[110px] max-w-[140px] group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1">
      <div 
        className="absolute top-2 right-2 w-1 h-1 rounded-full opacity-40 shadow-[0_0_8px_currentColor]"
        style={{ color: brand.accent, backgroundColor: 'currentColor' }}
      />
      
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
        {renderContent()}
      </div>

      <div className="space-y-0.5 text-center">
        <p className="text-[11px] font-bold tracking-wide transition-colors" style={{ color: brand.accent }}>
          {brand.short}
        </p>
        <p className="text-[8px] leading-tight text-white/40 font-medium uppercase tracking-widest whitespace-nowrap">
          {brand.name}
        </p>
      </div>
    </div>
  );
};

export const TrustBar = () => {
  const brands: BrandPartner[] = [
    { slug: 'amazonaws',      hex: 'FF9900', accent: '#FF9900', short: 'AWS',          name: 'Amazon Web Services' },
    { slug: 'microsoftazure', hex: '0078D4', accent: '#0078D4', short: 'Azure',        name: 'Microsoft Azure'     },
    { slug: 'googlecloud',    hex: '4285F4', accent: '#4285F4', short: 'Google Cloud', name: 'Google Cloud'        },
    { slug: 'oracle',         hex: 'F80000', accent: '#F80000', short: 'Oracle',       name: 'Oracle'              },
    { slug: 'comptia',        hex: 'C8202F', accent: '#C8202F', short: 'CompTIA',      name: 'CompTIA'             },
    { slug: null,             hex: '00F2FF', accent: '#00F2FF', short: 'IASA',         name: 'IASA Global', initials: 'IASA' },
  ];

  return (
    <div className="py-12">
      <div className="flex flex-col items-center gap-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 group/bar">
        <div className="flex flex-col items-center">
          <div className="section-label justify-center">
            Curriculum Aligned To
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 w-full max-w-5xl px-4">
          {brands.map((brand, idx) => (
            <PartnerCard key={brand.short + idx} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>('cloud-computing'); // Default to first track for high-impact load
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
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
      id: '4', cat: 'professional', title: 'Software Engineering & Full Stack Dev', accent: 'var(--brand)', num: '04', icon: '💻',
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
      id: '7', cat: 'foundation', title: 'Creative Media & UI/UX Design', accent: 'var(--brand)', num: '07', icon: '🎨',
      description: 'Design with purpose. From visual identity to user experience and interface design for global digital products.',
      duration: '3 Months', meta: 'Foundation Track', mode: 'Blended', certs: 'UI/UX Portfolio Cert', price: 'Enquire', price_sub: '/ ZAR'
    }
  ];

  const tracks = [
    'Cloud Computing', 
    'AI & Machine Learning', 
    'Cybersecurity', 
    'Data & Analytics', 
    'Digital Transformation', 
    'Software & DevOps', 
    'Digital Business'
  ];
  const levels = [
    '01: Technical Core', 
    '02: Specialisation', 
    '03: Solutions Mastery', 
    '04: Global Leadership'
  ];

  const getTrackId = (name: string) => name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

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
        <>
          <div className="relative w-[100vw] ml-[calc(-50vw+50%)] py-20 bg-surface/10 border-y border-border-custom overflow-hidden">
          {/* Ambient Background Accents */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-14 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="font-dm-mono text-[10px] text-brand uppercase tracking-[0.4em] mb-4 block">Institutional Discovery Hub</span>
              <h3 className="text-4xl md:text-5xl font-syne font-bold text-text-custom mb-6 tracking-tight">Select Your Career Track</h3>
              <p className="text-text-soft text-sm md:text-base leading-relaxed">
              </p>
            </div>
                       {/* Ginashe Way: 4x2 Institutional Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {Object.values(TRACKS).map((track, idx) => (
                <div 
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className="group relative bg-[#0a0a0b] border border-white/5 rounded-[24px] p-6 cursor-pointer transition-all duration-500 hover:border-brand/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    {/* Icon Pill */}
                    <div className="w-14 h-24 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-3xl shadow-2xl transition-all group-hover:border-brand/30 group-hover:scale-105">
                      <span className="filter grayscale group-hover:grayscale-0 transition-all">{track.icon}</span>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-brand/10 border border-brand/20">
                          <span className="font-dm-mono text-[8px] text-brand uppercase tracking-widest font-bold">Foundation</span>
                        </div>
                        <span className="font-dm-mono text-[8px] text-text-dim uppercase tracking-widest">12 Weeks</span>
                      </div>

                      {/* Command Title */}
                      <h4 className="font-syne font-black text-xl text-text-custom leading-tight group-hover:text-white transition-colors">
                        {track.title}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}

              {/* Box 8: Filler - Strategic Custom Enterprise */}
              <div 
                className="group relative bg-[#0a0a0b]/40 border border-white/5 border-dashed rounded-[24px] p-6 cursor-pointer transition-all duration-500 hover:border-brand/40 flex items-center justify-center text-center opacity-60 hover:opacity-100"
              >
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:border-brand/30">
                     <LucideIcon name="Layers" className="w-5 h-5 text-text-dim group-hover:text-brand" />
                   </div>
                   <h4 className="font-syne font-bold text-sm text-text-dim uppercase tracking-widest group-hover:text-white transition-colors">
                     Institutional<br />Strategic Design
                   </h4>
                   <p className="text-[9px] text-text-dim/60 font-dm-mono mt-2 uppercase tracking-widest">Custom Enterprise Pathways</p>
                </div>
              </div>
            </div>

            {/* Track Master Modal: Full-Screen Deep Dive */}
            <AnimatePresence>
              {selectedTrackId && (
                <div 
                  className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-12 overflow-hidden"
                  onClick={() => setSelectedTrackId(null)}
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
                  />
                  
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-7xl max-h-full bg-card/40 border border-white/10 rounded-[40px] shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Close Button */}
                    <button 
                      onClick={() => setSelectedTrackId(null)}
                      className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand hover:border-brand transition-all"
                    >
                      ✕
                    </button>

                    {/* Left Panel: High-Impact Visuals */}
                    <div className="w-full md:w-[400px] h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                       <img 
                        src={TRACKS[selectedTrackId].heroImage} 
                        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                        alt={TRACKS[selectedTrackId].title}
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent hidden md:block" />
                       <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent md:hidden" />
                       
                       <div className="absolute bottom-12 left-12 right-12 z-10">
                          <div className="w-20 h-20 rounded-2xl bg-black/60 border border-brand/40 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                            {TRACKS[selectedTrackId].icon}
                          </div>
                          <span className="font-dm-mono text-[10px] text-brand uppercase tracking-[0.6em] mb-3 block">Institutional Dimension</span>
                          <h2 className="font-syne font-black text-4xl text-white tracking-tighter uppercase leading-none">
                            {TRACKS[selectedTrackId].title}
                          </h2>
                       </div>
                    </div>

                    {/* Right Panel: Content Viewport */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-20 md:pl-28">
                       <div className="max-w-3xl space-y-16">
                          <div className="space-y-6">
                            <span className="font-dm-mono text-[10px] text-white/20 uppercase tracking-[0.5em] block">Institutional Mission</span>
                            <p className="text-2xl md:text-3xl text-text-soft font-outfit leading-snug">
                              {TRACKS[selectedTrackId].mission}
                            </p>
                          </div>

                          {/* Tactical Roadmap Timeline */}
                          <div className="space-y-10">
                            <div className="flex items-center justify-between">
                              <span className="font-dm-mono text-[10px] text-white/20 uppercase tracking-[0.5em] block">Tactical Progression Matrix</span>
                              <div className="h-px flex-1 mx-8 bg-white/5" />
                              <span className="font-dm-mono text-[9px] text-brand uppercase tracking-widest font-bold">4 Technical Gates</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               {TRACKS[selectedTrackId].roadmap.map((step, sIdx) => (
                                 <div key={step.level} className="group/gate p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand/30 transition-all">
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm font-syne font-black text-white/40 group-hover/gate:text-brand transition-colors">
                                        0{sIdx + 1}
                                      </div>
                                      <div>
                                        <h5 className="font-syne font-bold text-lg text-white mb-2">{step.title}</h5>
                                        <p className="text-xs text-text-soft/80 leading-relaxed">{step.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                           {step.vendor_alignment.map(v => (
                                             <span key={v} className="px-2 py-0.5 rounded text-[8px] font-dm-mono bg-black/40 border border-white/10 text-text-dim uppercase tracking-widest">{v}</span>
                                           ))}
                                        </div>
                                      </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </div>

                          {/* Action Hub */}
                          <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                             <button 
                               onClick={() => (setSelectedTrackId(null), navigate(`/tracks/${selectedTrackId}`))}
                               className="flex-1 bg-brand text-black font-syne font-black text-xs uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(0,242,255,0.2)] flex items-center justify-center gap-4 group"
                             >
                               Initialize Track Authority <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                             </button>
                             <button 
                               onClick={() => setSelectedTrackId(null)}
                               className="px-12 py-6 rounded-2xl border border-white/10 font-syne font-black text-xs uppercase tracking-widest text-text-soft hover:bg-white/5 transition-all"
                             >
                               Close Master View
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/tracks')}
              className="bg-brand text-black font-syne font-bold px-8 py-4 rounded hover:bg-white transition-all uppercase tracking-widest text-xs inline-flex items-center gap-3 shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              Explore All Tracks
              <LucideIcon name="Rocket" className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/curriculum')}
              className="bg-white/5 border border-brand/40 text-brand font-syne font-bold px-8 py-4 rounded hover:bg-brand/10 transition-all uppercase tracking-widest text-xs inline-flex items-center gap-3"
            >
              View 28-Course Matrix
              <LucideIcon name="LayoutGrid" className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
      <div className="max-w-7xl mx-auto pt-12 pb-8">
        {/* Header: Title and Horizontal Institutional Command Center */}
        <div className="flex flex-col gap-8 mb-6 px-4">
          <div className="max-w-4xl px-4 md:px-0">
            <span className="font-dm-mono text-[10px] text-brand uppercase tracking-widest mb-2 block">Institutional Curriculum {initialFilterLevel ? 'Pathway' : 'Matrix'}</span>
            <h2 className="font-syne font-extrabold text-4xl mb-3 text-white leading-tight">
              {initialFilterLevel ? `${initialFilterLevel} Specialisation.` : 'Rigorous pathways.'}<br />
              <span className="text-brand">{initialFilterLevel ? 'Command the stack.' : 'Real-world outcomes.'}</span>
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
                    className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${activeLevel === 'all' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'}`}
                  >
                    All
                  </button>
                  {levels.map(lvl => {
                    const emoji = lvl.includes('01') ? '🚀' : lvl.includes('02') ? '⚡' : lvl.includes('03') ? '🛡️' : lvl.includes('04') ? '🌍' : '';
                    return (
                      <button 
                        key={lvl}
                        onClick={() => setActiveLevel(lvl.toLowerCase())}
                        className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeLevel === lvl.toLowerCase() ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'}`}
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
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'text-brand' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'grid' ? 'border-brand bg-brand/10' : 'border-white/10'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Grid</span>
                </button>

                <button 
                  onClick={() => setViewMode('matrix')}
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'matrix' ? 'text-brand' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'matrix' ? 'border-brand bg-brand/10' : 'border-white/10'}`}>
                    <TableProperties className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Matrix</span>
                </button>

                <button 
                  onClick={() => setViewMode('accordion')}
                  className={`flex items-center gap-2 font-dm-mono text-[9px] uppercase tracking-widest transition-all ${viewMode === 'accordion' ? 'text-brand' : 'text-text-dim hover:text-white opacity-50'}`}
                >
                  <div className={`w-9 h-9 rounded border flex items-center justify-center ${viewMode === 'accordion' ? 'border-brand bg-brand/10' : 'border-white/10'}`}>
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
               <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
             </div>
             <div className="flex flex-wrap gap-2 lg:gap-3">
                <button 
                  onClick={() => setActiveTrack('all')}
                  className={`px-4 py-2 rounded-md border font-dm-mono text-[9px] uppercase tracking-wider transition-all ${activeTrack === 'all' ? 'bg-brand/10 text-brand border-brand/40 shadow-[0_0_15px_rgba(0,242,255,0.05)]' : 'bg-white/[0.02] border-white/5 text-text-dim hover:border-white/10'}`}
                >
                  Universal
                </button>
                {tracks.map(track => (
                  <button 
                    key={track}
                    onClick={() => setActiveTrack(track)}
                    className={`px-4 py-2 rounded-md border font-dm-mono text-[9px] uppercase tracking-wider transition-all ${activeTrack === track ? 'bg-brand/10 text-brand border-brand/40 shadow-[0_0_15px_rgba(0,242,255,0.05)]' : 'bg-white/[0.02] border-white/5 text-text-dim hover:border-white/10'}`}
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
              className="bg-brand text-black font-syne font-bold px-8 py-4 rounded-lg hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
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
                        <span className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.4em] mb-1">Track Dimension</span>
                        <h3 
                          onClick={() => navigate(`/tracks/${getTrackId(trackName)}`)}
                          className="font-syne font-extrabold text-2xl text-white uppercase tracking-tight hover:text-brand cursor-pointer transition-colors flex items-center gap-3"
                        >
                          {trackName}
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </h3>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                      <button 
                        onClick={() => navigate(`/tracks/${getTrackId(trackName)}`)}
                        className="px-6 py-2.5 rounded-full border border-white/10 font-syne font-black uppercase text-[10px] tracking-widest text-text-soft hover:bg-white hover:text-navy transition-all"
                      >
                        Explore Full Track
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                      {trackPrograms.map(program => {
                        return (
                        <div 
                          key={program.id} 
                          onClick={() => onOpenModal(program.id)}
                          className={`
                            group rounded-3xl border transition-all duration-700 overflow-hidden relative
                            ${expandedProgram === program.id ? 'bg-bg border-brand/40 shadow-[0_30px_100px_rgba(0,0,0,0.8)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}
                          `}
                        >
                          {/* Header: Core Info */}
                          <div className="p-4 md:p-6 flex flex-col justify-between gap-6 relative">
                            {/* Hover Glow Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand/0 to-brand/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex items-center gap-6 relative z-10 flex-1">
                              <div className="w-16 h-16 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-brand/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                                <LucideIcon name={program.icon} className="w-8 h-8 relative z-10" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 font-dm-mono text-[8px] text-brand uppercase tracking-widest">{program.level || 'Professional'} Level</span>
                                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                  <span className="font-dm-mono text-[9px] text-text-soft uppercase tracking-[0.2em]">{program.duration} intensive</span>
                                </div>
                                <h4 className="font-syne font-extrabold text-xl text-white group-hover:text-brand transition-colors tracking-tight">{program.title}</h4>
                              </div>
                            </div>
                          </div>
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
                <div className="pl-8 p-3 font-dm-mono text-[9px] uppercase text-brand/60 tracking-[0.3em] border-r border-white/10 flex items-center bg-navy sticky left-0 z-40 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">Tracks</div>
                {levels.map(lvl => (
                  <div key={lvl} className="p-3 text-center border-r border-border-custom last:border-r-0 flex items-center justify-center">
                    <span className="font-syne font-bold text-[10px] text-white uppercase tracking-tighter leading-tight">{lvl}</span>
                  </div>
                ))}
              </div>
              
              {/* Rows */}
              {tracks.map(track => (
                <div key={track} className="grid grid-cols-[220px_repeat(4,1fr)] border-b border-white/[0.05] group">
                  <div className="pl-8 p-6 flex flex-col justify-center border-r border-white/10 bg-navy sticky left-0 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                    <span 
                      onClick={() => navigate(`/tracks/${getTrackId(track)}`)}
                      className="font-syne font-black text-[13px] text-white uppercase tracking-tighter group-hover:text-brand cursor-pointer transition-colors"
                    >
                      {track}
                    </span>
                  </div>
                  {levels.map(lvl => {
                    const stageKey = lvl.split(':')[0].trim(); // e.g. "01"
                    const levelMap: Record<string, string> = {
                      '01': 'Foundation',
                      '02': 'Associate',
                      '03': 'Professional',
                      '04': 'Enterprise'
                    };
                    const levelName = levelMap[stageKey];
                    const prog = programs.find(p => p.track === track && p.level === levelName);
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
                                <div className="font-dm-mono text-[7px] text-brand uppercase tracking-tighter">
                                  {sanitizeAccreditation(prog.nqf_level || 'Institutional Credit')}
                                </div>
                                {prog.nqf_level && (
                                  <div className="w-1 h-1 rounded-full bg-brand/20 border border-brand/40" />
                                )}
                              </div>
                              <div className="font-syne font-bold text-[12px] text-text-custom leading-tight group-hover:text-brand transition-colors">{prog.title}</div>
                              <div className="text-[9px] text-text-dim mt-1.5 line-clamp-2 leading-relaxed opacity-60">
                                {sanitizeAccreditation(prog.description)}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-brand opacity-60 group-hover:opacity-100 transition-opacity">
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
                  <div className="absolute top-8 right-8 font-syne font-black text-[80px] leading-none pointer-events-none tracking-tighter text-white/[0.03] group-hover:text-brand/[0.05] transition-colors">{prog.num}</div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand group-hover:bg-brand/10 group-hover:border-brand/20 transition-all">
                      <LucideIcon name={prog.icon} className="w-6 h-6" />
                    </div>
                    <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-brand/60">{prog.cat}</div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="font-dm-mono text-[8px] text-brand uppercase tracking-[0.2em]">
                        {sanitizeAccreditation(prog.nqf_level || 'Institutional Credit')}
                      </div>
                      {prog.nqf_level && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand/20 border border-brand/30" title="Governance Logged" />
                      )}
                    </div>
                    <h3 className="font-syne font-bold text-2xl mb-4 group-hover:text-brand transition-colors">{prog.title}</h3>
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
                        className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-brand hover:border-brand hover:text-black transition-all group/btn"
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
                        <div className="h-[1px] w-12 bg-brand/30" />
                        <h3 className="font-syne font-bold text-xl uppercase tracking-tighter text-white">
                          {track} <span className="text-brand/40 ml-2 font-dm-mono text-sm tracking-widest">({trackPrograms.length})</span>
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
                                ? 'bg-brand/10 border-brand/60 scale-105 shadow-[0_0_30px_rgba(0,242,255,0.1)] z-10' 
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
                              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">{prog.num}</span>
                              <span className="font-dm-mono text-[9px] text-brand/60 uppercase tracking-[0.2em]">{prog.level}</span>
                            </div>

                            <h4 className="font-syne font-bold text-lg mb-3 text-white group-hover:text-brand transition-colors leading-tight">{prog.title}</h4>
                            <p className="text-text-dim text-[12px] leading-relaxed line-clamp-3 mb-6">
                              {sanitizeAccreditation(prog.description)}
                            </p>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                               <span className="font-dm-mono text-[9px] text-text-dim uppercase tracking-widest">{prog.duration || '12-24 Weeks'}</span>
                               <span className="font-syne font-bold text-[9px] text-brand uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Explore Intel →</span>
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
