import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import AcademyDashboard from './AcademyDashboard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

// ─── UTILITY: AI Match Score Badge ───────────
function AIMatchBadge({ score }: { score: number | null }) {
  if (!score) return <span className="text-text-dim text-[9px] font-dm-mono">N/A</span>;
  const color = score >= 85 ? 'emerald' : score >= 70 ? 'gold' : 'coral';
  return (
    <div className={`flex items-center gap-1.5`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border bg-${color}-dim text-${color} border-${color}/20`}>
        {score}
      </div>
      <span className={`text-[8px] font-dm-mono uppercase tracking-wider text-${color}`}>
        {score >= 85 ? 'Strong' : score >= 70 ? 'Good' : 'Review'}
      </span>
    </div>
  );
}

// ─── ADMIN DASHBOARD (MAIN) ──────────────────
export function AdminDashboard() {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'courses' | 'news' | 'events' | 'finances' | 'progress' | 'staff' | 'settings' | 'communications'>('overview');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const isSuperAdmin = profile?.role === 'super_admin' || user?.email === 'ginandNatalie@gmail.com' || user?.email === 'academy@ginashe.co.za';

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
    if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'courses') {
      fetchCourses();
    }
  }, [activeTab]);

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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const app = applications.find(a => a.id === id);
      const historyEntry = {
        event: `Status changed to ${newStatus}`,
        timestamp: new Date().toISOString(),
        by: user?.email || 'admin',
        details: `Application ${newStatus} by ${user?.email}`
      };

      const existingHistory = Array.isArray(app?.history) ? app.history : [];

      const updateData: any = {
        status: newStatus,
        reviewed_by: user?.email,
        reviewed_at: new Date().toISOString(),
        history: [...existingHistory, historyEntry],
        updated_at: new Date().toISOString()
      };

      // Generate student number on approval
      if (newStatus === 'approved' && !app?.student_number) {
        const year = new Date().getFullYear();
        const seq = String(Math.floor(Math.random() * 9000) + 1000);
        updateData.student_number = `GDA-${year}-${seq}`;
      }

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
    <div className="p-8 max-w-7xl mx-auto">
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
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="font-syne font-extrabold text-3xl">Admin Dashboard</h1>
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-custom rounded-lg text-text-muted hover:text-text-custom hover:border-gold/30 transition-all"
                >
                  <span className="text-sm">🔍</span>
                  <span className="font-dm-mono text-[9px] tracking-wider">CMD+K</span>
                </button>
              </div>
              <div className="flex gap-4 mt-4 border-b border-border-custom overflow-x-auto">
                {[
                  { id: 'overview', label: 'Stats' },
                  { id: 'applications', label: 'Admissions' },
                  { id: 'courses', label: 'Courses' },
                  { id: 'news', label: 'News' },
                  { id: 'events', label: 'Events' },
                  { id: 'finances', label: 'Finance' },
                  { id: 'staff', label: 'Staff' },
                  { id: 'settings', label: 'Site Settings' },
                  { id: 'communications', label: 'Comms' },
                ].filter(t => (t.id === 'staff' || t.id === 'settings') ? isSuperAdmin : true).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2 px-1 font-dm-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-gold border-b-2 border-gold' : 'text-text-muted hover:text-text-custom'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && activeTab !== 'overview' ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            </div>
          ) : activeTab === 'overview' ? (
            <OverviewStats applications={applications} courses={courses} />
          ) : activeTab === 'applications' ? (
            <ApplicationTable apps={applications} onUpdate={fetchApplications} onSelect={setSelectedApp} isLoading={loading} filters={{status: statusFilter, search: searchQuery}} />
          ) : activeTab === 'courses' ? (
            <CourseManager courses={courses} onRefresh={fetchCourses} onEditContent={setEditingCourse} />
          ) : activeTab === 'progress' ? (
            <StudentProgressTracker />
          ) : activeTab === 'staff' ? (
            <StaffManagement />
          ) : activeTab === 'communications' ? (
            <CommunicationLogs />
          ) : (
            <SiteSettings />
          )}
        </>
      )}

      {/* ─── APPLICATION DETAIL MODAL ─── */}
      {selectedApp && (
        <div className="fixed inset-0 z-[3000] bg-bg/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedApp(null)}>
          <div className="bg-card border border-border-custom rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-muted hover:text-text-custom" onClick={() => setSelectedApp(null)}>✕</button>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-dm-mono text-[10px] uppercase tracking-widest text-gold">{selectedApp.type} Application</span>
                <AIMatchBadge score={selectedApp.ai_match_score} />
              </div>
              <h2 className="font-syne font-extrabold text-2xl">
                {selectedApp.type === 'individual' ? `${selectedApp.first_name} ${selectedApp.last_name}` : selectedApp.organization_name}
              </h2>
              <p className="text-text-muted text-sm">{selectedApp.email}</p>
              {selectedApp.student_number && (
                <p className="text-gold font-dm-mono text-sm mt-1">{selectedApp.student_number}</p>
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

              {selectedApp.type === 'individual' && (
                <>
                  <div>
                    <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Program</label>
                    <p className="text-sm font-semibold text-gold">{selectedApp.program}</p>
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
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
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
                <a href={`mailto:${selectedApp.email}`} className="btn btn-gold btn-sm flex-1 justify-center">Email Applicant</a>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Error fetching communication logs:', err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Communication Log</h2>
        <button onClick={() => exportToCSV(logs, 'gda-communications')} className="btn btn-outline btn-sm">📤 Export CSV</button>
      </div>
      <div className="bg-card border border-border-custom rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border-custom">
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Date</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Recipient</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Type</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Subject</th>
              <th className="p-4 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-border-custom hover:bg-white/2">
                <td className="p-4 text-[11px] text-text-soft">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-4 text-[12px]">{log.recipient_email}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-dm-mono uppercase bg-sky-dim text-sky border border-sky/20">
                    {log.email_type}
                  </span>
                </td>
                <td className="p-4 text-[12px] text-text-soft max-w-[250px] truncate">{log.subject}</td>
                <td className="p-4">
                  <span className={`text-[9px] font-dm-mono uppercase ${log.status === 'sent' ? 'text-emerald' : 'text-coral'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-text-muted">No communication logs found. Emails will appear here after they are sent.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STAFF MANAGEMENT ────────────────────────
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
    } catch (err: any) { alert('Error updating role: ' + err.message); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Staff & Roles</h2>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(staff, 'gda-staff')} className="btn btn-outline btn-sm">📤 Export</button>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-gold btn-sm">{isAdding ? 'Cancel' : '+ Add Staff'}</button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-card border border-border-custom rounded-xl p-6 mb-6">
          <p className="text-sm text-text-muted mb-4">Note: Staff members must first create an account. You can then upgrade their role here.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Email Address" className="bg-surface border border-border-custom rounded p-2 text-sm" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
            <select className="bg-surface border border-border-custom rounded p-2 text-sm" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
              <option value="admin">Administrator</option>
              <option value="instructor">Instructor</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button onClick={async () => {
              const { data: u } = await supabase.from('profiles').select('id').eq('email', newStaff.email).single();
              if (u) { handleUpdateRole(u.id, newStaff.role); setIsAdding(false); }
              else { alert('User not found. They must sign up first.'); }
            }} className="btn btn-gold">Assign Role</button>
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
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-dm-mono uppercase border ${m.role === 'super_admin' ? 'border-gold/20 text-gold bg-gold-dim' : 'border-sky/20 text-sky bg-sky-dim'}`}>{m.role}</span>
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
    ctaSubtitle: 'Applications for the April 2025 cohort close soon. Seats are limited to 25 per cohort — secure yours now.'
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
      alert('Settings saved!');
    } catch (err: any) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border-custom rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-syne font-bold text-xl">Global Site Settings</h2>
          <button onClick={handleSave} disabled={saving} className={`btn btn-gold btn-sm ${saving ? 'opacity-50' : ''}`}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Intake Status</label>
              <select className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.intakeStatus} onChange={e => setSettings({...settings, intakeStatus: e.target.value})}>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="WAITLIST">WAITLIST ONLY</option>
              </select>
            </div>
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Contact Email</label>
              <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Hero Main Title</label>
            <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} />
          </div>
          <div>
            <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Hero Subtitle</label>
            <textarea className="w-full bg-surface border border-border-custom rounded p-2 text-sm h-24" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} />
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
                <label key={page.id} className="flex items-center justify-between p-3 bg-surface border border-border-custom rounded-md cursor-pointer hover:border-gold/30 transition-all">
                  <span className="text-xs font-medium">{page.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={(settings as any)[page.id]} onChange={e => setSettings({...settings, [page.id]: e.target.checked})} />
                    <div className="w-9 h-5 bg-bg/50 border border-border-custom peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:after:bg-bg"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border-custom">
            <button onClick={handleSave} disabled={saving} className={`btn btn-gold w-full ${saving ? 'opacity-50' : ''}`}>
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
function CourseManager({ courses, onRefresh, onEditContent }: { courses: any[], onRefresh: () => void, onEditContent: (course: any) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', slug: '', thumbnail_url: '📘' });

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('courses').insert([newCourse]);
      if (error) throw error;
      setIsAdding(false);
      setNewCourse({ title: '', description: '', slug: '', thumbnail_url: '📘' });
      onRefresh();
    } catch (err: any) { alert('Error adding course: ' + err.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Manage Courses</h2>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(courses, 'gda-courses')} className="btn btn-outline btn-sm">📤 Export</button>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-gold btn-sm">{isAdding ? 'Cancel' : '+ Create New Course'}</button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCourse} className="bg-card border border-border-custom rounded-xl p-6 space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Course Title</label>
              <input required className="w-full bg-surface border border-border-custom rounded-md p-2 text-sm" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
            </div>
            <div>
              <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Slug (URL)</label>
              <input required className="w-full bg-surface border border-border-custom rounded-md p-2 text-sm" value={newCourse.slug} onChange={e => setNewCourse({ ...newCourse, slug: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Description</label>
            <textarea required className="w-full bg-surface border border-border-custom rounded-md p-2 text-sm h-24" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-gold w-full">Save Course</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-card border border-border-custom rounded-xl p-6 hover:border-gold/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center text-2xl">{course.thumbnail_url}</div>
            </div>
            <h3 className="font-syne font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-[12px] text-text-muted line-clamp-2 mb-4">{course.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-border-custom">
              <span className="font-dm-mono text-[9px] uppercase tracking-widest text-text-dim">/courses/{course.slug}</span>
              <button onClick={() => onEditContent(course)} className="text-gold text-[11px] font-bold hover:underline">Manage Content →</button>
            </div>
          </div>
        ))}
      </div>
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
    } catch (err: any) { alert('Error: ' + err.message); }
    finally { setLoading(false); }
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('modules').insert({ course_id: course.id, title: newModuleTitle, order_index: modules.length + 1 });
      if (error) throw error;
      setNewModuleTitle(''); setIsAddingModule(false); fetchContent();
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  async function handleAddLesson(moduleId: string) {
    try {
      const { data, error } = await supabase.from('lessons').insert({ module_id: moduleId, title: 'New Lesson', content: '', video_url: '', duration: '10:00', order_index: 99 }).select().single();
      if (error) throw error;
      setEditingLesson(data); setEditingQuiz(null); fetchContent();
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  async function handleAddQuiz(moduleId: string) {
    try {
      const { data, error } = await supabase.from('quizzes').insert({ module_id: moduleId, title: 'Module Quiz', description: 'Test your knowledge.', passing_score: 80, order_index: 100 }).select().single();
      if (error) throw error;
      setEditingQuiz({ ...data, questions: [] }); setEditingLesson(null); fetchContent();
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  async function handleSaveLesson(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('lessons').update(editingLesson).eq('id', editingLesson.id);
      if (error) throw error;
      setEditingLesson(null); fetchContent();
    } catch (err: any) { alert('Error: ' + err.message); }
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
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface border border-border-custom">←</button>
        <div>
          <h2 className="font-syne font-bold text-2xl">{course.title}</h2>
          <p className="text-text-muted text-sm">Manage modules, lessons, and quizzes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-syne font-bold text-lg">Curriculum</h3>
            <button onClick={() => setIsAddingModule(true)} className="text-gold text-[11px] font-bold">+ Add Module</button>
          </div>

          {isAddingModule && (
            <form onSubmit={handleAddModule} className="bg-card border border-border-custom p-4 rounded-xl flex gap-2">
              <input autoFocus placeholder="Module Title" className="flex-1 bg-surface border border-border-custom rounded-md p-2 text-sm" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} />
              <button type="submit" className="btn btn-gold btn-sm">Add</button>
            </form>
          )}

          <div className="space-y-4">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="bg-card border border-border-custom rounded-xl overflow-hidden">
                <div className="bg-surface p-3 border-b border-border-custom flex justify-between items-center">
                  <span className="font-dm-mono text-[10px] uppercase text-text-muted">Module {mIdx + 1}: {mod.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddLesson(mod.id)} className="text-[10px] text-gold hover:underline">+ Lesson</button>
                    <button onClick={() => handleAddQuiz(mod.id)} className="text-[10px] text-gold hover:underline">+ Quiz</button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {mod.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                    <button key={lesson.id} onClick={() => { setEditingLesson(lesson); setEditingQuiz(null); }}
                      className={`w-full text-left p-2 rounded text-[12px] transition-all ${editingLesson?.id === lesson.id ? 'bg-gold/10 text-gold' : 'hover:bg-white/5 text-text-soft'}`}>
                      📄 {lesson.title}
                    </button>
                  ))}
                  {mod.quizzes?.map((quiz: any) => (
                    <button key={quiz.id} onClick={async () => {
                      const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('order_index', { ascending: true });
                      setEditingQuiz({ ...quiz, questions: questions || [] }); setEditingLesson(null);
                    }}
                      className={`w-full text-left p-2 rounded text-[12px] transition-all ${editingQuiz?.id === quiz.id ? 'bg-gold/10 text-gold' : 'hover:bg-white/5 text-text-soft'}`}>
                      ❓ {quiz.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingLesson ? (
            <form onSubmit={handleSaveLesson} className="bg-card border border-border-custom rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-syne font-bold text-xl">Edit Lesson</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingLesson(null)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-gold btn-sm">Save Changes</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Lesson Title</label>
                  <input required className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingLesson.title} onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Video URL</label>
                  <input className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingLesson.video_url} onChange={e => setEditingLesson({ ...editingLesson, video_url: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Duration</label>
                  <input className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingLesson.duration} onChange={e => setEditingLesson({ ...editingLesson, duration: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Content (Markdown)</label>
                <textarea className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm h-64 font-mono" value={editingLesson.content} onChange={e => setEditingLesson({ ...editingLesson, content: e.target.value })} />
              </div>
            </form>
          ) : editingQuiz ? (
            <form onSubmit={handleSaveQuiz} className="bg-card border border-border-custom rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-syne font-bold text-xl">Edit Quiz</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingQuiz(null)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-gold btn-sm">Save Quiz</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Quiz Title</label>
                  <input required className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingQuiz.title} onChange={e => setEditingQuiz({ ...editingQuiz, title: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Description</label>
                  <input className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingQuiz.description} onChange={e => setEditingQuiz({ ...editingQuiz, description: e.target.value })} />
                </div>
                <div>
                  <label className="block font-dm-mono text-[10px] uppercase text-text-muted mb-1">Passing Score (%)</label>
                  <input type="number" className="w-full bg-surface border border-border-custom rounded-md p-3 text-sm" value={editingQuiz.passing_score} onChange={e => setEditingQuiz({ ...editingQuiz, passing_score: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-6 pt-6 border-t border-border-custom">
                <div className="flex justify-between items-center">
                  <h4 className="font-syne font-bold text-lg">Questions</h4>
                  <button type="button" onClick={() => setEditingQuiz({
                    ...editingQuiz, questions: [...editingQuiz.questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]
                  })} className="text-gold text-[11px] font-bold">+ Add Question</button>
                </div>
                {editingQuiz.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="bg-surface p-4 rounded-xl border border-border-custom space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-dm-mono text-[10px] text-text-muted">Question {qIdx + 1}</span>
                      <button type="button" onClick={() => {
                        const newQs = [...editingQuiz.questions]; newQs.splice(qIdx, 1);
                        setEditingQuiz({ ...editingQuiz, questions: newQs });
                      }} className="text-coral text-[10px]">Remove</button>
                    </div>
                    <input placeholder="Enter question text" className="w-full bg-bg border border-border-custom rounded-md p-2 text-sm" value={q.question}
                      onChange={e => { const newQs = [...editingQuiz.questions]; newQs[qIdx].question = e.target.value; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt: string, oIdx: number) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${qIdx}`} checked={q.correct_answer === oIdx}
                            onChange={() => { const newQs = [...editingQuiz.questions]; newQs[qIdx].correct_answer = oIdx; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                          <input placeholder={`Option ${oIdx + 1}`} className="flex-1 bg-bg border border-border-custom rounded-md p-2 text-[12px]" value={opt}
                            onChange={e => { const newQs = [...editingQuiz.questions]; newQs[qIdx].options[oIdx] = e.target.value; setEditingQuiz({ ...editingQuiz, questions: newQs }); }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="bg-card border border-border-custom border-dashed rounded-xl p-20 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-syne font-bold text-xl mb-2">Select a lesson or quiz to edit</h3>
              <p className="text-text-muted">Choose an item from the sidebar to modify its content and settings.</p>
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
      alert('Post saved!');
      setIsEditing(false);
      fetchPosts();
    } catch (err: any) { alert(err.message); }
  }

  if (loading && !isEditing) return <div className="py-20 text-center">Loading posts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">News & Insights CMS</h2>
        <button onClick={() => { setCurrentPost({ title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'General' }); setIsEditing(true); }} className="btn btn-gold btn-sm">+ New Article</button>
      </div>

      {isEditing ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.title} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} />
            <input placeholder="Slug (optional)" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.slug} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} />
            <input placeholder="Image URL" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.image_url} onChange={e => setCurrentPost({...currentPost, image_url: e.target.value})} />
            <select className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentPost.category} onChange={e => setCurrentPost({...currentPost, category: e.target.value})}>
              <option>General</option>
              <option>Technology</option>
              <option>Career</option>
              <option>Academy Update</option>
            </select>
          </div>
          <textarea placeholder="Excerpt" className="w-full bg-surface border border-border-custom p-2 rounded text-sm h-20" value={currentPost.excerpt} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} />
          <div className="bg-white text-black rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={currentPost.content} onChange={val => setCurrentPost({...currentPost, content: val})} style={{ height: '300px', marginBottom: '40px' }} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSavePost} className="btn btn-gold btn-sm">Save Article</button>
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
                  <span className="text-[9px] font-dm-mono uppercase text-gold">{post.category}</span>
                  <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="text-gold text-[10px] font-bold">Edit</button>
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
    } catch (err: any) { alert(err.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-syne font-bold text-xl">Events & Webinars</h2>
        <button onClick={() => { setCurrentEvent({ title: '', description: '', event_date: '', event_time: '', location: '', type: 'Webinar' }); setIsEditing(true); setSelectedEvent(null); }} className="btn btn-gold btn-sm">+ New Event</button>
      </div>

      {isEditing ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
          <input placeholder="Title" className="w-full bg-surface border border-border-custom p-2 rounded text-sm font-bold" value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.event_date} onChange={e => setCurrentEvent({...currentEvent, event_date: e.target.value})} />
            <input type="time" className="bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.event_time} onChange={e => setCurrentEvent({...currentEvent, event_time: e.target.value})} />
          </div>
          <input placeholder="Location (or Link)" className="w-full bg-surface border border-border-custom p-2 rounded text-sm" value={currentEvent.location} onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})} />
          <textarea placeholder="Description" className="w-full bg-surface border border-border-custom p-2 rounded text-sm h-32" value={currentEvent.description} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSaveEvent} className="btn btn-gold btn-sm">Save Event</button>
          </div>
        </div>
      ) : selectedEvent ? (
        <div className="bg-card border border-border-custom rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <button onClick={() => setSelectedEvent(null)} className="text-gold text-[10px] uppercase font-bold mb-2">← Back to List</button>
              <h3 className="font-syne font-bold text-2xl">{selectedEvent.title}</h3>
              <p className="text-text-muted text-sm">{selectedEvent.event_date} at {selectedEvent.event_time}</p>
            </div>
            <button onClick={() => exportToCSV(regs, `registrations-${selectedEvent.id}`)} className="btn btn-gold btn-sm">📥 Export CSV</button>
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
                      <span className="px-2 py-0.5 rounded-full bg-gold-dim text-gold text-[9px] border border-gold/20 uppercase font-dm-mono">{r.status}</span>
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
            <div key={ev.id} className="bg-card border border-border-custom rounded-xl p-5 hover:border-gold/30 transition-all">
              <span className="text-[9px] font-dm-mono uppercase text-gold bg-gold-dim px-2 py-0.5 rounded border border-gold/10 inline-block mb-3">{ev.type}</span>
              <h3 className="font-bold mb-1">{ev.title}</h3>
              <p className="text-[11px] text-text-muted line-clamp-2 mb-4">{ev.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-border-custom">
                <button onClick={() => { setSelectedEvent(ev); fetchRegistrations(ev.id); }} className="text-[10px] font-bold text-sky">View Regs ({ev.reg_count || 0})</button>
                <button onClick={() => { setCurrentEvent(ev); setIsEditing(true); }} className="text-gold text-[10px] font-bold">Edit</button>
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
        <div className="bg-card border border-border-custom p-4 rounded-xl">
          <div className="text-[10px] uppercase text-text-muted font-dm-mono mb-1">Total Revenue</div>
          <div className="text-2xl font-syne font-bold text-emerald">R {invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border-custom p-4 rounded-xl">
          <div className="text-[10px] uppercase text-text-muted font-dm-mono mb-1">Pending</div>
          <div className="text-2xl font-syne font-bold text-gold">R {invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border-custom p-4 rounded-xl">
          <div className="text-[10px] uppercase text-text-muted font-dm-mono mb-1">Total Outstanding</div>
          <div className="text-2xl font-syne font-bold text-coral">R {invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-card border border-border-custom rounded-xl overflow-hidden">
        <div className="bg-surface p-4 border-b border-border-custom font-bold text-sm">Recent Invoices</div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-custom bg-surface/50 text-left">
              <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Invoice #</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Student</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Amount</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Status</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-text-dim">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-b border-border-custom">
                <td className="p-3 text-sm font-dm-mono">{inv.invoice_number}</td>
                <td className="p-3 text-sm">
                  {inv.profiles?.first_name} {inv.profiles?.last_name}
                  <div className="text-[9px] text-text-dim">{inv.student_number}</div>
                </td>
                <td className="p-3 text-sm font-bold">R {inv.amount.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-dm-mono border ${inv.status === 'paid' ? 'bg-emerald-dim text-emerald border-emerald/20' : 'bg-gold-dim text-gold border-gold/20'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-3">
                  {inv.status !== 'paid' && (
                    <button onClick={() => markAsPaid(inv.id)} className="text-emerald text-[10px] font-bold hover:underline">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="space-y-8">
      <div className="bg-navy border border-gold/20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <h2 className="font-syne font-bold text-xl mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gold" />
          Financial Statement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-dim font-dm-mono mb-1">Total Balance Due</div>
            <div className="text-4xl font-syne font-extrabold text-white">
              R {invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + Number(i.amount), 0).toLocaleString()}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-gold btn-sm">Pay Outstanding</button>
              <button onClick={() => exportToCSV(invoices, 'my-statement')} className="btn btn-outline btn-sm">Download Statement</button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[12px] text-text-soft">Last Payment</span>
              <span className="text-sm font-bold">{txs[0] ? `R ${txs[0].amount}` : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[12px] text-text-soft">Next Due Date</span>
              <span className="text-sm font-bold text-gold">{invoices.find(i => i.status !== 'paid')?.due_date || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-syne font-bold text-lg">Invoices</h3>
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-card border border-border-custom rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-dm-mono text-[11px] text-gold">{inv.invoice_number}</div>
                  <div className="text-sm font-bold mt-1">GDA Program Fees</div>
                  <div className="text-[10px] text-text-muted mt-1">Due {inv.due_date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">R {inv.amount.toLocaleString()}</div>
                  <span className={`text-[9px] uppercase font-dm-mono ${inv.status === 'paid' ? 'text-emerald' : 'text-gold'}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-syne font-bold text-lg">Payment History</h3>
          <div className="space-y-3">
            {txs.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 p-4 border-b border-border-custom">
                <div className="w-10 h-10 rounded-full bg-surface border border-border-custom flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-emerald" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">R {tx.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">{tx.payment_method} • {tx.reference}</div>
                </div>
                <div className="text-[10px] text-text-dim text-right">
                  {new Date(tx.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {txs.length === 0 && <div className="text-center py-10 text-text-dim text-sm italic">No transactions found.</div>}
          </div>
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
  const [activeSection, setActiveSection] = useState<'dashboard' | 'courses' | 'finances' | 'applications' | 'profile' | 'settings'>('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  useEffect(() => {
    if (user) fetchStudentData();
  }, [user]);

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
      alert('Profile updated successfully!');
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  async function handlePasswordReset() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      alert('Password reset link sent to your email!');
    } catch (err: any) { alert('Error: ' + err.message); }
  }

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold mx-auto mb-4"></div>
        <p className="text-gold font-dm-mono text-[10px] uppercase tracking-widest">Loading your portal...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* ─── PORTAL HEADER ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-syne font-extrabold text-3xl mb-1">
            Welcome back, {profile?.first_name || user?.email?.split('@')[0]}
          </h1>
          <div className="flex items-center gap-3 text-text-muted text-[12px]">
            <span>{user?.email}</span>
            {profile?.student_number && (
              <>
                <span className="text-border-custom">|</span>
                <span className="font-dm-mono text-gold">{profile.student_number}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => signOut()} className="btn btn-outline btn-sm">Sign Out</button>
        </div>
      </div>

      {/* ─── PORTAL TABS ─── */}
      <div className="flex gap-4 mb-8 border-b border-border-custom overflow-x-auto">
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '' },
          { id: 'courses', label: '📚 My Courses', icon: '' },
          { id: 'finances', label: '💰 Finances', icon: '' },
          { id: 'applications', label: '📝 Applications', icon: '' },
          { id: 'profile', label: '👤 Profile', icon: '' },
          { id: 'settings', label: '⚙️ Settings', icon: '' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`pb-2 px-1 font-dm-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === tab.id ? 'text-gold border-b-2 border-gold' : 'text-text-muted hover:text-text-custom'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── DASHBOARD ─── */}
      {activeSection === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
            <div className="font-syne font-extrabold text-[32px] text-gold">{enrollments.length}</div>
            <div className="font-dm-mono text-[9px] uppercase tracking-widest text-text-dim mt-1">Active Courses</div>
          </div>
          <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
            <div className="font-syne font-extrabold text-[32px] text-emerald">
              {Object.values(progress).filter(p => p === 100).length}
            </div>
            <div className="font-dm-mono text-[9px] uppercase tracking-widest text-text-dim mt-1">Completed</div>
          </div>
          <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
            <div className="font-syne font-extrabold text-[32px] text-sky">{applications.length}</div>
            <div className="font-dm-mono text-[9px] uppercase tracking-widest text-text-dim mt-1">Applications</div>
          </div>

          {/* Next Steps Widget */}
          <div className="md:col-span-3 bg-gold-dim border border-gold/20 rounded-xl p-6">
            <h3 className="font-syne font-bold text-lg mb-2 text-gold">📋 Next Steps</h3>
            <p className="text-[13px] text-text-soft leading-relaxed">
              {applications.some(a => a.status === 'approved' && !enrollments.some(e => e.courses?.title === a.program))
                ? 'You have an approved application! Head to "My Courses" to enroll and start learning.'
                : applications.some(a => !a.status || a.status === 'pending')
                ? 'Your application is under review. Our admissions team will contact you within 2 business days.'
                : enrollments.length > 0
                ? 'Continue where you left off — pick a course from "My Courses" to keep progressing.'
                : 'Welcome to GDA! Apply for a programme to begin your journey.'}
            </p>
          </div>
        </div>
      )}

      {/* ─── MY COURSES ─── */}
      {activeSection === 'courses' && (
        <div className="space-y-6">
          {enrollments.map(enroll => (
            <div key={enroll.id} className="bg-card border border-border-custom rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-xl">{enroll.courses?.thumbnail_url || '📘'}</div>
                  <div>
                    <div className="font-bold text-lg mb-1">{enroll.courses?.title}</div>
                    <div className="text-sm text-text-muted">Enrolled {enroll.enrolled_at ? new Date(enroll.enrolled_at).toLocaleDateString() : ''}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {progress[enroll.course_id] === 100 && (
                    <button onClick={() => setShowCertificate({ course: enroll.courses, profile })} className="btn btn-outline btn-sm">🎓 Certificate</button>
                  )}
                  <button onClick={() => onStartCourse(enroll.course_id)} className="btn btn-gold btn-sm">
                    {progress[enroll.course_id] > 0 ? 'Continue' : 'Start Learning'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-dm-mono uppercase tracking-wider text-text-muted">
                  <span>Course Progress</span>
                  <span>{progress[enroll.course_id] || 0}%</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border-custom">
                  <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress[enroll.course_id] || 0}%` }} />
                </div>
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="bg-card border border-border-custom border-dashed rounded-xl p-10 text-center text-text-muted">
              You are not currently enrolled in any courses.
            </div>
          )}
        </div>
      )}

      {/* ─── APPLICATIONS ─── */}
      {activeSection === 'applications' && (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-card border border-border-custom rounded-xl p-6 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg mb-1">{app.program}</div>
                <div className="text-sm text-text-muted">Submitted {new Date(app.created_at).toLocaleDateString()}</div>
                {app.student_number && <div className="font-dm-mono text-[11px] text-gold mt-1">{app.student_number}</div>}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-dm-mono uppercase border ${
                app.status === 'approved' ? 'border-emerald/20 text-emerald bg-emerald-dim' :
                app.status === 'rejected' ? 'border-coral/20 text-coral bg-coral-dim' :
                'border-gold/20 text-gold bg-gold-dim'
              }`}>
                {app.status || 'Under Review'}
              </span>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="bg-card border border-border-custom border-dashed rounded-xl p-10 text-center text-text-muted">
              You haven't submitted any applications yet.
            </div>
          )}
        </div>
      )}

      {/* ─── PROFILE ─── */}
      {activeSection === 'profile' && (
        <div className="max-w-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-syne font-bold text-xl">My Profile</h2>
            {editingProfile ? (
              <div className="flex gap-2">
                <button onClick={() => { setEditingProfile(false); setProfileForm(profile); }} className="btn btn-outline btn-sm">Cancel</button>
                <button onClick={handleSaveProfile} className="btn btn-gold btn-sm">Save Changes</button>
              </div>
            ) : (
              <button onClick={() => setEditingProfile(true)} className="btn btn-gold btn-sm">Edit Profile</button>
            )}
          </div>

          <div className="bg-card border border-border-custom rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'First Name', key: 'first_name', placeholder: 'Your first name' },
                { label: 'Last Name', key: 'last_name', placeholder: 'Your last name' },
                { label: 'Phone', key: 'phone', placeholder: '+27 XX XXX XXXX' },
                { label: 'Date of Birth', key: 'date_of_birth', type: 'date' },
                { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
                { label: 'Nationality', key: 'nationality', placeholder: 'South Africa' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">{field.label}</label>
                  {editingProfile ? (
                    field.type === 'select' ? (
                      <select className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={profileForm[field.key] || ''} onChange={e => setProfileForm({...profileForm, [field.key]: e.target.value})}>
                        <option value="">Select…</option>
                        {field.options?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={field.type || 'text'} className="w-full bg-surface border border-border-custom rounded p-2 text-sm" placeholder={field.placeholder || ''} value={profileForm[field.key] || ''} onChange={e => setProfileForm({...profileForm, [field.key]: e.target.value})} />
                    )
                  ) : (
                    <p className="text-sm">{profile?.[field.key] || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-custom">
              <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Bio</label>
              {editingProfile ? (
                <textarea className="w-full bg-surface border border-border-custom rounded p-2 text-sm h-20" placeholder="Tell us about yourself..." value={profileForm.bio || ''} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
              ) : (
                <p className="text-sm text-text-soft">{profile?.bio || 'No bio set.'}</p>
              )}
            </div>

            <div className="pt-4 border-t border-border-custom">
              <h3 className="font-syne font-bold text-sm mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Name</label>
                  {editingProfile ? (
                    <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={profileForm.emergency_contact_name || ''} onChange={e => setProfileForm({...profileForm, emergency_contact_name: e.target.value})} />
                  ) : (
                    <p className="text-sm">{profile?.emergency_contact_name || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Phone</label>
                  {editingProfile ? (
                    <input className="w-full bg-surface border border-border-custom rounded p-2 text-sm" value={profileForm.emergency_contact_phone || ''} onChange={e => setProfileForm({...profileForm, emergency_contact_phone: e.target.value})} />
                  ) : (
                    <p className="text-sm">{profile?.emergency_contact_phone || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FINANCES ─── */}
      {activeSection === 'finances' && <MyFinance />}

      {/* ─── SETTINGS ─── */}
      {activeSection === 'settings' && (
        <div className="max-w-xl space-y-6">
          <h2 className="font-syne font-bold text-xl">Account Settings</h2>

          <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
            <h3 className="font-syne font-bold text-sm">Security</h3>
            <div>
              <label className="block font-dm-mono text-[9px] uppercase text-text-dim mb-1">Email Address</label>
              <p className="text-sm font-mono">{user?.email}</p>
            </div>
            <button onClick={handlePasswordReset} className="btn btn-outline btn-sm">🔐 Reset Password</button>
          </div>

          <div className="bg-card border border-border-custom rounded-xl p-6 space-y-4">
            <h3 className="font-syne font-bold text-sm">Data & Privacy</h3>
            <button onClick={() => exportToJSON([profile || {}], 'my-gda-profile')} className="btn btn-outline btn-sm">📥 Download My Data</button>
            <p className="text-[11px] text-text-dim">You can request a full copy of your data at any time. For account deletion, contact academy@ginashe.co.za.</p>
          </div>

          <div className="bg-coral/5 border border-coral/20 rounded-xl p-6">
            <h3 className="font-syne font-bold text-sm text-coral mb-2">Danger Zone</h3>
            <p className="text-[12px] text-text-muted mb-3">Signing out will end your current session. All your data remains safe.</p>
            <button onClick={() => signOut()} className="btn btn-sm bg-coral/10 text-coral border border-coral/20 hover:bg-coral/20">Sign Out</button>
          </div>
        </div>
      )}

      {/* ─── CERTIFICATE MODAL ─── */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-black p-12 rounded-none shadow-2xl max-w-4xl w-full relative border-[20px] border-gold/20">
            <button onClick={() => setShowCertificate(null)} className="absolute top-4 right-4 text-black/40 hover:text-black">✕</button>
            <div className="text-center border-4 border-gold/40 p-12">
              <div className="text-gold text-5xl mb-8">🎓</div>
              <h1 className="font-syne font-extrabold text-4xl mb-4 uppercase tracking-tighter">Certificate of Completion</h1>
              <p className="text-gray-500 font-dm-mono text-sm uppercase tracking-widest mb-12">This is to certify that</p>
              <div className="border-b-2 border-black/10 pb-2 mb-4 inline-block px-12">
                <h2 className="font-syne font-bold text-5xl text-black">{showCertificate.profile?.first_name} {showCertificate.profile?.last_name}</h2>
              </div>
              <p className="text-gray-500 font-dm-mono text-sm uppercase tracking-widest mb-12">has successfully completed the course</p>
              <h3 className="font-syne font-bold text-3xl text-gold mb-16">{showCertificate.course.title}</h3>
              <div className="flex justify-between items-end pt-12 border-t border-black/5">
                <div className="text-left">
                  <div className="font-dm-mono text-[10px] uppercase text-gray-400 mb-1">Date Issued</div>
                  <div className="font-bold">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-1 bg-black/10 mb-2"></div>
                  <div className="font-dm-mono text-[10px] uppercase text-gray-400">Ginashe Academy</div>
                </div>
                <div className="text-right">
                  <div className="font-dm-mono text-[10px] uppercase text-gray-400 mb-1">Certificate ID</div>
                  <div className="font-mono text-xs">GDA-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => window.print()} className="btn bg-black text-white hover:bg-black/80">🖨️ Print to PDF</button>
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
    } catch (err: any) { console.error('Error:', err.message); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;

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
                      <div className="h-full bg-gold transition-all duration-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="font-dm-mono text-[10px] text-gold">{item.progress}%</span>
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
