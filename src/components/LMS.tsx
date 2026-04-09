import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration: string;
  module_id: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  passing_score: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export function CourseViewer({ courseId, onBack }: { courseId: string; onBack: () => void }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeItem, setActiveItem] = useState<{ type: 'lesson' | 'quiz', data: any } | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  async function fetchCourseData() {
    setLoading(true);
    try {
      // Fetch course
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', courseId).single();
      setCourse(courseData);

      // Fetch modules, lessons, and quizzes
      const { data: modulesData } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (*),
          quizzes (*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesData) {
        const sortedModules = modulesData.map(m => ({
          ...m,
          lessons: m.lessons.sort((a: any, b: any) => a.order_index - b.order_index),
          quizzes: m.quizzes.sort((a: any, b: any) => a.order_index - b.order_index)
        }));
        setModules(sortedModules);
        if (sortedModules[0]?.lessons[0]) {
          setActiveItem({ type: 'lesson', data: sortedModules[0].lessons[0] });
        }
      }

      // Fetch progress
      if (user) {
        const { data: lessonProgress } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id);
        
        const { data: quizProgress } = await supabase
          .from('quiz_attempts')
          .select('quiz_id')
          .eq('user_id', user.id)
          .eq('passed', true);
        
        setCompletedLessons(lessonProgress?.map(p => p.lesson_id) || []);
        setCompletedQuizzes(quizProgress?.map(p => p.quiz_id) || []);
      }
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleComplete(lessonId: string) {
    if (!user) return;

    const isCompleted = completedLessons.includes(lessonId);
    try {
      if (isCompleted) {
        await supabase.from('lesson_progress').delete().eq('user_id', user.id).eq('lesson_id', lessonId);
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
      } else {
        await supabase.from('lesson_progress').insert({ user_id: user.id, lesson_id: lessonId });
        setCompletedLessons(prev => [...prev, lessonId]);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border-custom bg-surface overflow-y-auto hidden md:block">
        <div className="p-6 border-b border-border-custom">
          <button onClick={onBack} className="text-text-muted hover:text-gold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
            ← Back to Portal
          </button>
          <h2 className="font-syne font-bold text-lg leading-tight">{course?.title}</h2>
        </div>
        <div className="p-4 space-y-6">
          {modules.map((mod, mIdx) => (
            <div key={mod.id}>
              <h3 className="font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-dim mb-3 px-2">
                Module {mIdx + 1}: {mod.title}
              </h3>
              <div className="space-y-1">
                {mod.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveItem({ type: 'lesson', data: lesson })}
                    className={`w-full text-left p-3 rounded-md transition-all flex items-start gap-3 ${
                      activeItem?.type === 'lesson' && activeItem.data.id === lesson.id ? 'bg-gold/10 text-gold' : 'hover:bg-white/5 text-text-soft'
                    }`}
                  >
                    <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      completedLessons.includes(lesson.id) ? 'bg-emerald border-emerald text-white' : 'border-border-custom'
                    }`}>
                      {completedLessons.includes(lesson.id) && <span className="text-[10px]">✓</span>}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium leading-snug">{lesson.title}</div>
                      <div className="text-[10px] text-text-dim mt-1">{lesson.duration}</div>
                    </div>
                  </button>
                ))}
                {mod.quizzes.map((quiz) => (
                  <button
                    key={quiz.id}
                    onClick={() => setActiveItem({ type: 'quiz', data: quiz })}
                    className={`w-full text-left p-3 rounded-md transition-all flex items-start gap-3 ${
                      activeItem?.type === 'quiz' && activeItem.data.id === quiz.id ? 'bg-gold/10 text-gold' : 'hover:bg-white/5 text-text-soft'
                    }`}
                  >
                    <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      completedQuizzes.includes(quiz.id) ? 'bg-gold border-gold text-white' : 'border-border-custom'
                    }`}>
                      {completedQuizzes.includes(quiz.id) ? <span className="text-[10px]">✓</span> : <span className="text-[10px]">?</span>}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium leading-snug">{quiz.title}</div>
                      <div className="text-[10px] text-text-dim mt-1">Quiz</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        {activeItem?.type === 'lesson' ? (
          <div className="max-w-4xl mx-auto">
            {activeItem.data.video_url && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-border-custom shadow-2xl">
                <iframe
                  src={activeItem.data.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="font-syne font-extrabold text-3xl mb-2">{activeItem.data.title}</h1>
                <div className="text-text-muted text-sm">Lesson {completedLessons.length} of {modules.reduce((acc, m) => acc + m.lessons.length, 0)} completed</div>
              </div>
              <button
                onClick={() => toggleComplete(activeItem.data.id)}
                className={`btn btn-sm ${completedLessons.includes(activeItem.data.id) ? 'btn-outline' : 'btn-gold'}`}
              >
                {completedLessons.includes(activeItem.data.id) ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-text-soft leading-relaxed">
              {activeItem.data.content.split('\n').map((line: string, i: number) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
          </div>
        ) : activeItem?.type === 'quiz' ? (
          <QuizView 
            quiz={activeItem.data} 
            onComplete={() => {
              setCompletedQuizzes(prev => [...prev, activeItem.data.id]);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-3xl mb-6">🎓</div>
            <h2 className="font-syne font-bold text-2xl mb-2">Select a lesson or quiz to begin</h2>
            <p className="text-text-muted">Choose an item from the sidebar to start learning.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function QuizView({ quiz, onComplete }: { quiz: any, onComplete: () => void }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
    setSubmitted(false);
    setAnswers({});
  }, [quiz.id]);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('order_index', { ascending: true });
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= quiz.passing_score;

    setScore(finalScore);
    setSubmitted(true);

    if (user) {
      try {
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          quiz_id: quiz.id,
          score: finalScore,
          passed,
          completed_at: new Date().toISOString()
        });
        if (passed) onComplete();
      } catch (err) {
        console.error('Error saving quiz attempt:', err);
      }
    }
  }

  if (loading) return <div className="text-center py-20">Loading quiz questions...</div>;

  if (submitted) {
    const passed = score >= quiz.passing_score;
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className={`text-6xl mb-6`}>{passed ? '🎉' : '📚'}</div>
        <h2 className="font-syne font-bold text-3xl mb-2">{passed ? 'Congratulations!' : 'Keep Studying'}</h2>
        <p className="text-text-muted mb-8">
          You scored <span className={`font-bold ${passed ? 'text-emerald' : 'text-coral'}`}>{score}%</span>. 
          {passed ? ' You have passed this quiz!' : ` You need ${quiz.passing_score}% to pass.`}
        </p>
        {!passed && (
          <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="btn btn-gold">Try Again</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="font-syne font-extrabold text-3xl mb-2">{quiz.title}</h1>
        <p className="text-text-muted">{quiz.description}</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg">{qIdx + 1}. {q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt: string, oIdx: number) => (
                <button
                  key={oIdx}
                  onClick={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[qIdx] === oIdx 
                      ? 'bg-gold/10 border-gold text-gold' 
                      : 'bg-surface border-border-custom hover:border-gold/30'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border-custom flex justify-between items-center">
        <div className="text-sm text-text-muted">
          {Object.keys(answers).length} of {questions.length} questions answered
        </div>
        <button
          disabled={Object.keys(answers).length < questions.length}
          onClick={handleSubmit}
          className="btn btn-gold px-8"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
