3589import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import AcademyDashboard from './AcademyDashboard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  BarChart3, BookOpen, CreditCard, User, Settings, Layout,
  ChevronRight, LogOut, CheckCircle2, Clock, MapPin, Phone,
  Briefcase, GraduationCap, ArrowRight, ShieldCheck, Mail, Globe,
  Calendar, Zap, Star, AlertCircle, FileText, Lock, AlertTriangle,
  LayoutGrid, List, UserRound, Verified, History, XCircle, Shield
} from 'lucide-react';
import { GovernanceMotivationModal } from './GovernanceMotivationModal';

// ─── UTILITY: CSV Export ─────────────────────
function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function exportToJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.json`; a.click();
  URL.revokeObjectURL(url);
}

// ─── ADMIN: AI Match Badge ─────────────────────
function AIMatchBadge({ score }: { score: number }) {
  if (score === undefined || score === null) return null;
  const percentage = Math.round(score * 100);
  const color = percentage >= 80 ? 'text-emerald' : percentage >= 60 ? 'text-brand' : 'text-text-muted';
  const bg = percentage >= 80 ? 'bg-emerald/10' : percentage >= 60 ? 'bg-brand/10' : 'bg-white/5';

  return (
    <div className={`px-2.5 py-1 rounded-lg ${bg} ${color} border border-current/10 flex items-center gap-2 group transition-all`}>
      <Zap size={10} className={percentage >= 80 ? 'animate-pulse' : ''} />
      <span className="font-dm-mono text-[9px] font-bold uppercase tracking-wider">AI_MATCH: {percentage}%</span>
    </div>
  );
}

// ─── ADMIN: Overview Stats ──────────────────────
function OverviewStats({ applications, courses }: { applications: any[], courses: any[] }) {
  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-brand', bg: 'bg-brand/10' },
    { label: 'Pending Review', value: applications.filter(a => !a.status || a.status === 'pending').length, icon: Clock, color: 'text-sky', bg: 'bg-sky/10' },
    { label: 'Approved Students', value: applications.filter(a => a.status === 'approved' || a.status === 'enrolled').length, icon: ShieldCheck, color: 'text-emerald', bg: 'bg-emerald/10' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-purple', bg: 'bg-purple/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeUp">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#0a0d14] border border-brand/10 rounded-2xl p-5 hover:border-brand/30 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand/2 rounded-full -mr-8 -mt-8 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} border border-brand/5`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="flex-1" />
            <div className="w-6 h-6 rounded-lg bg-surface border border-border-custom flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-2.5 h-2.5 text-brand" />
            </div>
          </div>
          <div className="font-syne font-black text-3xl mb-0.5 tracking-tighter">{s.value}</div>
          <div className="font-dm-mono text-[9px] uppercase tracking-[0.15em] text-text-muted font-bold">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN: Application Table ───────────────────
