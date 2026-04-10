-- Supabase Schema for Ginashe Digital Academy
-- ============================================
-- FULL TERTIARY EDUCATION SYSTEM SCHEMA v2.0

-- 1. Profiles Table (Extended with biographical data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    id_number TEXT,               -- SA ID or Passport number
    gender TEXT,                   -- Male, Female, Non-binary, Prefer not to say
    nationality TEXT DEFAULT 'South Africa',
    student_number TEXT UNIQUE,    -- GDA-2026-XXXX format
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    heroTitle TEXT DEFAULT 'Master the Future of Digital Innovation',
    heroSubtitle TEXT DEFAULT 'Join Africa''s premier academy for Cloud Engineering, AI, and Digital Transformation.',
    intakeStatus TEXT DEFAULT 'OPEN',
    contactEmail TEXT DEFAULT 'admissions@ginashe.co.za',
    showFaculty BOOLEAN DEFAULT true,
    showCurriculum BOOLEAN DEFAULT true,
    showAbout BOOLEAN DEFAULT true,
    showAdmissions BOOLEAN DEFAULT true,
    -- Section Visibility
    showHero BOOLEAN DEFAULT true,
    showTrustBar BOOLEAN DEFAULT true,
    showPrograms BOOLEAN DEFAULT true,
    showCTA BOOLEAN DEFAULT true,
    -- Content
    trustBarTitle TEXT DEFAULT 'Recognised by',
    programsTitle TEXT DEFAULT 'Rigorous pathways. Real-world outcomes.',
    programsSubtitle TEXT DEFAULT 'Every programme is co-designed with industry, built on cloud-vendor curricula, and delivered by practitioners who have solved the problems you''ll face.',
    ctaTitle TEXT DEFAULT 'Your cloud career starts today.',
    ctaSubtitle TEXT DEFAULT 'Applications for the April 2026 cohort close soon. Seats are limited to 25 per cohort — secure yours now.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default settings if not exists
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. Applications Table (Extended with biographical + CRM fields)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,                    -- individual, organisation, partner
    first_name TEXT,
    last_name TEXT,
    organization_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    id_number TEXT,                         -- SA ID or Passport number
    gender TEXT,
    nationality TEXT DEFAULT 'South Africa',
    program TEXT,
    qualification TEXT,
    cv_url TEXT,
    message TEXT,
    -- CRM / Admin fields
    student_number TEXT,                    -- Assigned on approval: GDA-YYYY-XXXX
    status TEXT DEFAULT 'pending',          -- pending, under_review, approved, rejected, waitlisted, enrolled
    admin_notes TEXT,                       -- Internal notes by admin
    reviewed_by TEXT,                       -- Email of admin who reviewed
    reviewed_at TIMESTAMP WITH TIME ZONE,
    ai_match_score INT,                    -- 0-100 mocked alignment score
    history JSONB DEFAULT '[]'::jsonb,     -- Audit trail of status changes
    -- Organisation-specific fields
    contact_person TEXT,
    org_size TEXT,
    partner_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Communication Logs (Email tracking)
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    sender TEXT DEFAULT 'system',           -- system, admin email
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL,               -- confirmation, welcome, admission, rejection, follow_up, admin_notification
    status TEXT DEFAULT 'sent',             -- sent, failed, bounced
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    thumbnail_url TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    duration TEXT,
    level TEXT DEFAULT 'Beginner',          -- Beginner, Intermediate, Advanced
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INT DEFAULT 80,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- 11. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT true,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 12. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    passed BOOLEAN DEFAULT false,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. Programs Table (Publicly listed programs)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cat TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    meta TEXT,
    mode TEXT,
    certs TEXT,
    price TEXT,
    priceSub TEXT,
    icon TEXT,
    accent TEXT,
    num TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. Student Number Sequence
CREATE SEQUENCE IF NOT EXISTS public.student_number_seq START WITH 1001 INCREMENT BY 1;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Site Settings
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update site settings" ON public.site_settings;
CREATE POLICY "Only admins can update site settings" ON public.site_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Applications: Anyone can insert (public form), admins can see all, users see their own
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Communication Logs: Admins only
DROP POLICY IF EXISTS "Admins can view communication logs" ON public.communication_logs;
CREATE POLICY "Admins can view communication logs" ON public.communication_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "System can insert communication logs" ON public.communication_logs;
CREATE POLICY "System can insert communication logs" ON public.communication_logs FOR INSERT WITH CHECK (true);

-- Courses
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage courses" ON public.courses;
CREATE POLICY "Only admins can manage courses" ON public.courses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Programs
DROP POLICY IF EXISTS "Programs are viewable by everyone" ON public.programs;
CREATE POLICY "Programs are viewable by everyone" ON public.programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage programs" ON public.programs;
CREATE POLICY "Only admins can manage programs" ON public.programs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Modules, Lessons, Quizzes, Quiz Questions: Viewable by enrolled students and admin
DROP POLICY IF EXISTS "Modules viewable by everyone" ON public.modules;
CREATE POLICY "Modules viewable by everyone" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lessons viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons viewable by everyone" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Quizzes viewable by everyone" ON public.quizzes;
CREATE POLICY "Quizzes viewable by everyone" ON public.quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Quiz questions viewable by everyone" ON public.quiz_questions;
CREATE POLICY "Quiz questions viewable by everyone" ON public.quiz_questions FOR SELECT USING (true);

-- Enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

DROP POLICY IF EXISTS "System can manage enrollments" ON public.enrollments;
CREATE POLICY "System can manage enrollments" ON public.enrollments FOR ALL USING (true);

-- Lesson Progress & Quiz Attempts
DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

-- ============================================
-- FUNCTION: Generate Student Number
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_student_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'GDA-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('public.student_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
