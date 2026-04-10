import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import { AdminDashboard, StudentPortal } from './components/Portals';
import { CourseViewer } from './components/LMS';
import { ArrowRight } from 'lucide-react';

// Pages
import Home from './pages/Home';
import CurriculumPage from './pages/CurriculumPage';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EventsPage from './pages/EventsPage';
import VerifyPage from './pages/VerifyPage';

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
    <div className="min-h-screen bg-bg text-text-custom selection:bg-gold-dim selection:text-gold transition-colors duration-300 flex flex-col">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
          <p className="text-gold font-dm-mono text-[10px] tracking-widest uppercase animate-pulse">Initializing Academy...</p>
          <div className="mt-8">
             {/* Academy Initialization */}
          </div>
        </div>
      ) : (
        <>
          {!isPortal && <Navbar onOpenModal={openModal} editMode={editMode} setEditMode={setEditMode} siteSettings={siteSettings} />}
          
          {isPortal && (
            <div className="bg-surface/50 border-b border-border-custom py-3 px-6 md:px-14 flex items-center justify-between sticky top-0 z-[1001] backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                  <img 
                    src="https://firebasestorage.googleapis.com/v0/b/ginashe-digital.firebasestorage.app/o/Ginashe%20Logo.svg?alt=media&token=041611c8-fc50-4b78-ab91-29ecf2dbe517" 
                    alt="GDA"
                    className="w-5 h-5 brightness-0 invert-0 mix-blend-multiply"
                  />
                </div>
                <span className="font-syne font-bold text-sm tracking-tight hidden sm:inline">Portal Access</span>
              </div>
              <Link 
                to="/" 
                className="flex items-center gap-2 font-dm-mono text-[10px] tracking-[0.15em] uppercase text-gold hover:text-text-custom transition-colors group"
              >
                <ArrowRight className="rotate-180 transition-transform group-hover:-translate-x-1" size={14} />
                Back to main site
              </Link>
            </div>
          )}

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home onOpenModal={openModal} editMode={editMode} siteSettings={siteSettings} />} />
              {(!siteSettings || siteSettings.showCurriculum !== false) && (
                <Route path="/curriculum" element={<CurriculumPage editMode={editMode} />} />
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
              
              <Route 
                path="/admin" 
                element={isAdmin ? <div className={isPortal ? "pt-8" : "pt-24"}><AdminDashboard /></div> : <Navigate to="/" />} 
              />
              <Route 
                path="/student-portal" 
                element={<Navigate to="/portal" replace />} 
              />
              <Route 
                path="/portal" 
                element={user ? <div className={isPortal ? "pt-8" : "pt-24"}><StudentPortal onStartCourse={(id) => navigate(`/course/${id}`)} /></div> : <Navigate to="/" />} 
              />
              <Route 
                path="/course/:courseId" 
                element={user ? <CourseViewerWrapper /> : <Navigate to="/" />} 
              />
            </Routes>
          </main>

          {!isPortal && <Footer onOpenModal={openModal} editMode={editMode} />}
        </>
      )}
    </div>
  );
}

function CourseViewerWrapper() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  return <CourseViewer courseId={courseId!} onBack={() => navigate('/portal')} />;
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
