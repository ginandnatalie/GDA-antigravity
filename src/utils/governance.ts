/**
 * Regulatory Silence Utility
 * Strips accreditation keywords for public view while allowing markers for admin audit.
 */

export interface SanitizeOptions {
  isAdmin?: boolean;
  stripNQF?: boolean;
}

export function sanitizeAccreditation(text: string, options: SanitizeOptions = {}): string {
  if (!text) return '';
  
  const keywords = [/saqa/gi, /seta/gi, /qcto/gi, /nqf\s*level\s*\d+/gi, /nqf\s*\d+/gi];
  
  let result = text;

  if (options.isAdmin) {
    // If admin, we don't strip but we can wrap them in a marker if needed
    // For now, we return as is, but we could add a subtle flag in the UI component
    return result;
  }

  // Strip for public view
  keywords.forEach(pattern => {
    result = result.replace(pattern, (match) => {
      // Replace with high-end generic alternative or just remove
      if (match.toLowerCase().includes('nqf')) return 'Institutional Credit';
      return '';
    });
  });

  // Clean up multiple spaces and trailing punctuation possibly left behind
  return result.replace(/\s\s+/g, ' ').trim();
}

/**
 * Checks if a string contains regulatory keywords
 */
export function hasRegulatoryKeywords(text: string): boolean {
  if (!text) return false;
  const keywords = [/saqa/gi, /seta/gi, /qcto/gi, /nqf/gi];
  return keywords.some(pattern => pattern.test(text));
}
