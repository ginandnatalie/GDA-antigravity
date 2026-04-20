import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import WhatsAppOrb from './components/WhatsAppOrb';
import { ArrowRight } from 'lucide-react';

// Pages
import Home from './pages/Home';
import CurriculumPage from './pages/CurriculumPage';
import LevelFoundationPage from './pages/LevelFoundationPage';
import LevelAssociatePage from './pages/LevelAssociatePage';
import LevelProfessionalPage from './pages/LevelProfessionalPage';
import LevelEnterprisePage from './pages/LevelEnterprisePage';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EventsPage from './pages/EventsPage';
import VerifyPage from './pages/VerifyPage';
import PathwaysPage from './pages/PathwaysPage';
import TermsPage from './pages/TermsPage';
import RefundsPage from './pages/RefundsPage';
import PopiaPage from './pages/PopiaPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  async function fetchSiteSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return;
        throw error;
      }
      if (data) setSiteSettings(data);
    } catch (err: any) {
      console.error('Error fetching site settings:', err.message);
    }
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || user?.email?.includes('ginashe.co.za');


  useEffect(() => {
    // 1. Listen for Supabase events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setActiveModal('reset-password');
      }
    });


    return () => subscription.unsubscribe();
  }, []);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const courseId = params.get('courseId');

    if (paymentStatus === 'success' && courseId) {
      handleSuccessfulPayment(courseId);
    }
  }, []);

  async function handleSuccessfulPayment(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const { error } = await supabase.from('enrollments').insert({ user_id: user.id, course_id: courseId });
      if (error) throw error;
      alert('Payment successful! You are now enrolled in the course.');
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/portal');
    } catch (err: any) {
      console.error('Enrollment error:', err.message);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.animate-fadeUp').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isPortal = pathname.startsWith('/portal') || pathname.startsWith('/admin') || pathname.startsWith('/course') || pathname.startsWith('/verify');

  return (
    <div className="min-h-screen bg-bg text-text-custom selection:bg-brand/30 selection:text-brand transition-colors duration-300 flex flex-col">
      <Modals 
        activeModal={activeModal} 
        onClose={closeModal} 
        onSwitchModal={(id) => setActiveModal(id)}
        onLoginSuccess={(role) => {
          navigate(role === 'admin' ? '/admin' : '/portal');
        }} 
      />

      {loading ? (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center transition-colors duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
          <p className="text-brand font-dm-mono text-[10px] tracking-widest uppercase animate-pulse">Initializing Academy...</p>
          <div className="mt-8">
             {/* Academy Initialization */}
          </div>
        </div>
      ) : (
        <>
          {!isPortal && <Navbar onOpenModal={openModal} editMode={editMode} setEditMode={setEditMode} siteSettings={siteSettings} />}
          


          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home onOpenModal={openModal} editMode={editMode} siteSettings={siteSettings} />} />
              <Route path="/levels/foundation" element={<LevelFoundationPage onOpenModal={openModal} editMode={editMode} />} />
              <Route path="/levels/associate" element={<LevelAssociatePage onOpenModal={openModal} editMode={editMode} />} />
              <Route path="/levels/professional" element={<LevelProfessionalPage onOpenModal={openModal} editMode={editMode} />} />
              <Route path="/levels/enterprise" element={<LevelEnterprisePage onOpenModal={openModal} editMode={editMode} />} />
              <Route path="/pathways" element={<PathwaysPage onOpenModal={openModal} editMode={editMode} />} />
              {(!siteSettings || siteSettings.showCurriculum !== false) && (
                <Route path="/curriculum" element={<CurriculumPage onOpenModal={openModal} editMode={editMode} />} />
              )}
              {(!siteSettings || siteSettings.showFaculty !== false) && (
                <Route path="/faculty" element={<FacultyPage editMode={editMode} />} />
              )}
              {(!siteSettings || siteSettings.showAbout !== false) && (
                <Route path="/about" element={<AboutPage onOpenModal={openModal} editMode={editMode} />} />
              )}
              {(!siteSettings || siteSettings.showAdmissions !== false) && (
                <Route path="/admissions" element={<AdmissionsPage onOpenModal={openModal} editMode={editMode} />} />
              )}
              <Route path="/contact" element={<ContactPage onOpenModal={openModal} editMode={editMode} />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refunds" element={<RefundsPage />} />
              <Route path="/popia" element={<PopiaPage />} />
              
              <Route 
                path="/admin" 
                element={<Navigate to="https://staff.ginashe.academy" replace />} 
              />
              <Route 
                path="/portal" 
                element={<Navigate to="https://portal.ginashe.academy" replace />} 
              />
              <Route 
                path="/course/*" 
                element={<Navigate to="https://portal.ginashe.academy" replace />} 
              />
              <Route path="/activate" element={<Navigate to="https://staff.ginashe.academy" replace />} />
            </Routes>
          </main>
          
          {!isPortal && (
            <>
              <Footer onOpenModal={openModal} editMode={editMode} />
              <WhatsAppOrb />
            </>
          )}
        </>
      )}
    </div>
  );
}



export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