function ApplicationTable({ apps, onUpdate, onSelect, isLoading, filters }: any) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border-custom rounded-3xl overflow-hidden animate-fadeUp shadow-2xl relative isolate">
      <div className="absolute inset-0 bg-brand/2 pointer-events-none" />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 backdrop-blur-md border-b border-border-custom">
              <th className="p-3.5 font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold">Applicant Identity</th>
              <th className="p-3.5 font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold">Programme / Org</th>
              <th className="p-3.5 font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold">Submission</th>
              <th className="p-3.5 font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold">Current Status</th>
              <th className="p-3.5 font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold text-right">Records</th>
            </tr>
          </thead>
          <tbody>
            {!apps.length ? (
              <tr><td colSpan={5} className="p-20 text-center text-text-muted italic">No records found in the current queue.</td></tr>
            ) : apps.map((app: any) => (
              <tr
                key={app.id}
                className="border-b border-border-custom/50 hover:bg-brand/[0.03] transition-colors group cursor-pointer"
                onClick={() => onSelect(app)}
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border-custom flex items-center justify-center font-bold text-xs">
                      {app.first_name?.[0] || app.organization_name?.[0]}
                    </div>
                    <div>
                      <div className="font-syne font-bold text-sm group-hover:text-brand transition-colors">{app.type === 'individual' ? `${app.first_name} ${app.last_name}` : app.organization_name}</div>
                      <div className="text-[11px] text-text-dim font-dm-mono lowercase">{app.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-[12px] font-semibold text-text-custom">{app.program || 'N/A'}</div>
                  {app.organization_name && <div className="text-[9px] text-brand/60 border border-brand/10 px-1.5 py-0.5 rounded inline-block uppercase tracking-tighter mt-1">{app.organization_name}</div>}
                </td>
                <td className="p-5">
                  <div className="text-[11px] text-text-soft font-dm-mono">{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="text-[9px] text-text-dim uppercase">{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="p-3.5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-dm-mono uppercase border tracking-widest ${app.status === 'approved' ? 'bg-emerald-dim text-emerald border-emerald/20' :
                      app.status === 'rejected' ? 'bg-coral-dim text-coral border-coral/20' :
                        'bg-brand-dim text-brand border-brand/20'
                    }`}>
                    {app.status || 'pending'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button className="p-2 bg-surface hover:bg-brand hover:text-bg border border-border-custom rounded-xl transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD (MAIN) ──────────────────
export function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [governanceSettings, setGovernanceSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [academicSchedule, setAcademicSchedule] = useState<any[]>([]);

  // Dashboard application list state
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ─── GOVERNANCE MOTIVATION STATE ───
  const [showGovModal, setShowGovModal] = useState(false);
  const [govAction, setGovAction] = useState<{ name: string; targetId?: string; callback: (data: any) => void } | null>(null);

  const isSuperAdmin = profile?.role === 'super_admin' ||
    user?.email === 'academy@ginashe.co.za' ||
    user?.email === 'ginashetraining@gmail.com' ||
    user?.email === 'george@ginashe.co.za';

  // ─── CMD+K Shortcut ──────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchCourses();
    fetchCampuses();
    fetchGovernance();
    fetchNotifications();
    fetchAlumniApprovals();
    fetchAcademicSchedule();

    // ─── INSTANT SECURITY DECOMMISSIONING ───
    const handleLeave = (e: BeforeUnloadEvent) => {
      // If NOT a refresh, clear session synchronously
      const navType = (performance.getEntriesByType("navigation")[0] as any)?.type;
      if (navType !== 'reload') {
        window.sessionStorage.clear();
      }
    };
    window.addEventListener('beforeunload', handleLeave);

    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchApplications())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'school_settings' }, () => fetchGovernance())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_notifications', filter: `user_id=eq.${user?.id}` }, () => fetchNotifications())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alumni_records' }, () => fetchAlumniApprovals())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'academic_schedule' }, () => fetchAcademicSchedule())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, []);

  async function fetchCampuses() {
    const { data } = await supabase.from('campuses').select('*').eq('is_active', true);
    setCampuses(data || []);
  }

  async function fetchGovernance() {
    const { data } = await supabase.from('school_settings').select('*');
    const settings: any = {};
    data?.forEach(s => settings[s.key] = s.value);
    setGovernanceSettings(settings);
  }

  async function fetchNotifications() {
    const { data } = await supabase
      .from('system_notifications')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  }

  async function fetchAlumniApprovals() {
    const { data } = await supabase
      .from('alumni_records')
      .select('*, profiles:user_id(*)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    setPendingApprovals(data || []);
  }

  async function fetchAcademicSchedule() {
    const { data } = await supabase.from('academic_schedule').select('*').order('start_time', { ascending: true });
    setAcademicSchedule(data || []);
  }

  async function handleApproveAlumni(record: any) {
    setGovAction({
      name: 'INSTITUTIONAL_BLESSING_GRANT',
      targetId: record.id,
      callback: async (govData) => {
        const { error } = await supabase
          .from('alumni_records')
          .update({ is_approved: true })
          .eq('id', record.id);

        if (error) {
          alert(error.message);
        } else {
          await supabase.from('institutional_audit_logs').insert({
            action: 'INSTITUTIONAL_BLESSING_GRANTED',
            performed_by: user?.id,
            target_type: 'alumni_record',
            target_id: record.id,
            reason: govData.motivation,
            new_value: { record_id: record.id, status: 'approved', evidence_url: govData.evidenceUrl }
          });
          toast.success('Institutional Blessing Granted!');
          fetchAlumniApprovals();
        }
      }
    });
    setShowGovModal(true);
  }

  async function handlePasswordReset() {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/portal`,
      });
      if (error) throw error;
      toast.success('Institutional Security Protocol Initiated', {
        description: `A recovery link has been dispatched to ${user.email}.`
      });
    } catch (err: any) {
      alert(`Security protocol failed: ${err.message}`);
    }
  }

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCourses() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, curriculum_tracks(*)')
        .order('nqf_level', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setGovAction({
      name: `APPLICATION_STATUS_UPDATE_${newStatus.toUpperCase()}`,
      targetId: id,
      callback: async (govData) => {
        setUpdatingId(id);
        try {
          const app = applications.find(a => a.id === id);
          const historyEntry = {
            event: `Status changed to ${newStatus}`,
            timestamp: new Date().toISOString(),
            by: user?.email || 'admin',
            details: govData.motivation
          };

          const existingHistory = Array.isArray(app?.history) ? app.history : [];

          const updateData: any = {
            status: newStatus,
            reviewed_by: user?.email,
            reviewed_at: new Date().toISOString(),
            history: [...existingHistory, historyEntry],
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('applications')
            .update(updateData)
            .eq('id', id);

          if (error) throw error;

          // Send email notification
          try {
            await fetch('/api/send-status-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: app.email,
                name: app.type === 'individual' ? `${app.first_name} ${app.last_name}` : app.organization_name,
                status: newStatus,
                program: app.program,
                studentNumber: updateData.student_number
              })
            });
          } catch (emailErr) {
            console.error('Failed to send email notification:', emailErr);
          }

          setApplications(applications.map(a =>
            a.id === id ? { ...a, ...updateData } : a
          ));
        } catch (err: any) {
          alert('Error updating status: ' + err.message);
        } finally {
          setUpdatingId(null);
        }
      }
    });
    setShowGovModal(true);
  }

  // ─── BULK ACTIONS ────────────────
  async function bulkUpdateStatus(newStatus: string) {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to ${newStatus} ${selectedIds.size} applications?`)) return;

    for (const id of selectedIds) {
      await updateStatus(id, newStatus);
    }
    setSelectedIds(new Set());
  }

  // ─── FILTERED + SORTED DATA ─────
  const filteredApps = useMemo(() => {
    let result = applications;

    // Type filter
    if (filter !== 'all') result = result.filter(a => a.type === filter);
    // Status filter
    if (statusFilter !== 'all') result = result.filter(a => (a.status || 'pending') === statusFilter);
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        (a.first_name?.toLowerCase().includes(q)) ||
        (a.last_name?.toLowerCase().includes(q)) ||
        (a.email?.toLowerCase().includes(q)) ||
        (a.organization_name?.toLowerCase().includes(q)) ||
        (a.program?.toLowerCase().includes(q)) ||
        (a.student_number?.toLowerCase().includes(q))
      );
    }
    // Sort
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [applications, filter, statusFilter, searchQuery, sortField, sortDir]);

  // ─── STATS ───────────────────────
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => !a.status || a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    enrolled: applications.filter(a => a.status === 'enrolled').length,
    avgScore: applications.filter(a => a.ai_match_score).length > 0
      ? Math.round(applications.filter(a => a.ai_match_score).reduce((s, a) => s + a.ai_match_score, 0) / applications.filter(a => a.ai_match_score).length)
      : 0,
  }), [applications]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApps.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredApps.map(a => a.id)));
  };

  const [editingCourse, setEditingCourse] = useState<any>(null);

  return (
    <div className="w-full min-h-screen bg-bg">
      {/* ─── CMD+K Command Palette ─── */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-[5000] bg-bg/90 backdrop-blur-md flex items-start justify-center pt-[15vh]" onClick={() => setShowCommandPalette(false)}>
          <div className="bg-card border border-border-custom rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border-custom flex items-center gap-3">
              <span className="text-text-muted text-lg">🔍</span>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-text-custom font-dm-sans text-[14px] placeholder:text-text-dim"
                placeholder="Search students, courses, applications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setShowCommandPalette(false); }}
              />
              <span className="font-dm-mono text-[9px] text-text-dim px-2 py-0.5 bg-surface rounded border border-border-custom">ESC</span>
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              {[
                { label: 'View Applications', icon: '📝', action: () => { setActiveTab('applications'); setShowCommandPalette(false); } },
                { label: 'Manage Courses', icon: '📚', action: () => { setActiveTab('courses'); setShowCommandPalette(false); } },
                { label: 'Student Progress', icon: '📊', action: () => { setActiveTab('progress'); setShowCommandPalette(false); } },
                { label: 'Staff Management', icon: '👥', action: () => { setActiveTab('staff'); setShowCommandPalette(false); } },
                { label: 'Site Settings', icon: '⚙️', action: () => { setActiveTab('settings'); setShowCommandPalette(false); } },
                { label: 'Communication Logs', icon: '📧', action: () => { setActiveTab('communications'); setShowCommandPalette(false); } },
                { label: 'Export All Applications (CSV)', icon: '📤', action: () => { exportToCSV(applications, 'gda-applications'); setShowCommandPalette(false); } },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-lg flex items-center gap-3 hover:bg-surface transition-colors text-[13px]"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingCourse ? (
        <CourseContentEditor
          course={editingCourse}
          onBack={() => {
            setEditingCourse(null);
            fetchCourses();
          }}
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row min-h-screen bg-bg relative isolate">
            {/* ─── ADMIN SIDEBAR ─── */}
            <aside className={`fixed lg:h-screen lg:border-r border-border-custom bg-surface/80 backdrop-blur-2xl z-50 transition-all duration-300 ease-[0.25,0.1,0.25,1] ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}>
              <div className="flex flex-col h-full relative">
                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="absolute -right-3 top-20 w-6 h-6 bg-brand text-bg rounded-full hidden lg:flex items-center justify-center shadow-lg z-30 hover:scale-110 transition-transform"
                >
                  {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} className="rotate-180" />}
                </button>

                <div className="p-4 h-full flex flex-col">
                  {/* Institutional Navigation */}
                  <div className="mb-8">
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/';
                      }}
                      className={`w-full flex items-center rounded-xl bg-brand/10 border border-brand/30 text-brand hover:bg-brand hover:text-bg transition-all font-bold text-[10px] uppercase tracking-tighter ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-2.5'}`}
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Main Website →</span>}
                    </button>
                  </div>

                  <div className={`mb-8 flex items-center overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'lg:justify-center' : 'px-2 justify-start gap-2.5'}`}>
                    <div className="w-9 h-9 rounded-xl bg-brand text-bg flex items-center justify-center font-black shadow-lg shadow-brand/20 shrink-0">G</div>
                    {(!isSidebarCollapsed || isMobileMenuOpen) && (
                      <div className="flex flex-col animate-fade">
                        <h2 className="font-syne font-extrabold text-lg tracking-tighter whitespace-nowrap leading-none">ADMIN HUB</h2>
                        <span className="text-[7px] font-dm-mono text-brand tracking-widest uppercase opacity-70">Institutional Control</span>
                      </div>
                    )}
                  </div>

                  <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { id: 'overview', label: 'Command Hub', icon: Zap },
                      { id: 'applications', label: 'Admissions', icon: FileText },
                      { id: 'courses', label: 'Curriculum', icon: BookOpen },
                      { id: 'academic', label: 'Academic Assets', icon: Star },
                      { id: 'broadcasts', label: 'Broadcast Hub', icon: Zap },
                      { id: 'registry', label: 'Global Registry', icon: User },
                      { id: 'timetable', label: 'Campus Timetable', icon: Calendar },
                      { id: 'attendance', label: 'Attendance Registry', icon: CheckCircle2 },
                      { id: 'vault', label: 'Resource Vault', icon: Lock },
                      { id: 'progress', label: 'Student Success', icon: Zap },
                      { id: 'finances', label: 'Financials', icon: CreditCard },
                      { id: 'news', label: 'Content CMS', icon: Layout },
                      { id: 'events', label: 'Events Hub', icon: Calendar },
                      { id: 'governance', label: 'Campus Governance', icon: ShieldCheck, super: true },
                      { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck, super: true },
                      { id: 'graduation', label: 'Graduation', icon: GraduationCap, super: true },
                      { id: 'audit', label: 'Audit Trail', icon: Lock, super: true },
                      { id: 'settings', label: 'Portal Config', icon: Settings, super: true },
                    ].filter(t => t.super ? isSuperAdmin : true).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                        title={(isSidebarCollapsed && !isMobileMenuOpen) ? item.label : ''}
                        className={`w-full flex items-center rounded-xl font-dm-mono text-[11px] uppercase tracking-widest transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-brand text-bg font-bold shadow-lg shadow-brand/20'
                            : 'text-text-muted hover:text-text-custom hover:bg-white/5'
                          } ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:justify-center p-3' : 'px-4 py-3 gap-3'}`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="whitespace-nowrap animate-fade">{item.label}</span>}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-border-custom space-y-1">
                    <button
                      onClick={() => setShowCommandPalette(true)}
                      title={(isSidebarCollapsed && !isMobileMenuOpen) ? 'Quick Search' : ''}
                      className={`w-full flex items-center rounded-xl bg-surface border border-border-custom text-text-muted hover:text-brand transition-all font-dm-mono text-[10px] uppercase tracking-widest ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:justify-center p-3' : 'px-4 py-3 gap-3'}`}
                    >
                      <span className="text-sm shrink-0 text-center">🔍</span>
                      {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="whitespace-nowrap animate-fade">Quick Search [K]</span>}
                    </button>
                    <button
                      onClick={handlePasswordReset}
                      title={(isSidebarCollapsed && !isMobileMenuOpen) ? 'Security' : ''}
                      className={`w-full flex items-center rounded-xl text-text-muted hover:text-brand hover:bg-brand/5 transition-all font-dm-mono text-[11px] uppercase tracking-widest ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:justify-center p-3' : 'px-4 py-3 gap-3'}`}
                    >
                      <Lock className="w-4 h-4 shrink-0" />
                      {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="whitespace-nowrap animate-fade">Secure Reset</span>}
                    </button>
                    <button
                      onClick={() => signOut()}
                      title={(isSidebarCollapsed && !isMobileMenuOpen) ? 'Sign Out' : ''}
                      className={`w-full flex items-center rounded-xl text-coral hover:bg-coral/5 transition-all font-dm-mono text-[11px] uppercase tracking-widest ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:justify-center p-3' : 'px-4 py-3 gap-3'}`}
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="whitespace-nowrap animate-fade">Sign Out</span>}
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40 lg:hidden animate-fade"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* ─── ADMIN MAIN CONTENT ─── */}
            <main className={`flex-1 p-4 md:p-6 lg:p-8 animate-fade transition-all duration-300 ease-[0.25,0.1,0.25,1] ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
              {/* TOP BAR */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div className="flex items-center gap-4 animate-fadeRight">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-3 bg-surface border border-border-custom rounded-2xl text-brand"
                  >
                    <Layout className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="font-syne font-extrabold text-4xl md:text-5xl tracking-tighter mb-2">
                      {activeTab === 'overview' ? 'Command Centre' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <p className="text-text-muted font-dm-mono text-[10px] uppercase tracking-[0.2em]">
                      Ginashe Admin System &bull; Active Session: {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 animate-fadeLeft">
                  {/* Notifications Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`p-3 rounded-2xl border transition-all ${notifications.length > 0 ? 'bg-brand/10 border-brand/30 text-brand animate-pulse' : 'bg-surface/50 border-border-custom text-text-muted hover:text-brand'}`}
                    >
                      <Zap className="w-4 h-4" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-bg">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-4 w-80 bg-card border border-border-custom rounded-2xl shadow-2xl z-[100] overflow-hidden">
                        <div className="p-4 border-b border-border-custom flex justify-between items-center bg-surface">
                          <span className="text-[10px] font-dm-mono uppercase tracking-widest font-bold">Priority Notices</span>
                          <button onClick={() => setShowNotifications(false)} className="text-[10px] text-text-dim">CLOSE</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(n => (
                            <div key={n.id} className="p-4 border-b border-border-custom/50 hover:bg-white/5 transition-colors cursor-pointer" onClick={async () => {
                              await supabase.from('system_notifications').update({ is_read: true }).eq('id', n.id);
                              fetchNotifications();
                              if (n.link) setActiveTab('courses'); // Redirect to courses for inquiries
                            }}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                <span className="text-[11px] font-bold">{n.title}</span>
                              </div>
                              <p className="text-[10px] text-text-soft leading-relaxed">{n.message}</p>
                              <div className="text-[8px] text-text-dim font-dm-mono uppercase mt-2">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <div className="p-10 text-center">
                              <p className="text-[10px] text-text-dim italic">System clear. No pending interactions.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 bg-surface/50 border border-border-custom p-2 rounded-2xl backdrop-blur-md">
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-dm-mono uppercase focus:ring-0 cursor-pointer text-brand pr-8"
                    >
                      <option value="all">All Campuses</option>
                      {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="w-px h-8 bg-border-custom" />
                    <div className="text-right px-2">
                      <p className="text-[10px] text-text-dim font-dm-mono uppercase">Database</p>
                      <p className="text-xs font-bold text-emerald flex items-center justify-end gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Connected
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENT RENDERER */}
              <div className="relative">
                {loading && activeTab !== 'overview' && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/50 backdrop-blur-sm rounded-3xl min-h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand mx-auto mb-4"></div>
                      <p className="font-dm-mono text-[10px] uppercase text-brand">Synchronizing Database...</p>
                    </div>
                  </div>
                )}

                <div className={`transition-all duration-300 ${loading && activeTab !== 'overview' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                  {activeTab === 'overview' ? (
                    <OverviewStats applications={applications} courses={courses} />
                  ) : activeTab === 'applications' ? (
                    <ApplicationTable
                      apps={applications}
                      onUpdate={fetchApplications}
                      onSelect={setSelectedApp}
                      isLoading={loading}
                      filters={{ status: statusFilter, search: searchQuery }}
                    />
                  ) : activeTab === 'courses' ? (
                    <CourseManager courses={courses} onRefresh={fetchCourses} onEditContent={setEditingCourse} />
                  ) : activeTab === 'compliance' ? (
                    <ComplianceDashboard />
                  ) : activeTab === 'broadcasts' ? (
                    <BroadcastHub />
                  ) : activeTab === 'academic' ? (
                    <div className="space-y-8 animate-fade">
                      <div className="bg-card border border-border-custom rounded-3xl p-10">
                        <h3 className="font-syne font-bold text-2xl mb-6">Create Academic Item</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Linked Course</label>
                              <select id="ac-course" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm">
                                <option value="">Select Course...</option>
                                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Item Type</label>
                              <select id="ac-type" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm">
                                <option value="assignment">Assignment</option>
                                <option value="assessment">Assessment</option>
                                <option value="exam">Official Exam</option>
                                <option value="capstone">Capstone Project</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Weighting (%)</label>
                              <input id="ac-weight" type="number" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm" defaultValue="20" title="Proportion of the final module grade" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Passing Score (%)</label>
                              <input id="ac-pass" type="number" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm" defaultValue="50" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Integrity Logic</label>
                              <select id="ac-proctor" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm">
                                <option value="false">Standard Mode</option>
                                <option value="true">Active Proctoring (Focus Tracking)</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-dm-mono uppercase text-text-muted tracking-widest">Instructions / Reference Material</label>
                            <textarea id="ac-desc" className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm h-32" placeholder="Submission guidelines, required files, etc..." />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={async () => {
                                const course_id = (document.getElementById('ac-course') as HTMLSelectElement).value;
                                const type = (document.getElementById('ac-type') as HTMLSelectElement).value;
                                const title = (document.getElementById('ac-title') as HTMLInputElement).value;
                                const total_marks = parseInt((document.getElementById('ac-marks') as HTMLInputElement).value);
                                const weight = parseInt((document.getElementById('ac-weight') as HTMLInputElement).value);
                                const passing_score = parseInt((document.getElementById('ac-pass') as HTMLInputElement).value);
                                const is_proctored = (document.getElementById('ac-proctor') as HTMLSelectElement).value === 'true';
                                const due_date = (document.getElementById('ac-due') as HTMLInputElement).value;
                                const description = (document.getElementById('ac-desc') as HTMLTextAreaElement).value;

                                const { error } = await supabase.from('assessments').insert({
                                  course_id, type, title, total_marks, weight, passing_score, is_proctored, due_date: due_date || null, description
                                });
                                if (error) alert(error.message);
                                else {
                                  alert('Academic item created with integrity controls!');
                                  (document.getElementById('ac-title') as HTMLInputElement).value = '';
                                }
                              }}
                              className="btn btn-brand px-12 py-4"
                            >💾 Save Academic Item</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === 'news' ? (
                    <NewsManager />
                  ) : activeTab === 'events' ? (
                    <EventsManager />
                  ) : activeTab === 'finances' ? (
                    <FinanceManager />
                  ) : activeTab === 'progress' ? (
                    <StudentProgressTracker />
                  ) : activeTab === 'governance' ? (
                    <div className="space-y-8 animate-fade">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card border border-border-custom rounded-3xl p-10">
                          <h3 className="font-syne font-bold text-2xl mb-2">Institutional Overrides</h3>
                          <p className="text-text-muted text-xs mb-8">Master controls for Academy-wide features. Overrides per-course settings.</p>
                          <div className="space-y-6">
                            {[
                              { key: 'global_discussions_enabled', label: 'Peer-to-Peer Discussions', desc: 'Activates student forums and social hubs.' },
                              { key: 'global_ai_tutor_enabled', label: 'Intelligent AI Tutor', desc: 'Allows students to query curriculum via GDA_Brain.' },
                              { key: 'campus_overlap_allowed', label: 'Cross-Campus Enrolment', desc: 'Allows students to hold active seats in multiple branches.' },
                              { key: 'transcripts_enabled', label: 'Institutional Transcripts (Beta)', desc: 'Must be manually activated for SuperAdmin verification.' },
                            ].map(opt => (
                              <div key={opt.key} className="flex items-center justify-between p-4 bg-bg border border-border-custom rounded-2xl">
                                <div>
                                  <div className="text-sm font-bold">{opt.label}</div>
                                  <div className="text-[10px] text-text-dim uppercase tracking-tighter">{opt.desc}</div>
                                </div>
                                <button
                                  onClick={async () => {
                                    const newVal = governanceSettings[opt.key] === 'true' ? 'false' : 'true';
                                    const { error } = await supabase.from('school_settings').update({ value: JSON.stringify(newVal) }).eq('key', opt.key);
                                    if (error) alert(error.message);
                                    else fetchGovernance();
                                  }}
                                  className={`w-12 h-6 rounded-full relative transition-colors ${governanceSettings[opt.key] === 'true' ? 'bg-brand' : 'bg-surface border border-border-custom'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${governanceSettings[opt.key] === 'true' ? 'left-7' : 'left-1'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-navy border border-brand/10 rounded-3xl p-10 flex flex-col justify-between">
                          <div>
                            <h3 className="font-syne font-bold text-2xl mb-2 text-brand">DHET Compliance Hub</h3>
                            <p className="text-sm text-text-soft leading-relaxed mb-6">Access immutable records required for SACE, SAQA, and Department audits. No records can be deleted from this portal.</p>
                          </div>
                          <div className="space-y-4">
                            <button onClick={() => setActiveTab('communications')} className="w-full btn btn-outline py-4 flex items-center justify-between px-6">
                              <span className="text-xs uppercase tracking-widest font-dm-mono">View Audit Trails</span>
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                            <button className="w-full btn btn-brand py-4 flex items-center justify-between px-6">
                              <span className="text-xs text-bg uppercase tracking-widest font-bold">Generate Annual Report</span>
                              <BarChart3 className="w-4 h-4 text-bg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === 'registry' ? (
                    <InstitutionalUserRegistry />
                  ) : activeTab === 'timetable' ? (
                    <TimetableManager courses={courses} />
                  ) : activeTab === 'attendance' ? (
                    <AttendanceHub courses={courses} />
                  ) : activeTab === 'vault' ? (
                    <InstitutionalResourceVault />
                  ) : activeTab === 'staff' ? (
                    <StaffManagement />
                  ) : activeTab === 'graduation' ? (
                    <GraduationPipeline pendingApprovals={pendingApprovals} onApprove={handleApproveAlumni} />
                  ) : activeTab === 'audit' ? (
                    <InstitutionalAuditHub pendingApprovals={pendingApprovals} onApprove={handleApproveAlumni} />
                  ) : activeTab === 'communications' ? (
                    <CommunicationLogs />
                  ) : (
                    <SiteSettings />
                  )}
                </div>
              </div>
            </main>
          </div>
        </>
      )}

      {/* ─── APPLICATION DETAIL MODAL ─── */}
      {selectedApp && (
        <div className="fixed inset-0 z-[3000] bg-bg/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedApp(null)}>
          <div className="bg-card border border-border-custom rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-muted hover:text-text-custom" onClick={() => setSelectedApp(null)}>✕</button>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-dm-mono text-[10px] uppercase tracking-widest text-brand">{selectedApp.type} Application</span>
                <AIMatchBadge score={selectedApp.ai_match_score} />
              </div>
              <h2 className="font-syne font-extrabold text-2xl">
                {selectedApp.type === 'individual' ? `${selectedApp.first_name} ${selectedApp.last_name}` : selectedApp.organization_name}
              </h2>
              <p className="text-text-muted text-sm">{selectedApp.email}</p>
              {selectedApp.student_number && (
                <p className="text-brand font-dm-mono text-sm mt-1">{selectedApp.student_number}</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Phone</label>
                  <p className="text-sm">{selectedApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Applied On</label>
                  <p className="text-sm">{new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Biographical Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Date of Birth</label>
                  <p className="text-sm">{selectedApp.date_of_birth ? new Date(selectedApp.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">ID / Passport</label>
                  <p className="text-sm font-mono">{selectedApp.id_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Gender</label>
                  <p className="text-sm">{selectedApp.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Nationality</label>
                  <p className="text-sm">{selectedApp.nationality || 'N/A'}</p>
                </div>
              </div>

              {/* Address Data */}
              <div className="pt-4 border-t border-border-custom">
                <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-2">Residential Address</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-dm-mono text-[8px] uppercase text-text-muted mb-0.5">Street Address</label>
                    <p className="text-[13px]">{selectedApp.address_line1 || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block font-dm-mono text-[8px] uppercase text-text-muted mb-0.5">City</label>
                    <p className="text-[13px]">{selectedApp.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block font-dm-mono text-[8px] uppercase text-text-muted mb-0.5">Province</label>
                    <p className="text-[13px]">{selectedApp.province || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block font-dm-mono text-[8px] uppercase text-text-muted mb-0.5">Postcode</label>
                    <p className="text-[13px]">{selectedApp.postal_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block font-dm-mono text-[8px] uppercase text-text-muted mb-0.5">Country</label>
                    <p className="text-[13px]">{selectedApp.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedApp.type === 'individual' && (
                <>
                  <div>
                    <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Program</label>
                    <p className="text-sm font-semibold text-brand">{selectedApp.program}</p>
                  </div>
                  <div>
                    <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Highest Qualification</label>
                    <p className="text-sm">{selectedApp.qualification || 'N/A'}</p>
                  </div>
                </>
              )}

              {selectedApp.message && (
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Message</label>
                  <div className="bg-surface p-4 rounded border border-border-custom text-sm italic text-text-soft">
                    "{selectedApp.message}"
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Admin Notes</label>
                <textarea
                  className="w-full bg-surface border border-border-custom rounded p-3 text-sm h-20"
                  placeholder="Add internal notes about this application..."
                  defaultValue={selectedApp.admin_notes || ''}
                  onBlur={async (e) => {
                    if (e.target.value !== (selectedApp.admin_notes || '')) {
                      await supabase.from('applications').update({ admin_notes: e.target.value }).eq('id', selectedApp.id);
                      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, admin_notes: e.target.value } : a));
                    }
                  }}
                />
              </div>

              {/* History / Audit Trail */}
              {Array.isArray(selectedApp.history) && selectedApp.history.length > 0 && (
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-2">Audit Trail</label>
                  <div className="space-y-2">
                    {selectedApp.history.map((h: any, i: number) => (
                      <div key={i} className="flex gap-3 items-start text-[11px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0"></div>
                        <div>
                          <span className="font-semibold">{h.event}</span>
                          <span className="text-text-muted ml-2">{new Date(h.timestamp).toLocaleString()}</span>
                          {h.by && <span className="text-text-dim ml-1">by {h.by}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                {selectedApp.cv_url && (
                  <a href={selectedApp.cv_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm flex-1 justify-center">Download CV</a>
                )}
                <a href={`mailto:${selectedApp.email}`} className="btn btn-brand btn-sm flex-1 justify-center">Email Applicant</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMMUNICATION LOGS ──────────────────────
function CommunicationLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'comms'>('audit');

  useEffect(() => {
    fetchLogs();
    fetchAuditLogs();
  }, []);

  async function fetchLogs() {
    try {
      const { data, error } = await supabase.from('email_logs').select('*').order('created_at', { ascending: false });
      if (!error) setLogs(data || []);
    } catch (err) {
      console.error('Error fetching email logs:', err);
    }
  }

  async function fetchAuditLogs() {
    const { data } = await supabase.from('governance_audit_logs').select('*').order('created_at', { ascending: false });
    setAuditLogs(data || []);
  }

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex gap-4 border-b border-border-custom pb-4">
        <button onClick={() => setActiveSubTab('comms')} className={`text-[10px] uppercase tracking-widest font-dm-mono px-4 py-2 rounded-lg ${activeSubTab === 'comms' ? 'bg-brand/10 text-brand' : 'text-text-muted hover:text-text-custom'}`}>Communication History</button>
        <button onClick={() => setActiveSubTab('audit')} className={`text-[10px] uppercase tracking-widest font-dm-mono px-4 py-2 rounded-lg ${activeSubTab === 'audit' ? 'bg-brand/10 text-brand' : 'text-text-muted hover:text-text-custom'}`}>Institutional Governance Logs</button>
      </div>

      {activeSubTab === 'comms' ? (
        <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-border-custom">
                <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Timestamp</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Recipient</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Subject</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/2 transition-colors text-xs">
                  <td className="p-6 font-dm-mono text-text-dim">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-6 font-bold text-text-custom">{log.recipient_email}</td>
                  <td className="p-6 text-text-soft">{log.subject}</td>
                  <td className="p-6 text-center">
                    <span className="px-2 py-1 rounded-[4px] text-[9px] font-bold uppercase bg-emerald/10 text-emerald border border-emerald/20">SENT</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <div className="p-20 text-center text-text-dim text-sm italic">No communication records found.</div>}
        </div>
      ) : (
        <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface/50 border-b border-border-custom">
                  <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Timestamp</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Directive</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Category</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Evidence</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-text-muted font-dm-mono">Motivation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-6 text-xs text-text-dim font-dm-mono">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-6">
                      <span className="px-2 py-1 rounded text-[9px] font-bold uppercase bg-brand/10 text-brand border border-brand/20">{log.action_type || 'ADMIN_OVERRIDE'}</span>
                    </td>
                    <td className="p-6 text-xs font-dm-mono text-text-custom">{log.category}</td>
                    <td className="p-6">
                      {log.evidence_url ? (
                        <a href={log.evidence_url} target="_blank" rel="noreferrer" className="text-sky hover:underline text-[9px] font-dm-mono flex items-center gap-1">
                          📎 VIEW FILING
                        </a>
                      ) : (
                        <span className="text-text-dim text-[9px] italic">No physical filing</span>
                      )}
                    </td>
                    <td className="p-6 text-xs text-text-muted leading-relaxed max-w-xs">{log.admin_notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditLogs.length === 0 && <div className="p-20 text-center text-text-dim text-sm italic">No institutional governance records found.</div>}
        </div>
      )}
    </div>
  );
}

// ─── INSTITUTIONAL USER REGISTRY ────────────────
function InstitutionalUserRegistry() {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeMainTab, setActiveMainTab] = useState<'students' | 'staff'>('students');
  const [activeSubTab, setActiveSubTab] = useState('active'); // Default for students

  // Governance Modals State
  const [governanceUser, setGovernanceUser] = useState<any>(null);
  const [governanceAction, setGovernanceAction] = useState<any>(null); // { type: string, newStatus: string, newRole: string }
  const [motivation, setMotivation] = useState('');
  const [comments, setComments] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alumniAcademicRecord, setAlumniAcademicRecord] = useState<any>(null);

  const isSuperAdmin = profile?.role === 'super_admin' ||
    user?.email === 'academy@ginashe.co.za' ||
    user?.email === 'ginashetraining@gmail.com' ||
    user?.email === 'george@ginashe.co.za';

  const INSTITUTIONAL_ROLES = [
    { id: 'super_admin', label: 'Super Admin', color: 'text-brand', bg: 'bg-brand/10' },
    { id: 'campus_manager', label: 'Campus Manager', color: 'text-sky', bg: 'bg-sky/10' },
    { id: 'head_of_department', label: 'HOD', color: 'text-purple', bg: 'bg-purple/10' },
    { id: 'lecturer_senior', label: 'Senior Lecturer', color: 'text-emerald', bg: 'bg-emerald/10' },
    { id: 'lecturer_junior', label: 'Lecturer', color: 'text-emerald/70', bg: 'bg-emerald/5' },
    { id: 'registrar', label: 'Registrar', color: 'text-amber', bg: 'bg-amber/10' },
    { id: 'bursar', label: 'Bursar', color: 'text-rose', bg: 'bg-rose/10' },
    { id: 'student', label: 'Student', color: 'text-text-dim', bg: 'bg-surface' },
  ];

  const MOTIVATION_CATEGORIES = [
    'Academic Dishonesty',
    'Disciplinary',
    'Financial Default',
    'Voluntary Deregistration',
    'Cancellation',
    'Deferred',
    'Institutional Override',
    'Curriculum Completion (Standard)',
    'Administrative Error Correction',
    'Force Graduate (Governance Evidence Required)',
    'Conduct Violation',
    'Plagiarism',
    'Financial Suspension',
    'Legal Compliance'
  ];

  const STUDENT_LIFECYCLE_TABS = [
    { id: 'active', label: 'Registered' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'suspended', label: 'Suspended' },
    { id: 'terminated', label: 'Terminated' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'deferred', label: 'Deferred' }
  ];

  const STAFF_DEPT_TABS = [
    { id: 'executive', label: 'Executive' },
    { id: 'academic', label: 'Academic' },
    { id: 'support', label: 'Support' },
    { id: 'operations', label: 'Operations' },
    { id: 'financial_aid', label: 'Financial Aid' },
    { id: 'registrar_office', label: 'Registrar Office' },
    { id: 'it_support', label: 'IT Support' },
    { id: 'admissions', label: 'Admissions' }
  ];

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('last_name', { ascending: true });
    setUsers(data || []);
    setLoading(false);
  }

  // ─── GOVERNANCE ACTION COMMITS ───
  async function commitGovernanceAction() {
    if (!isSuperAdmin) return;
    if (!motivation) { alert('Protocol Violation: Motivation Category is mandatory.'); return; }
    setIsProcessing(true);

    try {
      let finalEvidenceUrl = evidenceUrl;

      // Handle Physical Evidence Upload if file selected
      const fileInput = document.getElementById('governance-evidence-upload') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${governanceUser.id}_${Date.now()}.${fileExt}`;
        const filePath = `evidence/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('governance_evidence')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('governance_evidence')
          .getPublicUrl(filePath);

        finalEvidenceUrl = publicUrl;
      } else if ((motivation === 'Institutional Override' || governanceAction.newStatus === 'alumni' || motivation.includes('Evidence Required')) && !evidenceUrl) {
        // Check if URL was provided manually or if it was required
        alert('Protocol Violation: This action requires physical evidence (File or URL).');
        setIsProcessing(false);
        return;
      }

      // 1. Update Target Profile
      const updateData: any = {};
      if (governanceAction.newStatus) updateData.account_status = governanceAction.newStatus;
      if (governanceAction.newRole) updateData.role = governanceAction.newRole;
      if (governanceAction.newDept) {
        const currentDepts = governanceUser.departments || [];
        updateData.departments = Array.from(new Set([...currentDepts, governanceAction.newDept]));
      }

      const { error: upErr } = await supabase.from('profiles').update(updateData).eq('id', governanceUser.id);
      if (upErr) throw upErr;

      // 2. Archive to Governance Log
      const { error: logErr } = await supabase.from('governance_audit_logs').insert({
        actor_id: user?.id,
        target_id: governanceUser.id,
        action_type: governanceAction.type,
        motivation_category: motivation,
        admin_comments: comments,
        evidence_url: finalEvidenceUrl,
        metadata: { prev_state: governanceUser, action_details: governanceAction }
      });
      if (logErr) throw logErr;

      // 3. Post-Action Specifics (Alumni Record)
      if (governanceAction.newStatus === 'alumni') {
        const { error: alumniErr } = await supabase.from('alumni_records').insert({
          user_id: governanceUser.id,
          graduation_year: new Date().getFullYear(),
          program: alumniAcademicRecord?.program || 'Verified GDA Programme',
          achievements: 'Institutional Graduation via SuperAdmin Override',
          governance_reference: finalEvidenceUrl
        });
        if (alumniErr) console.warn('Post-Action Warning: Alumni record creation failed', alumniErr);
      }

      toast.success('Administrative Directive Successfully Executed.');
      setGovernanceUser(null);
      setMotivation('');
      setComments('');
      setEvidenceUrl('');
      fetchUsers();
    } catch (err: any) {
      toast.error('Governance Breach Detected', { description: err.message });
    }
    finally { setIsProcessing(false); }
  }

  // ─── ACADEMIC VERIFICATION ───
  async function triggerAlumniProcess(targetUser: any) {
    setGovernanceUser(targetUser);
    setGovernanceAction({ type: 'STATUS_CHANGE', newStatus: 'alumni' });

    // Fetch academic record for popup
    const { data: enrollments } = await supabase.from('enrollments').select('*, courses(title)').eq('user_id', targetUser.id);
    const { data: submissions } = await supabase.from('submissions').select('*').eq('user_id', targetUser.id);

    setAlumniAcademicRecord({
      enrollments: enrollments || [],
      avgGrade: submissions?.length ? (submissions.reduce((acc, curr) => acc + (curr.marks_obtained || 0), 0) / submissions.length).toFixed(1) : 0
    });
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.student_number?.toLowerCase().includes(search.toLowerCase());

    if (activeMainTab === 'students') {
      return matchesSearch && u.role === 'student' && (u.account_status || 'active') === activeSubTab;
    } else {
      // Staff logic: roles other than student
      const isStaff = u.role !== 'student';
      if (!isStaff) return false;

      // Filter by department (Support multi-dept per your request)
      if (activeSubTab === 'executive') return matchesSearch && (u.role === 'super_admin' || u.role === 'campus_manager' || (u.departments || []).includes('Executive'));
      if (activeSubTab === 'academic') return matchesSearch && (u.role === 'head_of_department' || u.role?.includes('lecturer') || (u.departments || []).includes('Academic'));
      if (activeSubTab === 'support') return matchesSearch && (u.role === 'registrar' || u.role === 'bursar' || (u.departments || []).includes('Support'));
      if (activeSubTab === 'operations') return matchesSearch && (u.departments || []).includes('Operations');
      if (activeSubTab === 'financial_aid') return matchesSearch && (u.departments || []).includes('Financial Aid');
      if (activeSubTab === 'registrar_office') return matchesSearch && (u.departments || []).includes('Registrar Office');
      if (activeSubTab === 'it_support') return matchesSearch && (u.departments || []).includes('IT Support');
      if (activeSubTab === 'admissions') return matchesSearch && (u.departments || []).includes('Admissions');

      return matchesSearch;
    }
  });

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── PRIMARY REGISTRY NAVIGATION ─── */}
      <div className="flex items-center justify-between p-1.5 bg-card/50 border border-border-custom rounded-2xl w-fit mb-8">
        <button
          onClick={() => { setActiveMainTab('students'); setActiveSubTab('active'); }}
          className={`px-8 py-3 rounded-xl text-xs font-dm-mono uppercase transition-all flex items-center gap-3 ${activeMainTab === 'students' ? 'bg-brand text-bg shadow-lg shadow-brand/20 font-bold' : 'text-text-muted hover:text-text-custom'}`}
        >
          <UserRound className="w-4 h-4" />
          STUDENT REGISTRY
        </button>
        <button
          onClick={() => { setActiveMainTab('staff'); setActiveSubTab('executive'); }}
          className={`px-8 py-3 rounded-xl text-xs font-dm-mono uppercase transition-all flex items-center gap-3 ${activeMainTab === 'staff' ? 'bg-brand text-bg shadow-lg shadow-brand/20 font-bold' : 'text-text-muted hover:text-text-custom'}`}
        >
          <Briefcase className="w-4 h-4" />
          STAFF LEDGER
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Secondary Lifecycle/Dept Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border-custom rounded-xl overflow-x-auto custom-scrollbar max-w-full">
          {(activeMainTab === 'students' ? STUDENT_LIFECYCLE_TABS : STAFF_DEPT_TABS).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-[9px] font-dm-mono uppercase whitespace-nowrap transition-all ${activeSubTab === tab.id ? 'bg-white/5 text-brand border border-brand/20' : 'text-text-dim hover:text-white'}`}
            >
              {tab.label}
              {activeMainTab === 'students' && (
                <span className="ml-2 font-bold opacity-50">{users.filter(u => u.role === 'student' && (u.account_status || 'active') === tab.id).length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Toggler */}
          <div className="flex items-center gap-1 p-1 bg-surface border border-border-custom rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand text-bg shadow-sm' : 'text-text-dim'}`}>
              <List size={14} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand text-bg shadow-sm' : 'text-text-dim'}`}>
              <LayoutGrid size={14} />
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-xs">🔍</span>
            <input
              placeholder={`Search ${activeMainTab === 'students' ? 'Student Base' : 'Staff Ledger'}...`}
              className="bg-surface border border-border-custom rounded-xl py-2 pl-9 pr-4 text-xs font-dm-mono w-48 lg:w-64 focus:border-brand/50 transition-all outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
          <p className="mt-6 text-xs font-dm-mono uppercase tracking-[0.2em]">Synchronizing Records Vault...</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-[#0a0d14] border border-brand/10 rounded-2xl overflow-hidden shadow-2xl relative isolate">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface/50 border-b border-brand/10 text-brand text-[9px] uppercase font-dm-mono tracking-[0.2em]">
                  <th className="p-4">Identity Verification</th>
                  <th className="p-4">Governance Role</th>
                  <th className="p-4">Institutional Presence</th>
                  <th className="p-4 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className={`hover:bg-brand/5 transition-colors group ${u.account_status === 'suspended' ? 'opacity-60 grayscale' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} className="w-9 h-9 rounded-xl object-cover border border-brand/10 shadow-lg" alt="" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-surface border border-brand/10 flex items-center justify-center font-black text-xs text-brand">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-text-soft flex items-center gap-2">
                            {u.first_name} {u.last_name}
                            {u.account_status === 'suspended' && <XCircle className="w-3 h-3 text-coral" />}
                          </div>
                          <div className="text-[10px] text-text-dim font-dm-mono lowercase">{u.email}</div>
                          <div className="text-[9px] font-dm-mono text-brand mt-0.5">{u.student_number || 'STAFF-ID: ' + u.id.slice(0, 6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${INSTITUTIONAL_ROLES.find(r => r.id === (u.role || 'student'))?.bg || 'bg-surface'
                          } ${INSTITUTIONAL_ROLES.find(r => r.id === (u.role || 'student'))?.color || 'text-text-dim'}`}>
                          {u.role || 'student'}
                        </span>
                        {(u.departments || []).map((d: string) => (
                          <span key={d} className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-white/5 border border-white/10 text-white/50">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="text-[10px] font-dm-mono text-text-dim uppercase tracking-widest">{u.campus_id ? 'Branch Authenticated' : 'Remote Access'}</div>
                        <div className="text-[8px] text-text-dim font-dm-mono uppercase mt-1">Joined: {new Date(u.created_at).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && (
                          <>
                            {activeMainTab === 'students' && (u.account_status || 'active') === 'active' && (
                              <button
                                onClick={() => triggerAlumniProcess(u)}
                                className="p-2 bg-emerald/10 text-emerald border border-emerald/20 rounded-lg hover:bg-emerald hover:text-bg transition-all"
                                title="Process Graduation"
                              >
                                <Verified size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => { setGovernanceUser(u); setGovernanceAction({ type: 'STATUS_CHANGE', newStatus: u.account_status === 'suspended' ? 'active' : 'suspended' }); }}
                              className={`p-2 border rounded-lg transition-all ${u.account_status === 'suspended' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-coral/10 text-coral border-coral/20 hover:bg-coral hover:text-white'}`}
                              title={u.account_status === 'suspended' ? 'Reactivate Hub' : 'Suspend Access'}
                            >
                              <History size={14} />
                            </button>
                            <select
                              className="bg-surface border border-brand/10 rounded-lg py-1.5 px-2 text-[10px] font-dm-mono focus:border-brand transition-all outline-none"
                              value={u.role || 'student'}
                              onChange={(e) => {
                                setGovernanceUser(u);
                                setGovernanceAction({ type: 'ROLE_UPDATE', newRole: e.target.value });
                              }}
                            >
                              {INSTITUTIONAL_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                            </select>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(u => (
            <div key={u.id} className={`bg-card border border-border-custom rounded-3xl p-6 relative overflow-hidden group hover:border-brand/30 transition-all ${u.account_status === 'suspended' ? 'opacity-60 grayscale' : ''}`}>
              {u.account_status === 'suspended' && <div className="absolute top-4 right-4 text-coral text-[8px] font-black uppercase tracking-widest bg-coral/10 px-2 py-0.5 rounded border border-coral/20">Access Locked</div>}
              <div className="flex items-center gap-4 mb-6">
                {u.avatar_url ? (
                  <img src={u.avatar_url} className="w-14 h-14 rounded-2xl object-cover border border-brand/10 shadow-xl" alt="" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-surface border border-brand/10 flex items-center justify-center font-black text-lg text-brand shadow-inner">
                    {u.first_name?.[0]}{u.last_name?.[0]}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="font-syne font-black text-base text-text-soft truncate leading-tight uppercase">{u.first_name} <br /> {u.last_name}</h3>
                  <p className="text-[10px] font-dm-mono text-brand mt-1 truncate">{u.student_number || 'GDA-ADMIN-' + u.id.slice(0, 4).toUpperCase()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter border shadow-sm ${INSTITUTIONAL_ROLES.find(r => r.id === (u.role || 'student'))?.bg || 'bg-surface'
                    } ${INSTITUTIONAL_ROLES.find(r => r.id === (u.role || 'student'))?.color || 'text-text-dim'}`}>
                    {u.role || 'student'}
                  </span>
                  {(u.departments || []).map((d: string) => (
                    <span key={d} className="px-2 py-1 rounded-md text-[8px] font-bold uppercase bg-white/5 border border-white/10 text-white/50">{d}</span>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-dm-mono uppercase text-text-dim">Branch Presence</span>
                    <span className="text-[10px] text-text-soft font-bold uppercase tracking-widest">{u.campus_id ? 'Authenticated' : 'Remote'}</span>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => { setGovernanceUser(u); setGovernanceAction({ type: 'STATUS_CHANGE', newStatus: u.account_status === 'suspended' ? 'active' : 'suspended' }); }}
                      className="text-[9px] font-dm-mono text-coral hover:text-brand transition-colors underline underline-offset-4"
                    >
                      LOCK ACCOUNT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── GOVERNANCE MOTIVATION MODAL ─── */}
      {governanceUser && governanceAction && (
        <div className="fixed inset-0 z-[4000] bg-bg/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade">
          <div className="bg-card border border-brand/20 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] flex flex-col items-center p-12 relative">
            <button onClick={() => { setGovernanceUser(null); setAlumniAcademicRecord(null); }} className="absolute top-8 right-8 text-text-dim hover:text-white transition-colors">✕</button>

            <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-brand/20">
              <ShieldCheck className="w-10 h-10 text-brand" />
            </div>

            <h2 className="font-syne font-black text-3xl mb-2 tracking-tighter text-center uppercase">Institutional Directive</h2>
            <p className="text-text-muted text-xs text-center mb-10 max-w-sm">Every administrative command requires a motivational seal for institutional accountability. Please archive your reasoning.</p>

            {/* ALUMNI ACADEMIC RECORD HUB */}
            {alumniAcademicRecord && (
              <div className="w-full bg-surface border border-brand/10 rounded-2xl p-6 mb-8 text-center animate-fadeUp">
                <span className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.3em] mb-4 block underline">ACADEMIC VERIFICATION HUB</span>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-card border border-brand/5 rounded-xl">
                    <div className="text-[8px] text-text-dim uppercase mb-1">Modules Passed</div>
                    <div className="text-xl font-syne font-black text-brand">{alumniAcademicRecord.enrollments.length}</div>
                  </div>
                  <div className="p-3 bg-card border border-brand/5 rounded-xl">
                    <div className="text-[8px] text-text-dim uppercase mb-1">Mean Marks (%)</div>
                    <div className="text-xl font-syne font-black text-brand">{alumniAcademicRecord.avgGrade}%</div>
                  </div>
                </div>
                {alumniAcademicRecord.enrollments.length === 0 && (
                  <div className="p-2 bg-coral/10 text-coral text-[9px] font-bold rounded border border-coral/20 uppercase">
                    Warning: No Academic Activity Detected. SuperAdmin Override Required.
                  </div>
                )}
              </div>
            )}

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Protocol Motivation</label>
                <select
                  className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono uppercase focus:border-brand transition-all outline-none cursor-pointer"
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                >
                  <option value="">Select Official Reasoning...</option>
                  {MOTIVATION_CATEGORIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Executive Commentary</label>
                <textarea
                  className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs h-32 focus:border-brand transition-all outline-none resize-none"
                  placeholder="Elaborate on the institutional necessity of this decision..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">
                    Physical Evidence (Direct Upload)
                  </label>
                  <input
                    id="governance-evidence-upload"
                    type="file"
                    className="w-full bg-bg border border-border-custom rounded-xl p-4 text-[10px] font-dm-mono"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-custom" /></div>
                  <div className="relative flex justify-center text-[8px] uppercase font-dm-mono"><span className="bg-card px-2 text-text-dim">OR Manual URL</span></div>
                </div>

                <div className="space-y-2">
                  <input
                    type="url"
                    className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono focus:border-brand transition-all outline-none"
                    placeholder="External Evidence URL..."
                    value={evidenceUrl}
                    onChange={e => setEvidenceUrl(e.target.value)}
                  />
                </div>
                {(motivation === 'Institutional Override' || governanceAction.newStatus === 'alumni' || (motivation && motivation.includes('Evidence Required'))) && (
                  <p className="text-[8px] text-coral uppercase pl-1 font-bold animate-pulse">
                    PROTOCOL WARNING: High-compliance action requires evidence upload or URL.
                  </p>
                )}
              </div>

              <button
                onClick={commitGovernanceAction}
                disabled={isProcessing}
                className={`w-full btn btn-brand py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'COMMITTING ARCHIVE...' : 'COMMIT DIRECTIVE'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BROADCAST HUB ──────────────────────────
function BroadcastHub() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>('info');
  const [isSending, setIsSending] = useState(false);

  async function handleBroadcast() {
    if (!title || !content) { alert('Policy violation: Title and Content required.'); return; }
    setIsSending(true);

    try {
      // 1. Log to Announcements
      const { error: annErr } = await supabase.from('announcements').insert({
        title, content, type, priority: type === 'urgent' ? 'high' : 'normal', created_by: user?.id
      });
      if (annErr) throw annErr;

      // 2. Dispatch Push Alerts (Simulated via system_notifications for all users)
      const { data: users } = await supabase.from('profiles').select('id');
      if (users && type === 'urgent') {
        const notifications = users.map(u => ({
          user_id: u.id,
          title: `URGENT: ${title}`,
          message: content,
          is_read: false
        }));
        await supabase.from('system_notifications').insert(notifications);
      }

      toast.success('Institutional Bulletin Dispatched');
      setTitle(''); setContent(''); setType('info');
    } catch (err: any) { toast.error('System Failure', { description: err.message }); }
    finally { setIsSending(false); }
  }

  return (
    <div className="space-y-8 animate-fade">
      <div className="bg-card border border-border-custom rounded-3xl p-10 relative overflow-hidden isolate">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px]" />

        <h3 className="font-syne font-black text-3xl mb-2 tracking-tighter">Broadcast Command Centre</h3>
        <p className="text-xs text-text-muted mb-8 max-w-xl">Dispatch institutional directives, emergency alerts, and curriculum updates across the academy ecosystem.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest">Protocol Title</label>
              <input
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm focus:border-brand transition-all outline-none"
                placeholder="Institutional Directive #772..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest">Dispatch Priority</label>
              <select
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm appearance-none focus:border-brand transition-all outline-none cursor-pointer"
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option value="info">General Information</option>
                <option value="warning">Policy Warning</option>
                <option value="urgent">Urgent Alert (Push Global)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest">Bulletin Content</label>
            <textarea
              className="w-full bg-bg border border-border-custom rounded-xl p-4 text-sm h-48 focus:border-brand transition-all outline-none resize-none custom-scrollbar"
              placeholder="Explicit details regarding the institutional update..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleBroadcast}
              disabled={isSending}
              className={`btn btn-brand px-12 py-4 flex items-center gap-3 group ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Zap className={`w-4 h-4 ${type === 'urgent' ? 'animate-pulse fill-bg' : ''}`} />
              {isSending ? 'DISPATCHING...' : 'DISPATCH DIRECTIVE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: '', role: 'admin', first_name: '', last_name: '' });

  useEffect(() => { fetchStaff(); }, []);

  async function fetchStaff() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').neq('role', 'student');
      if (error) throw error;
      setStaff(data || []);
    } catch (err: any) { console.error('Error fetching staff:', err.message); }
    finally { setLoading(false); }
  }

  async function handleUpdateRole(id: string, newRole: string) {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) throw error;
      fetchStaff();
    } catch (err: any) { toast.error('Error updating role', { description: err.message }); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Staff & Roles</h2>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(staff, 'gda-staff')} className="btn btn-outline btn-sm">📤 Export</button>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-brand btn-sm">{isAdding ? 'Cancel' : '+ Add Staff'}</button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-card border border-border-custom rounded-xl p-6 mb-6">
          <p className="text-sm text-text-muted mb-4">Note: Staff members must first create an account. You can then upgrade their role here.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Email Address" className="bg-surface border border-border-custom rounded p-2 text-sm" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
            <select className="bg-surface border border-border-custom rounded p-2 text-sm" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}>
              <option value="admin">Administrator</option>
              <option value="instructor">Instructor</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button onClick={async () => {
              const { data: u } = await supabase.from('profiles').select('id').eq('email', newStaff.email).single();
              if (u) { handleUpdateRole(u.id, newStaff.role); setIsAdding(false); }
              else { toast.error('Protocol Violation', { description: 'User not found. They must sign up first.' }); }
            }} className="btn btn-brand">Assign Role</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border-custom rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border-custom">
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Staff Member</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Current Role</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(m => (
              <tr key={m.id} className="border-b border-border-custom">
                <td className="p-4">
                  <div className="font-bold">{m.first_name} {m.last_name}</div>
                  <div className="text-[10px] text-text-muted">{m.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-dm-mono uppercase border ${m.role === 'super_admin' ? 'border-brand/20 text-brand bg-brand-dim' : 'border-sky/20 text-sky bg-sky-dim'}`}>{m.role}</span>
                </td>
                <td className="p-4">
                  <select className="bg-surface border border-border-custom rounded p-1 text-[11px]" value={m.role} onChange={(e) => handleUpdateRole(m.id, e.target.value)}>
                    <option value="student">Demote to Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SITE SETTINGS ───────────────────────────
function SiteSettings() {
  const [settings, setSettings] = useState({
    heroTitle: 'Master the Future of Digital Innovation',
    heroSubtitle: 'Join Africa\'s premier academy for Cloud Engineering, AI, and Digital Transformation.',
    intakeStatus: 'OPEN',
    contactEmail: 'admissions@ginashe.co.za',
    showFaculty: true, showCurriculum: true, showAbout: true, showAdmissions: true,
    showHero: true, showTrustBar: true, showPrograms: true, showCTA: true,
    trustBarTitle: 'Recognised by',
    programsTitle: 'Rigorous pathways.\nReal-world outcomes.',
    programsSubtitle: 'Every programme is co-designed with industry, built on cloud-vendor curricula, and delivered by practitioners who have solved the problems you\'ll face.',
    ctaTitle: 'Your cloud career starts today.',
    ctaSubtitle: 'Applications for the April 2026 cohort close soon. Seats are limited to 25 per cohort — secure yours now.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSettings(data);
    } catch (err: any) { console.error('Error:', err.message); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings });
      if (error) throw error;
      toast.success('Institutional Settings Synchronized');
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border-custom rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-syne font-bold text-xl">Global Site Settings</h2>
          <button onClick={handleSave} disabled={saving} className={`btn btn-brand btn-sm ${saving ? 'opacity-50' : ''}`}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Intake Status</label>
              <select className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.intakeStatus} onChange={e => setSettings({ ...settings, intakeStatus: e.target.value })}>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="WAITLIST">WAITLIST ONLY</option>
              </select>
            </div>
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Contact Email</label>
              <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Hero Main Title</label>
            <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} />
          </div>
          <div>
            <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Hero Subtitle</label>
            <textarea className="w-full bg-surface border border-border-custom rounded p-2 text-sm h-24" value={settings.heroSubtitle} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} />
          </div>

          <div className="pt-6 border-t border-border-custom">
            <h3 className="font-syne font-bold text-sm mb-4 uppercase tracking-wider">Page Visibility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'showCurriculum', label: 'Curriculum Page' },
                { id: 'showFaculty', label: 'Faculty Page' },
                { id: 'showAbout', label: 'About Page' },
                { id: 'showAdmissions', label: 'Admissions Page' }
              ].map(page => (
                <label key={page.id} className="flex items-center justify-between p-3 bg-surface border border-border-custom rounded-md cursor-pointer hover:border-brand/30 transition-all">
                  <span className="text-xs font-medium">{page.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={(settings as any)[page.id]} onChange={e => setSettings({ ...settings, [page.id]: e.target.checked })} />
                    <div className="w-9 h-5 bg-bg/50 border border-border-custom peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand peer-checked:after:bg-bg"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border-custom">
            <button onClick={handleSave} disabled={saving} className={`btn btn-brand w-full ${saving ? 'opacity-50' : ''}`}>
              {saving ? 'Saving...' : 'Update Site Content'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-custom border-dashed rounded-xl p-8 text-center">
        <h3 className="font-syne font-bold text-lg mb-2">Advanced Configuration</h3>
        <p className="text-sm text-text-muted mb-6">Manage API keys, payment integrations, and system logs.</p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-outline btn-sm">Paystack Config</button>
          <button className="btn btn-outline btn-sm">Email Templates</button>
          <button className="btn btn-outline btn-sm">System Logs</button>
        </div>
      </div>
    </div>
  );
}

// ─── COURSE MANAGER ──────────────────────────
// ─── TIMETABLE MANAGER ───────────────────────
function TimetableManager({ courses }: { courses: any[] }) {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'subject' | 'institutional' | 'exam' | 'term'>('subject');
  const [form, setForm] = useState<any>({ title: '', description: '', category: 'subject', start_time: '', end_time: '', course_id: '', location: '' });

  useEffect(() => {
    fetchSchedule();
  }, []);

  async function fetchSchedule() {
    const { data } = await supabase.from('academic_schedule').select('*, courses(title)').order('start_time', { ascending: true });
    setSchedule(data || []);
  }

  async function handleSave() {
    try {
      if (!form.title || !form.start_time) throw new Error('Title and Start Time are required');

      const { error } = await supabase.from('academic_schedule').upsert({
        ...form,
        course_id: form.category === 'subject' || form.category === 'exam' ? form.course_id || null : null
      });

      if (error) throw error;
      setIsAdding(false);
      setForm({ title: '', description: '', category: activeCategory, start_time: '', end_time: '', course_id: '', location: '' });
      fetchSchedule();
    } catch (err: any) {
      toast.error('System Failure', { description: err.message });
    }
  }

  const filteredSchedule = schedule.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-between items-center bg-card border border-border-custom p-6 rounded-3xl">
        <div>
          <h2 className="font-syne font-black text-2xl tracking-tighter uppercase">Institutional Command: Scheduling</h2>
          <div className="flex gap-4 mt-2">
            {['subject', 'institutional', 'exam', 'term'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`text-[9px] font-dm-mono uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${activeCategory === cat ? 'bg-brand text-bg border-brand font-bold' : 'border-white/10 text-text-muted hover:border-brand/30'
                  }`}
              >
                {cat.replace('_', ' ')}s
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-brand px-8 py-3 text-[10px] font-black tracking-widest uppercase shadow-xl shadow-brand/10">
          {isAdding ? 'DISCARD PROTOCOL' : `+ DEPLOY ${activeCategory.toUpperCase()}`}
        </button>
      </div>

      {isAdding && (
        <div className="bg-navy border border-brand/20 rounded-[2.5rem] p-8 animate-fadeDown shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.2em] px-2">Directive Title</label>
              <input
                className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm focus:border-brand outline-none"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Module 4 Sync Session"
              />
            </div>
            {(activeCategory === 'subject' || activeCategory === 'exam') && (
              <div className="space-y-2">
                <label className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.2em] px-2">Target Academic Stream</label>
                <select
                  className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm outline-none"
                  value={form.course_id}
                  onChange={e => setForm({ ...form, course_id: e.target.value })}
                >
                  <option value="">Select Modular Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.2em] px-2">Temporal Point (Start)</label>
              <input
                type="datetime-local"
                className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm"
                value={form.start_time}
                onChange={e => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.2em] px-2">Closure Point (End)</label>
              <input
                type="datetime-local"
                className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm"
                value={form.end_time}
                onChange={e => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-dm-mono text-brand uppercase tracking-[0.2em] px-2">Geographical / Digital Node</label>
              <input
                className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Room 402 / MS Teams / Global"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleSave} className="w-full btn btn-brand py-3 text-[10px] font-black uppercase tracking-widest">COMMIT TO REGISTER</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filteredSchedule.map(session => (
            <div key={session.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-brand/[0.02] transition-colors group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${session.category === 'exam' ? 'bg-coral/20 text-coral' : 'bg-brand/20 text-brand'
                  }`}>
                  {session.category === 'exam' ? '📋' : '📅'}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-lg leading-none mb-2">{session.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-dm-mono uppercase text-text-dim">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(session.start_time).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    {session.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {session.location}</span>}
                    {session.courses && <span className="text-brand font-black">&bull; {session.courses.title}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    if (confirm('Decommission this record?')) {
                      await supabase.from('academic_schedule').delete().eq('id', session.id);
                      fetchSchedule();
                    }
                  }}
                  className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredSchedule.length === 0 && (
            <div className="p-20 text-center text-text-dim italic text-sm">No active {activeCategory} archives detected for the current query.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE HUB ─────────────────────────
function AttendanceHub({ courses }: { courses: any[] }) {
  const [selectedCourse, setSelectedCourse] = useState('');

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-syne font-black text-2xl tracking-tighter">Attendance Registry</h2>
          <p className="text-[10px] font-dm-mono text-brand uppercase tracking-widest">Institutional Presence Tracking</p>
        </div>
        <select
          className="bg-surface border border-border-custom rounded-xl py-2 px-4 text-xs font-dm-mono uppercase outline-none focus:border-brand"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Target Module</option>
          {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-3xl p-20 text-center relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-brand/[0.02] pointer-events-none" />
        <CheckCircle2 className="w-12 h-12 text-brand/20 mx-auto mb-6" />
        <h3 className="font-syne font-bold text-xl mb-2 text-text-soft">Ready for Protocol</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">Select a module above to initiate the digital attendance register. All presence markers are immutable once signed by the facilitator.</p>
      </div>
    </div>
  );
}

// ─── COMPLIANCE DASHBOARD (SUPERADMIN ONLY) ──
function ComplianceDashboard() {
  const [settings, setSettings] = useState<any>({
    seta_accreditation_no: '',
    qcto_reference_no: '',
    dhet_registration_status: 'PRACTITIONER_ONLY',
    compliance_expiry_date: '',
    governance_notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompliance();
  }, []);

  async function fetchCompliance() {
    try {
      const { data } = await supabase.from('school_settings').select('*');
      const mapped: any = {};
      data?.forEach(s => mapped[s.key] = s.value);
      setSettings(prev => ({ ...prev, ...mapped }));
    } catch (err) {
      console.error('Compliance sync failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('school_settings').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
      toast.success('Directive Executed', { description: 'Institutional compliance registry updated.' });
    } catch (err: any) {
      alert('Protocol Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-brand font-dm-mono text-xs uppercase tracking-widest">Synchronizing Compliance Registry...</div>;

  return (
    <div className="space-y-8 animate-fade">
      <div className="bg-coral/10 border border-coral/30 rounded-2xl p-6 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-coral shrink-0" />
        <div>
          <h4 className="font-syne font-black text-coral uppercase text-sm tracking-tight">Regulatory Silence Protocol Active</h4>
          <p className="text-[11px] text-text-soft leading-relaxed mt-1">
            Data within this hub is strictly for institutional governance and audit readiness.
            <span className="font-black text-white ml-1">NEVER EXPOSE THESE DETAILS ON PUBLIC INTERFACES</span> until official SAQA/MICT validation is concluded.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border-custom rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h3 className="font-syne font-bold text-xl mb-8 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand" />
            Accreditation Registry
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Academic Registry ID</label>
              <input
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono focus:border-brand outline-none transition-all"
                value={settings.seta_accreditation_no}
                onChange={e => setSettings({ ...settings, seta_accreditation_no: e.target.value })}
                placeholder="Institutional ID..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Provincial Reference Number</label>
              <input
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono focus:border-brand outline-none transition-all"
                value={settings.qcto_reference_no}
                onChange={e => setSettings({ ...settings, qcto_reference_no: e.target.value })}
                placeholder="Provincial Ref..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">DHET Registration Status</label>
              <select
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono uppercase focus:border-brand outline-none cursor-pointer"
                value={settings.dhet_registration_status}
                onChange={e => setSettings({ ...settings, dhet_registration_status: e.target.value })}
              >
                <option value="PROVISIONAL">Provisional Approval</option>
                <option value="ACTIVE">Fully Registered</option>
                <option value="PRACTITIONER_ONLY">Practitioner-Led (Industry Alignment)</option>
                <option value="PENDING">Application In Progress</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border-custom rounded-[2.5rem] p-10">
          <h3 className="font-syne font-bold text-xl mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand" />
            Governance Calendar
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Audit Renewal Date</label>
              <input
                type="date"
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs font-dm-mono focus:border-brand outline-none"
                value={settings.compliance_expiry_date}
                onChange={e => setSettings({ ...settings, compliance_expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest pl-1">Executive Compliance Notes</label>
              <textarea
                className="w-full bg-bg border border-border-custom rounded-xl p-4 text-xs h-32 focus:border-brand outline-none resize-none"
                placeholder="Internal commentary regarding accreditation milestones..."
                value={settings.governance_notes}
                onChange={e => setSettings({ ...settings, governance_notes: e.target.value })}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full btn btn-brand py-4 font-black uppercase tracking-widest text-[10px] ${saving ? 'opacity-50' : ''}`}
            >
              {saving ? 'UPDATING REGISTRY...' : 'COMMIT COMPLIANCE RECORD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INSTITUTIONAL RESOURCE VAULT ───────────
function InstitutionalResourceVault() {
  const complianceFiles = [
    { title: 'DHET_Accreditation_2026.pdf', type: 'Certificate', date: '2026-01-10' },
    { title: 'Institutional_Governance_Framework.docx', type: 'Policy', date: '2026-02-15' },
    { title: 'SACE_Compliance_Checklist.pdf', type: 'Audit', date: '2026-03-01' },
    { title: 'SAQA_Level_Descript_P1.pdf', type: 'Standard', date: '2025-11-20' },
  ];

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-syne font-black text-2xl tracking-tighter">Institutional Resource Vault</h2>
          <p className="text-[10px] font-dm-mono text-brand uppercase tracking-widest">Encrypted Compliance Repository</p>
        </div>
        <button className="btn btn-brand btn-sm uppercase tracking-widest font-black text-[9px] px-6">+ DEPOSIT DOCUMENT</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceFiles.map((file, i) => (
          <div key={i} className="bg-card border border-border-custom rounded-2xl p-5 hover:border-brand/30 transition-all group cursor-pointer relative isolate overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rounded-full -mr-8 -mt-8 blur-2xl" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-surface border border-border-custom rounded-xl text-brand">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-dm-mono uppercase text-text-dim px-2 py-0.5 border border-border-custom rounded-full">{file.type}</span>
            </div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-brand transition-colors truncate">{file.title}</h4>
            <p className="text-[9px] text-text-dim font-dm-mono uppercase tracking-widest">Stored: {file.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STUDENT TIMETABLE ───────────────────────
function StudentTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = ['08:00', '10:00', '12:00', '14:00', '16:00'];

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-syne font-black text-2xl tracking-tighter">My Personal Schedule</h2>
          <p className="text-[10px] font-dm-mono text-brand uppercase tracking-widest">Active Academic Commitment</p>
        </div>
        <button className="btn btn-outline btn-sm text-[9px] font-black uppercase tracking-widest">Download PDF</button>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-6 divide-x divide-brand/10 border-b border-brand/10 bg-surface/50">
          <div className="p-4 bg-surface" />
          {days.map(d => <div key={d} className="p-4 text-[10px] font-black text-brand uppercase text-center tracking-widest">{d}</div>)}
        </div>
        {slots.map(time => (
          <div key={time} className="grid grid-cols-6 divide-x divide-brand/5 bg-transparent group">
            <div className="p-4 text-[10px] font-dm-mono text-text-dim text-right bg-surface/20">{time}</div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 min-h-[100px] hover:bg-brand/[0.02] transition-colors relative isolate">
                {/* Simulated session */}
                {i === 1 && time === '08:00' && (
                  <div className="absolute inset-2 p-2 bg-brand/10 border border-brand/30 rounded-lg animate-fade">
                    <div className="text-[8px] font-black text-brand uppercase leading-tight mb-1">Cloud Architecture</div>
                    <div className="text-[7px] text-text-soft font-dm-mono italic uppercase">Room 402 • 08:00 - 10:00</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACADEMIC CALENDAR VIEW ──────────────────
function AcademicCalendarView({ schedule, enrollments }: { schedule: any[], enrollments: any[] }) {
  const [activeTab, setActiveTab] = useState<'subject' | 'institutional' | 'term'>('subject');

  // Filter based on enrollments if subject category
  const filteredEvents = useMemo(() => {
    if (activeTab === 'institutional' || activeTab === 'term') {
      return schedule.filter(s => s.category === activeTab);
    }
    // Filter subject and exam events by student's active course IDs
    const enrolledCourseIds = enrollments.map(e => e.course_id);
    return schedule.filter(s =>
      (s.category === 'subject' || s.category === 'exam') &&
      enrolledCourseIds.includes(s.course_id)
    );
  }, [schedule, enrollments, activeTab]);

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-custom">
        <div>
          <h2 className="font-syne font-black text-3xl tracking-tighter uppercase mb-2">Academic Ledger</h2>
          <div className="flex gap-4">
            {[
              { id: 'subject', label: 'Academic Subjects', icon: BookOpen },
              { id: 'institutional', label: 'Institutional', icon: Globe },
              { id: 'term', label: 'Full Term', icon: GraduationCap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-[9px] font-dm-mono uppercase tracking-[0.2em] px-4 py-2 border rounded-xl transition-all ${activeTab === tab.id ? 'bg-brand text-bg border-brand font-bold shadow-lg shadow-brand/20' : 'border-white/10 text-text-dim hover:border-brand/30'
                  }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-dim font-dm-mono uppercase">Reference Protocol: 2026_LETS_GO</p>
        </div>
      </div>

      {activeTab === 'term' ? (
        <div className="relative py-10 pl-10">
          {/* Vertical Timeline Track */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent" />

          <div className="space-y-12">
            {filteredEvents.map((ev, i) => (
              <div key={i} className="relative group animate-fadeRight" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Timeline Node */}
                <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-2 border-bg shadow-xl transition-all group-hover:scale-150 ${ev.category === 'exam' ? 'bg-coral shadow-coral/50' : 'bg-brand shadow-brand/50'
                  }`} />

                <div className="bg-card border border-border-custom p-6 rounded-[2rem] hover:border-brand/30 transition-all flex flex-col md:flex-row md:items-center gap-10">
                  <div className="md:w-32 shrink-0">
                    <div className="text-lg font-black font-syne text-brand leading-none">{new Date(ev.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    <div className="text-[10px] font-dm-mono text-text-dim uppercase tracking-widest mt-1">{new Date(ev.start_time).getFullYear()}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-syne font-bold text-xl mb-1 group-hover:text-brand transition-colors">{ev.title}</h4>
                    <p className="text-xs text-text-soft leading-relaxed max-w-xl">{ev.description}</p>
                  </div>
                  <div className="text-right">
                    {ev.location && <div className="text-[10px] font-dm-mono uppercase text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/20 inline-flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {ev.location}</div>}
                  </div>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="p-20 text-center text-text-dim italic text-sm">No terminal milestones detected for the current session.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev, i) => (
            <div key={i} className={`bg-card border border-border-custom rounded-3xl p-8 relative overflow-hidden group hover:border-brand/50 transition-all animate-fade ${ev.category === 'exam' ? 'ring-1 ring-coral/20' : ''
              }`}>
              <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest shadow-inner ${ev.category === 'exam' ? 'bg-coral/20 text-coral border-b border-l border-coral/30' : 'bg-brand/20 text-brand border-b border-l border-brand/30'
                }`}>{ev.category === 'exam' ? 'IMMUTABLE EXAM' : ev.category.replace('_', ' ')}</div>

              <div className="mb-6 flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-2xl shadow-xl">
                  {ev.category === 'exam' ? <ShieldCheck className="w-6 h-6 text-coral" /> : <Calendar className="w-6 h-6 text-brand" />}
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-bold text-text-emphasis">{new Date(ev.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</div>
                  <div className="text-[10px] font-dm-mono text-brand uppercase tracking-tighter">{new Date(ev.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <h4 className="font-syne font-extrabold text-xl mb-3 group-hover:text-brand transition-colors">{ev.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed mb-6 line-clamp-3">{ev.description || 'Institutional mandate details available upon request.'}</p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-dm-mono uppercase tracking-[0.2em] text-text-dim">{ev.location || 'GDA_GLOBAL_NODE'}</span>
                <button className="text-brand hover:underline text-[9px] font-black uppercase tracking-widest">Details →</button>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-full p-24 text-center bg-surface/10 rounded-[3rem] border border-dashed border-white/10">
              <div className="text-5xl mb-6 opacity-30">📭</div>
              <h3 className="font-syne font-bold text-xl mb-2 text-text-soft">Query Response Null</h3>
              <p className="text-xs text-text-dim italic">No events matching the current category/enrolment criteria found in the academic ledger.</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-navy to-bg border border-brand/10 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="max-w-xl text-center lg:text-left">
          <h3 className="font-syne font-bold text-2xl mb-2 text-brand">Institutional Schedule Sync</h3>
          <p className="text-xs text-text-muted leading-relaxed uppercase tracking-tighter">Integrate the official Ginashe academic schedule with your personal terminal. Supports Google Calendar, Apple iCal, and MS Outlook via secure iCal Protocol.</p>
        </div>
        <button className="btn btn-brand px-12 py-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 whitespace-nowrap">DEPLOY ICAL FEED</button>
      </div>
    </div>
  );
}

function StudentVault({ documents, onUpload }: { documents: any[], onUpload: (type: string) => void }) {
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-syne font-black text-2xl tracking-tighter">My Document Vault</h2>
          <p className="text-[10px] font-dm-mono text-brand uppercase tracking-widest">Secure Personal Records</p>
        </div>
        <button className="btn btn-brand btn-sm uppercase tracking-widest font-black text-[9px] px-6">+ UPLOAD RECORD</button>
      </div>
      <div className="bg-card border border-border-custom rounded-3xl p-20 text-center text-text-dim text-sm italic">No documents uploaded to your secure vault.</div>
    </div>
  );
}

function CourseManager({ courses, onRefresh, onEditContent }: { courses: any[], onRefresh: () => void, onEditContent: (course: any) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState<any>({ title: '', description: '', slug: '', thumbnail_url: '📘', nqf_level: 4, progression_level: 'Foundation', track_id: '' });
  const [tracks, setTracks] = useState<any[]>([]);
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    supabase.from('curriculum_tracks').select('*').then(({ data }) => setTracks(data || []));
  }, []);

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('courses').insert([newCourse]);
      if (error) throw error;
      setIsAdding(false);
      onRefresh();
    } catch (err: any) { alert('Protocol Violation: ' + err.message); }
  }

  // Grouping logic
  const groupedCourses = courses.reduce((acc: any, course) => {
    const trackName = course.curriculum_tracks?.name || 'Unassigned Track';
    if (!acc[trackName]) acc[trackName] = {
      theme: course.curriculum_tracks?.color_theme || 'blue',
      courses: []
    };
    acc[trackName].courses.push(course);
    return acc;
  }, {});

  const THEME_MAP: any = {
    blue: 'border-sky/20 bg-sky/5 text-sky',
    purple: 'border-purple/20 bg-purple/5 text-purple',
    coral: 'border-coral/20 bg-coral/5 text-coral',
    amber: 'border-amber/20 bg-amber/5 text-amber',
    emerald: 'border-emerald/20 bg-emerald/5 text-emerald',
    green: 'border-green/20 bg-green/5 text-green',
    rose: 'border-rose/20 bg-rose/5 text-rose',
  };

  return (
    <div className="space-y-12 animate-fade">
      <div className="flex justify-between items-end border-b border-brand/10 pb-8">
        <div>
          <h2 className="font-syne font-black text-3xl uppercase tracking-tighter text-brand">Curriculum Map</h2>
          <p className="text-text-muted text-[10px] font-dm-mono uppercase tracking-[0.3em] mt-2">7 Learning Tracks • 28 Master Courses • Phase 1 Architecture</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-brand btn-sm h-12 px-6">
            {isAdding ? 'Close Archive' : '+ Provision Course'}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCourse} className="bg-card border border-brand/20 rounded-3xl p-8 space-y-6 max-w-4xl animate-fadeDown shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block font-dm-mono text-[9px] uppercase text-text-muted mb-2 font-bold tracking-widest pl-1">Educational Track</label>
              <select required className="w-full bg-surface border border-border-custom rounded-xl p-4 text-xs font-bold focus:border-brand transition-all outline-none"
                value={newCourse.track_id} onChange={e => setNewCourse({ ...newCourse, track_id: e.target.value })}>
                <option value="">Select Institutional Track...</option>
                {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-dm-mono text-[9px] uppercase text-text-muted mb-2 font-bold tracking-widest pl-1">Enrolment Icon</label>
              <input maxLength={2} className="w-full bg-surface border border-border-custom rounded-xl p-4 text-center text-xl focus:border-brand transition-all outline-none"
                value={newCourse.thumbnail_url} onChange={e => setNewCourse({ ...newCourse, thumbnail_url: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-dm-mono text-[9px] uppercase text-text-muted mb-2 font-bold tracking-widest pl-1">Course Title</label>
              <input required className="w-full bg-surface border border-border-custom rounded-xl p-4 text-xs font-bold focus:border-brand transition-all outline-none"
                value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
            </div>
            <div>
              <label className="block font-dm-mono text-[9px] uppercase text-text-muted mb-2 font-bold tracking-widest pl-1">NQF Level Verification</label>
              <select className="w-full bg-surface border border-border-custom rounded-xl p-4 text-xs font-bold focus:border-brand transition-all outline-none"
                value={newCourse.nqf_level} onChange={e => setNewCourse({ ...newCourse, nqf_level: parseInt(e.target.value) })}>
                {[3, 4, 5, 6, 7, 8].map(l => <option key={l} value={l}>NQF Level {l}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-brand w-full py-5 font-black text-sm tracking-[0.2em] uppercase">Commit to Academy Map</button>
        </form>
      )}

      {Object.entries(groupedCourses).map(([trackName, data]: [string, any]) => (
        <div key={trackName} className="space-y-6">
          <div className={`flex items-center gap-4 py-2 px-6 rounded-2xl border w-fit ${THEME_MAP[data.theme] || THEME_MAP.blue}`}>
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-syne font-black text-xs uppercase tracking-[0.3em]">{trackName}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.courses.sort((a: any, b: any) => a.nqf_level - b.nqf_level).map((course: any) => (
              <div key={course.id} className="bg-card border border-border-custom rounded-3xl p-6 hover:border-brand/30 transition-all group flex flex-col h-full relative overflow-hidden isolate">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none bg-current ${THEME_MAP[data.theme]?.split(' ')[2]}`} />

                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-surface border border-brand/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{course.thumbnail_url}</div>
                  <span className="text-[8px] font-dm-mono font-black border border-brand/20 text-brand px-2 py-0.5 rounded uppercase tracking-tighter">NQF L{course.nqf_level}</span>
                </div>

                <div className="flex-1">
                  <h4 className="font-syne font-black text-base mb-1 text-text-soft leading-tight uppercase line-clamp-2">{course.title}</h4>
                  <span className="text-[9px] font-dm-mono text-brand/60 uppercase tracking-widest block mb-4">{course.progression_level}</span>
                  <p className="text-[11px] text-text-muted line-clamp-3 leading-relaxed">{course.description}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-brand/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          const saqa = prompt('Administrative Override: Enter SAQA/MICT ID Mapping', course.accreditation_meta?.saqa_id || '');
                          if (saqa !== null) {
                            supabase.from('courses').update({
                              accreditation_meta: { ...course.accreditation_meta, saqa_id: saqa }
                            }).eq('id', course.id).then(() => onRefresh());
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-dim hover:text-brand transition-all"
                        title="Regulatory Compliance Settings"
                      >
                        <ShieldCheck size={12} />
                      </button>
                    )}
                  </div>
                  <button onClick={() => onEditContent(course)} className="text-brand text-[10px] font-black uppercase tracking-tighter hover:underline flex items-center gap-1 group/btn">
                    ARCHITECT
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── COURSE CONTENT EDITOR ───────────────────
function CourseContentEditor({ course, onBack }: { course: any, onBack: () => void }) {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  useEffect(() => { fetchContent(); }, [course.id]);

  async function fetchContent() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('modules').select('*, lessons (*), quizzes (*)').eq('course_id', course.id).order('order_index', { ascending: true });
      if (error) throw error;
      setModules(data || []);
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
    finally { setLoading(false); }
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('modules').insert({ course_id: course.id, title: newModuleTitle, order_index: modules.length + 1 });
      if (error) throw error;
      setNewModuleTitle(''); setIsAddingModule(false); fetchContent();
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handleAddLesson(moduleId: string) {
    try {
      const { data, error } = await supabase.from('lessons').insert({ module_id: moduleId, title: 'New Lesson', content: '', video_url: '', duration: '10:00', order_index: 99 }).select().single();
      if (error) throw error;
      setEditingLesson(data); setEditingQuiz(null); fetchContent();
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handleAddQuiz(moduleId: string) {
    try {
      const { data, error } = await supabase.from('quizzes').insert({ module_id: moduleId, title: 'Module Quiz', description: 'Test your knowledge.', passing_score: 80, order_index: 100 }).select().single();
      if (error) throw error;
      setEditingQuiz({ ...data, questions: [] }); setEditingLesson(null); fetchContent();
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handleSaveLesson(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('lessons').update(editingLesson).eq('id', editingLesson.id);
      if (error) throw error;
      setEditingLesson(null); fetchContent();
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handleSaveQuiz(e: React.FormEvent) {
    e.preventDefault();
    try {
      await supabase.from('quizzes').update({ title: editingQuiz.title, description: editingQuiz.description, passing_score: editingQuiz.passing_score }).eq('id', editingQuiz.id);
      await supabase.from('quiz_questions').delete().eq('quiz_id', editingQuiz.id);
      if (editingQuiz.questions.length > 0) {
        await supabase.from('quiz_questions').insert(editingQuiz.questions.map((q: any, i: number) => ({
          quiz_id: editingQuiz.id, question: q.question, options: q.options, correct_answer: q.correct_answer, order_index: i
        })));
      }
      setEditingQuiz(null); fetchContent();
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center gap-4 bg-[#0a0d14] p-4 rounded-2xl border border-brand/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand/[0.02] pointer-events-none" />
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-surface border border-brand/10 flex items-center justify-center hover:bg-brand/10 transition-colors group">
          <ChevronRight className="w-5 h-5 text-brand rotate-180" />
        </button>
        <div>
          <h2 className="font-syne font-black text-xl uppercase tracking-tighter text-brand">{course.title}</h2>
          <p className="text-text-muted text-[10px] font-dm-mono uppercase tracking-widest">Master Curriculum Architect</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-syne font-black text-sm uppercase tracking-widest text-text-muted">Curriculum</h3>
            <button onClick={() => setIsAddingModule(true)} className="text-brand text-[9px] font-black uppercase tracking-widest hover:underline">+ Add Module</button>
          </div>

          {isAddingModule && (
            <form onSubmit={handleAddModule} className="bg-[#0a0d14] border border-brand/20 p-3 rounded-xl flex gap-2 animate-fadeUp">
              <input autoFocus placeholder="Module Identifier" className="flex-1 bg-surface border border-brand/10 rounded-md p-2 text-[11px] font-dm-mono" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} />
              <button type="submit" className="btn btn-brand px-3 text-[9px] font-black uppercase">Add</button>
            </form>
          )}

          <div className="space-y-3">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="bg-[#0a0d14] border border-brand/10 rounded-2xl overflow-hidden group hover:border-brand/30 transition-all">
                <div className="bg-surface/30 p-3 border-b border-brand/10 flex justify-between items-center">
                  <span className="font-dm-mono text-[9px] uppercase tracking-widest text-brand/80 font-bold">MOD_{mIdx + 1}: {mod.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddLesson(mod.id)} className="text-[9px] font-black text-emerald uppercase tracking-tighter hover:underline px-1">+ LSN</button>
                    <button onClick={() => handleAddQuiz(mod.id)} className="text-[9px] font-black text-sky uppercase tracking-tighter hover:underline px-1">+ QZ</button>
                  </div>
                </div>
                <div className="p-1 px-2 pb-2 space-y-0.5">
                  {mod.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                    <button key={lesson.id} onClick={() => { setEditingLesson(lesson); setEditingQuiz(null); }}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${editingLesson?.id === lesson.id ? 'bg-brand/10 text-brand border border-brand/20' : 'hover:bg-white/5 text-text-soft border border-transparent'}`}>
                      <FileText size={12} className={editingLesson?.id === lesson.id ? 'text-brand' : 'text-text-dim'} />
                      <span className="truncate">{lesson.title}</span>
                    </button>
                  ))}
                  {mod.quizzes?.map((quiz: any) => (
                    <button key={quiz.id} onClick={async () => {
                      const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('order_index', { ascending: true });
                      setEditingQuiz({ ...quiz, questions: questions || [] }); setEditingLesson(null);
                    }}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${editingQuiz?.id === quiz.id ? 'bg-brand/10 text-brand border border-brand/20' : 'hover:bg-white/5 text-text-soft border border-transparent'}`}>
                      <ShieldCheck size={12} className={editingQuiz?.id === quiz.id ? 'text-brand' : 'text-text-dim'} />
                      <span className="truncate">{quiz.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingLesson ? (
            <form onSubmit={handleSaveLesson} className="bg-[#0a0d14] border border-brand/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeLeft">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex justify-between items-center relative z-10">
                <h3 className="font-syne font-black text-xl uppercase tracking-tighter text-brand">Edit Academic Module</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingLesson(null)} className="btn btn-outline px-4 py-2 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="btn btn-brand px-6 py-2 text-[10px] font-black uppercase tracking-widest">Persist Changes</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Lesson Identifier</label>
                  <input required className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm font-bold focus:border-brand/30 transition-all" value={editingLesson.title} onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Video Asset URL</label>
                  <input className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm font-dm-mono focus:border-brand/30 transition-all" value={editingLesson.video_url} onChange={e => setEditingLesson({ ...editingLesson, video_url: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Estimated Duration</label>
                  <input className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm font-dm-mono focus:border-brand/30 transition-all" value={editingLesson.duration} onChange={e => setEditingLesson({ ...editingLesson, duration: e.target.value })} />
                </div>
              </div>
              <div className="relative z-10">
                <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Academic Content (Markdown)</label>
                <textarea className="w-full bg-surface border border-brand/10 rounded-xl p-4 text-sm h-64 font-mono focus:border-brand/30 transition-all custom-scrollbar" value={editingLesson.content} onChange={e => setEditingLesson({ ...editingLesson, content: e.target.value })} />
              </div>
            </form>
          ) : editingQuiz ? (
            <form onSubmit={handleSaveQuiz} className="bg-[#0a0d14] border border-brand/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeLeft">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex justify-between items-center relative z-10">
                <h3 className="font-syne font-black text-xl uppercase tracking-tighter text-sky">Refine Assessment</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingQuiz(null)} className="btn btn-outline px-4 py-2 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="btn btn-brand px-6 py-2 text-[10px] font-black uppercase tracking-widest">Seal Quiz</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Assessment Title</label>
                  <input required className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm font-bold focus:border-brand/30 transition-all" value={editingQuiz.title} onChange={e => setEditingQuiz({ ...editingQuiz, title: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Executive Summary</label>
                  <input className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm focus:border-brand/30 transition-all" value={editingQuiz.description} onChange={e => setEditingQuiz({ ...editingQuiz, description: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1 font-bold">Threshold (%)</label>
                  <input type="number" className="w-full bg-surface border border-brand/10 rounded-xl p-3 text-sm font-dm-mono focus:border-brand/30 transition-all" value={editingQuiz.passing_score} onChange={e => setEditingQuiz({ ...editingQuiz, passing_score: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-6 pt-6 border-t border-brand/10 relative z-10">
                <div className="flex justify-between items-center">
                  <h4 className="font-syne font-black text-lg uppercase tracking-widest text-text-soft">Assessment Nodes</h4>
                  <button type="button" onClick={() => setEditingQuiz({
                    ...editingQuiz, questions: [...editingQuiz.questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]
                  })} className="text-brand text-[9px] font-black uppercase tracking-widest border border-brand/20 px-3 py-1 rounded-full hover:bg-brand/10 transition-all">+ Add Vector</button>
                </div>
                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {editingQuiz.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="bg-surface/50 p-4 rounded-xl border border-brand/5 space-y-4 group">
                      <div className="flex justify-between items-start">
                        <span className="font-dm-mono text-[9px] text-text-muted uppercase tracking-widest font-bold">Vector_{qIdx + 1}</span>
                        <button type="button" onClick={() => {
                          const newQs = [...editingQuiz.questions]; newQs.splice(qIdx, 1);
                          setEditingQuiz({ ...editingQuiz, questions: newQs });
                        }} className="text-coral text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Expunge</button>
                      </div>
                      <input placeholder="Enter assessment vector prompt" className="w-full bg-bg border border-brand/10 rounded-xl p-3 text-sm focus:border-brand/20 transition-all" value={q.question}
                        onChange={e => { const newQs = [...editingQuiz.questions]; newQs[qIdx].question = e.target.value; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx} className="flex items-center gap-3 bg-bg/50 p-2 rounded-lg border border-transparent hover:border-brand/10 transition-all">
                            <input type="radio" name={`correct-${qIdx}`} checked={q.correct_answer === oIdx}
                              className="accent-brand h-4 w-4"
                              onChange={() => { const newQs = [...editingQuiz.questions]; newQs[qIdx].correct_answer = oIdx; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                            <input placeholder={`Vector Option ${oIdx + 1}`} className="flex-1 bg-transparent border-none p-1 text-[11px] focus:ring-0" value={opt}
                              onChange={e => { const newQs = [...editingQuiz.questions]; newQs[qIdx].options[oIdx] = e.target.value; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-[#0a0d14] border-2 border-dashed border-brand/10 rounded-3xl p-20 text-center animate-pulse">
              <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">🏛️</div>
              <h3 className="font-syne font-black text-xl mb-2 uppercase tracking-tighter text-brand/40">Select Academic Node</h3>
              <p className="text-text-dim text-[11px] uppercase tracking-widest max-w-xs mx-auto">Choose a curriculum component to begin architectural refinement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NEWS MANAGER (CMS) ─────────────────────
function NewsManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({ title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'General' });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  async function handleSavePost() {
    try {
      if (!currentPost.slug) currentPost.slug = currentPost.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { error } = await supabase.from('posts').upsert(currentPost);
      if (error) throw error;
      toast.success('Institutional Record Saved');
      setIsEditing(false);
      fetchPosts();
    } catch (err: any) { toast.error('System Failure', { description: err.message }); }
  }

  if (loading && !isEditing) return <div className="py-20 text-center">Loading posts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">News & Insights CMS</h2>
        <button onClick={() => { setCurrentPost({ title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'General' }); setIsEditing(true); }} className="btn btn-brand btn-sm">+ New Article</button>
      </div>

      {isEditing ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.title} onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })} />
            <input placeholder="Slug (optional)" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.slug} onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value })} />
            <input placeholder="Image URL" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.image_url} onChange={e => setCurrentPost({ ...currentPost, image_url: e.target.value })} />
            <select className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.category} onChange={e => setCurrentPost({ ...currentPost, category: e.target.value })}>
              <option>General</option>
              <option>Technology</option>
              <option>Career</option>
              <option>Academy Update</option>
            </select>
          </div>
          <textarea placeholder="Excerpt" className="w-full bg-surface border border-border-custom p-2 rounded text-sm h-20" value={currentPost.excerpt} onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })} />
          <div className="bg-white text-black rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={currentPost.content} onChange={val => setCurrentPost({ ...currentPost, content: val })} style={{ height: '300px', marginBottom: '40px' }} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSavePost} className="btn btn-brand btn-sm">Save Article</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border-custom p-4 rounded-xl flex gap-4">
              <div className="w-20 h-20 bg-surface rounded-lg overflow-hidden shrink-0">
                <img src={post.image_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{post.title}</h3>
                <p className="text-[10px] text-text-muted line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] font-dm-mono uppercase text-brand">{post.category}</span>
                  <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="text-brand text-[10px] font-bold">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EVENTS MANAGER ─────────────────────────
function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [regs, setRegs] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>({ title: '', description: '', event_date: '', event_time: '', location: '', type: 'Webinar' });

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    setEvents(data || []);
  }

  async function fetchRegistrations(id: string) {
    const { data } = await supabase.from('event_registrations').select('*').eq('event_id', id).order('created_at', { ascending: false });
    setRegs(data || []);
  }

  async function handleSaveEvent() {
    try {
      const { error } = await supabase.from('events').upsert(currentEvent);
      if (error) throw error;
      setIsEditing(false);
      fetchEvents();
    } catch (err: any) { toast.error('System Failure', { description: err.message }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Events & Webinars</h2>
        <button onClick={() => { setCurrentEvent({ title: '', description: '', event_date: '', event_time: '', location: '', type: 'Webinar' }); setIsEditing(true); setSelectedEvent(null); }} className="btn btn-brand btn-sm">+ New Event</button>
      </div>

      {isEditing ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
          <input placeholder="Title" className="w-full bg-surface border border-border-custom p-2 rounded text-sm font-bold" value={currentEvent.title} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.event_date} onChange={e => setCurrentEvent({ ...currentEvent, event_date: e.target.value })} />
            <input type="time" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.event_time} onChange={e => setCurrentEvent({ ...currentEvent, event_time: e.target.value })} />
          </div>
          <input placeholder="Location (or Link)" className="w-full bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.location} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} />
          <textarea placeholder="Description" className="w-full bg-surface border border-border-custom p-2 rounded text-sm h-32" value={currentEvent.description} onChange={e => setCurrentEvent({ ...currentEvent, description: e.target.value })} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSaveEvent} className="btn btn-brand btn-sm">Save Event</button>
          </div>
        </div>
      ) : selectedEvent ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <button onClick={() => setSelectedEvent(null)} className="text-brand text-[10px] uppercase font-bold mb-2">← Back to List</button>
              <h3 className="font-syne font-bold text-2xl">{selectedEvent.title}</h3>
              <p className="text-text-muted text-sm">{selectedEvent.event_date} at {selectedEvent.event_time}</p>
            </div>
            <button onClick={() => exportToCSV(regs, `registrations-${selectedEvent.id}`)} className="btn btn-brand btn-sm">📥 Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-custom text-left">
                  <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Name</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Email</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Status</th>
                </tr>
              </thead>
              <tbody>
                {regs.map(r => (
                  <tr key={r.id} className="border-b border-border-custom">
                    <td className="p-3 text-sm">{r.name}</td>
                    <td className="p-3 text-sm text-text-soft">{r.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-brand-dim text-brand text-[9px] border border-brand/20 uppercase font-dm-mono">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <div key={ev.id} className="bg-card border border-border-custom rounded-xl p-5 hover:border-brand/30 transition-all">
              <span className="text-[9px] font-dm-mono uppercase text-brand bg-brand-dim px-2 py-0.5 rounded border border-brand/10 inline-block mb-3">{ev.type}</span>
              <h3 className="font-bold mb-1">{ev.title}</h3>
              <p className="text-[11px] text-text-muted line-clamp-2 mb-4">{ev.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-border-custom">
                <button onClick={() => { setSelectedEvent(ev); fetchRegistrations(ev.id); }} className="text-[10px] font-bold text-sky">View Regs ({ev.reg_count || 0})</button>
                <button onClick={() => { setCurrentEvent(ev); setIsEditing(true); }} className="text-brand text-[10px] font-bold">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FINANCE MANAGER (ADMIN) ────────────────
function FinanceManager() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFinances(); }, []);

  async function fetchFinances() {
    setLoading(true);
    const { data: inv } = await supabase.from('invoices').select('*, profiles(first_name, last_name)').order('created_at', { ascending: false });
    const { data: pay } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    setInvoices(inv || []);
    setTxs(pay || []);
    setLoading(false);
  }

  async function markAsPaid(id: string) {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id);
    fetchFinances();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Finance & Invoicing</h2>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(invoices, 'all-invoices')} className="btn btn-outline btn-sm">Export Invoices</button>
          <button onClick={() => exportToCSV(txs, 'all-transactions')} className="btn btn-outline btn-sm">Export Payments</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0a0d14] border border-brand/10 p-5 rounded-2xl relative overflow-hidden group hover:border-brand/30 transition-all">
          <div className="absolute top-0 right-0 w-12 h-12 bg-brand/2 rounded-full -mr-6 -mt-6 blur-xl" />
          <div className="text-[9px] uppercase tracking-[0.15em] text-text-muted font-dm-mono mb-1 font-bold">Total Revenue</div>
          <div className="text-2xl font-syne font-black text-emerald tracking-tighter">R {invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#0a0d14] border border-brand/10 p-5 rounded-2xl relative overflow-hidden group hover:border-brand/30 transition-all">
          <div className="absolute top-0 right-0 w-12 h-12 bg-brand/2 rounded-full -mr-6 -mt-6 blur-xl" />
          <div className="text-[9px] uppercase tracking-[0.15em] text-text-muted font-dm-mono mb-1 font-bold">Pending Approval</div>
          <div className="text-2xl font-syne font-black text-brand tracking-tighter">R {invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#0a0d14] border border-brand/10 p-5 rounded-2xl relative overflow-hidden group hover:border-brand/30 transition-all">
          <div className="absolute top-0 right-0 w-12 h-12 bg-brand/2 rounded-full -mr-6 -mt-6 blur-xl" />
          <div className="text-[9px] uppercase tracking-[0.15em] text-text-muted font-dm-mono mb-1 font-bold">Institutional Outstanding</div>
          <div className="text-2xl font-syne font-black text-coral tracking-tighter">R {invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-2xl overflow-hidden shadow-2xl relative isolate">
        <div className="absolute inset-0 bg-brand/[0.01] pointer-events-none" />
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface/50 border-b border-brand/10 text-brand text-[9px] uppercase font-dm-mono tracking-[0.2em]">
                <th className="p-4">Invoice Cluster</th>
                <th className="p-4">Finalist Identity</th>
                <th className="p-4">Institutional Balance</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/5">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-brand/5 transition-colors group">
                  <td className="p-4">
                    <div className="text-[10px] font-dm-mono text-text-soft font-bold">{inv.invoice_number}</div>
                    <div className="text-[8px] text-text-dim uppercase tracking-widest">{new Date(inv.created_at || Date.now()).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm text-text-soft">{inv.profiles?.first_name} {inv.profiles?.last_name}</div>
                    <div className="text-[9px] text-text-dim font-dm-mono uppercase">{inv.student_number}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-syne font-black text-sm text-white">R {inv.amount?.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-brand/10 text-brand border-brand/20'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(inv.id)}
                        className="btn btn-brand px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      >
                        SEAL PAYMENT
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center text-text-muted italic text-[10px] uppercase tracking-widest">Archive is currently vacant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MY FINANCE (STUDENT) ────────────────────
function MyFinance() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyFinances();
  }, [user]);

  async function fetchMyFinances() {
    setLoading(true);
    const { data: inv } = await supabase.from('invoices').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
    const { data: pay } = await supabase.from('transactions').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
    setInvoices(inv || []);
    setTxs(pay || []);
    setLoading(false);
  }

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex justify-between items-center px-2">
        <h2 className="font-syne font-black text-2xl uppercase tracking-tighter text-brand">Financial Ledger</h2>
        <div className="flex items-center gap-2 pr-2">
          <div className="text-right">
            <p className="text-[9px] text-text-muted font-dm-mono uppercase tracking-widest">System Record</p>
            <p className="text-[10px] font-bold text-emerald flex items-center justify-end gap-1.5 uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Verified
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0d14] border border-brand/10 p-6 rounded-2xl relative overflow-hidden group hover:border-brand/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand/10 transition-all" />
          <div className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-dm-mono mb-2 font-bold">Account Balance Due</div>
          <div className="text-4xl font-syne font-black text-white tracking-tighter">
            R {invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + Number(i.amount), 0).toLocaleString()}
          </div>
          <div className="mt-6 flex gap-3 relative z-10">
            <button className="btn btn-brand px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all">Settle Balance</button>
            <button onClick={() => exportToCSV(invoices, 'my-statement')} className="btn btn-outline px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Download Audit</button>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-3">
          <div className="bg-[#0a0d14] border border-brand/10 p-4 rounded-xl flex justify-between items-center group hover:border-brand/20 transition-all">
            <div>
              <span className="text-[9px] text-text-muted font-dm-mono uppercase tracking-widest block mb-0.5">Last Transaction</span>
              <span className="text-lg font-syne font-black text-emerald tracking-tighter">{txs[0] ? `R ${txs[0].amount.toLocaleString()}` : 'N/A'}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald/5 border border-emerald/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-emerald" />
            </div>
          </div>
          <div className="bg-[#0a0d14] border border-brand/10 p-4 rounded-xl flex justify-between items-center group hover:border-brand/20 transition-all">
            <div>
              <span className="text-[9px] text-text-muted font-dm-mono uppercase tracking-widest block mb-0.5">Next Commitment</span>
              <span className="text-lg font-syne font-black text-brand tracking-tighter">{invoices.find(i => i.status !== 'paid')?.due_date || 'N/A'}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-brand" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-3xl overflow-hidden shadow-2xl relative isolate">
        <div className="absolute inset-0 bg-brand/[0.01] pointer-events-none" />
        <div className="p-4 border-b border-brand/10 bg-surface/30 flex justify-between items-center">
          <span className="font-syne font-bold text-xs uppercase tracking-widest text-brand/80">Institutional Ledger</span>
          <span className="text-[9px] font-dm-mono text-text-muted uppercase tracking-widest">{invoices.length} RECORDS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface/50 border-b border-brand/10 text-brand text-[9px] uppercase font-dm-mono tracking-[0.2em]">
                <th className="p-4">Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Allocation</th>
                <th className="p-4">Quantum</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/5">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-brand/5 transition-colors group">
                  <td className="p-4 text-[11px] font-dm-mono text-text-soft">{inv.invoice_number}</td>
                  <td className="p-4 text-[11px] font-dm-mono text-text-dim">{new Date(inv.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="p-4 text-[11px] font-bold text-text-soft uppercase tracking-tighter">GDA Program Fees</td>
                  <td className="p-4 font-syne font-black text-sm">R {inv.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-dm-mono border tracking-widest ${inv.status === 'paid' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-brand/10 text-brand border-brand/20'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-[9px] font-black uppercase text-text-dim hover:text-brand transition-colors tracking-widest">Verify Record</button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-text-muted italic text-xs">No institutional records found in your ledger.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PORTAL ──────────────────────────
export function StudentPortal({ onStartCourse }: { onStartCourse: (courseId: string) => void }) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [showCertificate, setShowCertificate] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'courses' | 'finances' | 'applications' | 'profile' | 'settings' | 'vault' | 'records' | 'timetable' | 'calendar'>('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New State for LMS Features
  const [courses, setCourses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [applyingCourse, setApplyingCourse] = useState<any>(null);
  const [academicTab, setAcademicTab] = useState<'lessons' | 'assignments' | 'assessments' | 'exams' | 'capstone'>('lessons');
  const [isApplyDropdownOpen, setIsApplyDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [proctoringAlert, setProctoringAlert] = useState<string | null>(null);
  const [lessonComments, setLessonComments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<any>({});
  const [academicSchedule, setAcademicSchedule] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    fetchStudentData();

    // ─── UNIFIED REAL-TIME HUB ───
    const channel = supabase
      .channel(`student-portal-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        setProfile(payload.new);
        setProfileForm(payload.new);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `email=eq.${user.email?.toLowerCase()}`
      }, () => {
        fetchStudentData(); // Re-fetch applications
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchStudentData(); // Re-fetch if news changes
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'academic_schedule'
      }, () => {
        fetchStudentData(); // Re-fetch if academic schedule changes
      })
      .subscribe();

    const handleLeave = (e: BeforeUnloadEvent) => {
      // If NOT a refresh, clear session synchronously
      const navType = (performance.getEntriesByType("navigation")[0] as any)?.type;
      if (navType !== 'reload') {
        window.sessionStorage.clear();
      }
    };
    window.addEventListener('beforeunload', handleLeave);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [user]);

  // ─── EXAM PROCTORING (INTEGRITY LOGIC) ───
  useEffect(() => {
    if (activeSection === 'courses' && academicTab === 'exams') {
      const handleBlur = () => {
        setProctoringAlert('Security Alert: Academic integrity tracking active. Please do not leave the exam window.');
        supabase.from('institutional_audit_logs').insert({
          user_id: user?.id,
          action: 'EXAM_WINDOW_BLUR',
          target_type: 'exam_session',
          target_id: user?.id as any,
          reason: 'Student left the exam tab/window'
        });
      };
      const handleFocus = () => {
        setTimeout(() => setProctoringAlert(null), 5000);
      };

      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      return () => {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [activeSection, academicTab, user?.id]);

  async function fetchStudentData() {
    setLoading(true);
    try {
      const { data: apps } = await supabase.from('applications').select('*').eq('email', user?.email).order('created_at', { ascending: false });
      setApplications(apps || []);

      const { data: enrolls } = await supabase.from('enrollments').select('*, courses (*)').eq('user_id', user?.id);
      setEnrollments(enrolls || []);

      const { data: lessonProgress } = await supabase.from('lesson_progress').select('*').eq('user_id', user?.id);
      const { data: quizAttempts } = await supabase.from('quiz_attempts').select('*').eq('user_id', user?.id).eq('passed', true);
      const { data: modules } = await supabase.from('modules').select('*, lessons(*), quizzes(*)');

      // New data fetches
      const { data: allCourses } = await supabase.from('courses').select('*').eq('is_active', true);
      const { data: allAnnouncements } = await supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false });
      const { data: allAssessments } = await supabase.from('assessments').select('*');
      const { data: allSubmissions } = await supabase.from('assessment_submissions').select('*').eq('user_id', user?.id);
      const { data: allDocs } = await supabase.from('student_documents').select('*').eq('student_id', user?.id);
      const { data: allNotifs } = await supabase.from('system_notifications').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      const { data: settings } = await supabase.from('school_settings').select('*');
      const { data: schedule } = await supabase.from('academic_schedule').select('*').order('start_time', { ascending: true });

      setCourses(allCourses || []);
      setAnnouncements(allAnnouncements || []);
      setAssessments(allAssessments || []);
      setSubmissions(allSubmissions || []);
      setDocuments(allDocs || []);
      setNotifications(allNotifs || []);
      setAcademicSchedule(schedule || []);

      const setMap: any = {};
      settings?.forEach(s => setMap[s.key] = s.value);
      setSchoolSettings(setMap);

      const progressMap: Record<string, number> = {};
      enrolls?.forEach(enroll => {
        const courseModules = modules?.filter(m => m.course_id === enroll.course_id) || [];
        const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
        const totalQuizzes = courseModules.reduce((acc, m) => acc + m.quizzes.length, 0);
        const completedLessons = lessonProgress?.filter(p => courseModules.some(m => m.lessons.some((l: any) => l.id === p.lesson_id))).length || 0;
        const passedQuizzes = quizAttempts?.filter(a => courseModules.some(m => m.quizzes.some((q: any) => q.id === a.quiz_id))).length || 0;
        const percent = totalLessons + totalQuizzes > 0 ? Math.round(((completedLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100) : 0;
        progressMap[enroll.course_id] = percent;
      });
      setProgress(progressMap);

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (prof) { setProfile(prof); setProfileForm(prof); }
    } catch (err: any) { console.error('Error:', err.message); }
    finally { setLoading(false); }
  }

  async function handleSaveProfile() {
    try {
      const { error } = await supabase.from('profiles').update({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone: profileForm.phone,
        date_of_birth: profileForm.date_of_birth,
        gender: profileForm.gender,
        nationality: profileForm.nationality,
        bio: profileForm.bio,
        address_line1: profileForm.address_line1,
        city: profileForm.city,
        province: profileForm.province,
        postal_code: profileForm.postal_code,
        emergency_contact_name: profileForm.emergency_contact_name,
        emergency_contact_phone: profileForm.emergency_contact_phone,
        updated_at: new Date().toISOString(),
      }).eq('id', user?.id);

      if (error) throw error;
      setProfile(profileForm);
      setEditingProfile(false);
      toast.success('Resident Profile Updated Successfully');
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handlePasswordReset() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      toast.success('Security Protocol Initiated', { description: 'Password reset link sent to your email!' });
    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
  }

  async function handleUpload(type: string) {
    const url = prompt('Enter the document URL (Simulation: normally you would choose a file):', 'https://example.com/doc.pdf');
    if (!url) return;

    const { error } = await supabase.from('student_documents').insert({
      student_id: user?.id,
      type,
      file_url: url,
      status: 'pending'
    });

    if (error) alert(error.message);
    else {
      alert('Artifact uploaded for verification!');
      fetchStudentData();
    }
  }

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand mx-auto mb-4"></div>
        <p className="text-brand font-dm-mono text-[10px] uppercase tracking-widest">Loading your portal...</p>
      </div>
    </div>
  );

  // ─── GRADUATED? → ALUMNI HUB ───
  if (profile?.graduation_status === 'graduated') {
    return <AlumniHub profile={profile} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg relative isolate">
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className={`fixed lg:h-screen lg:border-r border-border-custom bg-[#0a0d14]/95 backdrop-blur-3xl z-50 transition-all duration-300 ease-[0.25,0.1,0.25,1] ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-brand text-bg rounded-full hidden lg:flex items-center justify-center shadow-lg z-30 hover:scale-110 transition-transform"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} className="rotate-180" />}
          </button>

          <div className="p-4 h-full flex flex-col">
            {/* Institutional Navigation */}
            <div className="mb-8">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className={`w-full flex items-center rounded-xl bg-brand/10 border border-brand/30 text-brand hover:bg-brand hover:text-bg transition-all font-bold text-[10px] uppercase tracking-tighter ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-2.5'}`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Main Website →</span>}
              </button>
            </div>

            <div className={`mb-8 flex items-center overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'lg:justify-center' : 'px-2 justify-start gap-2.5'}`}>
              <div className="w-9 h-9 rounded-xl bg-brand text-bg flex items-center justify-center font-black shadow-lg shadow-brand/20 shrink-0 uppercase tracking-tighter">G</div>
              {(!isSidebarCollapsed || isMobileMenuOpen) && (
                <div className="flex flex-col animate-fade">
                  <h2 className="font-syne font-extrabold text-lg tracking-tighter whitespace-nowrap leading-none">STUDENT HUB</h2>
                  <span className="text-[7px] font-dm-mono text-brand tracking-widest uppercase opacity-70 italic font-bold">Observer Portal</span>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
              {[
                { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                { id: 'courses', label: 'My Learning', icon: BookOpen },
                { id: 'vault', label: 'My Vault', icon: ShieldCheck },
                { id: 'records', label: 'Academic Record', icon: Star },
                { id: 'announcements', label: 'Announcements', icon: Zap },
                { id: 'timetable', label: 'My Timetable', icon: Calendar },
                { id: 'calendar', label: 'Academic Calendar', icon: GraduationCap },
                { id: 'finances', label: 'Billing', icon: CreditCard },
                { id: 'applications', label: 'Admissions', icon: FileText },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  title={isSidebarCollapsed ? item.label : ''}
                  className={`w-full flex items-center rounded-xl font-dm-mono text-[11px] uppercase tracking-widest transition-all duration-200 group ${activeSection === item.id
                      ? 'bg-brand text-bg font-bold shadow-lg shadow-brand/20'
                      : 'text-text-muted hover:text-text-custom hover:bg-white/5 border border-transparent'
                    } ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:justify-center p-3' : 'px-4 py-3 gap-3'}`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${activeSection === item.id ? 'text-brand' : 'group-hover:text-brand'} transition-colors`} />
                  {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="whitespace-nowrap animate-fade">{item.label}</span>}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-border-custom space-y-4">
              {!isSidebarCollapsed ? (
                <div className="px-4 py-3 bg-surface border border-border-custom rounded-xl animate-fade">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs uppercase shrink-0">
                      {profile?.first_name?.[0] || user?.email?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate">{profile?.first_name || 'Student'}</p>
                      <p className="text-[9px] text-text-muted truncate uppercase tracking-tighter">ID: {profile?.student_number?.split('-').pop() || '...'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div title={`${profile?.first_name || 'Student'}`} className="flex justify-center py-2">
                  <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs uppercase shadow-sm">
                    {profile?.first_name?.[0] || user?.email?.[0]}
                  </div>
                </div>
              )}
              <button
                onClick={() => signOut()}
                title={isSidebarCollapsed ? 'Sign Out' : ''}
                className={`w-full flex items-center rounded-xl text-coral hover:bg-coral/5 transition-all font-dm-mono text-[11px] uppercase tracking-widest ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'}`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap animate-fade">Sign Out</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className={`flex-1 p-4 md:p-6 lg:p-8 animate-fade transition-all duration-300 ease-[0.25,0.1,0.25,1] ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="animate-fadeRight">
            <h1 className="font-syne font-extrabold text-4xl md:text-5xl tracking-tighter mb-2">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <p className="text-text-muted font-dm-mono text-[10px] uppercase tracking-[0.2em]">
              Ginashe Digital Academy &bull; Secure Student Environment
            </p>
          </div>
          {proctoringAlert && (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-coral text-bg rounded-full flex items-center gap-3 shadow-2xl animate-bounce">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">{proctoringAlert}</span>
            </div>
          )}
          <div className="flex items-center gap-4 bg-surface/50 border border-border-custom p-2 rounded-2xl backdrop-blur-md animate-fadeLeft">
            <div className="text-right px-2">
              <p className="text-[10px] text-text-dim font-dm-mono uppercase">System Status</p>
              <p className="text-xs font-bold text-emerald flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Live
              </p>
            </div>
            <div className="w-px h-8 bg-border-custom" />
            <div className="flex items-center gap-2 pr-2">
              <div className="p-2 bg-surface rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-brand" />
              </div>
              <span className="text-xs font-bold">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* ─── DASHBOARD CONTENT ─── */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-fade">
            {/* HERO BANNER */}
            <section className="relative overflow-hidden bg-navy rounded-[2rem] border border-brand/20 p-6 md:p-10 group shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-brand/10 transition-all duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-brand text-[9px] uppercase font-dm-mono tracking-widest mb-4">
                    <Zap className="w-3 h-3 fill-brand" />
                    New Course Intake Open
                  </div>
                  <h2 className="font-syne font-extrabold text-2xl md:text-3xl mb-4 leading-tight">
                    Welcome back, <span className="text-brand">{profile?.first_name || 'Scholar'}</span>!
                  </h2>
                  <p className="text-text-soft text-sm md:text-base max-w-lg mb-8 leading-relaxed">
                    "Success in the cloud is about constant evolution. You are {profile?.student_number ? 'enrolled as a pioneer' : 'one step away from joining'} our 2026 cohort."
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button onClick={() => setActiveSection('courses')} className="btn btn-brand group">
                      Go to Classes <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setActiveSection('profile')} className="btn btn-outline">Review Roadmap</button>
                  </div>
                </div>
                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                  <div className="absolute inset-0 bg-brand/20 rounded-full animate-ping opacity-20" />
                  <div className="relative w-full h-full bg-navy border-4 border-brand/30 rounded-3xl overflow-hidden flex items-center justify-center p-4">
                    <div className="text-center font-syne">
                      <div className="text-6xl mb-2">🚀</div>
                      <div className="text-brand font-bold text-lg uppercase tracking-wider">Level 1</div>
                      <div className="text-[10px] text-text-dim font-dm-mono">Cloud Resident</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* KEY METRICS */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Courses Enrolled', value: enrollments.length, color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20', icon: BookOpen },
                { label: 'Completed Credits', value: Object.values(progress).filter(p => p === 100).length, color: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/20', icon: CheckCircle2 },
                { label: 'Applications', value: applications.length, color: 'text-sky', bg: 'bg-sky/10', border: 'border-sky/20', icon: FileText },
                { label: 'Learning Hours', value: '12.4', color: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/20', icon: Clock },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0d14] border border-brand/10 rounded-2xl p-5 hover:border-brand/30 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand/2 rounded-full -mr-8 -mt-8 blur-2xl" />
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-surface border border-border-custom flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-2.5 h-2.5 text-brand" />
                    </div>
                  </div>
                  <div className="font-syne font-black text-3xl mb-0.5 tracking-tighter">{stat.value}</div>
                  <p className="text-[9px] text-text-muted font-dm-mono uppercase tracking-[0.15em] font-bold">{stat.label}</p>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* ADMISSION ROADMAP / JOURNEY STEPPER */}
              <div className="xl:col-span-1 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-syne font-bold font-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand animate-pulse rounded-full" />
                    Admission Journey
                  </h3>
                  <span className="text-[10px] text-brand font-dm-mono uppercase">In Progress</span>
                </div>
                <div className="bg-surface/30 border border-border-custom rounded-2xl p-8 space-y-0">
                  {[
                    { title: 'Application Submitted', date: applications[0]?.created_at ? new Date(applications[0].created_at).toLocaleDateString() : 'Pending', completed: applications.length > 0 },
                    { title: 'Document Review', date: 'Processing', completed: applications.some(a => ['reviewing', 'approved', 'interviewing'].includes(a.status || '')) },
                    { title: 'Interview Invitation', date: '-', completed: applications.some(a => ['approved', 'interviewing'].includes(a.status || '')) },
                    { title: 'Enrolment Offer', date: '-', completed: applications.some(a => a.status === 'approved') },
                    { title: 'Official Welcome', date: '-', completed: enrollments.length > 0 },
                  ].map((step, i, arr) => (
                    <div key={i} className="relative pl-8 pb-10 last:pb-0">
                      {i !== arr.length - 1 && (
                        <div className={`absolute left-[11px] top-[24px] bottom-0 w-0.5 ${step.completed ? 'bg-brand' : 'bg-border-custom border-dashed border-l'}`} />
                      )}
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-brand text-bg' : 'bg-surface border border-border-custom text-text-muted'
                        }`}>
                        {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-text-dim/30" />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${step.completed ? 'text-white' : 'text-text-muted'}`}>{step.title}</h4>
                        <p className="text-[10px] text-text-dim uppercase tracking-tighter mt-1">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT ANNOUNCEMENTS / FEED */}
              <div className="xl:col-span-2 space-y-6">
                <h3 className="font-syne font-bold font-lg">Academy Announcements</h3>
                <div className="space-y-4">
                  {[
                    { type: 'Update', title: 'New Cloud Vendor Certification Path', body: 'We have officially added AWS Certified Cloud Practitioner to the April 2026 intake curriculum.', date: '2h ago' },
                    { type: 'Event', title: 'Virtual Open Day: Live Q&A', body: 'Join Chef Instructor George on Friday at 6pm for a live session on Cloud Architecture careers.', date: 'Yesterday' }
                  ].map((news, i) => (
                    <div key={i} className="bg-card border border-border-custom p-6 rounded-2xl flex gap-6 hover:border-brand/30 transition-all group">
                      <div className="w-2 rounded-full bg-brand/20 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[9px] font-dm-mono uppercase text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/10">{news.type}</span>
                          <span className="text-[10px] text-text-dim">{news.date}</span>
                        </div>
                        <h4 className="font-bold text-base mb-2 group-hover:text-brand transition-colors">{news.title}</h4>
                        <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{news.body}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 text-[10px] font-dm-mono uppercase tracking-widest text-text-dim hover:text-brand transition-colors">
                    View All News &bull; Press CMD+K to search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MY COURSES CONTENT ─── */}
        {activeSection === 'courses' && (
          <div className="space-y-10">
            {/* Academic Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border-custom pb-4">
              {[
                { id: 'modules', label: 'Lessons', icon: BookOpen },
                { id: 'assignments', label: 'Assignments', icon: Briefcase },
                { id: 'assessments', label: 'Assessments', icon: Star },
                { id: 'exams', label: 'Exams', icon: GraduationCap },
                { id: 'capstone', label: 'Capstone', icon: ShieldCheck }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAcademicTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-dm-mono text-[10px] uppercase tracking-widest transition-all ${academicTab === tab.id
                      ? 'bg-brand/10 text-brand border border-brand/20'
                      : 'text-text-muted hover:text-text-custom hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {academicTab === 'modules' && (
              <div className="space-y-10">
                {enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {enrollments.map(enroll => (
                      <div key={enroll.id} className="bg-card border border-border-custom rounded-[2rem] overflow-hidden group hover:border-brand/40 transition-all duration-500">
                        <div className="h-48 bg-navy p-10 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-brand/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                          <div className="text-6xl z-10 group-hover:scale-110 transition-transform duration-500">{enroll.courses?.thumbnail_url || '📘'}</div>
                        </div>
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="font-syne font-bold text-xl mb-1 group-hover:text-brand transition-colors">{enroll.courses?.title}</h3>
                              <p className="text-[10px] text-text-dim uppercase font-dm-mono">Enrolled {new Date(enroll.enrolled_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                            {progress[enroll.course_id] === 100 && (
                              <div className="p-2 bg-emerald/10 text-emerald rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-dm-mono uppercase text-text-muted">
                                <span>Completion</span>
                                <span className="text-brand font-bold">{progress[enroll.course_id] || 0}%</span>
                              </div>
                              <div className="h-1.5 bg-surface rounded-full overflow-hidden p-0.5 border border-border-custom">
                                <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-1000" style={{ width: `${progress[enroll.course_id] || 0}%` }} />
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button onClick={() => onStartCourse(enroll.course_id)} className="flex-1 btn btn-brand py-4">
                                {progress[enroll.course_id] > 0 ? 'Resume Lesson' : 'Launch Course'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border-custom border-dashed rounded-[3rem] p-20 text-center animate-pulse">
                    <div className="text-5xl mb-6">🔭</div>
                    <h3 className="font-syne font-extrabold text-2xl mb-4">No Active Classrooms</h3>
                    <p className="text-text-muted max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                      Your journey hasn't started yet. Enroll in one of our professional certifications to begin.
                    </p>
                    <div className="flex justify-center gap-4">
                      <a href="/admissions" className="btn btn-brand px-8 py-3">Browse Catalogue</a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {academicTab !== 'modules' && (
              <div className="space-y-6">
                {assessments.filter(a => a.type === academicTab.slice(0, -1) || a.type === academicTab).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {assessments
                      .filter(a => a.type === academicTab.slice(0, -1) || a.type === academicTab)
                      .map(assessment => {
                        const sub = submissions.find(s => s.assessment_id === assessment.id);
                        return (
                          <div key={assessment.id} className={`bg-card border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${academicTab === 'exams' ? 'border-coral/50 bg-coral/5 shadow-lg shadow-coral/10' : 'border-border-custom hover:border-brand/20'
                            }`}>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-dm-mono uppercase px-2 py-0.5 rounded border ${academicTab === 'exams' ? 'text-coral bg-coral/10 border-coral/20' : 'text-brand bg-brand/10 border-brand/10'
                                  }`}>{academicTab === 'exams' ? 'Final Examination' : 'Required'}</span>
                                <h4 className="font-bold text-lg">{assessment.title}</h4>
                              </div>
                              <p className="text-xs text-text-muted max-w-lg mb-2">{assessment.description}</p>
                              <div className="flex items-center gap-4 text-[10px] text-text-dim uppercase font-dm-mono">
                                <span>Due: {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'N/A'}</span>
                                <span>Weight: {assessment.weight || 0}%</span>
                                {assessment.is_proctored && <span className="text-brand font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Integrity Tracking</span>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {sub ? (
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-dm-mono uppercase border tracking-widest shadow-sm ${sub.status === 'graded' ? 'border-emerald/20 text-emerald bg-emerald/5' : 'border-brand/20 text-brand bg-brand/5'
                                  }`}>
                                  {sub.status === 'graded' ? `Graded: ${sub.marks_obtained}/${assessment.total_marks}` : 'Submitted'}
                                </div>
                              ) : (
                                <button className="btn btn-brand py-2 px-6 text-xs">+ Submit Work</button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <div className="p-20 text-center bg-surface/10 rounded-3xl border border-white/5">
                    <div className="text-4xl mb-4">📂</div>
                    <p className="text-text-dim italic text-sm">No {academicTab} items published for your current enrolment yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── FINANCES CONTENT ─── */}
        {activeSection === 'finances' && <MyFinance />}

        {/* ─── APPLICATIONS CONTENT ─── */}
        {activeSection === 'applications' && (
          <div className="space-y-6">
            <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-surface/30 p-8 border-b border-border-custom flex justify-between items-center">
                <div>
                  <h3 className="font-syne font-bold text-2xl">Academic Admissions</h3>
                  <p className="text-[10px] text-text-muted font-dm-mono uppercase mt-1">Intake Management & History</p>
                </div>

                {/* SMART DROPDOWN FOR SUBMIT NEW */}
                <div className="relative">
                  <button
                    onClick={() => setIsApplyDropdownOpen(!isApplyDropdownOpen)}
                    className="btn btn-brand px-6 py-3 flex items-center gap-2 group"
                  >
                    <Zap className={`w-4 h-4 transition-transform ${isApplyDropdownOpen ? 'rotate-12' : ''}`} />
                    + Apply for New Course
                  </button>

                  {isApplyDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-navy border border-brand/20 rounded-2xl shadow-2xl p-4 z-[60] animate-fadeUp">
                      <div className="text-[10px] font-dm-mono text-brand uppercase tracking-[0.2em] mb-4 px-2">Available Certificates</div>
                      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                        {courses
                          .filter(course => !enrollments.some(e => e.course_id === course.id))
                          .filter(course => !applications.some(a => a.program === course.title))
                          .map(course => (
                            <button
                              key={course.id}
                              onClick={() => {
                                setApplyingCourse(course);
                                setIsApplyDropdownOpen(false);
                              }}
                              className="w-full text-left p-3 hover:bg-brand/10 rounded-xl transition-all group/item"
                            >
                              <div className="font-bold text-sm group-hover/item:text-brand transition-colors">{course.title}</div>
                              <div className="text-[9px] text-text-muted uppercase font-dm-mono mt-1">{course.category || 'Professional Certification'}</div>
                            </button>
                          ))
                        }
                        {courses.filter(course => !enrollments.some(e => e.course_id === course.id) && !applications.some(a => a.program === course.title)).length === 0 && (
                          <div className="p-4 text-center text-text-muted text-xs italic">No new courses available to apply for at this time.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="divide-y divide-border-custom bg-surface/10">
                {applications.map(app => (
                  <div key={app.id} className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-white/2 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-lg ${app.status === 'approved' ? 'bg-emerald/10 border border-emerald/20 text-emerald' :
                          app.status === 'rejected' ? 'bg-coral/10 border border-coral/20 text-coral' :
                            'bg-brand/10 border border-brand/20 text-brand'
                        }`}>
                        {app.type === 'individual' ? '👤' : '🏢'}
                      </div>
                      <div>
                        <h4 className="font-syne font-bold text-2xl mb-1 group-hover:text-brand transition-colors">{app.program}</h4>
                        <div className="flex flex-wrap items-center gap-4 font-dm-mono text-[10px] uppercase text-text-dim">
                          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Ref: {app.id.slice(0, 8).toUpperCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-border-custom" />
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Submitted {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-dm-mono uppercase border tracking-widest shadow-sm ${app.status === 'approved' ? 'border-emerald/20 text-emerald bg-emerald/5' :
                          app.status === 'rejected' ? 'border-coral/20 text-coral bg-coral/5' :
                            'border-brand/20 text-brand bg-brand/5'
                        }`}>
                        {app.status || 'Admissions Review'}
                      </span>
                      {app.student_number && (
                        <p className="text-[12px] font-extrabold text-brand px-2 bg-brand/10 rounded-lg py-1 border border-brand/20">Assigned Student ID: {app.student_number}</p>
                      )}
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="text-5xl mb-6">🖋️</div>
                    <h4 className="font-syne font-bold text-xl mb-2">No Active Applications</h4>
                    <p className="text-text-muted text-sm max-w-sm mx-auto">You haven't submitted any applications for the 2026 intake yet. Select a course from the dropdown above to begin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TIMETABLE CONTENT ─── */}
        {activeSection === 'timetable' && <StudentTimetable />}

        {/* ─── CALENDAR CONTENT ─── */}
        {activeSection === 'calendar' && <AcademicCalendarView schedule={academicSchedule} enrollments={enrollments} />}

        {/* ─── VAULT CONTENT ─── */}
        {activeSection === 'vault' && <StudentVault documents={documents} onUpload={handleUpload} />}

        {/* ─── ANNOUNCEMENTS CONTENT ─── */}
        {activeSection === 'announcements' && (
          <div className="space-y-8 animate-fade">
            <div className="bg-gradient-to-r from-navy to-surface border border-brand/20 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h3 className="font-syne font-extrabold text-3xl mb-2">Academy Broadcasts</h3>
                <p className="text-text-muted font-dm-mono text-xs uppercase tracking-widest">Global messages from institution staff</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {announcements.map(item => (
                <div key={item.id} className="bg-card border border-border-custom rounded-3xl p-8 hover:border-brand/30 transition-all group flex gap-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${item.type === 'urgent' ? 'bg-coral/10 text-coral border border-coral/20' :
                      item.type === 'warning' ? 'bg-brand/10 text-brand border border-brand/20' :
                        'bg-sky/10 text-sky border border-sky/20'
                    }`}>
                    {item.type === 'urgent' ? <Zap className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[9px] font-dm-mono uppercase px-2 py-0.5 rounded-md border ${item.type === 'urgent' ? 'border-coral/20 text-coral bg-coral/5' :
                              'border-brand/20 text-brand bg-brand/5'
                            }`}>{item.type} broadcast</span>
                          <span className="text-[10px] text-text-dim flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <h4 className="font-syne font-bold text-2xl mb-1 group-hover:text-brand transition-colors">{item.title}</h4>
                      </div>
                      {item.priority === 'high' && (
                        <div className="px-3 py-1 bg-coral/10 text-coral text-[9px] font-dm-mono uppercase rounded-full border border-coral/20 animate-pulse">Priority High</div>
                      )}
                    </div>
                    <div className="text-text-soft text-sm leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="bg-surface/20 border border-border-custom border-dashed rounded-[3rem] p-24 text-center">
                  <div className="text-6xl mb-6">🔕</div>
                  <h3 className="font-syne font-extrabold text-2xl mb-4 text-text-muted">No New Broadcasts</h3>
                  <p className="text-text-dim max-w-xs mx-auto text-sm italic">All communications from the institution will appear here in real-time.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── PROFILE CONTENT ─── */}
        {activeSection === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-1 space-y-8">
              {/* PROFILE PROGRESS CARD */}
              <div className="bg-navy rounded-[2.5rem] p-8 border border-brand/20 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-brand/5 opacity-50 backdrop-blur-3xl" />
                <div className="relative text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-3xl bg-surface border-4 border-brand/30 flex items-center justify-center text-4xl overflow-hidden shadow-inner">
                      {profile?.first_name?.[0] || 'G'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-brand text-bg rounded-xl shadow-lg">
                      <Zap className="w-4 h-4 fill-bg" />
                    </div>
                  </div>
                  <h3 className="font-syne font-extrabold text-2xl mb-1">{profile?.first_name} {profile?.last_name}</h3>
                  <p className="text-[10px] text-text-dim font-dm-mono uppercase tracking-[0.3em] mb-8">Cloud Resident</p>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-dm-mono uppercase text-text-soft">Profile Strength</span>
                      <span className="text-sm font-bold text-brand">
                        {Math.round((Object.values(profileForm || {}).filter(v => !!v).length / Object.keys(profileForm || {}).length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-brand transition-all duration-1000" style={{ width: `${(Object.values(profileForm || {}).filter(v => !!v).length / Object.keys(profileForm || {}).length) * 100}%` }} />
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">Complete your profile details to unlock all academy features.</p>
                  </div>
                </div>
              </div>

              {/* SECURITY SUMMARY */}
              <div className="bg-card border border-border-custom rounded-3xl p-6">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  Security Protocol
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                    <div>
                      <p className="text-[12px] font-bold">Email Verified</p>
                      <p className="text-[10px] text-text-dim">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <div>
                      <p className="text-[12px] font-bold">Authentication</p>
                      <p className="text-[10px] text-text-dim">Passkey / OTP Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-8">
              <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-xl">
                <div className="bg-surface/30 p-8 border-b border-border-custom flex justify-between items-center">
                  <div>
                    <h3 className="font-syne font-bold text-2xl">Personal Information</h3>
                    <p className="text-[10px] text-text-muted font-dm-mono uppercase mt-1">Identity & Residency Data</p>
                  </div>
                  {editingProfile ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProfile(false)} className="btn btn-outline btn-sm">Discard</button>
                      <button onClick={handleSaveProfile} className="btn btn-brand btn-sm px-6">Commit Changes</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingProfile(true)} className="btn btn-brand btn-sm px-6">Modify Details</button>
                  )}
                </div>

                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left">
                    {[
                      { label: 'First Name', key: 'first_name', icon: User },
                      { label: 'Last Name', key: 'last_name', icon: User },
                      { label: 'Contact Number', key: 'phone', icon: Phone },
                      { label: 'Date of Birth', key: 'date_of_birth', icon: Calendar, type: 'date' },
                      { label: 'Nationality', key: 'nationality', icon: Globe },
                      { label: 'Postal Code', key: 'postal_code', icon: MapPin },
                    ].map(field => (
                      <div key={field.key} className="space-y-2 group">
                        <label className="flex items-center gap-2 text-[10px] font-dm-mono uppercase text-text-dim tracking-widest group-hover:text-brand transition-colors">
                          <field.icon className="w-3 h-3" />
                          {field.label}
                        </label>
                        {editingProfile ? (
                          <input
                            type={field.type || 'text'}
                            className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm focus:border-brand/50 transition-all outline-none"
                            value={profileForm[field.key] || ''}
                            onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                          />
                        ) : (
                          <div className="p-3 bg-surface/30 border border-transparent rounded-xl text-sm font-bold">
                            {profile?.[field.key] || <span className="text-text-muted font-normal italic">Requires completion</span>}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-dm-mono uppercase text-text-dim tracking-widest">
                        <MapPin className="w-3 h-3" />
                        Residential Address
                      </label>
                      {editingProfile ? (
                        <input
                          className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm"
                          value={profileForm.address_line1 || ''}
                          onChange={e => setProfileForm({ ...profileForm, address_line1: e.target.value })}
                        />
                      ) : (
                        <div className="p-3 bg-surface/30 border border-transparent rounded-xl text-sm font-bold">
                          {profile?.address_line1 || <span className="text-text-muted font-normal italic">Address not set</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EMERGENCY CONTACT SECTION */}
                  <div className="pt-10 border-t border-border-custom">
                    <div className="flex items-center gap-4 mb-8">
                      <ShieldCheck className="w-5 h-5 text-brand" />
                      <h4 className="font-syne font-bold text-lg">Next of Kin / Emergency Contact</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left">
                      {[
                        { label: 'Name / Relationship', key: 'emergency_contact_name', icon: User },
                        { label: 'Emergency Contact Phone', key: 'emergency_contact_phone', icon: Phone },
                      ].map(field => (
                        <div key={field.key} className="space-y-2 group">
                          <label className="flex items-center gap-2 text-[10px] font-dm-mono uppercase text-text-dim tracking-widest group-hover:text-brand transition-colors">
                            <field.icon className="w-3 h-3" />
                            {field.label}
                          </label>
                          {editingProfile ? (
                            <input
                              className="w-full bg-bg border border-border-custom rounded-xl p-3 text-sm focus:border-brand/50 transition-all outline-none"
                              value={profileForm[field.key] || ''}
                              onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                            />
                          ) : (
                            <div className="p-3 bg-surface/30 border border-transparent rounded-xl text-sm font-bold">
                              {profile?.[field.key] || <span className="text-text-muted font-normal italic">Requires completion</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-border-custom">
                    <div className="flex items-center gap-4 mb-8">
                      <Briefcase className="w-5 h-5 text-brand" />
                      <h4 className="font-syne font-bold text-lg">Biographical Statement</h4>
                    </div>
                    {editingProfile ? (
                      <textarea
                        className="w-full bg-bg border border-border-custom rounded-xl p-5 text-sm h-40 focus:border-brand/50 transition-all outline-none"
                        placeholder="Tell us about your technical background and career goals..."
                        value={profileForm.bio || ''}
                        onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      />
                    ) : (
                      <div className="p-6 bg-surface/20 border border-border-custom rounded-2xl italic text-text-soft text-sm leading-relaxed">
                        "{profile?.bio || 'No biographical information provided. Editing your profile allows you to introduce yourself to instructors.'}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── SETTINGS CONTENT ─── */}
        {activeSection === 'settings' && (
          <div className="max-w-4xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border-custom rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-brand/10 text-brand rounded-2xl"><Settings className="w-6 h-6" /></div>
                  <h3 className="font-syne font-bold text-xl">Account Configuration</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-dm-mono uppercase text-text-dim mb-1 block">Primary Identity</label>
                    <div className="p-4 bg-surface rounded-xl border border-border-custom font-mono text-sm">{user?.email}</div>
                  </div>
                  <button onClick={handlePasswordReset} className="w-full btn btn-outline flex items-center justify-center gap-2 py-4">
                    <ShieldCheck className="w-4 h-4" /> Reset Access Credentials
                  </button>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Passwords must reside in our secure cloud identity vault. Resetting will send a secure link to your verified email.
                  </p>
                </div>
              </div>

              <div className="bg-navy border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-syne font-bold font-xl mb-4">GDA Data Privacy</h3>
                  <p className="text-sm text-text-soft leading-relaxed mb-6">
                    You have full sovereignty over your educational data. Download your complete record in standard JSON format for transferability.
                  </p>
                </div>
                <div className="space-y-4">
                  <button onClick={() => exportToJSON([profile || {}], 'gda-archive')} className="w-full btn btn-outline border-white/10 hover:border-brand/50 py-4 flex items-center gap-3 justify-center">
                    <Globe className="w-4 h-4" /> Download Records Archive
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-coral/5 border border-coral/20 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="p-5 bg-coral/10 text-coral rounded-3xl border border-coral/20"><AlertCircle className="w-8 h-8" /></div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-syne font-bold text-xl text-coral mb-2">Institutional Sign Out</h4>
                <p className="text-sm text-text-muted">Sign out of your secure academic session. Your progress and data are encrypted and persisted.</p>
              </div>
              <button onClick={() => signOut()} className="btn bg-coral/10 text-coral border border-coral/20 hover:bg-coral px-8 py-3 transition-colors">Terminate Session</button>
            </div>
          </div>
        )}
      </main>

      {/* ─── CERTIFICATE MODAL ─── */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-xl animate-fade">
          <div className="bg-white text-black p-1 md:p-12 rounded-none shadow-2xl max-w-4xl w-full relative border-[24px] border-brand/10">
            <button onClick={() => setShowCertificate(null)} className="absolute top-4 right-4 text-black/40 hover:text-black z-10 p-2">✕</button>
            <div className="text-center border-[6px] border-brand/30 p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-brand opacity-50" />
              <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-brand opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-brand opacity-50" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-brand opacity-50" />

              <div className="text-brand text-6xl mb-10 opacity-30 select-none">🎓</div>
              <h1 className="font-syne font-extrabold text-4xl md:text-5xl mb-6 uppercase tracking-tighter">Certificate of Excellence</h1>
              <p className="text-gray-400 font-dm-mono text-[12px] uppercase tracking-[0.4em] mb-14">Presented by Ginashe Digital Academy</p>

              <div className="relative mb-6">
                <div className="h-px bg-black/10 absolute top-1/2 left-0 right-0" />
                <span className="relative z-10 bg-white px-6 text-gray-500 font-dm-mono text-[10px] uppercase tracking-widest">This is to certify that</span>
              </div>

              <h2 className="font-syne font-bold text-5xl md:text-6xl text-black mb-10 tracking-tight">{showCertificate.profile?.first_name} {showCertificate.profile?.last_name}</h2>

              <p className="text-gray-500 font-dm-mono text-[11px] uppercase tracking-widest mb-14">Has demonstrated professional mastery in the curriculum of</p>
              <h3 className="font-syne font-bold text-3xl md:text-4xl text-brand mb-20 italic">"{showCertificate.course.title}"</h3>

              <div className="flex justify-between items-end pt-12 border-t border-black/5">
                <div className="text-left">
                  <div className="font-dm-mono text-[9px] uppercase text-gray-400 mb-2">Digital Stamp</div>
                  <div className="text-xs font-mono select-all">GDA-AUTH-{showCertificate.course.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div className="text-center px-8 border-x border-black/5">
                  <div className="font-dm-sans text-[11px] mb-2 italic">Ginashe Digital Board of Instructors</div>
                  <div className="w-40 h-px bg-black opacity-20 mx-auto" />
                </div>
                <div className="text-right">
                  <div className="font-dm-mono text-[9px] uppercase text-gray-400 mb-2">Issued On</div>
                  <div className="font-bold text-sm tracking-tighter">{new Date().toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
            <button onClick={() => window.print()} className="btn bg-white text-black font-bold px-10 py-4 shadow-2xl hover:bg-brand transition-all flex items-center gap-3">
              <Zap className="w-5 h-5" /> Export to Digital PDF
            </button>
          </div>
        </div>
      )}

      {/* ─── QUICK APPLY MODAL ─── */}
      {applyingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/80 backdrop-blur-md animate-fade">
          <div className="bg-bg border border-brand/20 rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px]" />

            <button onClick={() => setApplyingCourse(null)} className="absolute top-8 right-8 text-text-muted hover:text-white transition-colors">✕</button>

            <div className="relative z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-brand text-[9px] uppercase font-dm-mono tracking-widest mb-6">
                <Zap className="w-3 h-3 fill-brand" />
                Intelligent Admission System
              </div>

              <h2 className="font-syne font-extrabold text-3xl mb-2">Apply for {applyingCourse.title}</h2>
              <p className="text-text-muted text-sm mb-10 leading-relaxed">
                We've pre-filled your application using your institutional profile. Verify your details before submitting.
              </p>

              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-6 bg-surface/30 p-6 rounded-2xl border border-border-custom">
                  <div>
                    <label className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest block mb-1">Full Name</label>
                    <div className="font-bold text-sm tracking-tight">{profile?.first_name} {profile?.last_name}</div>
                  </div>
                  <div>
                    <label className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest block mb-1">Student ID</label>
                    <div className="font-bold text-sm tracking-tight">{profile?.student_number || 'New Candidate'}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest block mb-1">Institutional Email</label>
                    <div className="font-bold text-sm text-brand tracking-tight">{user?.email}</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest block mb-2">Motivation (Optional)</label>
                  <textarea
                    id="app-motivation"
                    className="w-full bg-surface border border-border-custom rounded-xl p-4 text-sm h-32 focus:border-brand/50 transition-all outline-none"
                    placeholder="Briefly tell us why you want to join this programme..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setApplyingCourse(null)} className="flex-1 btn btn-outline py-4">Cancel</button>
                <button
                  onClick={async () => {
                    try {
                      const motivation = (document.getElementById('app-motivation') as HTMLTextAreaElement)?.value;
                      const { error } = await supabase.from('applications').insert({
                        first_name: profile?.first_name,
                        last_name: profile?.last_name,
                        email: user?.email,
                        phone: profile?.phone,
                        program: applyingCourse.title,
                        message: motivation,
                        type: 'individual',
                        status: 'pending'
                      });
                      if (error) throw error;

                      await fetch('https://ffgypwmrmdosaihgpkuw.supabase.co/functions/v1/process-application', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user?.email, name: `${profile?.first_name} ${profile?.last_name}`, program: applyingCourse.title })
                      });

                      setApplyingCourse(null);
                      // @ts-ignore
                      fetchStudentData();
                      toast.success('Application Submitted Successfully');
                    } catch (err: any) { toast.error('Protocol Violation', { description: err.message }); }
                  }}
                  className="flex-[2] btn btn-brand py-4"
                >Submit Application →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STUDENT PROGRESS TRACKER (Admin View) ───
function StudentProgressTracker() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProgressData(); }, []);

  async function fetchProgressData() {
    setLoading(true);
    try {
      const { data: enrollments } = await supabase.from('enrollments').select('*, profiles:user_id (id, first_name, last_name, email), courses:course_id (id, title)');
      const { data: lessonProgress } = await supabase.from('lesson_progress').select('*');
      const { data: quizAttempts } = await supabase.from('quiz_attempts').select('*');
      const { data: modules } = await supabase.from('modules').select('*, lessons(*), quizzes(*)');

      const processed = enrollments?.map(enroll => {
        const studentLessons = lessonProgress?.filter(p => p.user_id === enroll.user_id && modules?.some(m => m.course_id === enroll.course_id && m.lessons.some((l: any) => l.id === p.lesson_id))) || [];
        const studentQuizzes = quizAttempts?.filter(a => a.user_id === enroll.user_id && modules?.some(m => m.course_id === enroll.course_id && m.quizzes.some((q: any) => q.id === a.quiz_id))) || [];
        const totalLessons = modules?.filter(m => m.course_id === enroll.course_id).reduce((acc, m) => acc + m.lessons.length, 0) || 0;
        const totalQuizzes = modules?.filter(m => m.course_id === enroll.course_id).reduce((acc, m) => acc + m.quizzes.length, 0) || 0;
        const completedLessons = studentLessons.length;
        const passedQuizzes = studentQuizzes.filter(a => a.passed).length;
        const progressPercent = totalLessons + totalQuizzes > 0 ? Math.round(((completedLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100) : 0;
        return {
          id: enroll.id, student: enroll.profiles, course: enroll.courses, progress: progressPercent,
          completedLessons, totalLessons, passedQuizzes, totalQuizzes,
          lastAttempt: studentQuizzes.length > 0 ? new Date(Math.max(...studentQuizzes.map(a => new Date(a.completed_at).getTime()))).toLocaleDateString() : 'N/A'
        };
      });

      setStudents(processed || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Student Progress</h2>
        <button onClick={() => exportToCSV(students, 'gda-student-progress')} className="btn btn-outline btn-sm">📤 Export CSV</button>
      </div>
      <div className="bg-card border border-border-custom rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border-custom">
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Student</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Course</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Progress</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Lessons</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Quizzes</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Certificate</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {students.map(item => (
              <tr key={item.id} className="border-b border-border-custom hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{item.student?.first_name} {item.student?.last_name}</div>
                  <div className="text-[10px] text-text-muted">{item.student?.email}</div>
                </td>
                <td className="p-4 text-sm">{item.course?.title}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-brand transition-all duration-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="font-dm-mono text-[10px] text-brand">{item.progress}%</span>
                  </div>
                </td>
                <td className="p-4 text-[12px]">{item.completedLessons} / {item.totalLessons}</td>
                <td className="p-4 text-[12px]">{item.passedQuizzes} / {item.totalQuizzes}</td>
                <td className="p-4">
                  {item.progress === 100 ? (
                    <span className="text-emerald text-[10px] font-bold flex items-center gap-1"><span className="text-sm">🎓</span> ISSUED</span>
                  ) : (
                    <span className="text-text-dim text-[10px]">PENDING</span>
                  )}
                </td>
                <td className="p-4 text-[12px] text-text-muted">{item.lastAttempt}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center text-text-muted">No student progress data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── GRADUATION PIPELINE (Admin) ─────────────
function GraduationPipeline({ pendingApprovals, onApprove }: { pendingApprovals: any[], onApprove: (record: any) => void }) {
  const [eligible, setEligible] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEligibility(); }, []);

  async function fetchEligibility() {
    setLoading(true);
    try {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*, profiles:user_id(*), courses:course_id(*)');
      const { data: lessonProgress } = await supabase.from('lesson_progress').select('*');
      const { data: quizAttempts } = await supabase.from('quiz_attempts').select('*');
      const { data: modules } = await supabase.from('modules').select('*, lessons(*), quizzes(*)');
      const { data: incidents } = await supabase.from('proctoring_incidents').select('*').eq('reviewed', false);

      const processed = enrollments?.map(enroll => {
        const courseModules = modules?.filter(m => m.course_id === enroll.course_id) || [];
        const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
        const totalQuizzes = courseModules.reduce((acc, m) => acc + m.quizzes.length, 0);
        const completedLessons = lessonProgress?.filter(p => p.user_id === enroll.user_id && courseModules.some(m => m.lessons.some((l: any) => l.id === p.lesson_id))).length || 0;
        const passedQuizzes = quizAttempts?.filter(a => a.user_id === enroll.user_id && a.passed && courseModules.some(m => m.quizzes.some((q: any) => q.id === a.quiz_id))).length || 0;
        const progress = totalLessons + totalQuizzes > 0 ? Math.round(((completedLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100) : 0;
        const unreviewedIncidents = incidents?.filter(i => i.user_id === enroll.user_id).length || 0;
        const gpaFinal = progress;

        return {
          ...enroll,
          progress,
          gpaFinal,
          unreviewedIncidents,
          isEligible: progress === 100 && unreviewedIncidents === 0,
        };
      }) || [];

      setEligible(processed.filter(e => e.progress >= 80));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleGraduate(student: any) {
    if (!confirm(`Confirm graduation for ${student.profiles?.first_name} ${student.profiles?.last_name}?`)) return;

    const credentialId = `GDA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { error } = await supabase.from('alumni_records').insert({
      user_id: student.user_id,
      course_id: student.course_id,
      gpa_final: student.gpaFinal,
      credential_id: credentialId,
      graduation_date: new Date().toISOString(),
      is_approved: false,
      institutional_notes: 'Graduation Sealed via Institutional Governance Hub. All four pillars verified.',
    });

    if (error) {
      toast.error('Graduation Failure', { description: error.message });
    } else {
      await supabase.from('profiles').update({ graduation_status: 'graduated' }).eq('id', student.user_id);
      await supabase.from('institutional_audit_logs').insert({
        action: 'GRADUATION_SEALED',
        performed_by: student.user_id,
        target_type: 'student',
        target_id: student.user_id,
        reason: `Graduated from ${student.courses?.title} with GPA ${student.gpaFinal}%`,
        new_value: { credential_id: credentialId, gpa: student.gpaFinal },
      });
      toast.success('Graduation Sealed', { description: 'Awaiting Institutional Blessing.' });
      fetchEligibility();
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex items-center gap-3">
        <Lock className="w-5 h-5 text-brand" />
        <h2 className="font-syne font-extrabold text-2xl tracking-tighter">Graduation Pipeline</h2>
        <span className="text-[9px] font-dm-mono bg-brand/10 text-brand px-3 py-1 rounded-full border border-brand/20">{eligible.length} CANDIDATES</span>
      </div>

      <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface border-b border-border-custom text-[9px] uppercase font-dm-mono text-text-muted tracking-widest">
              <th className="p-5">Student</th>
              <th className="p-5">Course</th>
              <th className="p-5">GPA</th>
              <th className="p-5">Integrity</th>
              <th className="p-5">Eligibility</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom">
            {eligible.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-5">
                  <div className="font-bold text-sm">{s.profiles?.first_name} {s.profiles?.last_name}</div>
                  <div className="text-[10px] text-text-muted font-dm-mono">{s.profiles?.student_number || 'N/A'}</div>
                </td>
                <td className="p-5 text-sm">{s.courses?.title}</td>
                <td className="p-5 font-syne font-black text-lg">{s.gpaFinal}%</td>
                <td className="p-5">
                  {s.unreviewedIncidents === 0 ? (
                    <span className="text-emerald text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> CLEAR</span>
                  ) : (
                    <span className="text-coral text-[10px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {s.unreviewedIncidents} FLAGS</span>
                  )}
                </td>
                <td className="p-5">
                  {s.isEligible ? (
                    <span className="text-emerald text-[10px] font-bold bg-emerald/10 px-3 py-1 rounded-full border border-emerald/20">ELIGIBLE</span>
                  ) : (
                    <span className="text-brand text-[10px] font-bold bg-brand/10 px-3 py-1 rounded-full border border-brand/20">IN PROGRESS</span>
                  )}
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => handleGraduate(s)}
                    disabled={!s.isEligible}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${s.isEligible ? 'btn btn-brand hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-surface text-text-dim cursor-not-allowed opacity-50'}`}
                  >
                    {s.isEligible ? '🎓 SEAL GRADUATION' : 'NOT READY'}
                  </button>
                </td>
              </tr>
            ))}
            {eligible.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-text-muted italic text-xs uppercase tracking-widest font-dm-mono">No candidates near graduation threshold.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pendingApprovals && pendingApprovals.length > 0 && (
        <InstitutionalApprovalQueue pendingApprovals={pendingApprovals} onApprove={onApprove} />
      )}
    </div>
  );
}

// ─── INSTITUTIONAL APPROVAL QUEUE (Shared) ────
function InstitutionalApprovalQueue({ pendingApprovals, onApprove }: { pendingApprovals: any[], onApprove: (record: any) => void }) {
  return (
    <div className="space-y-4 pt-12 animate-fade">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-brand rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
        <h3 className="font-syne font-black text-xl uppercase tracking-tighter text-brand">Institutional Approval Queue</h3>
        <span className="text-[9px] font-dm-mono bg-brand/10 text-brand px-3 py-1 rounded-full border border-brand/20 tracking-widest">{pendingApprovals.length} PENDING</span>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-3xl overflow-hidden shadow-2xl relative isolate">
        <div className="absolute inset-0 bg-brand/[0.01] pointer-events-none" />
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface/50 border-b border-brand/10 text-brand text-[9px] uppercase font-dm-mono tracking-[0.2em]">
                <th className="p-4">Finalist Identity</th>
                <th className="p-4">Final GPA</th>
                <th className="p-4">Sealed Date</th>
                <th className="p-4">Governance_ID</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/5">
              {pendingApprovals.map(r => (
                <tr key={r.id} className="hover:bg-brand/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-sm text-text-soft">{r.profiles?.first_name} {r.profiles?.last_name}</div>
                    <div className="text-[9px] text-text-dim font-dm-mono uppercase">{r.profiles?.student_number}</div>
                  </td>
                  <td className="p-4 font-syne font-black text-emerald text-sm">{r.gpa_final}%</td>
                  <td className="p-4 text-[11px] text-text-dim font-dm-mono">{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="p-4 text-[9px] font-dm-mono text-brand/60 uppercase tracking-tighter">{r.credential_id}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onApprove(r)}
                      className="btn btn-brand px-5 py-2 rounded-xl text-[9px] font-black tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    >
                      GRANT BLESSING
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── INSTITUTIONAL AUDIT HUB (Admin) ──────────
function InstitutionalAuditHub({ pendingApprovals, onApprove }: { pendingApprovals: any[], onApprove: (record: any) => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const { data } = await supabase.from('institutional_audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      setLogs(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-brand" />
          <h2 className="font-syne font-black text-2xl tracking-tighter uppercase text-white">System Audit Log</h2>
        </div>
        <span className="text-[9px] font-dm-mono bg-brand/5 text-brand/80 px-4 py-1.5 rounded-full border border-brand/10 tracking-[0.2em] uppercase">{logs.length} Immutable Records</span>
      </div>

      <div className="bg-[#0a0d14] border border-brand/10 rounded-3xl overflow-hidden shadow-2xl relative isolate">
        <div className="absolute inset-0 bg-brand/[0.01] pointer-events-none" />
        <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md">
              <tr className="border-b border-brand/10 text-[9px] uppercase font-dm-mono text-brand/60 tracking-[0.2em]">
                <th className="p-4">Action Cluster</th>
                <th className="p-4">Entity Identifier</th>
                <th className="p-4">Rationale</th>
                <th className="p-4 text-right">Chronology</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/5">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-brand/5 transition-colors group">
                  <td className="p-4">
                    <span className="text-[9px] font-black text-brand bg-brand/10 px-3 py-1 rounded-lg border border-brand/20 uppercase tracking-widest">{log.action}</span>
                  </td>
                  <td className="p-4 font-dm-mono">
                    <div className="text-[10px] text-text-soft font-bold uppercase tracking-tighter">{log.target_type}</div>
                    <div className="text-[9px] text-text-dim">{log.target_id?.substring(0, 12)}...</div>
                  </td>
                  <td className="p-4 text-[11px] text-text-soft leading-relaxed max-w-sm">
                    {log.reason || 'No executive rationale provided.'}
                  </td>
                  <td className="p-4 text-[10px] font-dm-mono text-text-dim text-right">
                    {new Date(log.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4} className="p-16 text-center text-text-muted italic text-[11px] uppercase tracking-[0.3em]">Institutional archive is currently vacant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ALUMNI HUB (Student View) ────────────────
function AlumniHub({ profile }: { profile: any }) {
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    async function fetchRecord() {
      const { data } = await supabase.from('alumni_records').select('*').eq('user_id', profile.id).single();
      setRecord(data);
    }
    fetchRecord();
  }, [profile.id]);

  return (
    <div className="min-h-screen bg-navy text-text-custom flex items-center justify-center p-8 relative overflow-hidden isolate">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-brand/5 blur-[150px] rounded-full -mr-[50%] -mt-[50%]" />
      <div className="absolute inset-0 bg-white/2 blur-[100px] rounded-full -ml-[40%] -mb-[40%]" />

      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-[#0a0d14]/80 backdrop-blur-2xl border border-brand/10 rounded-[3rem] p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] mb-2 transform group-hover:rotate-6 transition-all duration-700">
              <span className="text-navy font-syne font-black text-3xl">G</span>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-dm-mono uppercase tracking-[0.5em] text-brand bg-brand/5 px-6 py-2 rounded-full border border-brand/20">Institutional Alumni Governance</span>
              <h1 className="font-syne font-black text-5xl md:text-6xl tracking-tighter leading-none text-white">
                Honourably Sealed, <br /><span className="text-brand">{profile?.first_name}.</span>
              </h1>
            </div>

            {record ? (
              <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 text-left relative z-10">
                  <div className="p-6 bg-white/[0.02] border border-brand/10 rounded-3xl space-y-5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest">Master Credential Lock</p>
                      <p className="text-base font-bold text-brand/90 font-dm-mono">{record.credential_id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest">Aggregate GPA</p>
                        <p className="text-4xl font-syne font-black text-emerald tracking-tighter">{record.gpa_final}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-dm-mono uppercase text-text-dim tracking-widest">Sealing Date</p>
                        <p className="text-lg font-bold text-text-soft">{new Date(record.graduation_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-brand/5">
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg inline-block ${record.is_approved ? 'bg-emerald/5 text-emerald border border-emerald/20' : 'bg-brand/5 text-brand border border-brand/20 animate-pulse'}`}>
                        {record.is_approved ? '✓ INSTITUTIONALLY RECOGNIZED' : '⏳ PENDING FINAL AUDIT'}
                      </p>
                    </div>
                  </div>

                  <div className="px-2">
                    <p className="text-[11px] text-text-dim italic leading-relaxed">
                      "This academic record is cryptographically verified and permanently inscribed in the Ginashe Institutional Audit Hub. Your excellence is now part of our legacy."
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="flex-1 btn btn-brand py-4 text-[10px] font-black tracking-widest shadow-[0_0_25px_rgba(0,242,255,0.15)] hover:scale-[1.02] transition-all">GENERATE CERTIFICATE</button>
                    <button className="flex-1 btn btn-outline py-4 text-[10px] font-black tracking-widest border-brand/10 hover:border-brand/30 transition-all">SHARE EXCELLENCE</button>
                  </div>
                </div>

                {/* Right: The Seal */}
                <div className="flex justify-center flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand/20 blur-[60px] rounded-full animate-pulse" />
                    <img
                      src="/gda_institutional_seal_cyan.png"
                      alt="GDA Institutional Seal"
                      className={`w-64 h-64 object-contain relative z-10 ${record.is_approved ? 'grayscale-0' : 'grayscale transition-all duration-1000'}`}
                    />
                    {record.is_approved && (
                      <div className="absolute -top-4 -right-4 bg-emerald text-navy p-3 rounded-full shadow-2xl z-20 animate-bounce">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-dm-mono uppercase text-text-dim tracking-widest">
                    {record.is_approved ? 'Official Digital Seal Active' : 'Seal Pending Activation'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
                <p className="text-[10px] font-dm-mono uppercase text-brand tracking-widest">Recalling Sealed Record...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Brand */}
        <div className="mt-12 flex flex-col items-center space-y-4 opacity-50">
          <div className="h-px w-20 bg-white/10" />
          <p className="text-[10px] font-dm-mono uppercase text-text-dim tracking-[0.2em]">GINASHE DIGITAL ACADEMY | ALUMNI GOVERNANCE</p>
        </div>
      </div>
    </div>
  );
}

// ─── STAFF ACTIVATION VIEW ───────────────────
export function StaffActivationView() {
  const [token] = useState(new URLSearchParams(window.location.search).get('token'));
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) verifyToken();
    else { setLoading(false); setError('No invitation token provided.'); }
  }, [token]);

  async function verifyToken() {
    try {
      const { data, error } = await supabase.from('profiles')
        .select('*')
        .eq('invitation_token', token)
        .gt('token_expires_at', new Date().toISOString())
        .single();

      if (error || !data) throw new Error('Invalid or expired invitation token.');
      setProfileData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    if (password.length < 8) {
      toast.error('Security Breach', { description: 'Password must be at least 8 characters.' });
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profileData.email,
        password,
        options: { data: { first_name: profileData.first_name, last_name: profileData.last_name } }
      });
      if (authError) throw authError;

      await new Promise(r => setTimeout(r, 1000));

      const { error: updateError } = await supabase.from('profiles')
        .update({ staff_number: profileData.staff_number, role: profileData.role, is_active_staff: true, onboarding_status: 'active' })
        .eq('id', authData.user?.id);
      if (updateError) throw updateError;

      await supabase.from('profiles').delete().eq('id', profileData.id);
      setSuccess(true);
    } catch (err: any) {
      toast.error('Activation Failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 animate-fade">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      <p className="mt-8 text-brand font-dm-mono text-[10px] tracking-widest uppercase">Verifying Institutional Token...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center animate-fade">
      <div className="w-20 h-20 bg-coral/10 text-coral rounded-3xl flex items-center justify-center text-3xl mb-8">⚠️</div>
      <h2 className="font-syne font-extrabold text-3xl mb-4">Activation Failed</h2>
      <p className="text-text-soft text-sm max-w-md mb-8">{error}</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = '/';
        }}
        className="btn btn-brand px-12 py-4 shadow-xl"
      >
        Return to Academy Home
      </button>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center animate-fade">
      <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-3xl flex items-center justify-center text-3xl mb-8">✨</div>
      <h2 className="font-syne font-extrabold text-3xl mb-4">Welcome to GDA</h2>
      <p className="text-text-soft text-sm max-w-md mb-8">Your institutional identity is active. You can now access your staff hub.</p>
      <button onClick={() => window.location.href = '/portal'} className="btn btn-brand px-12 py-4 shadow-xl">Enter Portal</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row animate-fade">
      <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-between relative overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-brand/5 blur-[120px] rounded-full -mr-32 -mt-32 animate-pulse" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 bg-brand text-bg rounded-xl flex items-center justify-center text-lg font-black shadow-[0_0_20px_rgba(0,242,255,0.2)]">G</div>
            <h1 className="font-syne font-black text-xl uppercase tracking-widest text-white">Institutional_Access</h1>
          </div>
          <div className="space-y-6">
            <span className="text-[9px] font-dm-mono uppercase text-brand tracking-widest bg-brand/5 px-4 py-1.5 rounded-full border border-brand/20">Legacy Validation Active</span>
            <h2 className="font-syne font-black text-5xl md:text-6xl leading-[0.9] tracking-tighter text-white">Activate <br /><span className="text-brand">Staff Hub.</span></h2>
            <p className="text-text-dim max-w-sm text-[13px] leading-relaxed">
              Complete your cryptographic onboarding by setting your institutional credentials. This will grant you governance access allocated to your professional role.
            </p>
          </div>
        </div>
        <div className="relative z-10 pt-12 border-t border-brand/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-brand/20 flex items-center justify-center text-xs text-brand font-bold shadow-inner">SF</div>
            <div>
              <p className="text-[9px] text-text-muted uppercase font-dm-mono tracking-widest mb-0.5">Assigned Professional ID</p>
              <p className="text-sm font-black text-white">{profileData?.staff_number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-center p-12 lg:p-24 bg-bg border-l border-border-custom relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/2 rounded-full blur-[100px]" />
        <div className="max-w-md w-full mx-auto space-y-12 relative z-10">
          <div className="space-y-4">
            <h3 className="font-syne font-black text-2xl uppercase tracking-tighter text-white">Set Command Password</h3>
            <p className="text-text-soft text-sm italic">Institutional primary domain verified: <span className="text-brand font-dm-mono">{profileData?.email}</span></p>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-dm-mono uppercase text-text-muted tracking-widest flex items-center gap-2 ml-1">
                <Lock size={10} className="text-brand" /> Choose Secure Password
              </label>
              <input
                type="password"
                className="w-full bg-[#0a0d14] border border-brand/10 focus:border-brand/30 rounded-2xl p-5 outline-none transition-all placeholder:text-text-dim text-sm text-white selection:bg-brand selection:text-navy"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="bg-[#0a0d14]/50 border border-brand/5 p-6 rounded-2xl space-y-4">
              <h4 className="font-dm-mono text-[9px] uppercase font-bold text-brand tracking-widest">Role Privileges</h4>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider text-text-soft">{profileData?.role} ACCESS ENABLED</span>
              </div>
              <p className="text-[10px] text-text-dim leading-relaxed font-bold">
                BY ACTIVATING THIS ACCOUNT, YOU AGREE TO THE GDA INSTITUTIONAL GOVERNANCE POLICY AND DATA INTEGRITY STANDARDS.
              </p>
            </div>
            <button
              onClick={handleActivate}
              disabled={loading}
              className="w-full btn btn-brand py-5 shadow-[0_0_30px_rgba(0,242,255,0.1)] rounded-2xl font-black tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:scale-[1.01] transition-all"
            >
              {loading ? 'INITIALIZING...' : 'ACTIVATE STAFF IDENTITY'} <ArrowRight size={18} />
            </button>
          </div>
          <div className="pt-8 border-t border-brand/10">
            <p className="text-[9px] text-text-dim text-center font-dm-mono tracking-widest">GINASHE DIGITAL ACADEMY HUB SECURITY (INSTITUTIONAL_V5)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
