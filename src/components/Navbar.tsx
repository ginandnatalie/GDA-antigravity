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
    { label: 'Academy Pathways', path: '/pathways', hasMega: true },
    { label: 'Institutional Matrix', path: '/curriculum', hasMega: true },
    { label: 'Admissions', path: '/admissions', hasMega: true },
    { label: 'Faculty', path: '/faculty', hasMega: false },
    { label: 'Discover', path: '#', hasMega: true },
  ];

  // Discover Nested Items
  const discoverItems = [
    { label: 'About GDA', path: '/about', icon: <Globe className="w-4 h-4" />, desc: 'Global vision & local impact' },
    { label: 'News & Insights', path: '/news', icon: <Newspaper className="w-4 h-4" />, desc: 'Weekly tech trends & articles' },
    { label: 'Upcoming Events', path: '/events', icon: <Calendar className="w-4 h-4" />, desc: 'Join our next masterclass' },
    { label: 'Support Center', path: '/contact', icon: <MessageSquare className="w-4 h-4" />, desc: 'Get in touch with GDA' },
  ];

  return (
    <nav id="nav" className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-8 mt-5">
      {/* Main Navbar Bar */}
      <div className={`mx-auto max-w-7xl relative z-[2001] h-[72px] flex items-center px-6 rounded-2xl transition-all duration-500 border ${
        isScrolled 
          ? 'bg-bg/98 backdrop-blur-3xl border-border2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
          : 'bg-bg/60 backdrop-blur-xl border-white/10'
      }`}>
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-3 no-underline shrink-0 group">
          <div className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 group-hover:rotate-6 transition-transform duration-500">
            <img 
              src="/logo.svg" 
              alt="GDA"
              className="w-7 h-7 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-black text-[22px] tracking-tighter leading-[0.8] text-white">
              Ginashe
            </span>
            <span className="font-outfit font-black text-[12px] tracking-[0.05em] uppercase text-white -mt-0.5">
              <span className="text-gold">Digital</span> Academy
            </span>
          </div>
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
                className={`inline-flex items-center gap-1.5 font-outfit font-bold text-[14px] tracking-wide no-underline px-5 py-2.5 rounded-xl transition-all ${
                  pathname === item.path ? 'text-gold bg-gold/10' : 'text-text-soft hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {item.hasMega && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activeDropdown === item.label ? 'rotate-180 text-gold' : 'text-text-muted'}`} />}
              </Link>

              {/* RICH MEGA MENUS */}
              <AnimatePresence>
                {activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.97 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[540px] z-[2100]"
                  >
                    <div className="bg-[#0b0e14] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                      
                      {/* Academy Pathways Mega Menu */}
                      {item.label === 'Academy Pathways' && (
                        <div className="p-5 grid grid-cols-2 gap-4">
                          {[
                            { title: 'Foundation Core', desc: 'Institutional Entrance & Literacy', icon: <Cpu className="w-5 h-5" />, color: 'text-gold', bg: 'bg-gold/5', path: '/levels/foundation' },
                            { title: 'Associate Specialist', desc: 'Technical Specialisation Phase', icon: <Zap className="w-5 h-5" />, color: 'text-emerald', bg: 'bg-emerald/5', path: '/levels/associate' },
                            { title: 'Professional Residency', desc: 'High-Performance Mastery', icon: <Shield className="w-5 h-5" />, color: 'text-sky', bg: 'bg-sky/5', path: '/levels/professional' },
                            { title: 'Enterprise Fellowship', desc: 'Global Leadership & Governance', icon: <Globe className="w-5 h-5" />, color: 'text-violet', bg: 'bg-violet/5', path: '/levels/enterprise' }
                          ].map((c, i) => (
                            <Link key={i} to={c.path} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5">
                              <div className={`p-2.5 rounded-xl ${c.bg} border border-white/5 group-hover/item:scale-110 transition-transform ${c.color}`}>{c.icon}</div>
                              <div>
                                <div className="font-outfit font-bold text-[14px] text-white group-hover/item:text-gold transition-colors">{c.title}</div>
                                <div className="text-[11px] text-text-muted leading-relaxed mt-1">{c.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {item.label === 'Institutional Matrix' && (
                        <div className="p-5 grid grid-cols-2 gap-4">
                          {[
                            { title: 'AI & Machine Learning', desc: 'Intelligence & Predictive Systems', indicator: 'Market Critical', icon: <Zap className="w-5 h-5" />, color: 'text-emerald', bg: 'bg-emerald/5' },
                            { title: 'Cloud Computing', desc: 'Infrastructure & Distributed Systems', indicator: 'Institutional Pillar', icon: <Cpu className="w-5 h-5" />, color: 'text-sky', bg: 'bg-sky/5' },
                            { title: 'Software & DevOps', desc: 'Engineering Sovereignty & CI/CD', indicator: 'High Growth', icon: <Code className="w-5 h-5" />, color: 'text-coral', bg: 'bg-coral/5' },
                            { title: 'Digital Transformation', desc: 'Strategy & Institutional Governance', indicator: 'Strategic Leadership', icon: <Briefcase className="w-5 h-5" />, color: 'text-gold', bg: 'bg-gold/5' }
                          ].map((c, i) => (
                            <Link key={i} to="/curriculum" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 relative overflow-hidden">
                              <div className={`p-2.5 rounded-xl ${c.bg} border border-white/5 group-hover/item:scale-110 transition-transform ${c.color}`}>{c.icon}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-outfit font-bold text-[14px] text-white group-hover/item:text-gold transition-colors">{c.title}</div>
                                  <span className="font-dm-mono text-[7px] px-1.5 py-0.5 rounded-sm bg-white/5 text-text-muted uppercase tracking-wider">{c.indicator}</span>
                                </div>
                                <div className="text-[11px] text-text-muted leading-relaxed">{c.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* Admissions Mega Menu */}
                      {item.label === 'Admissions' && (
                        <div className="p-4 space-y-1">
                          {[
                            { title: 'How to Apply', desc: 'Step-by-step application guide', icon: <Rocket className="w-4 h-4" />, path: '/admissions#apply' },
                            { title: 'Scholarships', desc: 'Merit-based funding & support', icon: <CreditCard className="w-4 h-4" />, path: '/admissions#funding' },
                            { title: 'Tuition & Fees', desc: 'Investment plans & structure', icon: <Landmark className="w-4 h-4" />, path: '/admissions#tuition' },
                            { title: 'Entry Requirements', desc: 'Academic & technical criteria', icon: <Shield className="w-4 h-4" />, path: '/admissions#entry' },
                            { title: 'Talk to an Advisor', desc: 'One-on-one career consultation', icon: <MessageSquare className="w-4 h-4" />, path: '/contact' }
                          ].map((l, i) => (
                            <Link key={i} to={l.path} className="flex items-center justify-between p-4 rounded-xl hover:bg-gold/10 group/item transition-all border border-transparent hover:border-gold/10">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gold group-hover/item:bg-gold group-hover/item:text-navy transition-all">{l.icon}</div>
                                <div>
                                  <div className="font-outfit font-bold text-[14px] text-white">{l.title}</div>
                                  <div className="text-[10px] text-text-dim mt-0.5">{l.desc}</div>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-muted group-hover/item:translate-x-1 group-hover/item:text-gold transition-all" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Discover Dropdown */}
                      {item.label === 'Discover' && (
                        <div className="p-4 grid grid-cols-2 gap-3">
                          {discoverItems.map((d, i) => (
                            <Link key={i} to={d.path} className="p-4 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5">
                              <div className="flex items-center gap-2.5 mb-2">
                                <span className="text-gold group-hover/item:scale-110 transition-transform">{d.icon}</span>
                                <span className="font-outfit font-bold text-[14px] text-white">{d.label}</span>
                              </div>
                              <div className="text-[11px] text-text-muted leading-snug">{d.desc}</div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Bottom Bar */}
                      <div className="bg-white/5 p-4 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                          <span className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted">Next Intake: April 2026</span>
                        </div>
                        <Link to="/contact" className="text-[11px] font-bold text-gold hover:underline flex items-center gap-1">
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
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 pr-4 border-r border-white/10">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-gold transition-all">
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            {isSuperAdmin && (
              <button 
                onClick={editMode ? handleSaveAll : () => setEditMode(true)}
                className={`p-2.5 rounded-xl transition-all ${editMode ? 'text-emerald bg-emerald/10 border border-emerald/20' : 'text-text-muted hover:text-gold hover:bg-white/5'}`}
              >
                <Zap size={19} className={editMode ? 'animate-pulse' : ''} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden xl:flex items-center gap-2 font-jetbrains text-[9px] tracking-[0.2em] text-[#22c55e] hover:text-gold transition-colors no-underline">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              CONTACT US
            </Link>
            
            <button 
              className="lg:hidden p-2 text-white hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- DYNAMIC ACCESS POD (Experimental Menu) --- */}
        <div className="hidden lg:block absolute bottom-[-36px] right-0 z-[1001]">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-stretch bg-navy border border-gold/30 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(244,162,26,0.1)] overflow-hidden h-12"
          >
            {/* Student/Staff Profile Section */}
            <a 
              href={user ? (isAdmin ? 'https://staff.ginashe.academy' : 'https://portal.ginashe.academy') : 'https://portal.ginashe.academy'}
              onClick={!user ? (e) => { e.preventDefault(); onOpenModal('student'); } : undefined}
              className="flex items-center gap-3 px-6 hover:bg-white/5 transition-all group border-r border-white/10 no-underline"
            >
              <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-all">
                <GraduationCap className="w-4 h-4 text-gold group-hover:text-navy transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-black text-[10px] text-white uppercase tracking-tight leading-none group-hover:text-gold transition-colors">
                  {user ? (isAdmin ? 'Admin Console' : 'Student Hub') : 'Student Portal'}
                </span>
                <span className="text-[7px] font-jetbrains text-text-muted uppercase tracking-widest mt-0.5">Secure_Access</span>
              </div>
            </a>
            

            {/* High-Impact CTA */}
            <button 
              onClick={() => onOpenModal('apply')}
              className="px-8 bg-gold relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-navy translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2.5 text-navy group-hover/btn:text-gold transition-colors">
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
            className="fixed inset-0 z-[5000] bg-[#070a10] lg:hidden overflow-y-auto"
          >
            <div className="h-screen flex flex-col p-6 pt-24 pb-12 gap-10">
              <div className="flex flex-col gap-8">
                <div className="text-gold font-jetbrains text-[10px] uppercase tracking-[0.4em] flex items-center gap-4">
                  <div className="h-px flex-1 bg-gold/20" />
                  NAVIGATION_MATRIX
                  <div className="h-px flex-1 bg-gold/20" />
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
                            <span className={`text-4xl font-outfit font-black transition-colors ${expandedMobileItem === item.label ? 'text-gold' : 'text-white'}`}>
                              {item.label}
                            </span>
                            <ChevronDown className={`w-8 h-8 transition-transform duration-500 ${expandedMobileItem === item.label ? 'rotate-180 text-gold' : 'text-text-muted hover:text-white'}`} />
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
                                  {/* Render Academy Pathways sub-items */}
                                  {item.label === 'Academy Pathways' && [
                                    { title: 'Foundation Core', desc: 'Level 1: Entry', icon: <Cpu className="w-4 h-4" />, path: '/levels/foundation' },
                                    { title: 'Associate Specialist', desc: 'Level 2: Speciality', icon: <Zap className="w-4 h-4" />, path: '/levels/associate' },
                                    { title: 'Professional Residency', desc: 'Level 3: Mastery', icon: <Shield className="w-4 h-4" />, path: '/levels/professional' },
                                    { title: 'Enterprise Fellowship', desc: 'Level 4: Fellowship', icon: <Globe className="w-4 h-4" />, path: '/levels/enterprise' }
                                  ].map((c, i) => (
                                    <Link key={i} to={c.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">{c.icon}</div>
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
                                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">{c.icon}</div>
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
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">{l.icon}</div>
                                        <span className="font-bold text-sm text-white">{l.title}</span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-text-muted" />
                                    </Link>
                                  ))}

                                  {/* Render Discover sub-items */}
                                  {item.label === 'Discover' && discoverItems.map((d, i) => (
                                    <Link key={i} to={d.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">{d.icon}</div>
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
                          className="block py-4 text-4xl font-outfit font-black text-white no-underline hover:text-gold transition-colors"
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
                  <button onClick={() => { setIsMobileMenuOpen(false); onOpenModal('apply'); }} className="py-4 rounded-2xl bg-white/5 border border-gold/30 font-outfit font-black text-gold text-[13px] hover:bg-gold/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Rocket size={16} /> Status
                  </button>
                </div>
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenModal('apply'); }} className="w-full py-5 rounded-2xl bg-gold font-outfit font-black text-navy text-[15px] hover:brightness-110 transition-all uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(244,162,26,0.3)]">
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
