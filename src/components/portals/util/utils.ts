import { supabase } from '../../../lib/supabase';

// ——— UTILITY: CSV Export —————————————————————
export function flattenObject(obj: any, prefix = ''): any {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const flattenedData = data.map(item => flattenObject(item));
  const headers = Object.keys(flattenedData[0]);
  
  const csv = [
    headers.join(','),
    ...flattenedData.map(row => headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.json`; a.click();
  URL.revokeObjectURL(url);
}

// ——— UTILITY: INSTITUTIONAL COMMUNICATION HUB ———
export async function triggerInstitutionalNotice(payload: {
  user_id?: string;
  recipient: string;
  subject: string;
  message: string;
  type: 'info' | 'urgent' | 'success' | 'warning';
  link?: string;
  metadata?: any;
}) {
  console.log(`[Institutional Hub] Dispatching notice to ${payload.recipient}: ${payload.subject}`);
  
  // 1. Log to System Notifications (In-App UI)
  if (payload.user_id) {
    await supabase.from('system_notifications').insert({
      user_id: payload.user_id,
      title: payload.subject,
      message: payload.message,
      type: payload.type,
      link: payload.link
    });
  }

  // 2. Log to Email Ledger (Compliance Audit)
  await supabase.from('email_logs').insert({
    recipient: payload.recipient,
    subject: payload.subject,
    status: 'sent',
    metadata: {
      ...payload.metadata,
      body_preview: payload.message.substring(0, 500)
    }
  });

  // 3. Log to Institutional Audit Trail
  await supabase.from('institutional_audit_logs').insert({
    action: 'COMMUNICATION_DISPATCHED',
    target_type: 'email',
    reason: `Automated ${payload.type} notice: ${payload.subject}`,
    new_value: { recipient: payload.recipient, subject: payload.subject }
  });
}
