import { UserLocation } from '@/types';

const US_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
  'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
  'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
  'wisconsin', 'wyoming', 'district of columbia', 'dc'
];

const STATE_ALIASES: Record<string, string> = {
  'ny': 'new york',
  'ca': 'california',
  'tx': 'texas',
  'fl': 'florida',
  'ga': 'georgia',
  'il': 'illinois',
  'pa': 'pennsylvania',
  'oh': 'ohio',
  'nc': 'north carolina',
  'mi': 'michigan',
  'nj': 'new jersey',
  'va': 'virginia',
  'wa': 'washington',
  'az': 'arizona',
  'ma': 'massachusetts',
  'tn': 'tennessee',
  'in': 'indiana',
  'mo': 'missouri',
  'md': 'maryland',
  'wi': 'wisconsin',
  'co': 'colorado',
  'mn': 'minnesota',
  'sc': 'south carolina',
  'al': 'alabama',
  'la': 'louisiana',
  'ky': 'kentucky',
  'or': 'oregon',
  'ok': 'oklahoma',
  'ct': 'connecticut',
  'ut': 'utah',
  'nv': 'nevada',
  'ia': 'iowa',
  'ar': 'arkansas',
  'ms': 'mississippi',
  'ks': 'kansas',
  'nm': 'new mexico',
  'ne': 'nebraska',
  'id': 'idaho',
  'wv': 'west virginia',
  'hi': 'hawaii',
  'nh': 'new hampshire',
  'me': 'maine',
  'mt': 'montana',
  'ri': 'rhode island',
  'de': 'delaware',
  'sd': 'south dakota',
  'nd': 'north dakota',
  'ak': 'alaska',
  'vt': 'vermont',
  'dc': 'district of columbia'
};

export function parseLocation(input: string): UserLocation | null {
  const lower = input.toLowerCase().trim();
  
  let country = 'us';
  let state: string | undefined;
  let county: string | undefined;

  // Check countries first
  if (/\b(canada|canadian)\b/.test(lower)) country = 'canada';
  else if (/\b(uk|united kingdom|britain|england)\b/.test(lower)) country = 'uk';
  else if (/\b(india|indian)\b/.test(lower)) country = 'india';

  // Check multi-word states first (longest first to avoid partial matches)
  const sortedStates = [...US_STATES].sort((a, b) => b.length - a.length);
  for (const s of sortedStates) {
    if (new RegExp(`\\b${s}\\b`).test(lower)) {
      state = s.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // Check aliases if state not found
  if (!state) {
    for (const [alias, fullName] of Object.entries(STATE_ALIASES)) {
      if (new RegExp(`\\b${alias}\\b`).test(lower)) {
        state = fullName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }
  }

  return { country, state, county };
}

export function isValidLocation(location: UserLocation | null): boolean {
  if (!location) return false;
  if (location.country === 'us' || location.country === 'canada' || location.country === 'uk') {
    return true;
  }
  return location.country !== 'us';
}

export function formatLocation(location: UserLocation | null): string {
  if (!location) return '';
  if (location.state) {
    return `${location.state}, ${location.country.toUpperCase()}`;
  }
  return location.country.toUpperCase();
}