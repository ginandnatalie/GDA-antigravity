-- ============================================
-- MIGRATION: GDA Powerhouse Schema Expansion
-- Run this in your Supabase SQL Editor to add
-- the new columns without affecting existing data.
-- ============================================

-- 1. Extend profiles table with biographical fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'South Africa';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_number TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- 2. Extend applications table with biographical + CRM fields
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'South Africa';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_number TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS ai_match_score INT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS org_size TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS partner_type TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- 3. Create communication_logs table
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    sender TEXT DEFAULT 'system',
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view communication logs" ON public.communication_logs;
CREATE POLICY "Admins can view communication logs" ON public.communication_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "System can insert communication logs" ON public.communication_logs;
CREATE POLICY "System can insert communication logs" ON public.communication_logs FOR INSERT WITH CHECK (true);

-- 4. Extend courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 5. Extend enrollments table
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- 6. Create lesson_progress table if missing
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT true,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

-- 7. Create quiz_attempts table if missing
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    passed BOOLEAN DEFAULT false,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'instructor'))
);

-- 8. Student Number Sequence
CREATE SEQUENCE IF NOT EXISTS public.student_number_seq START WITH 1001 INCREMENT BY 1;

-- 9. Function: Generate Student Number
CREATE OR REPLACE FUNCTION public.generate_student_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'GDA-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('public.student_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 10. Update application RLS policies
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

-- 11. Insert policy for profiles (needed for sign-up)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Done! Your database is now ready for the GDA Powerhouse.
SELECT 'Migration complete! GDA Powerhouse schema applied.' AS status;
