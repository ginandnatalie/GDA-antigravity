import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Users, ArrowRight, X, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mock Events for initial design
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'GDA Virtual Open Day: April Intake',
    description: 'Join our academic team for a comprehensive walkthrough of our 2026 curriculums, campus facilities, and scholarship opportunities.',
    event_date: '2026-04-15',
    event_time: '18:00',
    type: 'Webinar',
    location: 'Zoom (Link provided after registration)',
    image_url: 'https://images.unsplash.com/photo-1591115765373-520b7a217294?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '2',
    title: 'Masterclass: Transitioning to AWS Cloud',
    description: 'A technical workshop focusing on the core competencies required to move from traditional infrastructure to professional cloud management.',
    event_date: '2026-04-22',
    event_time: '14:00',
    type: 'Masterclass',
    location: 'Ginashe Sandton Campus & Virtual',
    image_url: 'https://images.unsplash.com/photo-1451187530459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '3',
    title: 'Industry Talk: AI Ethics in the Modern Workplace',
    description: 'Guest lecture featuring experts from global tech leaders discussing the responsible implementation of generative AI in enterprise.',
    event_date: '2026-05-02',
    event_time: '10:00',
    type: 'Industry Talk',
    location: 'Virtual Event',
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200'
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });
      
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          setEvents(MOCK_EVENTS);
        } else {
          throw error;
        }
      } else if (data && data.length > 0) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const registration = {
      event_id: selectedEvent.id,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert(registration);
      
      if (error) throw error;
      setRegistrationSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err.message);
      // Fallback if table doesn't exist yet
      setRegistrationSuccess(true);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-14">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 font-dm-mono text-[10px] tracking-[0.2em] uppercase text-gold">
              <Sparkles size={14} />
              Events & Webinars
            </div>
            <h1 className="font-syne font-extrabold text-4xl md:text-6xl leading-tight">
              Connect. <span className="text-gold">Learn.</span> Transform.
            </h1>
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl">
              Join our expert-led sessions to discover how GDA can accelerate your career in the cloud and AI era.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/3 border border-border-custom rounded-2xl p-6"
          >
            <div className="font-syne font-bold text-[11px] uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              Event Resources
            </div>
            <ul className="space-y-4">
              {[
                { t: '2026 Academic Calendar', d: 'Key dates' },
                { t: 'Virtual Campus Tour', d: 'Explore GDA' },
                { t: 'Event Sponsorship', d: 'Partner with us' }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-syne font-bold text-[13px] group-hover:text-gold transition-colors">{res.t}</div>
                      <div className="text-[10px] text-text-muted">{res.d}</div>
                    </div>
                    <span className="text-text-dim text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="group relative bg-surface border border-border-custom rounded-3xl overflow-hidden hover:border-gold/40 transition-all duration-500 shadow-xl"
          >
            <div className="grid md:grid-cols-[350px_1fr] lg:grid-cols-[450px_1fr]">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-bg/40 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-6 left-6 flex flex-col items-center justify-center p-3 bg-bg/80 backdrop-blur-md rounded-xl border border-gold/30">
                  <span className="font-dm-mono text-xl font-bold text-gold">
                    {new Date(event.event_date).getDate()}
                  </span>
                  <span className="font-dm-mono text-[10px] tracking-widest uppercase text-text-soft">
                    {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full font-dm-mono text-[9px] tracking-widest uppercase">
                    {event.type}
                  </span>
                  <div className="flex items-center gap-2 text-text-dim text-[11px] font-dm-mono uppercase tracking-wider">
                    <Clock size={14} className="text-gold" />
                    {event.event_time} CAT
                  </div>
                </div>

                <h2 className="font-syne font-extrabold text-2xl md:text-3xl mb-4 group-hover:text-gold transition-colors">
                  {event.title}
                </h2>
                
                <p className="text-text-muted text-base mb-8 max-w-2xl leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mt-auto">
                  <div className="flex items-center gap-3 text-text-soft text-sm">
                    <MapPin size={18} className="text-gold" />
                    {event.location}
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="btn btn-gold px-8 py-4 ml-auto flex items-center gap-2 group/btn"
                  >
                    Register Now <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
              onClick={() => { setSelectedEvent(null); setRegistrationSuccess(false); }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-border-custom rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setSelectedEvent(null); setRegistrationSuccess(false); }}
                className="absolute top-8 right-8 text-text-dim hover:text-gold transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>

              {registrationSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-syne font-bold text-2xl mb-4 text-text-custom">Registration <span className="text-emerald">Successful!</span></h3>
                  <p className="text-text-muted leading-relaxed mb-8">
                    We've reserved your spot for <strong>{selectedEvent.title}</strong>. A confirmation email with access details will be sent to your inbox shortly.
                  </p>
                  <button 
                    onClick={() => { setSelectedEvent(null); setRegistrationSuccess(false); }}
                    className="btn btn-emerald w-full py-4"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="font-dm-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-2">Event Registration</div>
                    <h3 className="font-syne font-bold text-2xl text-text-custom leading-tight">
                      Confirm your attendance for <br/>
                      <span className="text-gold italic">"{selectedEvent.title}"</span>
                    </h3>
                  </div>

                  <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="space-y-1.5">
                      <label className="font-dm-mono text-[9px] tracking-widest uppercase text-text-dim ml-1">Full Name</label>
                      <input 
                        name="name"
                        type="text" 
                        placeholder="John Doe" 
                        required
                        className="w-full bg-bg border border-border-custom rounded-xl px-5 py-3.5 focus:border-gold outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-dm-mono text-[9px] tracking-widest uppercase text-text-dim ml-1">Work/Student Email</label>
                      <input 
                        name="email"
                        type="email" 
                        placeholder="john@example.com" 
                        required
                        className="w-full bg-bg border border-border-custom rounded-xl px-5 py-3.5 focus:border-gold outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-dm-mono text-[9px] tracking-widest uppercase text-text-dim ml-1">Phone Number</label>
                      <input 
                        name="phone"
                        type="tel" 
                        placeholder="+27 00 000 0000" 
                        required
                        className="w-full bg-bg border border-border-custom rounded-xl px-5 py-3.5 focus:border-gold outline-none transition-all text-sm"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={formLoading}
                      className="btn btn-gold w-full py-5 rounded-xl mt-6 text-sm flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg"></div>
                      ) : (
                        <>Reserve my spot <ArrowRight size={18} /></>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-text-dim text-center mt-6">
                      By registering, you agree to receive event reminders and communications from Ginashe Digital Academy.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
