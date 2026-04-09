import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { Sun, Moon, X, Menu, GraduationCap, ArrowRight, Instagram, Twitter, Linkedin } from 'lucide-react';
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

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || user?.email?.includes('ginashe.co.za');
  const isSuperAdmin = profile?.role === 'super_admin' || user?.email === 'ginandNatalie@gmail.com' || user?.email === 'academy@ginashe.co.za';

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    // Dispatch a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('save-site-content'));
    
    // Give some visual feedback
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Curriculum', path: '/curriculum', key: 'showCurriculum' },
    { label: 'Faculty', path: '/faculty', key: 'showFaculty' },
    { label: 'About', path: '/about', key: 'showAbout' },
    { label: 'Admissions', path: '/admissions', key: 'showAdmissions' },
    { label: 'Contact', path: '/contact', key: 'showContact' },
  ].filter(item => !siteSettings || siteSettings[item.key] !== false);

  return (
    <nav 
      id="nav" 
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div className={`relative z-[2001] h-[72px] flex items-center px-5 sm:px-6 md:px-14 transition-all duration-300 ${isMobileMenuOpen ? 'bg-transparent border-transparent' : `bg-bg/92 backdrop-blur-3xl saturate-[1.4] border-b border-border-custom ${isScrolled ? 'bg-bg/98 border-border2' : ''}`}`}>
        <Link to="/" className={`flex items-center gap-3 no-underline shrink-0 cursor-pointer transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-gold rounded-md flex items-center justify-center relative overflow-hidden shrink-0">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/ginashe-digital.firebasestorage.app/o/Ginashe%20Logo.svg?alt=media&token=041611c8-fc50-4b78-ab91-29ecf2dbe517" 
              alt="GDA"
              className="w-6 h-6 object-contain brightness-0 invert-0 mix-blend-multiply"
            />
          </div>
          <div className="flex flex-col gap-px">
            <span className="font-syne font-extrabold text-[15px] sm:text-[16px] tracking-[0.02em] leading-none text-text-custom">
              Ginashe <span className="text-gold">Digital</span> Academy
            </span>
            <span className="font-dm-mono text-[8px] sm:text-[9px] tracking-[0.18em] uppercase text-text-soft">
              academy.ginashe.co.za
            </span>
          </div>
        </Link>

        <ul className={`hidden lg:flex items-center list-none mx-auto gap-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`inline-flex items-center gap-1.5 font-syne font-semibold text-[13px] tracking-[0.02em] no-underline px-4 py-2 rounded-md transition-all hover:text-gold hover:bg-gold-dim/50 ${pathname === item.path ? 'text-gold bg-gold-dim font-bold' : 'text-text-soft'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className={`flex items-center gap-1.5 sm:gap-2.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-text-muted hover:text-gold flex items-center justify-center"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="hidden xl:flex items-center gap-1.5 font-syne font-semibold text-[11px] tracking-[0.05em] text-[#22c55e] pr-4 border-r border-border-custom mr-1">
              <span className="pulse"></span>
              INTAKE OPEN
            </div>
            
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {isSuperAdmin && pathname === '/' && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className={`hidden lg:flex items-center gap-1.5 font-dm-mono text-[9px] tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-all ${editMode ? 'bg-coral text-white border-coral' : 'border-border-custom text-text-muted hover:text-coral'}`}
                    >
                      {editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
                    </button>
                    {editMode && (
                      <button 
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="hidden lg:flex items-center gap-1.5 font-dm-mono text-[9px] tracking-[0.1em] px-3 py-1.5 rounded-sm bg-emerald text-white border border-emerald hover:bg-emerald/90 transition-all disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                      </button>
                    )}
                  </div>
                )}
                <Link 
                  to={isAdmin ? '/admin' : '/portal'}
                  className={`hidden sm:inline-flex items-center gap-1.5 font-syne font-bold text-[11px] tracking-[0.04em] uppercase px-4 py-2 rounded-md cursor-pointer border transition-all no-underline ${pathname !== '/' ? 'bg-gold text-bg border-gold' : 'border-sky/20 bg-sky-dim text-sky hover:bg-sky/20'}`}
                >
                  ⬡ {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                </Link>
                <button 
                  className="hidden sm:block font-syne text-[11px] font-semibold text-text-muted hover:text-gold transition-colors uppercase tracking-wider"
                  onClick={() => { signOut(); navigate('/'); }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  className="hidden sm:inline-flex items-center gap-1.5 font-syne font-bold text-[11px] tracking-[0.04em] uppercase px-4 py-2 rounded-md cursor-pointer border border-sky/20 bg-sky-dim text-sky hover:bg-sky/20 transition-all no-underline"
                  onClick={() => onOpenModal('student')}
                >
                  ⬡ Student Portal
                </button>
                <button 
                  className="hidden xs:flex btn btn-gold btn-sm"
                  onClick={() => onOpenModal('apply')}
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>

          <button 
            className="lg:hidden bg-none border-none text-text-soft cursor-pointer p-2 hover:text-gold transition-colors relative z-[2002]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[2000] bg-bg/98 backdrop-blur-2xl lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen p-6 pt-24 gap-12">
              <div className="flex flex-col gap-8">
                <div className="font-dm-mono text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">Navigation</div>
                <ul className="flex flex-col list-none gap-6">
                  {navItems.map((item, i) => (
                    <motion.li 
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link 
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center justify-between font-syne font-bold text-3xl no-underline transition-all ${pathname === item.path ? 'text-gold' : 'text-text-custom hover:text-gold'}`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className={`transition-transform group-hover:translate-x-2 ${pathname === item.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={24} />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="font-dm-mono text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">Account</div>
                {!user ? (
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      className="w-full py-5 rounded-xl border border-sky/20 bg-sky-dim text-sky font-syne font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                      onClick={() => { onOpenModal('student'); setIsMobileMenuOpen(false); }}
                    >
                      <GraduationCap size={18} />
                      Student Portal
                    </button>
                    <button 
                      className="btn btn-gold w-full py-5 rounded-xl text-sm"
                      onClick={() => { onOpenModal('apply'); setIsMobileMenuOpen(false); }}
                    >
                      Apply Now — April Cohort
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link 
                      to={isAdmin ? '/admin' : '/portal'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-5 rounded-xl bg-gold text-bg font-syne font-bold uppercase tracking-widest text-xs text-center no-underline flex items-center justify-center gap-2"
                    >
                      <GraduationCap size={18} />
                      {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button 
                      className="w-full py-5 rounded-xl border border-border-custom text-text-muted font-syne font-bold uppercase tracking-widest text-xs"
                      onClick={() => { signOut(); navigate('/'); setIsMobileMenuOpen(false); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-12 border-t border-border-custom flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-6">
                    <a href="#" className="text-text-muted hover:text-gold transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="text-text-muted hover:text-gold transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="text-text-muted hover:text-gold transition-colors"><Linkedin size={20} /></a>
                  </div>
                  <div className="font-dm-mono text-[9px] text-text-dim uppercase tracking-widest">RSA · 2025</div>
                </div>
                <div className="text-[11px] text-text-dim leading-relaxed">
                  Ginashe Digital Academy is Africa's premier institution for cloud computing and AI transformation.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
