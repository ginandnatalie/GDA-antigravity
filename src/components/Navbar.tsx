import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { 
  Sun, Moon, X, Menu, GraduationCap, ArrowRight, Instagram, Twitter, Linkedin, 
  ChevronDown, BookOpen, Briefcase, HelpCircle, CreditCard, Users, FileText, 
  Landmark, Calendar, Newspaper, Zap, Globe, Languages, CheckCircle, 
  MessageSquare, Wallet, ExternalLink, ChevronRight, Layout, Info, Phone
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

  // Primary Navigation Items
  const navItems = [
    { label: 'Curriculum', path: '/curriculum', hasMega: true },
    { label: 'Admissions', path: '/admissions', hasMega: true },
    { label: 'Faculty', path: '/faculty', hasMega: false },
    { label: 'Discover', path: '#', hasMega: true },
  ];

  // Discover Items (Nested)
  const discoverItems = [
    { label: 'About Us', path: '/about', icon: <Info className="w-4 h-4" />, desc: 'Our mission & vision' },
    { label: 'News & Insights', path: '/news', icon: <Newspaper className="w-4 h-4" />, desc: 'Tech trends & updates' },
    { label: 'Events', path: '/events', icon: <Calendar className="w-4 h-4" />, desc: 'Webinars & masterclasses' },
    { label: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4" />, desc: 'Get in touch' },
  ];

  return (
    <nav id="nav" className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-8 mt-4">
      <div className={`mx-auto max-w-7xl relative z-[2001] h-[72px] flex items-center px-6 rounded-2xl transition-all duration-500 border ${
        isScrolled 
          ? 'bg-bg/95 backdrop-blur-2xl border-border2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
          : 'bg-bg/40 backdrop-blur-md border-white/5'
      }`}>
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-3 no-underline shrink-0 group">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/ginashe-digital.firebasestorage.app/o/Ginashe%20Logo.svg?alt=media&token=041611c8-fc50-4b78-ab91-29ecf2dbe517" 
              alt="GDA"
              className="w-6 h-6 object-contain mix-blend-multiply"
            />
          </div>
          <div className="flex flex-col gap-px">
            <span className="font-syne font-extrabold text-[16px] tracking-[0.02em] leading-none text-white whitespace-nowrap">
              Ginashe <span className="text-gold">Digital</span> Academy
            </span>
            <span className="font-dm-mono text-[9px] tracking-[0.18em] uppercase text-text-dim">
              Global Excellence
            </span>
          </div>
        </Link>

        {/* --- MAIN NAV --- */}
        <ul className="hidden lg:flex items-center list-none mx-auto gap-2">
          {navItems.map((item) => (
            <li 
              key={item.label} 
              className="relative"
              onMouseEnter={() => item.hasMega && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={item.path}
                className={`inline-flex items-center gap-1.5 font-syne font-semibold text-[13px] tracking-[0.03em] no-underline px-4 py-2 rounded-lg transition-all ${
                  pathname === item.path ? 'text-gold bg-gold/5' : 'text-text-soft hover:text-gold hover:bg-white/5'
                }`}
              >
                {item.label}
                {item.hasMega && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
              </Link>

              {/* DROPDOWNS */}
              <AnimatePresence>
                {activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[420px] z-[2100]"
                  >
                    <div className="bg-navy/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                      {item.label === 'Curriculum' && (
                        <div className="p-4 grid grid-cols-2 gap-3">
                          {[
                            { title: 'Cloud Engineering', icon: <Landmark className="w-4 h-4" />, color: 'text-sky' },
                            { title: 'AI & Data Science', icon: <Zap className="w-4 h-4" />, color: 'text-emerald' },
                            { title: 'Digital Leadership', icon: <Briefcase className="w-4 h-4" />, color: 'text-gold' },
                            { title: 'Full-Stack Web', icon: <Layout className="w-4 h-4" />, color: 'text-coral' }
                          ].map((c, i) => (
                            <Link key={i} to="/curriculum" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group/item">
                              <div className={`p-2 rounded-lg bg-white/5 border border-white/5 group-hover/item:border-gold/30 ${c.color}`}>{c.icon}</div>
                              <div className="font-syne font-bold text-[12px] text-white">{c.title}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {item.label === 'Admissions' && (
                        <div className="p-3 space-y-1">
                          {[
                            { title: 'Apply Now', icon: <ArrowRight className="w-4 h-4" />, path: '/admissions#apply' },
                            { title: 'Scholarships', icon: <CreditCard className="w-4 h-4" />, path: '/admissions#funding' },
                            { title: 'Financial Aid', icon: <Landmark className="w-4 h-4" />, path: '/admissions#tuition' },
                            { title: 'Entry Criteria', icon: <CheckCircle className="w-4 h-4" />, path: '/admissions#entry' }
                          ].map((l, i) => (
                            <Link key={i} to={l.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-gold/10 group/item transition-all">
                              <div className="flex items-center gap-3">
                                <div className="text-gold opacity-60 group-hover/item:opacity-100">{l.icon}</div>
                                <div className="font-syne font-bold text-[13px] text-white">{l.title}</div>
                              </div>
                              <ChevronRight className="w-3 h-3 text-text-dim opacity-0 group-hover/item:opacity-100 transition-all" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {item.label === 'Discover' && (
                        <div className="p-3 grid grid-cols-2 gap-2">
                          {discoverItems.map((d, i) => (
                            <Link key={i} to={d.path} className="p-3 rounded-xl hover:bg-white/5 transition-all group/item">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gold">{d.icon}</span>
                                <span className="font-syne font-bold text-[12px] text-white">{d.label}</span>
                              </div>
                              <div className="text-[10px] text-text-dim">{d.desc}</div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="bg-gold/5 p-3 px-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-dm-mono uppercase tracking-widest text-text-muted">Intake: April 2025</span>
                        <Link to="/contact" className="text-[10px] font-bold text-gold hover:underline">Get Help →</Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* --- RIGHT ACTIONS --- */}
        <div className="flex items-center gap-4">
          {/* Theme & Edit Mode */}
          <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/10 text-text-muted">
            <button onClick={toggleTheme} className="p-2 hover:text-gold transition-colors">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {isSuperAdmin && (
              <button 
                onClick={editMode ? handleSaveAll : () => setEditMode(true)}
                className={`p-2 rounded-full transition-all ${editMode ? 'text-emerald animate-pulse' : 'hover:text-gold'}`}
              >
                <Zap size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden xl:flex items-center gap-1.5 font-dm-mono text-[9px] tracking-widest text-[#22c55e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              SYSTEMS ONLINE
            </span>
            
            {/* User Dropdown/Mobile Toggle */}
            <button 
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- THE ACCESS POD (Protruding Experimental Menu) --- */}
        <div className="hidden lg:block absolute bottom-[-32px] right-6 z-[1001]">
          <div className="flex items-stretch bg-navy/90 backdrop-blur-xl border border-white/10 rounded-b-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="flex items-center border-r border-white/10">
              <Link 
                to={user ? (isAdmin ? '/admin' : '/portal') : '/portal'}
                onClick={!user ? (e) => { e.preventDefault(); onOpenModal('student'); } : undefined}
                className="flex items-center gap-2 px-5 py-2 hover:bg-white/5 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <GraduationCap className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="font-syne font-black text-[9px] text-white uppercase tracking-tighter leading-none">
                    {user ? (isAdmin ? 'Admin Panel' : 'My Dashboard') : 'Student Portal'}
                  </span>
                  <span className="text-[7px] font-dm-mono text-gold/60 uppercase">Login/Access</span>
                </div>
              </Link>
            </div>
            
            <div className="hidden xl:flex items-center border-r border-white/10">
              <Link to="/portal" className="px-4 py-2 hover:bg-white/5 transition-all flex flex-col items-center">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[8px] font-bold text-white/60 uppercase mt-0.5">Alumni</span>
              </Link>
            </div>

            <button 
              onClick={() => onOpenModal('apply')}
              className="px-6 py-2 bg-gradient-to-r from-gold to-[#c67d10] text-navy font-syne font-black text-[11px] uppercase tracking-tighter hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Zap className="w-3 h-3 fill-navy" />
              Apply For 2025
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[2000] bg-navy/98 backdrop-blur-3xl lg:hidden p-8 pt-24"
          >
            <div className="flex flex-col gap-8">
              <div className="text-gold font-dm-mono text-[10px] tracking-widest uppercase">Main Menu</div>
              <ul className="flex flex-col gap-6 list-none">
                {navItems.map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-4xl font-syne font-black text-white no-underline" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                {discoverItems.map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-2xl font-syne font-bold text-text-dim no-underline" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-4">
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenModal('student'); }} className="btn btn-outline w-full py-4 text-xl">Student Portal</button>
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenModal('apply'); }} className="btn btn-gold w-full py-4 text-xl">Apply Now</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
