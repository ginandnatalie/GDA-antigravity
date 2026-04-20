import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Send, ExternalLink } from 'lucide-react';
import PageHero from '../components/PageHero';

interface ContactPageProps {
  onOpenModal: (id: string) => void;
  editMode?: boolean;
}

export default function ContactPage({ onOpenModal, editMode }: ContactPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      alert('Failed to send. Please email us directly at academy@ginashe.co.za');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        label="Get in Touch"
        title={<>Let's Start<br />a Conversation.</>}
        subtitle="Have questions about our programmes, admissions, or enterprise training? We'd love to hear from you."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070"
        imageAlt="Modern office workspace"
      />

      <section className="bg-bg">
        <div className="section-inner !pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 md:gap-8">
            
            {/* LEFT — Contact Info Cards */}
            <div className="flex flex-col gap-4">
              <div className="bg-card border border-border-custom rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-brand" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-[14px] mb-1">Campus Address</h3>
                    <p className="text-[13px] text-text-soft leading-relaxed">Sandton, Johannesburg<br />Gauteng, South Africa</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border-custom rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-dim border border-sky/20 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-sky" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-[14px] mb-1">Email</h3>
                    <a href="mailto:academy@ginashe.co.za" className="text-[13px] text-brand no-underline hover:underline">academy@ginashe.co.za</a>
                    <p className="text-[12px] text-text-muted mt-0.5">We respond within 2 business days</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border-custom rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-dim border border-emerald/20 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-emerald" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-[14px] mb-1">WhatsApp</h3>
                    <a href="https://wa.me/27000000000" className="text-[13px] text-emerald no-underline hover:underline">+27 (0) 00 000 0000</a>
                    <p className="text-[12px] text-text-muted mt-0.5">Quick enquiries & support</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border-custom rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-violet" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-[14px] mb-1">Office Hours</h3>
                    <p className="text-[13px] text-text-soft leading-relaxed">Mon – Fri: 08:00 – 17:00 SAST<br />Sat: 09:00 – 13:00 (admissions only)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <button 
                  onClick={() => navigate('/apply')}
                  className="btn btn-brand w-full justify-center text-[10px]"
                >
                  Apply Now
                </button>
                <a 
                  href="https://digital.ginashe.co.za" 
                  target="_blank"
                  className="btn btn-outline w-full justify-center text-[10px]"
                >
                  Ginashe Digital <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div className="bg-card border border-border-custom rounded-xl p-5 md:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-dim border border-emerald/20 flex items-center justify-center mb-4">
                    <Send size={24} className="text-emerald" />
                  </div>
                  <h3 className="font-syne font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-[14px] text-text-soft max-w-[320px]">Thank you for reaching out. Our team will get back to you within 2 business days.</p>
                  <button 
                    onClick={() => setSent(false)}
                    className="btn btn-outline btn-sm mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <h2 className="font-syne font-bold text-lg mb-1">Send us a Message</h2>
                    <p className="text-[13px] text-text-muted">All fields are required. We'll respond via email.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-dim">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="bg-surface border border-border-custom rounded-lg px-4 py-3 text-[14px] text-text-custom outline-none focus:border-brand/40 transition-colors placeholder:text-text-dim"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-dim">Email</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="bg-surface border border-border-custom rounded-lg px-4 py-3 text-[14px] text-text-custom outline-none focus:border-brand/40 transition-colors placeholder:text-text-dim"
                        placeholder="name@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-dim">Subject</label>
                    <select 
                      required
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                      className="bg-surface border border-border-custom rounded-lg px-4 py-3 text-[14px] text-text-custom outline-none focus:border-brand/40 transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="Admissions Enquiry">Admissions Enquiry</option>
                      <option value="Programme Information">Programme Information</option>
                      <option value="Funding & Sponsorship">Funding & Sponsorship</option>
                      <option value="Enterprise Training">Enterprise Training</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-dm-mono text-[9px] tracking-[0.15em] uppercase text-text-dim">Message</label>
                    <textarea 
                      required
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      rows={5}
                      className="bg-surface border border-border-custom rounded-lg px-4 py-3 text-[14px] text-text-custom outline-none focus:border-brand/40 transition-colors resize-none placeholder:text-text-dim"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={sending}
                    className="btn btn-brand btn-lg w-full justify-center mt-2 disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
