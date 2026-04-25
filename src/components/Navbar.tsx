import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { 
  Sun, Moon, X, Menu, GraduationCap, ArrowRight, Instagram, Twitter, Linkedin, 
  ChevronDown, BookOpen, Briefcase, HelpCircle, CreditCard, Users, FileText, 
  Landmark, Calendar, Newspaper, Zap, Globe, Languages, CheckCircle, 
  MessageSquare, Wallet, ExternalLink, ChevronRight, Layout, Info, Phone, 
  Rocket, Shield, Cpu, Code, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  onOpenModal: (id: string) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  siteSettings?: any;
}

export default function Navbar({ onOpenModal, editMode, setEditMode, siteSettings }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || user?.email?.includes('ginashe.co.za');
  const isSuperAdmin = profile?.role === 'super_admin' || user?.email === 'ginandNatalie@gmail.com' || user?.email === 'academy@ginashe.co.za';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveAll = () => {
    setIsSaving(true);
    window.dispatchEvent(new CustomEvent('save-site-content'));
    setTimeout(() => setIsSaving(false), 1500);
  };

  // Primary Navigation
  const navItems = [
    { label: 'Career Tracks', path: '/tracks', hasMega: true },
    { label: 'Institutional Matrix', path: '/curriculum', hasMega: true },
    { label: 'Admissions', path: '/admissions', hasMega: true },
    { label: 'About GDA', path: '/about', hasMega: false },
    { label: 'Discover', path: '#', hasMega: true },
  ];

  // Discover Nested Items
  const discoverItems = [
    { label: 'The Faculty', path: '/faculty', icon: <Users className="w-4 h-4" />, desc: 'World-class practitioner lead' },
    { label: 'News & Insights', path: '/news', icon: <Newspaper className="w-4 h-4" />, desc: 'Weekly tech trends & articles' },
    { label: 'Upcoming Events', path: '/events', icon: <Calendar className="w-4 h-4" />, desc: 'Join our next masterclass' },
    { label: 'Founder Empowerment', path: '/foundership', icon: <Rocket className="w-4 h-4" />, desc: 'Architect your own digital destiny' },
    { label: 'Support Centre', path: '/contact', icon: <MessageSquare className="w-4 h-4" />, desc: 'Get in touch with GDA' },
  ];

  return (
    <nav id="nav" className={`fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-8 transition-all duration-500 ${isScrolled ? 'mt-2' : 'mt-5'}`}>
      {/* Main Navbar Bar */}
      <div className={`mx-auto max-w-7xl relative z-[2001] h-[72px] flex items-center px-6 rounded-2xl transition-all duration-700 border ${
        isScrolled 
          ? 'bg-[#0b0e14]/95 backdrop-blur-3xl border-brand/30 shadow-[0_20px_60px_rgba(0,242,255,0.15)] scale-[0.99]' 
          : 'bg-white/95 backdrop-blur-3xl border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.1)]'
      }`}>
        
        {/* --- LOGO --- */}
        <Link to="/" className="no-underline shrink-0 group" onClick={() => setActiveDropdown(null)}>
          <Logo variant={isScrolled ? 'dark' : 'light'} />
        </Link>

        {/* --- MAIN NAVIGATION --- */}
        <ul className="hidden lg:flex items-center list-none mx-auto gap-1">
          {navItems.map((item) => (
            <li 
              key={item.label} 
              className="relative"
              onMouseEnter={() => item.hasMega && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={item.path}
                onClick={() => setActiveDropdown(null)}
                className={`inline-flex items-center gap-1.5 font-outfit font-bold text-[14px] tracking-wide no-underline px-5 py-2.5 rounded-xl transition-all ${
                  pathname === item.path 
                    ? (isScrolled ? 'text-brand bg-brand/10' : 'bg-navy text-white shadow-lg shadow-navy/20') 
                    : (isScrolled ? 'text-text-soft hover:text-white hover:bg-white/5' : 'text-navy/60 hover:text-navy hover:bg-black/5')
                }`}
              >
                {item.label}
                {item.hasMega && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activeDropdown === item.label ? 'rotate-180 text-brand' : (isScrolled ? 'text-text-muted' : 'text-navy/30')}`} />}
              </Link>

              {/* RICH MEGA MENUS */}
              <AnimatePresence>
                {activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.97 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[860px] z-[2100]"
                  >
                    <div className="bg-[#0b0e14] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                      
                      {/* Career Tracks Mega Menu */}
                      {item.label === 'Career Tracks' && (
                        <div className="flex divide-x divide-white/5 h-[380px]">
                          {/* Panel A: The Tracks Grid (Left 60%) */}
                          <div className="flex-[1.5] p-6 pr-8">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand rounded-full" />
                                <div>
                                  <h4 className="font-syne font-black text-sm text-white uppercase tracking-wider">Strategic Career Pathways</h4>
                                  <p className="font-dm-mono text-[8px] text-text-dim uppercase tracking-[0.2em] mt-0.5">Industry Aligned // Global Outcomes</p>
                                </div>
                              </div>
                              <span className="font-dm-mono text-[9px] text-brand/60 uppercase tracking-widest bg-brand/5 px-2 py-1 rounded border border-brand/10">Velocity_Sync</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { title: 'Cloud Computing', desc: 'Architecture & Infrastructure', icon: <Cpu className="w-5 h-5 text-sky" />, bg: 'bg-sky/5', path: '/tracks/cloud-computing' },
                                { title: 'AI & Machine Learning', desc: 'Intelligence & RAG Engineering', icon: <Zap className="w-5 h-5 text-violet" />, bg: 'bg-violet/5', path: '/tracks/ai-machine-learning' },
                                { title: 'Cybersecurity', desc: 'Defensive & Offensive Ops', icon: <Shield className="w-5 h-5 text-coral" />, bg: 'bg-coral/5', path: '/tracks/cybersecurity' },
                                { title: 'Data & Analytics', desc: 'Engineering & BI Platforms', icon: <Layout className="w-5 h-5 text-emerald" />, bg: 'bg-emerald/5', path: '/tracks/data-analytics' },
                                { title: 'Software & DevOps', desc: 'Full-Stack & Cloud Native', icon: <Code className="w-5 h-5 text-brand" />, bg: 'bg-brand/5', path: '/tracks/software-devops' },
                                { title: 'Digital Business', desc: 'Ventures & E-Commerce', icon: <Rocket className="w-5 h-5 text-pink-400" />, bg: 'bg-pink-400/5', path: '/tracks/digital-business' },
                              ].map((c, i) => (
                                <Link 
                                  key={i} 
                                  to={c.path} 
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/gate p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${c.bg} border border-white/5 group-hover/gate:scale-110 transition-transform`}>{c.icon}</div>
                                    <div className="flex-1">
                                      <h5 className="font-syne font-black text-[13px] text-white group-hover/gate:text-brand transition-colors">{c.title}</h5>
                                      <p className="text-[10px] text-text-dim leading-snug mt-1 line-clamp-1">{c.desc}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Panel B: Visual Anchor (Right 40%) */}
                          <div className="flex-1 bg-black/40 relative overflow-hidden group/featured">
                            <img 
                              src="/career_tracks_visual.png" 
                              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover/featured:grayscale-0 transition-all duration-1000 group-hover/featured:scale-110"
                              alt="Career Pathways"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.4em] block">Sovereign Focus</span>
                                  <h4 className="font-syne font-black text-xl text-white uppercase leading-none tracking-tighter">
                                    Deploy<br />Your<br />Future
                                  </h4>
                                </div>
                                <p className="text-[10px] text-text-dim leading-relaxed">Execute global velocity with practitioner-led technical tracks.</p>
                                <button 
                                  onClick={(e) => { 
                                    e.preventDefault(); 
                                    setActiveDropdown(null);
                                    navigate('/tracks'); 
                                  }}
                                  className="w-full py-3 bg-white text-navy font-syne font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-brand transition-all shadow-[0_10px_25px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_25px_rgba(0,242,255,0.2)]"
                                >
                                  Initialize Tracks
                                </button>
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-scan z-20" />
                          </div>
                        </div>
                      )}
                      
                      {item.label === 'Institutional Matrix' && (
                        <div className="flex divide-x divide-white/5 h-[380px]">
                          {/* Panel A: The Syllabus Matrix (Left 60%) */}
                          <div className="flex-[1.5] p-6 pr-8">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand rounded-full" />
                                <div>
                                  <h4 className="font-syne font-black text-sm text-white uppercase tracking-wider">Academic Intelligence Matrix</h4>
                                  <p className="font-dm-mono text-[8px] text-text-dim uppercase tracking-[0.2em] mt-0.5">Syllabus Ver_2026.4 // Verified Registry</p>
                                </div>
                              </div>
                              <span className="font-dm-mono text-[9px] text-brand/60 uppercase tracking-widest bg-brand/5 px-2 py-1 rounded border border-brand/10">Master_Console</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { tier: 'MAT_01', title: 'Intelligence & RAG', desc: 'Neural architectures & vector search protocols', count: '08 Modules', icon: <Zap className="w-5 h-5 text-emerald" />, bg: 'bg-emerald/5' },
                                { tier: 'MAT_02', title: 'Infra & Cloud Ops', desc: 'Distributed systems & sovereign cloud logic', count: '06 Modules', icon: <Cpu className="w-5 h-5 text-sky" />, bg: 'bg-sky/5' },
                                { tier: 'MAT_03', title: 'Engineering Hub', desc: 'CI/CD pipelines & high-velocity deployment', count: '07 Modules', icon: <Code className="w-5 h-5 text-coral" />, bg: 'bg-coral/5' },
                                { tier: 'MAT_04', title: 'Digital Governance', desc: 'Strategy, compliance & institutional pivot', count: '07 Modules', icon: <Globe className="w-5 h-5 text-brand" />, bg: 'bg-brand/5' }
                              ].map((c, i) => (
                                <Link 
                                  key={i} 
                                  to="/curriculum" 
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/gate p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand/30 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${c.bg} border border-white/5 group-hover/gate:scale-110 transition-transform`}>{c.icon}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-dm-mono text-[9px] text-text-dim group-hover/gate:text-brand transition-colors">{c.tier}</span>
                                        <span className="font-dm-mono text-[8px] text-white/20 uppercase tracking-widest">{c.count}</span>
                                      </div>
                                      <h5 className="font-syne font-black text-[13px] text-white group-hover/gate:text-white transition-colors">{c.title}</h5>
                                      <p className="text-[10px] text-text-dim leading-snug mt-1 line-clamp-1">{c.desc}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Panel B: Institutional Mastery Visual (Right 40%) */}
                          <div className="flex-1 bg-black/40 relative overflow-hidden group/featured">
                            {/* Matrix Image Anchor */}
                            <img 
                              src="/institutional_matrix_visual_1776800140008.png" 
                              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 group-hover/featured:scale-110"
                              alt="Matrix Visual"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="font-dm-mono text-[9px] text-brand uppercase tracking-[0.4em] block">Sovereign Standard</span>
                                  <h4 className="font-syne font-black text-xl text-white uppercase leading-none tracking-tighter">
                                    Strategic<br />Institutional<br />Mastery
                                  </h4>
                                </div>
                                <p className="text-[10px] text-text-dim leading-relaxed">Execute full matrix disclosure to view all 28 course modules and technical benchmarks.</p>
                                <button 
                                  onClick={(e) => { 
                                    e.preventDefault(); 
                                    setActiveDropdown(null);
                                    navigate('/curriculum'); 
                                  }}
                                  className="w-full py-3 bg-brand text-navy font-syne font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_10px_25px_rgba(0,242,255,0.2)]"
                                >
                                  Request Full Protocol
                                </button>
                              </div>
                            </div>

                            {/* Scanning Line Overlay */}
                            <div className="absolute top-0 left-0 w-full h-px bg-brand/40 shadow-[0_0_15px_rgba(0,242,255,0.5)] animate-scan" />
                          </div>
                        </div>
                      )}
                      
                      {/* Admissions Mega Menu */}
                      {item.label === 'Admissions' && (
                        <div className="flex divide-x divide-white/5 h-[380px]">
                          {/* Panel A: The Syllabus Matrix (Left 60%) */}
                          <div className="flex-[1.5] p-6 pr-8">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand rounded-full" />
                                <div>
                                  <h4 className="font-syne font-black text-sm text-white uppercase tracking-wider">Admissions Operations Hub</h4>
                                  <p className="font-dm-mono text-[8px] text-text-dim uppercase tracking-[0.2em] mt-0.5">Secure Gateway // Enterprise Flow</p>
                                </div>
                              </div>
                              <span className="font-dm-mono text-[9px] text-brand/60 uppercase tracking-widest bg-brand/5 px-2 py-1 rounded border border-brand/10">INTAKE_2026</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { title: 'How to Apply', desc: 'Application Pipeline', code: 'OP_01', icon: <Rocket className="w-5 h-5 text-sky" />, bg: 'bg-sky/5', path: '/admissions#apply' },
                                { title: 'Tuition & Fees', desc: 'Institutional Capital', code: 'OP_02', icon: <Landmark className="w-5 h-5 text-emerald" />, bg: 'bg-emerald/5', path: '/admissions#tuition' },
                                { title: 'Scholarships', desc: 'Talent Funding', code: 'OP_03', icon: <CreditCard className="w-5 h-5 text-violet" />, bg: 'bg-violet/5', path: '/admissions#funding' },
                                { title: 'Requirements', desc: 'Entry Baselines', code: 'OP_04', icon: <Shield className="w-5 h-5 text-coral" />, bg: 'bg-coral/5', path: '/admissions#entry' }
                              ].map((c, i) => (
                                <Link 
                                  key={i} 
                                  to={c.path} 
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/gate p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${c.bg} border border-white/5 group-hover/gate:scale-110 transition-transform`}>{c.icon}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-dm-mono text-[9px] text-text-dim group-hover/gate:text-brand transition-colors">{c.title}</span>
                                        <span className="font-dm-mono text-[8px] text-white/20 uppercase tracking-widest">{c.code}</span>
                                      </div>
                                      <h5 className="font-syne font-black text-[11px] text-text-soft group-hover/gate:text-white transition-colors mt-1">{c.desc}</h5>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              
                              <Link 
                                to="/contact" 
                                onClick={() => setActiveDropdown(null)}
                                className="col-span-2 group/gate p-4 rounded-xl bg-brand/[0.03] border border-brand/10 hover:border-brand/30 hover:bg-brand/[0.05] transition-all relative overflow-hidden flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-brand/10 border border-brand/20 text-brand"><MessageSquare className="w-5 h-5" /></div>
                                  <div>
                                    <h5 className="font-syne font-black text-[13px] text-white group-hover/gate:text-brand transition-colors">Talk to an Advisor</h5>
                                    <p className="text-[10px] text-text-dim leading-snug mt-1">One-on-one career consultation & deployment strategy</p>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-brand opacity-50 group-hover/gate:opacity-100 group-hover/gate:translate-x-1 transition-all" />
                              </Link>
                            </div>
                          </div>

                          {/* Panel B: Visual Anchor (Right 40%) */}
                          <div className="flex-1 bg-black/40 relative overflow-hidden group/featured">
                            <img 
                              src="/admissions_visual.png" 
                              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover/featured:grayscale-0 transition-all duration-1000 group-hover/featured:scale-110"
                              alt="Admissions Gateway"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="font-dm-mono text-[9px] text-emerald uppercase tracking-[0.4em] block">Access Granted</span>
                                  <h4 className="font-syne font-black text-xl text-white uppercase leading-none tracking-tighter">
                                    Initialize<br />Enterprise<br />Gateway
                                  </h4>
                                </div>
                                <p className="text-[10px] text-text-dim leading-relaxed">Secure your institution slot and verify deployment readiness.</p>
                                <button 
                                  onClick={(e) => { 
                                    e.preventDefault(); 
                                    setActiveDropdown(null);
                                    navigate('/apply'); 
                                  }}
                                  className="w-full py-3 bg-emerald text-navy font-syne font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_10px_25px_rgba(86,207,172,0.2)] hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                                >
                                  Begin Onboarding
                                </button>
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-px bg-emerald/40 shadow-[0_0_15px_rgba(86,207,172,0.5)] animate-scan z-20" />
                          </div>
                        </div>
                      )}

                      {/* Discover Dropdown */}
                      {item.label === 'Discover' && (
                        <div className="flex divide-x divide-white/5 h-[380px]">
                          {/* Panel A: The Discover Grid (Left 60%) */}
                          <div className="flex-[1.5] p-6 pr-8">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand rounded-full" />
                                <div>
                                  <h4 className="font-syne font-black text-sm text-white uppercase tracking-wider">Global Knowledge Network</h4>
                                  <p className="font-dm-mono text-[8px] text-text-dim uppercase tracking-[0.2em] mt-0.5">Faculty // Intelligence // Community</p>
                                </div>
                              </div>
                              <span className="font-dm-mono text-[9px] text-brand/60 uppercase tracking-widest bg-brand/5 px-2 py-1 rounded border border-brand/10">Data_Node</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {discoverItems.map((d, i) => (
                                <Link 
                                  key={i} 
                                  to={d.path} 
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/gate p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand group-hover/gate:bg-brand/10 group-hover/gate:text-white transition-all">{d.icon}</div>
                                    <div className="flex-1">
                                      <h5 className="font-syne font-black text-[13px] text-white group-hover/gate:text-brand transition-colors">{d.label}</h5>
                                      <p className="text-[10px] text-text-dim leading-snug mt-1 line-clamp-2">{d.desc}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Panel B: Visual Anchor (Right 40%) */}
                          <div className="flex-1 bg-black/40 relative overflow-hidden group/featured">
                            <video 
                              src="/network_visualization.mp4" 
                              poster="/discover_visual.png"
                              autoPlay loop muted playsInline
                              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover/featured:grayscale-0 transition-all duration-1000 group-hover/featured:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="font-dm-mono text-[9px] text-sky uppercase tracking-[0.4em] block">Live Feed</span>
                                  <h4 className="font-syne font-black text-xl text-white uppercase leading-none tracking-tighter">
                                    Ginashe<br />Ecosystem<br />Matrix
                                  </h4>
                                </div>
                                <p className="text-[10px] text-text-dim leading-relaxed">Engage with world-class faculty and global technology trends.</p>
                                <button 
                                  onClick={(e) => { 
                                    e.preventDefault(); 
                                    setActiveDropdown(null);
                                    navigate('/about'); 
                                  }}
                                  className="w-full py-3 bg-sky/20 border border-sky/40 text-white font-syne font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-sky hover:text-navy transition-all shadow-[0_10px_25px_rgba(79,195,247,0.1)] hover:shadow-[0_10px_25px_rgba(79,195,247,0.3)]"
                                >
                                  Access Network
                                </button>
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-px bg-sky/40 shadow-[0_0_15px_rgba(79,195,247,0.5)] animate-scan z-20" />
                          </div>
                        </div>
                      )}

                      {/* Bottom Bar */}
                      <div className="bg-white/5 p-4 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                          <span className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted">Next Intake: April 2026</span>
                        </div>
                        <Link 
                          to="/contact" 
                          onClick={() => setActiveDropdown(null)}
                          className="text-[11px] font-bold text-brand hover:underline flex items-center gap-1"
                        >
                          Speak to GDA Experts <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* --- NAVBAR ACTIONS --- */}
        <div className="flex items-center gap-4 ml-auto lg:ml-0">
          <div className={`hidden sm:flex items-center gap-1.5 pr-4 border-r ${isScrolled ? 'border-white/10' : 'border-black/5'}`}>
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all ${isScrolled ? 'hover:bg-white/5 text-text-muted hover:text-brand' : 'hover:bg-navy/5 text-navy/40 hover:text-brand'}`}>
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            {isSuperAdmin && (
              <button 
                onClick={editMode ? handleSaveAll : () => setEditMode(true)}
                className={`p-2.5 rounded-xl transition-all ${editMode ? 'text-emerald bg-emerald/10 border border-emerald/20' : (isScrolled ? 'text-text-muted hover:text-brand hover:bg-white/5' : 'text-navy/40 hover:text-brand hover:bg-navy/5')}`}
              >
                <Zap size={19} className={editMode ? 'animate-pulse' : ''} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact" className={`hidden xl:flex items-center gap-2 font-jetbrains text-[9px] tracking-[0.2em] transition-colors no-underline ${isScrolled ? 'text-[#22c55e] hover:text-brand' : 'text-navy/60 hover:text-brand'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isScrolled ? 'bg-[#22c55e]' : 'bg-brand'}`} />
              CONTACT US
            </Link>
            
            <button 
              className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-white hover:text-brand' : 'text-navy hover:text-brand'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- DYNAMIC ACCESS POD --- */}
        <div className="hidden lg:block absolute bottom-[-36px] right-0 z-[1001]">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-stretch bg-navy border border-brand/30 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,242,255,0.1)] overflow-hidden h-12"
          >
            {/* Student/Staff Profile Section */}
            <a 
              href={user ? (isAdmin ? 'https://staff.ginashe.academy' : 'https://gda-student-portal.pages.dev/') : 'https://gda-student-portal.pages.dev/'}
              onClick={!user ? (e) => { e.preventDefault(); onOpenModal('student'); } : undefined}
              className="flex items-center gap-3 px-6 hover:bg-white/5 transition-all group border-r border-white/10 no-underline"
            >
              <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand transition-all">
                <GraduationCap className="w-4 h-4 text-brand group-hover:text-navy transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-black text-[10px] text-white uppercase tracking-tight leading-none group-hover:text-brand transition-colors">
                  {user ? (isAdmin ? 'Admin Console' : 'Student Portal') : 'Student Portal'}
                </span>
                <span className="text-[7px] font-jetbrains text-text-muted uppercase tracking-widest mt-0.5">Secure_Access</span>
              </div>
            </a>
            

            {/* High-Impact CTA */}
            <button 
              onClick={() => navigate('/apply')}
              className="px-8 bg-brand relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-navy translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2.5 text-navy group-hover/btn:text-brand transition-colors">
                <Rocket className="w-3.5 h-3.5" />
                <span className="font-outfit font-black text-[12px] uppercase tracking-tighter">Apply For 2026</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 450 }}
            className="fixed inset-0 z-[5000] bg-bg lg:hidden overflow-y-auto"
          >
            <div className="h-screen flex flex-col p-6 pt-24 pb-12 gap-10">
              <div className="flex flex-col gap-8">
                <div className="text-brand font-jetbrains text-[10px] uppercase tracking-[0.4em] flex items-center gap-4">
                  <div className="h-px flex-1 bg-brand/20" />
                  NAVIGATION_MATRIX
                  <div className="h-px flex-1 bg-brand/20" />
                </div>
                
                <ul className="flex flex-col list-none gap-2">
                  {navItems.map(item => (
                    <li key={item.label} className="border-b border-white/5 last:border-0 pb-2">
                      {item.hasMega ? (
                        <div className="flex flex-col">
                          <button 
                            onClick={() => setExpandedMobileItem(expandedMobileItem === item.label ? null : item.label)}
                            className="flex items-center justify-between w-full py-4 text-left group"
                          >
                            <span className={`text-4xl font-outfit font-black transition-colors ${expandedMobileItem === item.label ? 'text-brand' : 'text-white'}`}>
                              {item.label}
                            </span>
                            <ChevronDown className={`w-8 h-8 transition-transform duration-500 ${expandedMobileItem === item.label ? 'rotate-180 text-brand' : 'text-text-muted hover:text-white'}`} />
                          </button>
                          
                          <AnimatePresence>
                            {expandedMobileItem === item.label && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 gap-3 py-4 pl-2">
                                  {/* Render Career Tracks sub-items */}
                                  {item.label === 'Career Tracks' && [
                                    { title: 'Cloud Computing', desc: 'Architecture', icon: <Cpu className="w-4 h-4" />, path: '/tracks/cloud-computing' },
                                    { title: 'AI & Machine Learning', desc: 'Intelligence', icon: <Zap className="w-4 h-4" />, path: '/tracks/ai-machine-learning' },
                                    { title: 'Cybersecurity', desc: 'Active Defence', icon: <Shield className="w-4 h-4" />, path: '/tracks/cybersecurity' },
                                    { title: 'Data & Analytics', desc: 'Engineering', icon: <Layout className="w-4 h-4" />, path: '/tracks/data-analytics' },
                                    { title: 'Software & DevOps', desc: 'Cloud Native', icon: <Code className="w-4 h-4" />, path: '/tracks/software-devops' },
                                    { title: 'Digital Business', desc: 'Ventures', icon: <Rocket className="w-4 h-4" />, path: '/tracks/digital-business' },
                                    { title: 'Digital Transformation', desc: 'Strategy', icon: <Globe className="w-4 h-4" />, path: '/tracks/digital-transformation' }
                                  ].map((c, i) => (
                                    <Link key={i} to={c.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">{c.icon}</div>
                                      <div>
                                        <div className="font-bold text-sm text-white">{c.title}</div>
                                        <div className="text-[10px] text-text-muted">{c.desc}</div>
                                      </div>
                                    </Link>
                                  ))}

                                  {/* Render Institutional Matrix sub-items */}
                                  {item.label === 'Institutional Matrix' && [
                                    { title: 'AI & Machine Learning', desc: 'Intelligence Systems', icon: <Zap className="w-4 h-4" /> },
                                    { title: 'Cloud Computing', desc: 'Infrastructure Systems', icon: <Cpu className="w-4 h-4" /> },
                                    { title: 'Software & DevOps', desc: 'Engineering Sovereignty', icon: <Code className="w-4 h-4" /> },
                                    { title: 'Digital Transformation', desc: 'Institutional Strategy', icon: <Briefcase className="w-4 h-4" /> }
                                  ].map((c, i) => (
                                    <Link key={i} to="/curriculum" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">{c.icon}</div>
                                      <div>
                                        <div className="font-bold text-sm text-white">{c.title}</div>
                                        <div className="text-[10px] text-text-muted">{c.desc}</div>
                                      </div>
                                    </Link>
                                  ))}
                                  
                                  {/* Render Admissions sub-items */}
                                  {item.label === 'Admissions' && [
                                    { title: 'How to Apply', icon: <Rocket className="w-4 h-4" />, path: '/admissions#apply' },
                                    { title: 'Scholarships', icon: <CreditCard className="w-4 h-4" />, path: '/admissions#funding' },
                                    { title: 'Tuition & Fees', icon: <Landmark className="w-4 h-4" />, path: '/admissions#tuition' },
                                    { title: 'Entry Requirements', icon: <Shield className="w-4 h-4" />, path: '/admissions#entry' }
                                  ].map((l, i) => (
                                    <Link key={i} to={l.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand">{l.icon}</div>
                                        <span className="font-bold text-sm text-white">{l.title}</span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-text-muted" />
                                    </Link>
                                  ))}

                                  {/* Render Discover sub-items */}
                                  {item.label === 'Discover' && discoverItems.map((d, i) => (
                                    <Link key={i} to={d.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand">{d.icon}</div>
                                      <div>
                                        <div className="font-bold text-sm text-white">{d.label}</div>
                                        <div className="text-[10px] text-text-muted">{d.desc}</div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link 
                          to={item.path} 
                          className="block py-4 text-4xl font-outfit font-black text-white no-underline hover:text-brand transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setIsMobileMenuOpen(false); onOpenModal('student'); }} className="py-4 rounded-2xl border border-white/10 font-outfit font-black text-white text-[13px] hover:bg-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <User size={16} /> Portal
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/apply'); }} className="py-4 rounded-2xl bg-white/5 border border-brand/30 font-outfit font-black text-brand text-[13px] hover:bg-brand/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Rocket size={16} /> Status
                  </button>
                </div>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/apply'); }} className="w-full py-5 rounded-2xl bg-brand font-outfit font-black text-navy text-[15px] hover:brightness-110 transition-all uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,242,255,0.3)]">
                  Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
