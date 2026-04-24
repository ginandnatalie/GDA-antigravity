import { supabase } from './supabase';

/**
 * Institutional helper to generate the next available Student Number.
 * Format: ST-XXXX (e.g. ST-1011)
 */
export async function getNextStudentNumber(): Promise<string> {
  const RESERVED_MAX = 1010;
  const STARTING_NUMBER = 1011;

  try {
    // 1. Fetch from applications
    const { data: appData } = await supabase
      .from('applications')
      .select('student_number')
      .not('student_number', 'is', null);

    // 2. Fetch from profiles
    const { data: profileData } = await supabase
      .from('profiles')
      .select('student_number')
      .not('student_number', 'is', null);

    // 3. Extract and combine numbers
    const allNumbers: number[] = [
      ...(appData?.map(d => extractNumber(d.student_number)) || []),
      ...(profileData?.map(d => extractNumber(d.student_number)) || [])
    ].filter((n): n is number => n !== null);

    const maxFound = allNumbers.length > 0 ? Math.max(...allNumbers) : RESERVED_MAX;
    
    // Ensure we don't go below the reserved range
    const nextNum = Math.max(maxFound + 1, STARTING_NUMBER);
    
    return `ST-${nextNum}`;
  } catch (err) {
    console.error('Error generating student number:', err);
    // Fallback to a safe starting number if query fails
    return `ST-${STARTING_NUMBER}`;
  }
}

function extractNumber(sn: string | null): number | null {
  if (!sn) return null;
  // Match the new format: GDA-2026-XXXX or legacy ST-XXXX
  const match = sn.match(/(?:GDA-\d{4}-|ST-)(\d+)/);
  if (match) return parseInt(match[1], 10);
  return null;
}

/**
 * Validates a student ID or email across both applications and profiles.
 * Returns the relevant record if found.
 */
export async function validateStudentIdentity(input: string) {
  const identifier = input.trim().toLowerCase();
  
  // Check Applications
  const { data: app } = await supabase
    .from('applications')
    .select('id, email, first_name, last_name, status, program, student_number')
    .or(`student_number.eq.${input.trim()},email.ilike.${identifier}`)
    .maybeSingle();

  if (app) return { type: 'application', data: app };

  // Check Profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, student_number, role')
    .or(`student_number.eq.${input.trim()},email.ilike.${identifier}`)
    .maybeSingle();

  if (profile) return { type: 'profile', data: profile };

  return null;
}
