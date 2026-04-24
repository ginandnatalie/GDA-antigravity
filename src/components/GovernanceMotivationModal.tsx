import React, { useState, useEffect } from 'react';
import { supabase, uploadFile } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import { Shield, FileUp, Link, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GovernanceMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { motivation: string; evidenceUrl?: string; referenceUrl?: string }) => void;
  actionName: string;
  targetId?: string;
}

export function GovernanceMotivationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  actionName, 
  targetId 
}: GovernanceMotivationModalProps) {
  const { user } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'logging' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation || motivation.length < 10) {
      toast.error('Governance Violation', { description: 'Please provide a meaningful motivation (min 10 characters).' });
      return;
    }

    setIsSubmitting(true);
    setStatus('uploading');
    setErrorMsg('');

    try {
      let evidenceUrl = '';

      // 1. Upload File if present
      if (file) {
        const path = `governance-evidence/${Date.now()}_${file.name}`;
        evidenceUrl = await uploadFile('governance-evidence', path, file);
      }

      // 2. Log to governance_audit_logs
      setStatus('logging');
      const { error: logError } = await supabase.from('governance_audit_logs').insert([{
        admin_id: user?.id,
        admin_email: user?.email,
        action_name: actionName,
        target_id: targetId,
        motivation,
        evidence_url: evidenceUrl,
        reference_url: referenceUrl,
        timestamp: new RegExp('\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}').test(new Date().toISOString()) ? new Date().toISOString() : new Date().toISOString()
      }]);

      if (logError) throw logError;

      setStatus('success');
      setTimeout(() => {
        onSuccess({ motivation, evidenceUrl, referenceUrl });
        onClose();
        // Reset state
        setMotivation('');
        setReferenceUrl('');
        setFile(null);
        setStatus('idle');
      }, 1500);

    } catch (err: any) {
      console.error('Governance logging error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to record governance entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div 
        className="bg-card border border-brand/20 rounded-3xl w-full max-w-[500px] overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.05)] animate-fadeUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="font-syne font-bold text-xl text-text-custom">Governance Motivation</h2>
              <p className="text-[11px] text-text-muted uppercase tracking-widest font-dm-mono">Action: {actionName}</p>
            </div>
          </div>

          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center text-emerald animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-syne font-bold text-lg text-emerald">Motivation Logged</h3>
              <p className="text-xs text-text-soft">Institutional compliance verified. Proceeding...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-dm-mono text-[9px] tracking-widest uppercase text-text-muted">Motivation / Rationale (Mandatory)</label>
                <textarea 
                  required
                  className="w-full h-32 bg-surface/50 border border-border-custom rounded-xl p-4 text-[13px] text-text-custom outline-none focus:border-brand/40 transition-all resize-none placeholder:text-text-dim"
                  placeholder="Explain why this override is necessary according to GDA policy..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="block font-dm-mono text-[9px] tracking-widest uppercase text-text-muted">Evidence Document (Optional)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      className="hidden" 
                      id="gov-file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label 
                      htmlFor="gov-file"
                      className={`flex items-center justify-between w-full bg-surface/30 border border-dashed border-border-custom px-4 py-3 rounded-xl cursor-pointer hover:bg-brand/5 hover:border-brand/30 transition-all ${file ? 'border-brand/50 bg-brand/5' : ''}`}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <FileUp size={16} className={file ? 'text-brand' : 'text-text-muted'} />
                        <span className={`text-xs ${file ? 'text-brand font-medium' : 'text-text-dim'}`}>
                          {file ? file.name : 'Upload supporting evidence...'}
                        </span>
                      </div>
                      {file && <span className="text-[10px] text-text-muted" onClick={(e) => { e.preventDefault(); setFile(null); }}>Remove</span>}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-dm-mono text-[9px] tracking-widest uppercase text-text-muted">Reference URL (Optional)</label>
                  <div className="relative">
                    <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="url"
                      className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-5 py-4 text-[14px] text-text-custom focus:border-brand/40 outline-none transition-all shadow-inner"
                      placeholder="https://..."
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-coral/10 border border-coral/30 p-3 rounded-lg flex items-center gap-2 text-coral">
                  <AlertCircle size={16} />
                  <span className="text-[11px] font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-border-custom text-[11px] font-dm-mono uppercase tracking-widest text-text-soft hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || motivation.length < 10}
                  className="flex-1 px-6 py-3 rounded-xl bg-brand text-black text-[11px] font-dm-mono font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Recording...
                    </>
                  ) : (
                    'Authenticate & Log →'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 flex items-center gap-2 text-[10px] text-text-muted border-t border-border-custom pt-6 opacity-60">
            <Shield size={12} />
            <span>This interaction is subject to institutional audit. Administrator: {user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
